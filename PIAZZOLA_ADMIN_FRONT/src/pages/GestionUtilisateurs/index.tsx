import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { IReduxState } from '../../stores/store';
import { IRole, IUtilisateur, setListeRoles, setListeUtilisateurs } from '../../stores/utilisateurSlice';
import { apiClient } from '../../utils/apiClient';
import { convertDateToLocaleStringDateTime, recupSite } from '../../utils/functions';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import CustomSelect1 from '../components/CustomSelect1';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import LoadingCard from '../components/LoadingCard';
import { CustomNotification, INotification } from '../components/Notification';
import _ from "lodash";

const initialiseUtilisateur = { utilisateurId: 0, nomUtilisateur: "", roleId: 0, nomSite: "", nomRole: "", siteId: 0, motDePasseUtilisateur: "" }

const GestionUtilisateurs = () => {

  // Redux
  const dispatch = useDispatch()
  const { listeUtilisateurs, listeRoles } = useSelector((state: IReduxState) => state.utilisateur);
  const listeSites = useSelector((state: IReduxState) => state.gestionSiteWeb.listeSites);
  console.log("🚀 ~ GestionUtilisateurs ~ listeUtilisateurs:", listeUtilisateurs)

  // Hooks
  const [recherchePizza, setRecherchePizza] = useState("")
  const [loading, setLoading] = useState(false)
  const [recupListLoading, setRecupListLoading] = useState(false)
  const [utilisateurFormData, setUtilisateurFormData] = useState<IUtilisateur>(initialiseUtilisateur)
  const [message, setMessage] = useState("null")
  console.log("🚀 ~ GestionUtilisateurs ~ utilisateurFormData:", utilisateurFormData)
  const [openAddOrEditUtilisateurDialog, setOpenAddOrEditUtilisateurDialog] = useState(false)
  const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [notification, setNotification] = useState<INotification | undefined>()
  const notificationRef = useRef<NotificationElement>();
  const showNotification = () => notificationRef.current?.showToast();



  // Table hooks
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 12
  const pageCount = listeUtilisateurs!.length / itemsPerPage
  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Represente les colonnes de la liste des classes
  const colums: any = [
    { header: 'Nom', accessor: 'nomUtilisateur', visible: true, className: '' },
    { header: 'Role', accessor: 'nomRole', visible: true, className: 'hidden md:table-cell' },
    { header: 'Site', accessor: 'nomSite', visible: true, className: 'hidden lg:table-cell' },
    { header: 'MDP initial', accessor: 'motDePasseInitial', visible: true, className: 'hidden lg:table-cell' },
    {
      header: 'Derniere connexion',
      visible: true,
      className: 'hidden lg:table-cell',
      renderCell: (value: any, row: any) => (
        <span>{convertDateToLocaleStringDateTime(row?.dateDerniereConnexion || new Date())}</span>
      )
    },
    {
      header: 'Actions',
      renderCell: (value: any, row: any) => (
        <Menu className="">
          <Menu.Button as="button" className="rounded-md p w-5 h-5" >
            <Lucide
              icon="MoreVertical"
              className="w-5 h-5 text-slate-500"
            />
          </Menu.Button>
          <Menu.Items className="w-40">
            <Menu.Item onClick={() => {
              setOpenAddOrEditUtilisateurDialog(true)
              setdialogOpenKey("edit")
              setUtilisateurFormData(row)
            }}>
              <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
            </Menu.Item>
            <Menu.Item className={"text-red-600"} onClick={() => {
              setOpenDeleteConfirmBox(true)
              setUtilisateurFormData(row)
            }}>
              <Lucide icon="Trash" className="w-4 h-4 mr-2 " /> Supprimer
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ),
      visible: true,

    },
  ];

  const onButtonAnnulerClick = () => {
    setOpenAddOrEditUtilisateurDialog(false);
    setUtilisateurFormData(initialiseUtilisateur);
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setUtilisateurFormData(prev => ({
      ...prev,
      [name]: value, // Met à jour dynamiquement le champ modifié
    }));
  };

  /**
   * Affiche la notification, le setTimeout est necessaire (les notifications ne s'affichent pas sans)
   * @param notification 
   */
  const displayNotification = (notification: INotification) => {
    setNotification(notification)
    setTimeout(() => {
      showNotification();
    }, 30);
  }

  const recupListeUtilisateurs = async () => {
    try {
      setRecupListLoading(true)
      const res = await apiClient.get("/recup_utilisateurs")
      if (!res.status) throw res.error
      const data = res.data as IUtilisateur[]
      console.log("🚀 ~ recupListeUtilisateurs ~ data:", data)
      dispatch(setListeUtilisateurs(data.filter((item: IUtilisateur) => item?.superAdmin === 0)))
    } catch (error) {
      console.log("🚀 ~ recupListeUtilisateurs ~ error:", error)
    }
    finally {
      setRecupListLoading(false)
    }
  }

  const recupRoles = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get("/recup_role")
      if (!res.status) throw res.error
      const data = res.data as IRole[]
      dispatch(setListeRoles(data))
    } catch (error) {
      console.log("🚀 ~ recupRoles ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  /**
   * ajouter utilisateur, le retour est géré par socket
   * @returns 
   */
  const ajouterUtilisateur = async () => {
    try {
      if (!utilisateurFormData?.nomUtilisateur.length || !utilisateurFormData.roleId || !utilisateurFormData.siteId) {
        setMessage("Tous les champs sont obligatoires !")
        return
      }
      setLoading(true)
      console.log("🚀 ~ ajouterUtilisateur ~ utilisateurFormData:", utilisateurFormData)
      // return
      const res = await apiClient.post("/ajouter_utilisateur", { ...utilisateurFormData, siteId: Number(utilisateurFormData.siteId), roleId: Number(utilisateurFormData.roleId) })
      if (!res.status) throw res.error
      // const data = res.data as IUtilisateur
      // dispatch(addUtilisateur(data))
      setUtilisateurFormData(initialiseUtilisateur)
      displayNotification({ type: "success", content: "Utilisateur ajouté avec succès !" },);
      setOpenAddOrEditUtilisateurDialog(false)
      setMessage("null")
    } catch (error: any) {
      displayNotification({ content: error?.message, type: "error" })
    }
    finally {
      setLoading(false)
    }
  }


  const modifierUtilisateur = async () => {
    try {
      setLoading(true)
      const payload = { ...utilisateurFormData, siteId: Number(utilisateurFormData.siteId), roleId: Number(utilisateurFormData.roleId) }
      console.log("🚀 ~ modifierUtilisateur ~ payload:", payload)
      if (!payload?.nomUtilisateur.length) {
        console.log("🚀 ~ modifierUtilisateur ~ payload?.nomUtilisateur:", payload?.nomUtilisateur)
        setMessage("Tous les champs sont obligatoires !")
        return
      }
      const res = await apiClient.post("/modifier_utilisateur", payload)
      if (!res.status) throw res.error
      // const data = res.data as IUtilisateur
      // dispatch(updateUtilisateur(data))
      setUtilisateurFormData(initialiseUtilisateur)
      displayNotification({ type: "success", content: "Utilisateur modifié avec succès !" }
      );
      setOpenAddOrEditUtilisateurDialog(false)
      setMessage("null")
    } catch (error: any) {
      console.log("🚀 ~ modifierUtilisateur ~ error:", error)
      displayNotification({ content: error?.message, type: "error" })
    }
    finally {
      setLoading(false);
    }
  }

  const supprimerUtilisateur = async (utilisateurId: number) => {
    try {
      setLoading(true)
      const res = await apiClient.post("/supprimer_utilisateur", { utilisateurId })
      if (!res.status) throw res.error
      // const data = res.data as number
      // dispatch(deleteUtilisateur({ utilisateurId, status: 0 }))
      displayNotification({ type: "success", content: "Utilisateur supprimé avec succès !" },);
      setUtilisateurFormData(initialiseUtilisateur)
    } catch (error: any) {
      console.log("🚀 ~ supprimerUtilisateur ~ error:", error)
      displayNotification({ content: error?.message, type: "error" })
    }
    finally {
      setLoading(false)
      setOpenDeleteConfirmBox(false)
    }
  }



  useEffect(() => {
    recupListeUtilisateurs();
    recupRoles();
    recupSite(setLoading, loading)
  }, [])

  return (
    <>
      {
        recupListLoading
          ?
          <LoadingCard />
          :
          <>
            <div className="flex flex-col items-center mt-8  sm:flex-row">
              <h2 className="mr-auto text-lg font-medium">Liste utilisateurs</h2>
              <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                <Button
                  as="a"
                  href="#"
                  variant="primary"
                  onClick={(event: React.MouseEvent) => {
                    event.preventDefault();
                    setOpenAddOrEditUtilisateurDialog(true);
                    setdialogOpenKey('add')
                  }}
                  className="mr-2 shadow-md"
                >
                  Ajouter utilisateur
                </Button>
              </div>
            </div>

            <div className={`w-full overflow-x-auto hide-scrollbar intro-y mt-4  box`}>
              <CustomDataTable
                data={listeUtilisateurs}
                columns={colums}
                dataInitial={[]}
                rowKey={(row) => row.utilisateurId}
                selectedRows={[]}
                onSelectRow={() => null}
                onSelectAllRows={() => null}
                onRowDoubleClick={() => null}
                onDeleteSelectRows={() => null}
                endIndex={endIndex}
                startIndex={startIndex}
                pageIndex={pageIndex}
                setPageIndex={setPageIndex}
                pageCount={Math.ceil(pageCount)}
              />
            </div>
          </>
      }

      {/* BEGIN: Delete Confirmation Modal */}
      <ConfirmeBox
        confirmBoxProps={{
          intitule: `Voulez-vous vraiment supprimer ${utilisateurFormData.nomUtilisateur} ?`,
          handleConfirme: () => supprimerUtilisateur(utilisateurFormData.utilisateurId),
          loading: loading,
          buttonSaveLabel: "Supprimer",
          type: "danger",
          openConfirmeBox: openDeleteConfirmBox,
          handleCloseConfirmeBox: () => {
            setOpenDeleteConfirmBox(false);
            setLoading(false)
          },
        }}
      />

      {/* Ajout et modification du supplement */}
      <DialogBox
        dialogProps={{
          dialogTitle: dialogOpenKey === "edit" ? "Modifier l'utilisateur" : "Ajouter un utilisateur",
          dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations de l'utilisateur" : "Saisissez les informations de l'utilisateur",
          iconSvg: <></>,
          dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
          handleCloseDialog: onButtonAnnulerClick,
          disable: false,
          loading: loading,
          openDialog: openAddOrEditUtilisateurDialog,
          onButtonAnnulerClick: onButtonAnnulerClick,
          onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierUtilisateur() : ajouterUtilisateur(),
          dialogBoxContentHeader: "",
          dialogBoxContent:
            <div className="w-full  h-[350px] rounded-lg rounded-t-lg overflow-y-auto">
              {message !== "null" && <div className='text-red-600 my-2'>{message}</div>}
              <div className='mt-4'>
                {/* Champ pour le nom de la pizza */}
                <GenericFormInput
                  label="Nom de l'utilisateur"
                  id="nomUtilisateur"
                  placeholder="Nom de l'utilisateur"
                  value={utilisateurFormData?.nomUtilisateur}
                  onChange={(e) => handleInputChange(e)}
                  className='mb-2'
                  required
                />

                {/* {
                  dialogOpenKey === "add"
                  &&
                  <GenericFormInput
                    label="Mot de passe utilisateur"
                    id="motDePasseUtilisateur"
                    placeholder="Mot de passe utilisateur"
                    value={utilisateurFormData.motDePasseUtilisateur}
                    onChange={(e) => handleInputChange(e)}
                    className='mb-2'
                    required
                  />
                } */}

                <div className="">
                  {/* <div className="xl:w-40 xl:!mr-4">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="">Rôle utilisateur</div>
                      </div>
                    </div>
                  </div> */}
                  <CustomSelect1
                    // className='w-full'
                    label="Rôle de  l'utilisateur"
                    data={listeRoles}
                    keys={["roleId", "nomRole"]}
                    onChange={(e: any) => setUtilisateurFormData(prev => ({ ...prev, ...e }))}
                    id="roleId"
                    valuesSelected={utilisateurFormData.roleId}
                    containerClassname='flex flex-col mb-4'
                    required
                    initialiseValue={initialiseUtilisateur}
                  />
                </div>

                <div className="w-full">
                  {/* <div className="xl:w-40 xl:!mr-4">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="">Site pizzeria</div>
                      </div>
                    </div>
                  </div> */}
                  <CustomSelect1
                    label="Choix du site de la pizzeria"
                    data={listeSites}
                    keys={["siteId", "nomSite"]}
                    onChange={(e: any) => setUtilisateurFormData(prev => ({ ...prev, ...e }))}
                    id="siteId"
                    valuesSelected={utilisateurFormData.siteId}
                    containerClassname='flex flex-col'
                    required
                    initialiseValue={initialiseUtilisateur}
                  />
                </div>


              </div>
            </div>,
          handleSearch: () => null,
          size: "lg",
          height: "1/2"
        }}
      />

      {/* Affichage la notification */}
      <CustomNotification
        message={notification?.content}
        notificationRef={notificationRef}
        title={"Info"}
        type={notification?.type}
      />
    </>
  )
}

export default GestionUtilisateurs;



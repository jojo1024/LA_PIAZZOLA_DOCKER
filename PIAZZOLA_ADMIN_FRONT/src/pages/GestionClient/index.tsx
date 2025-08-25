import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { deleteClient, IClient, setListeClients, updateClient } from '../../stores/clientSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import LoadingCard from '../components/LoadingCard';
import { CustomNotification, INotification } from '../components/Notification';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import * as xlsx from "xlsx";
import Button from '../../base-components/Button';
import { convertDateToLocaleStringDateTime } from '../../utils/functions';

const initialiseClient = { clientId: 0, commentaire: "" }

const GestionClients = () => {

  // Redux
  const dispatch = useDispatch()
  const listeClients = useSelector((state: IReduxState) => state.client.listeClients);

  // Hooks
  const [recherchePizza, setRecherchePizza] = useState("")
  const [loading, setLoading] = useState(false)
  const [recupListLoading, setRecupListLoading] = useState(false)
  const [clientFormData, setClientFormData] = useState<Partial<IClient>>(initialiseClient)
  console.log("🚀 ~ GestionClients ~ clientFormData:", clientFormData)
  const [openAddOrEditClientDialog, setopenAddOrEditClientDialog] = useState(false)
  const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const [notification, setNotification] = useState<INotification | undefined>()
  const notificationRef = useRef<NotificationElement>();
  const showNotification = () => notificationRef.current?.showToast();
  const [message, setMessage] = useState("null")


  // Table hooks
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 16
  const pageCount = listeClients!.length / itemsPerPage
  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Represente les colonnes de la liste des classes
  const colums: any = [
    { header: 'Nom utilisateur', accessor: 'nomUtilisateurClient', visible: true, className: '' },
    { header: 'Email', accessor: 'emailClient', visible: true, className: 'hidden md:table-cell' },
    { header: 'Commentaire', accessor: 'commentaire', visible: true, className: 'hidden md:table-cell' },
    { header: 'Téléphone 1', accessor: 'telephoneClient', visible: true, className: 'hidden lg:table-cell' },
    { header: 'Téléphone 2', accessor: 'telephoneClient2', visible: true, className: 'hidden lg:table-cell' },
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
              setopenAddOrEditClientDialog(true)
              setdialogOpenKey("edit")
              setClientFormData(row)
            }}>
              <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
            </Menu.Item>
            <Menu.Item className={"text-red-600"} onClick={() => {
              setOpenDeleteConfirmBox(true)
              setClientFormData(row)
            }}>
              <Lucide icon="Trash" className="w-4 h-4 mr-2 " /> Supprimer
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ),
      visible: true,

    },
  ];


  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setClientFormData(prev => ({
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

  const recuplisteClients = async () => {
    try {
      setRecupListLoading(true)
      const res = await apiClient.get("/recup_clients")
      if (!res.status) throw res.error
      const data = res.data as IClient[]
      dispatch(setListeClients(data))
    } catch (error) {
      console.log("🚀 ~ recuplisteClients ~ error:", error)
    }
    finally {
      setRecupListLoading(false)
    }
  }

  const modifierCommentaireClient = async () => {
    try {
      if (!clientFormData?.commentaire) {
        setMessage("Le commentaire est obligatoire !")
        return
      }
      setLoading(true);
      console.log("🚀 ~ modifierCommentaireClient ~ clientFormData:", clientFormData)
      // return
      const res = await apiClient.post(`/update_client`, clientFormData);
      if (!res?.status) throw res?.error
      dispatch(updateClient(clientFormData))
      displayNotification({ type: "success", content: "Client modifié avec succès !" },);
      setClientFormData(clientFormData)
      setMessage("null")
      setopenAddOrEditClientDialog(false)
    } catch (error: any) {
      console.log("🚀 ~ insertClient ~ error:", error)
    } finally {
      setLoading(false);
    }
  }

  const supprimerClient = async (clientId: number) => {
    try {
      setLoading(true)
      const res = await apiClient.post("/supprimer_client", { clientId })
      if (!res.status) throw res.error
      // const data = res.data as number
      dispatch(deleteClient({ clientId, status: 0 }))
      displayNotification({ type: "success", content: "Client supprimé avec succès !" },);
      setClientFormData(initialiseClient)
      setOpenDeleteConfirmBox(false)
    } catch (error: any) {
      console.log("🚀 ~ supprimerClient ~ error:", error)
      displayNotification({ content: error?.message, type: "error" })
    }
    finally {
      setLoading(false)
    }
  }

  const onExportXlsx = () => {
    const newData = listeClients.map(({ nomUtilisateurClient, emailClient, telephoneClient, telephoneClient2, commentaire, dateInscription }) => ({
      NOM: nomUtilisateurClient,
      EMAIL: emailClient,
      TELEPHONE1: telephoneClient,
      TELEPHONE2: telephoneClient2,
      COMMENTAIRE: commentaire,
      "DATE INSCRIPTION": convertDateToLocaleStringDateTime(dateInscription)
    }));
    const sheet = xlsx.utils.json_to_sheet(newData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, sheet, 'Données');
    xlsx.writeFile(workbook, `etat_liste_des_client_de_la_piazzola.xlsx`);
  };

  useEffect(() => {
    recuplisteClients();
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
              <h2 className="mr-auto text-lg font-medium">Liste clients</h2>
              <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                <Button
                  as="a"
                  href="#"
                  variant="soft-primary"
                  onClick={() => onExportXlsx()}
                  className="mr-2 shadow-md"
                >
                  Exporter
                </Button>
              </div>
            </div>

            <div className={`w-full intro-y overflow-x-auto hide-scrollbar mt-4  box`}>
              <CustomDataTable
                data={listeClients}
                columns={colums}
                dataInitial={[]}
                rowKey={(row) => row.clientId}
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

      {/* Ajout et modification du site */}
      <DialogBox
        dialogProps={{
          dialogTitle: "Modifier le commentaire",
          dialogSubTitle: "Modifier le commentaire de ",
          iconSvg: <></>,
          dialogFooterButtonTitle: "Modifier",
          handleCloseDialog: () => setopenAddOrEditClientDialog(false),
          disable: false,
          loading: loading,
          openDialog: openAddOrEditClientDialog,
          onButtonAnnulerClick: () => setopenAddOrEditClientDialog(false),
          onButtonSaveClick: () => modifierCommentaireClient(),
          dialogBoxContentHeader: "",
          dialogBoxContent:
            <div className="w-full  h-[120px] rounded-lg rounded-t-lg overflow-y-auto">
              {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
              <div className='my-4'>
                {/* Champ pour le nom de la pizza */}
                <GenericFormInput
                  label="Commentaire"
                  id="commentaire"
                  placeholder="Commentaire"
                  value={clientFormData.commentaire}
                  onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>,
          handleSearch: () => null,
          size: "lg",
          height: "1/2"
        }}
      />

      {/* BEGIN: Delete Confirmation Modal */}
      <ConfirmeBox
        confirmBoxProps={{
          intitule: `Voulez-vous vraiment supprimer ${clientFormData.nomUtilisateurClient} ?`,
          handleConfirme: () => supprimerClient(clientFormData?.clientId!),
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

export default GestionClients;



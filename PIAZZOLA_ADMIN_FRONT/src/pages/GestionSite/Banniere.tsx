import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../base-components/Button";
import { FormCheck } from "../../base-components/Form";
import { NotificationElement } from "../../base-components/Notification";
import { IBanniere, setListeBannieres } from "../../stores/gestionSiteWebSlice";
import { IListePizzaItem, setListePizzas } from "../../stores/menuSlice";
import { IReduxState } from "../../stores/store";
import { apiClient } from "../../utils/apiClient";
import { BASE_URL_PROD } from "../../utils/constants";
import ConfirmeBox from "../components/ConfirmeBox";
import CustomSelect from "../components/CustomSelect";
import DialogBox from "../components/DialogBox";
import ImageUploader from "../components/ImageUploader";
import LoadingCard from "../components/LoadingCard";
import { CustomNotification, ITypeNotification } from "../components/Notification";
import { Pagination } from "../components/Pagination";
import CustomBanniereCard from "./CustomBanniereCard";



const initialiseBanniereFormData = {
  banniereId: 0, pizzaId: null, libBanniereImage: "", banniereImageEnBase64: null, bannierePublicitaire: 0
}
export interface INotificationProps { type: ITypeNotification, content: string }

const Banniere = () => {

  // Redux
  const dispatch = useDispatch()
  const listeBannieres = useSelector((state: IReduxState) => state.gestionSiteWeb.listeBannieres);
  const listePizzas = useSelector((state: IReduxState) => state.menu.listePizzas);
  console.log("🚀 ~ Banniere ~ listeBannieres:", listeBannieres)
  console.log("🚀 ~ Banniere ~ listeBannieres:", listeBannieres)

  // Hooks
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const deleteButtonRef = useRef(null);
  const [recherchePizza, setRecherchePizza] = useState("")
  const [openAddOrEditBanniereDialog, setOpenAddOrEditBanniereDialog] = useState(false)
  const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("null")
  const [recupListLoading, setRecupListLoading] = useState(false)
  const [banniereFormData, setBanniereFormData] = useState<IBanniere>(initialiseBanniereFormData);
  const [notification, setNotification] = useState<INotificationProps | undefined>()
  const notificationRef = useRef<NotificationElement>();
  const showNotification = () => notificationRef.current?.showToast();



  // Table hooks
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 8
  const pageCount = listeBannieres!.length / itemsPerPage
  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  /**
   * Affiche la notification, le setTimeout est necessaire (les notifications ne s'affichent pas sans)
   * @param notification 
   */
  const displayNotification = (notification: INotificationProps) => {
    setNotification(notification)
    setTimeout(() => {
      showNotification();
    }, 30);
  }

  const onButtonAnnulerClick = () => {
    setOpenAddOrEditBanniereDialog(false);
    setBanniereFormData(initialiseBanniereFormData);
  }


  // Fonction générique pour mettre à jour l'état
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBanniereFormData(prev => ({
      ...prev,
      [name]: Number(value), // Met à jour dynamiquement le champ modifié
    }));
  };

  // modifier l'image
  const handleImageChange = (base64: string | null) => {
    setBanniereFormData({ ...banniereFormData, banniereImageEnBase64: base64 });
  };

  const recupListeBannieres = async () => {
    try {
      setRecupListLoading(true)
      const res = await apiClient.get("/recup_banniere")
      if (!res.status) throw res.error
      const data = res.data as IBanniere[]
      console.log("🚀 ~ recupListeBannieres ~ formatPizzaData(data):", res.data)
      dispatch(setListeBannieres(data))
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setRecupListLoading(false)
    }
  }

  const recupListePizzas = async () => {
    try {
      setRecupListLoading(true)
      const res = await apiClient.get("/recup_liste_pizza")
      if (!res.status) throw res.error
      const data = res.data as IListePizzaItem[]
      dispatch(setListePizzas(data))
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setRecupListLoading(false)
    }
  }

  const ajouterBanniere = async () => {
    try {
      setLoading(true)
      // const payload = { pizzaFormat: [{ formatId: 1, prixFormat: 3000 }, { formatId: 2, prixFormat: 5000 }, { formatId: 3, prixFormat: 7000 }], nomPizza: "Paillazola", descriptionPizza: "kichta balaise", categoriePizzaId: 1, favoris: 0, avecViande: 0, pizzaImageEnBase64: banniereFormData.pizzaImageEnBase64, }
      if (!banniereFormData.banniereImageEnBase64) {
        setMessage("L'image de la pizza ne peut pas être vide !")
        return
      }
      // return
      const res = await apiClient.post("/ajouter_banniere", {...banniereFormData, pizzaId: banniereFormData.pizzaId ? Number(banniereFormData.pizzaId) : 1})
      if (!res.status) throw res.error
      // const data = res.data as IBanniere
      // dispatch(addPizza(data))
      setBanniereFormData(initialiseBanniereFormData)
      displayNotification({ type: "success", content: "Bannière ajoutée avec succès !" });

      // console.log("🚀 ~ recupListeBannieres ~ formatPizzaData(data):", formatPizzaData(data))
      // dispatch(setListePizzas(formatPizzaData(data)))
      setOpenAddOrEditBanniereDialog(false)
      setMessage("null")
    } catch (error: any) {
      displayNotification({ content: error?.message, type: "error" })
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }


  const modifierBanniere = async () => {
    try {
      if (!banniereFormData.pizzaId) {
        setMessage("La pizza ne peut pas être vide !")
        return
      }
      setLoading(true)
      // return
      const res = await apiClient.post("/modifier_banniere", { ...banniereFormData, pizzaId: banniereFormData.pizzaId ? Number(banniereFormData.pizzaId) : 1, banniereImageEnBase64: banniereFormData?.banniereImageEnBase64 })
      if (!res.status) throw res.error
      // const data = res.data as IListePizzaItem
      // dispatch(updatePizza(data))
      setBanniereFormData(initialiseBanniereFormData)
      displayNotification({ type: "success", content: "Bannière modifiée avec succès !" });
      setMessage("null")
      setOpenAddOrEditBanniereDialog(false)
    } catch (error: any) {
      displayNotification({ content: error?.message, type: "error" })
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  const supprimerBanniere = async (status: 0 | 1, banniereId: number) => {
    try {
      setLoading(true)
      const res = await apiClient.post("/supprimer_banniere", { banniereId, status })
      if (!res.status) throw res.error
      // const data = res.data as IListePizzaItem
      // dispatch(deletePizza(data))
      displayNotification({ type: "success", content: "Bannière supprimée avec succès !" });
      setOpenDeleteConfirmBox(false)
    } catch (error: any) {
      displayNotification({ content: error?.message, type: "error" })
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    recupListeBannieres();
    recupListePizzas()
  }, [])

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">


          <h2 className="mr-auto text-lg font-medium">Bannière</h2>

          <div className="hidden mx-auto md:block text-slate-500">
            .
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <Button onClick={() => {
              setOpenAddOrEditBanniereDialog(true)
              setdialogOpenKey("add")
            }}
              variant="primary" className="mr-2 shadow-md">
              Ajouter une bannière
            </Button>
          </div>
        </div>

        {
          recupListLoading
            ?
            // <div className="flex justify-center items-center">Chargement des données en cours...</div>
            <div className="col-span-12">
              <LoadingCard />
            </div>
            :
            <>
              {/* BEGIN: Menu */}
              {/* data={_.orderBy(listeBannieres, ['banniereId'], ['desc'])} */}

              {listeBannieres?.slice(startIndex, endIndex).map((item, index) => (
                <CustomBanniereCard
                  key={index}
                  imageBanniere={`${BASE_URL_PROD}/bannerImage/${item?.libBanniereImage}`}
                  onButtonEditClick={() => {
                    setOpenAddOrEditBanniereDialog(true)
                    setdialogOpenKey("edit")
                    setBanniereFormData(item)
                  }}
                  onButtonDeleteClick={() => {
                    setOpenDeleteConfirmBox(true)
                    setBanniereFormData(item)
                  }}
                />
              ))}
              {/* BEGIN: Pagination */}
              <div className="col-span-12">
                <div className='flex mr-2 justify-end items-center'>
                  <Pagination
                    pageIndex={pageIndex!}
                    setPageIndex={setPageIndex!}
                    pageCount={Math.ceil(pageCount!)}
                  />
                </div>
              </div>
              {/* END: Pagination */}

              {/* END: Menu*/}
            </>
        }

      </div>



      {/* BEGIN: Delete Confirmation Modal */}
      <ConfirmeBox
        confirmBoxProps={{
          intitule: `Voulez-vous vraiment supprimer la bannière ?`,
          handleConfirme: () => supprimerBanniere(0, banniereFormData.banniereId),
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

      {/* END: Delete Confirmation Modal */}

      {/* Ajout et modification de bannière */}
      <DialogBox
        dialogProps={{
          dialogTitle: dialogOpenKey === "edit" ? "Modifier la bannière" : "Ajouter une bannière",
          dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations de la bannière" : "Saisissez les informations de la bannière",
          iconSvg: <></>,
          dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
          handleCloseDialog: onButtonAnnulerClick,
          disable: false,
          loading: loading,
          openDialog: openAddOrEditBanniereDialog,
          onButtonAnnulerClick: onButtonAnnulerClick,
          onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierBanniere() : ajouterBanniere(),
          dialogBoxContentHeader: "",
          dialogBoxContent:
            <div className="w-full  h-[290px] rounded-lg rounded-t-lg overflow-y-auto">
              {message !== "null" && <div className='text-red-600 my-2'>{message}</div>}

              <ImageUploader
                imageHeight={410}
                imageWidth={461}
                label="Image bannière"
                onImageChange={handleImageChange}
                imageEnBase64={banniereFormData?.banniereImageEnBase64 || ""}
              />

              <div className="flex flex-col items-start pt-5 mt-2 px-1 first:mt-0 first:pt-0">

                <FormCheck onChange={(e: any) => setBanniereFormData(prev => ({ ...prev, bannierePublicitaire: prev.bannierePublicitaire === 0 ? 1 : 0 }))} className="mr-2 mb-4">
                  <FormCheck.Input id="bannierePublicitaire" type="checkbox" checked={banniereFormData.bannierePublicitaire === 1 ? true : false} />
                  <FormCheck.Label htmlFor="bannierePublicitaire">
                    Cette bannière est-elle une affiche publicitaire ?
                  </FormCheck.Label>
                </FormCheck>

                {
                  banniereFormData?.bannierePublicitaire === 0 &&
                  <>
                    <div className="">
                      <div className="text-left">
                        <div className="flex items-center">
                          <div className="">Choix de la pizza ou du plat</div>
                        </div>
                      </div>
                    </div>

                    <CustomSelect
                      className="w-full mb-6"
                      data={listePizzas}
                      keys={["pizzaId", "nomPizza"]}
                      onChange={handleInputChange}
                      id="pizzaId"
                      valuesSelected={banniereFormData.pizzaId || ""}
                      required
                    />
                  </>
                }
              </div>


            </div >,
          handleSearch: () => null,
          size: "lg",
          height: "1/2"
        }}
      />

      <CustomNotification
        message={notification?.content}
        notificationRef={notificationRef}
        title={"Info"}
        type={notification?.type}
      />
    </>
  );
}

export default Banniere;

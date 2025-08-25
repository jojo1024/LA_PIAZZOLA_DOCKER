import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../base-components/Button";
import { FormCheck, FormInput, FormLabel } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { NotificationElement } from "../../base-components/Notification";
import { IListePizzaItem, IListePizzaItemFormated, setListePizzas } from "../../stores/menuSlice";
import { IReduxState } from "../../stores/store";
import { apiClient } from "../../utils/apiClient";
import { BASE_URL_PROD, choixViandeData } from "../../utils/constants";
import { convertDateToLocaleStringDate, convertDateToLocaleStringDateTime, formatPizzaData, normalizeString } from "../../utils/functions";
import ConfirmeBox from "../components/ConfirmeBox";
import CustomMenuCard from "../components/CustomMenuCard";
import CustomSelect from "../components/CustomSelect";
import DialogBox from "../components/DialogBox";
import GenericFormInput from "../components/GenericFormInput";
import ImageUploader from "../components/ImageUploader";
import LoadingCard from "../components/LoadingCard";
import { CustomNotification, ITypeNotification } from "../components/Notification";
import { Pagination } from "../components/Pagination";
import Boisson from "./Boisson";
import Condiment from "./Condiment";
import Supplement from "./Supplement";
import { IChoixViande } from "../../stores/commandeSlice";
import Litepicker from "../../base-components/Litepicker";
import { formatDate } from "../../utils/helper";
import PlatDuJour from "./PlatDuJour";


interface RootObject {
  libPizza: string;
  descriptionPizza: string;
  imagePizza: string;
  pizzaFormat: PizzaFormat[];
  etatPizza: number;
}

interface PizzaFormat {
  libFormat: string;
  prixFormat: number;
}


const categoriePizzaData = [
  { categoriePizzaId: 1, libelleCategoriePizza: "Base crème" },
  { categoriePizzaId: 2, libelleCategoriePizza: "Base tomate" },
]

const categoriePlatData = [
  { categoriePizzaId: 6, libelleCategoriePizza: "Plats du jour" },
  { categoriePizzaId: 7, libelleCategoriePizza: "Notre carte" },
]

const initialisePizzaFormData = {
  nomPizza: "",
  descriptionPizza: "",
  pizzaImageEnBase64: null,
  libImagePizza: null,
  pizzaFormat: [
    { formatId: 1, nomFormat: "Small", prixPizzaFormat: null },
    { formatId: 2, nomFormat: "Regular", prixPizzaFormat: null },
    { formatId: 3, nomFormat: "Family", prixPizzaFormat: null },],
  avecViande: 0,
  avecAccompagnement: 0,
  favoris: 0,
  categoriePizzaId: 0,
  peutEtrelivre: 1,
  pizzaId: 0,
  estUnePizza: 1,
  choixViande: null,
  datePlatDuJour: new Date(),
  dateHeurPlatDuJour: new Date(),
  status: 1,
  platDuJourId: 0
}

const pizzaContenuViandeData = [
  {
    id: "avecJambon",
    libelle: "Cette pizza contient-elle du jambon (porc ou boeuf) au choix ?",
  },
  {
    id: "avecCharcuterie",
    libelle: "Cette pizza contient-elle de la charcuterie (porc ou boeuf) au choix ?",
  },
  {
    id: "avecChoriso",
    libelle: "Cette pizza contient-elle de la chorizo ( porc ou boeuf )  au choix ?",
  },


]
export interface INotificationProps { type: ITypeNotification, content: string }

const Menus = () => {

  // Redux
  const dispatch = useDispatch()
  const listePizzas = useSelector((state: IReduxState) => state.menu.listePizzas);
  console.log("🚀 ~ Menus ~ listePizzas:", listePizzas)
  console.log("🚀 ~ Menus ~ listePizzas:", listePizzas)

  // Hooks
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
  const deleteButtonRef = useRef(null);
  const [recherchePizza, setRecherchePizza] = useState("")
  const [openAddOrEditPizzaDialog, setOpenAddOrEditPizzaDialog] = useState(false)
  const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("null")
  const [pizzaOuPlat, setpizzaOuPlat] = useState<"pizza" | "plat">("pizza")
  const [recupListLoading, setRecupListLoading] = useState(false)
  const [pizzaFormData, setPizzaFormData] = useState<IListePizzaItemFormated>(initialisePizzaFormData);
  console.log("🚀 ~ pizzaFormDat>>>>>>>>>>>>>a:", pizzaFormData)
  const [notification, setNotification] = useState<INotificationProps | undefined>()
  const notificationRef = useRef<NotificationElement>();
  const showNotification = () => notificationRef.current?.showToast();


  const onButtonAnnulerClick = () => {
    setOpenAddOrEditPizzaDialog(false);
    setPizzaFormData(initialisePizzaFormData);
  }
  // Filtrr la liste de pizza selon la recherche
  const listePizzaFiltres = useMemo(() => {
    const isSearchDataEmpty = recherchePizza.length === 0
    // Si aucun filtre n'est appliqué, on retourne toute la liste
    if (isSearchDataEmpty) return listePizzas || []
    // Recherche par libellé classe
    if (!isSearchDataEmpty) {
      const rechercheNormalisee = normalizeString(recherchePizza.toLowerCase());
      console.log("🚀 ~ listePizzaFiltres ~ rechercheNormalisee:", rechercheNormalisee)
      
      return listePizzas?.filter(item =>
        normalizeString(item.nomPizza.toLowerCase()).includes(rechercheNormalisee) 
      );
    }
  }, [listePizzas, recherchePizza])

  // Table hooks
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 8
  const pageCount = listePizzaFiltres!.length / itemsPerPage
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


  // Fonction pour mettre à jour la valeur d'un champ
  const handlePizzaFormatInputChange = (index: number, newValue: string) => {
    // Copiez pizzaFormat immuablement
    const updatedFields = pizzaFormData?.pizzaFormat?.map((item, i) =>
      i === index
        ? { ...item, prixPizzaFormat: Number(newValue) } // Mettez à jour l'élément ciblé
        : item // Laissez les autres inchangés
    );
    // Mettez à jour l'état avec le nouvel array immuable
    setPizzaFormData((prev) => ({ ...prev, pizzaFormat: updatedFields }));
  };


  // Fonction générique pour mettre à jour l'état
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPizzaFormData(prev => ({
      ...prev,
      [name]: name === "categoriePizzaId" ? Number(value) : value, // Met à jour dynamiquement le champ modifié
    }));
  };

  // modifier l'image
  const handleImageChange = (base64: string | null) => {
    setPizzaFormData({ ...pizzaFormData, pizzaImageEnBase64: base64 });
  };

  const recupListePizza = async () => {
    try {
      setRecupListLoading(true)
      const res = await apiClient.get("/recup_pizza_format")
      if (!res.status) throw res.error
      const data = res.data as IListePizzaItem[]
      console.log("🚀 ~ recupListePizza ~ formatPizzaData(data):", res.data)
      dispatch(setListePizzas(formatPizzaData(data)))
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setRecupListLoading(false)
    }
  }

  const ajouterPizza = async () => {
    try {
      setLoading(true)
      // const payload = { pizzaFormat: [{ formatId: 1, prixFormat: 3000 }, { formatId: 2, prixFormat: 5000 }, { formatId: 3, prixFormat: 7000 }], nomPizza: "Paillazola", descriptionPizza: "kichta balaise", categoriePizzaId: 1, favoris: 0, avecViande: 0, pizzaImageEnBase64: pizzaFormData.pizzaImageEnBase64, }
      if (
        !pizzaFormData.nomPizza || 
        // !pizzaFormData.descriptionPizza || 
        !pizzaFormData.categoriePizzaId || 
        !pizzaFormData.pizzaImageEnBase64 ||
        (pizzaOuPlat === "plat" 
          ? !pizzaFormData.pizzaFormat[0]?.prixPizzaFormat 
          : (!pizzaFormData.pizzaFormat[0]?.prixPizzaFormat || 
             !pizzaFormData.pizzaFormat[1]?.prixPizzaFormat || 
             !pizzaFormData.pizzaFormat[2]?.prixPizzaFormat))
      ) {
        setMessage("Tous les champs sont obligatoires !");
        return;
      }
      
      console.log("🚀 ~ ajouterPizza ~ pizzaFormData:", pizzaFormData)
      // return
      const res = await apiClient.post("/ajouter_pizza", { ...pizzaFormData, pizzaFormat: pizzaOuPlat === "pizza" ? pizzaFormData.pizzaFormat : pizzaFormData.pizzaFormat.slice(0, 1), estUnePizza: pizzaOuPlat === "pizza" ? 1 : 0 })
      if (!res.status) throw res.error
      const data = res.data as IListePizzaItem
      // dispatch(addPizza(data))
      setPizzaFormData(initialisePizzaFormData)
      displayNotification({ type: "success", content: `${pizzaOuPlat === "pizza" ? "Pizza" : "Plat"} ajouté(e) avec succès !"` });

      console.log("🚀 ~ ajouterPizza ~ data:", data)
      // console.log("🚀 ~ recupListePizza ~ formatPizzaData(data):", formatPizzaData(data))
      // dispatch(setListePizzas(formatPizzaData(data)))
      setOpenAddOrEditPizzaDialog(false)
      setMessage("null")
    } catch (error: any) {
      displayNotification({ content: error?.message, type: "error" })
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }


  const modifierPizza = async () => {
    try {
      if (!pizzaFormData.nomPizza ||  !pizzaFormData.categoriePizzaId
        || pizzaOuPlat === "plat" ? !pizzaFormData.pizzaFormat[0].prixPizzaFormat : (!pizzaFormData.pizzaFormat[0].prixPizzaFormat || !pizzaFormData.pizzaFormat[1].prixPizzaFormat || !pizzaFormData.pizzaFormat[2].prixPizzaFormat)) {
        console.log("🚀 ~ ajouterPizza ~ pizzaFormData:", pizzaFormData)
        setMessage("Tous les champs sont obligatoires !")
        return
      }
      setLoading(true)
      // return
      const res = await apiClient.post("/modifier_pizza", { ...pizzaFormData, pizzaImageEnBase64: pizzaFormData?.pizzaImageEnBase64, pizzaFormat: pizzaOuPlat === "pizza" ? pizzaFormData.pizzaFormat : pizzaFormData.pizzaFormat.slice(0, 1), estUnePizza: pizzaOuPlat === "pizza" ? 1 : 0 })
      if (!res.status) throw res.error
      // const data = res.data as IListePizzaItem
      // dispatch(updatePizza(data))
      setPizzaFormData(initialisePizzaFormData)
      displayNotification({ type: "success", content: `${pizzaOuPlat} modifié(e) avec succès !` });
      setMessage("null")
      setOpenAddOrEditPizzaDialog(false)
    } catch (error: any) {
      displayNotification({ content: error?.message, type: "error" })
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  const supprimerPizza = async (status: 0 | 1, pizzaId: number) => {
    try {
      setLoading(true)
      const res = await apiClient.post("/supprimer_pizza", { pizzaId, status })
      if (!res.status) throw res.error
      // const data = res.data as IListePizzaItem
      // dispatch(deletePizza(data))
      displayNotification({ type: "success", content: `${pizzaOuPlat} supprimé(e) avec succès !` });
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
    recupListePizza()
  }, [])

  return (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Menu</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button onClick={() => {
            setOpenAddOrEditPizzaDialog(true)
            setdialogOpenKey("add")
          }}
            variant="primary" className="mr-2 shadow-md">
            Ajouter une pizza ou un plat
          </Button>

          <div className="hidden mx-auto md:block text-slate-500">
            .
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Rechercher une pizza ici..."
                onChange={(e) => setRecherchePizza(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
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
              {/* data={_.orderBy(listePizzaFiltres, ['pizzaId'], ['desc'])} */}

              {/* {_.orderBy(listePizzaFiltres, ['pizzaId'], ['desc'])?.slice(startIndex, endIndex)?.map((item, index) => ( */}
              {listePizzaFiltres && _.orderBy(listePizzaFiltres, ['pizzaId'], ['desc'])?.slice(startIndex, endIndex)?.map((item, index) => (
                <CustomMenuCard
                  key={index}
                  libPizza={item?.nomPizza}
                  estUnePizza={item?.estUnePizza}
                  descriptionPizza={item?.descriptionPizza}
                  imagePizza={`${BASE_URL_PROD}/pizza_image/${item?.libImagePizza}`}
                  pizzaFormat={item?.pizzaFormat || []}
                  onButtonEditClick={() => {
                    setOpenAddOrEditPizzaDialog(true)
                    setdialogOpenKey("edit")
                    setPizzaFormData(item)
                    setpizzaOuPlat(item?.estUnePizza ? "pizza" : "plat")
                  }}
                  onButtonDeleteClick={() => {
                    setOpenDeleteConfirmBox(true)
                    setPizzaFormData(item)
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
      <PlatDuJour />

      <Boisson />

      <Supplement />

      <Condiment />

      {/* BEGIN: Delete Confirmation Modal */}
      <ConfirmeBox
        confirmBoxProps={{
          intitule: `Voulez-vous vraiment supprimer ${pizzaFormData.nomPizza} ?`,
          handleConfirme: () => supprimerPizza(0, pizzaFormData.pizzaId),
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

      {/* Ajout et modification de pizza */}
      <DialogBox
        dialogProps={{
          dialogTitle: dialogOpenKey === "edit" ? `Modifier ${pizzaOuPlat === "pizza" ? "la pizza" : "le plat"}  ${pizzaFormData?.nomPizza}` : `Ajouter ${pizzaOuPlat === "pizza" ? "une pizza" : "un plat"}`,
          dialogSubTitle: dialogOpenKey === "edit" ? `Modifier les informations  ${pizzaOuPlat === "pizza" ? "de la pizza" : "du plat"}` : `Saisissez les informations de ${pizzaOuPlat === "pizza" ? "la pizza" : "le plat"}"`,
          iconSvg: <></>,
          dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
          handleCloseDialog: onButtonAnnulerClick,
          disable: false,
          loading: loading,
          openDialog: openAddOrEditPizzaDialog,
          onButtonAnnulerClick: onButtonAnnulerClick,
          onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierPizza() : ajouterPizza(),
          dialogBoxContentHeader: "",
          dialogBoxContent:
            <div className="w-full h-[400px] lg:h-[300px] xl:h-[450px] 2xl:h-[520px] rounded-lg rounded-t-lg overflow-y-auto">

              <div className="mt-3">
                {/* <label>Horizontal Radio Button</label> */}
                <div className="flex flex-col mt-2 sm:flex-row">
                  <FormCheck className="mr-8">
                    <FormCheck.Input onChange={() => setpizzaOuPlat("pizza")} checked={pizzaOuPlat === "pizza" ? true : false} id="pizza" type="radio" name="horizontal_radio_button" value="horizontal-radio-chris-evans" />
                    <FormCheck.Label htmlFor="pizza">
                      Pizza
                    </FormCheck.Label>
                  </FormCheck>
                  <FormCheck className="mt-2 mr-2 sm:mt-0">
                    <FormCheck.Input onChange={() => setpizzaOuPlat("plat")} checked={pizzaOuPlat !== "pizza" ? true : false} id="plat" type="radio" name="horizontal_radio_button" value="horizontal-radio-liam-neeson" />
                    <FormCheck.Label htmlFor="plat">
                      Plat
                    </FormCheck.Label>
                  </FormCheck>

                </div>
              </div>

              {message !== "null" && <div className='text-red-600 my-2 sticky'>{message}</div>}
              <ImageUploader
                label={`Image ${pizzaOuPlat === "pizza" ? "pizza" : "plat"}`}
                imageHeight={315}
                imageWidth={474}
                onImageChange={handleImageChange}
                imageEnBase64={pizzaFormData?.pizzaImageEnBase64 || ""}
              />
              {/* Champ pour le nom de la pizza */}
              <GenericFormInput
                label={`Nom  ${pizzaOuPlat === "pizza" ? "de la pizza" : "du plat"}`}
                id="nomPizza"
                // placeholder="Nom de la pizza"
                value={pizzaFormData.nomPizza}
                onChange={(e) => handleInputChange(e)}
                required
                className="mb-2"
              />

              {/* Champ pour la description de la pizza */}
              <GenericFormInput
                label={`Description  ${pizzaOuPlat === "pizza" ? "de la pizza" : "du plat"}`}
                id="descriptionPizza"
                type="text"
                // placeholder="Entrez la description de la pizza"
                value={pizzaFormData.descriptionPizza}
                onChange={(e) => handleInputChange(e)}
                // required
              />
              {/* Insérer le prix des différents formats */}
              <div className="flex-1 w-full  mt-6">
                <div className="grid-cols-4 gap-2 sm:grid">
                  {(pizzaOuPlat === "pizza" ? pizzaFormData.pizzaFormat : pizzaFormData.pizzaFormat.slice(0, 1)).map((field, index) => (
                    <div key={index} className="mb-5 sm:mr-4  sm:mb-0">
                      <FormLabel htmlFor={`form-input-${index}`}>{`Prix ${pizzaOuPlat === "pizza" ? field.nomFormat : "du plat"}`}<span className="text-red-600"> *</span></FormLabel>
                      <FormInput
                        id={`form-input-${index}`}
                        type="number"
                        className=" sm:mt-0"
                        // placeholder={`Prix ${field.nomFormat}`}
                        value={field?.prixPizzaFormat || ""}
                        onChange={(e) => handlePizzaFormatInputChange(index, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-start pt-5 mt-2  first:mt-0 first:pt-0">
                <div className="xl:w-40 xl:!mr-4">
                  <div className="text-left">
                    <div className="flex items-center">
                      <div className="">Catégorie {pizzaOuPlat === "pizza" ? "de la pizza" : "du plat"}<span className="text-red-600"> *</span></div>
                    </div>
                  </div>
                </div>

                <CustomSelect
                  className="w-full"
                  data={pizzaOuPlat === "pizza" ? categoriePizzaData : categoriePlatData}
                  keys={["categoriePizzaId", "libelleCategoriePizza"]}
                  onChange={handleInputChange}
                  id="categoriePizzaId"
                  valuesSelected={pizzaFormData.categoriePizzaId}
                />
              </div>
              {/* {
                pizzaFormData.categoriePizzaId === 6 &&
                <div className="flex flex-col items-start pt-5 mt-2 mb-6 first:mt-0 first:pt-0">
                  <div className="xl:w-40 xl:!mr-4">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="">Date du plat du jour</div>
                      </div>
                    </div>
                  </div>
                  <Litepicker value={convertDateToLocaleStringDate(pizzaFormData?.datePlatDuJour)} onChange={(e: any) => setPizzaFormData(prev => ({ ...prev, datePlatDuJour: new Date(e) }))} options={{
                    autoApply: true,
                    showWeekNumbers: true,
                    lang: "fr",
                    dropdowns: {
                      minYear: 2025,
                      maxYear: null,
                      months: true,
                      years: true,
                    },
                  }}  />
                </div>
              } */}


              {
                pizzaOuPlat === "pizza"
                &&
                <div className="mt-6 px-1">
                  <label className=" text-black">Pizza favoris</label>

                  <div className="flex flex-col my-2 mb-4 mt-2">
                    <FormCheck onChange={(e: any) => setPizzaFormData(prev => ({ ...prev, favoris: prev.favoris === 0 ? 1 : 0 }))} className="mt-2 mr-2 sm:mt-0">
                      <FormCheck.Input id="favoris" type="checkbox" checked={pizzaFormData.favoris === 1 ? true : false} />
                      <FormCheck.Label htmlFor="favoris">
                        Cette pizza fait-elle partie des favorites ?
                      </FormCheck.Label>
                    </FormCheck>
                  </div>

                  <div>
                    <label className=" text-black">Pizza avec viande</label>
                    {
                      pizzaContenuViandeData.map((item, index) => (
                        <FormCheck key={`${index}`} className="mt-2 p-1">
                          <FormCheck.Input
                            id={item.id}
                            type="radio"
                            name={item.id}
                            value={item.id}
                            checked={item.id === pizzaFormData?.choixViande}
                            onChange={(e: any) => setPizzaFormData(prev => ({ ...prev, choixViande: e.target.value }))}
                          />
                          <FormCheck.Label htmlFor={item.id}>
                            {item?.libelle}
                          </FormCheck.Label>
                        </FormCheck>
                      ))
                    }
                  </div>
                </div>
              }

              {
                pizzaOuPlat === "plat"
                &&
                <div>
                  <div className="flex flex-col my-2 mb-4 mt-2">
                    <FormCheck onChange={(e: any) => setPizzaFormData(prev => ({ ...prev, avecAccompagnement: prev.avecAccompagnement === 0 ? 1 : 0 }))} className="mt-2 mr-2 sm:mt-0">
                      <FormCheck.Input id="avecAccompagnement" type="checkbox" checked={pizzaFormData.avecAccompagnement === 1 ? true : false} />
                      <FormCheck.Label htmlFor="avecAccompagnement">
                        Ce plat est-il servi avec un accompagnement ?
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                  <div className="flex flex-col my-2 mb-4 mt-2">
                    <FormCheck onChange={(e: any) => setPizzaFormData(prev => ({ ...prev, peutEtrelivre: prev.peutEtrelivre === 0 ? 1 : 0 }))} className="mt-2 mr-2 sm:mt-0">
                      <FormCheck.Input id="peutEtrelivre" type="checkbox" checked={pizzaFormData.peutEtrelivre === 1 ? true : false} />
                      <FormCheck.Label htmlFor="peutEtrelivre">
                        Ce plat peut  être livré ?
                      </FormCheck.Label>
                    </FormCheck>
                  </div>
                </div>
              }

            </div>,
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

export default Menus;

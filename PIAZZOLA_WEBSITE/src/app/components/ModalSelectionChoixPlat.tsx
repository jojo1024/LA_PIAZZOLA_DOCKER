import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IBoisson, ICommandeDetail } from "../../store/interfaces";
import { initialiseCommandeDetail } from "../../store/menuSlice";
import { IReduxState } from "../../store/store";
import { quantitePizzaData } from "../../utils/constant";
import { extractZodErrors, formatListeSupplement } from "../../utils/functions";
import ButtonClose from "./Button/ButtonClose";
import CustomButton from "./CustomButton";
import CustomSelect1 from "./CustomSelect1";
import DisplayNotification from "./DisplayNotification";
import MultiSelect from "./MultiSelect";


export interface ModalSelectionChoixPlatProps {
  show: boolean;
  onCloseModalQuickView: () => void;
  choixPizzaSelectionnee: ICommandeDetail;
  handleChange: any;
  setChoixPizzaSelectionnee: React.Dispatch<React.SetStateAction<ICommandeDetail>>;
  setCommandeBoisson: React.Dispatch<React.SetStateAction<IBoisson[]>>;
  commandeBoisson: IBoisson[];
  onButtonAddClick: any;
  buttonTitle: string;
}

const ModalSelectionChoixPlat: FC<ModalSelectionChoixPlatProps> = ({
  show,
  onCloseModalQuickView,
  choixPizzaSelectionnee,
  handleChange,
  setCommandeBoisson,
  commandeBoisson,
  setChoixPizzaSelectionnee,
  onButtonAddClick,
  buttonTitle
}) => {

  // Redux
  const {  boisson, supplement, accompagnement } = useSelector((state: IReduxState) => state.pizzaAccompagnement);
  console.log("🚀 ~ supplement<<<<<<<<<<<<<<:", boisson)
  //  Hooks
  // Formater la liste des uppléments par categorie
  const supplementFormate = useMemo(() => formatListeSupplement(supplement), [supplement])
  console.log("🚀 ~ supplementFormate:", supplementFormate)
  const [formErrors, setFormErrors] = useState<any>({})
  // const [selectedSupplements, setSelectedSupplements] = useState<ISupplement[]>([]);

  // Recuperer l'item de la pizza selectioonné
  // const pizzaFormatFiltre = pizzaFormat.filter(item => item.pizzaId === choixPizzaSelectionnee.pizzaId)

  const addPizzaToCart = () => {
    try {
      // addPizzaPayloadSchema.parse({ quantiteCommande: choixPizzaSelectionnee.quantiteCommande, pizzaFormatId: 1 })
      setFormErrors({})
      onButtonAddClick()
      DisplayNotification({ libelle: "Plat ajouté avec succès !", type: "success", time: 1000 })
      setChoixPizzaSelectionnee(initialiseCommandeDetail)
      onCloseModalQuickView()
    } catch (error) {
      console.log("🚀 ~ addPizzaToCart ~ error:", error)
      const errors = extractZodErrors(error);
      setFormErrors(errors); // Met à jour l'état avec les erreurs
    }
  }



  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50"
        onClose={onCloseModalQuickView}
      >
        <div className="flex items-stretch md:items-center justify-center h-full text-center md:px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black/40 dark:bg-black/70" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block align-middle" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative inline-flex xl:py-8 w-full max-w-lg max-h-full ">
              <div
                className="flex-1 bg-white  overflow-hidden max-h-full  w-full  align-middle transition-all transform lg:rounded-2xl  
              dark:bg-neutral-900 dark:border dark:border-slate-700 dark:text-slate-100 shadow-xl"
              >
                <div className="bg-red-600 py-4">
                  <span className="absolute right-3 top-3 z-50">
                    <ButtonClose onClick={onCloseModalQuickView} color="white" />
                  </span>

                  <div className="text-xl text-white">{choixPizzaSelectionnee?.nomPizza}</div>
                  <div className="text-sm text-white mx-2">{choixPizzaSelectionnee?.descriptionPizza}</div>
                </div>
                <div className="  h-[300px]   p-8 rounded-xl">
                  {/* CHoix de la quantité de pizza souhaité */}
                  <CustomSelect1
                    containerClassname="mb-4 flex-col "
                    textClassname="w-32"
                    label="Quantité"
                    id="quantiteCommande"
                    valuesSelected={choixPizzaSelectionnee?.quantiteCommande || ""}
                    onChange={(e: any) => handleChange(e)}
                    data={quantitePizzaData}
                    keys={["idQuantiteCommande", "quantiteCommande"]}
                    error={formErrors["quantiteCommande"]}
                    required={true}
                  />

                  {/* Le choix de la viande depend de la pizza sélectionnée, toutes les pizzas n'utilisent pas la viande */}
                  {
                    choixPizzaSelectionnee?.avecAccompagnement
                    ?
                    <CustomSelect1
                      containerClassname="mb-4 flex-col "
                      textClassname="w-32"
                      label={`Accompagnement`}
                      id="accompagnementId"
                      valuesSelected={choixPizzaSelectionnee?.accompagnementId || ""}
                      onChange={(e: any) => handleChange(e)}
                      data={accompagnement}
                      keys={["accompagnementId", "nomAccompagnement"]}
                      required={true}
                    />
                    :null
                  }

                  <MultiSelect
                    setCategoriesState={setCommandeBoisson}
                    categoriesState={commandeBoisson}
                    data={boisson} libelle="Boissons"
                    // Pour afficher le nom et le prix de la boisson puisque c'est un composant générique
                    keys={["boissonId", "nomBoisson", "prixBoisson"]}
                    containerClassname="mb-4"
                    // disabled={choixPizzaSelectionnee?.pizzaGratos ? true : false}
                  />

                </div>
                {/* Bouton ajouter la pizza dans le panier */}
                <div className="m-4 z-0">
                  <CustomButton
                    onClick={() => addPizzaToCart()}
                    title={buttonTitle} width="w-full" classname="" />
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalSelectionChoixPlat;

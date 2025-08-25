import { Dialog, Transition } from "@headlessui/react";
import React, { FC, Fragment, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IBoisson, ICommandeDetail, ICondiment, ISupplement } from "../../store/interfaces";
import { initialiseCommandeDetail } from "../../store/menuSlice";
import { addPizzaPayloadSchema } from "../../store/schemas";
import { IReduxState } from "../../store/store";
import { choixViandeData, choixViandeitem, quantitePizzaData } from "../../utils/constant";
import { extractZodErrors, formatListeSupplement } from "../../utils/functions";
import ButtonClose from "./Button/ButtonClose";
import CustomButton from "./CustomButton";
import CustomSelect1 from "./CustomSelect1";
import DisplayNotification from "./DisplayNotification";
import MultiSelect from "./MultiSelect";
import MultiSelectGroupeParCategorie from "./MultiSelectGroupeParCategorie";
import Textarea from "./Textarea";


export interface ModalSelectionChoixPizzaProps {
  show: boolean;
  onCloseModalQuickView: () => void;
  choixPizzaSelectionnee: ICommandeDetail;
  handleChange: any;
  setChoixPizzaSelectionnee: React.Dispatch<React.SetStateAction<ICommandeDetail>>;
  setCommandeBoisson: React.Dispatch<React.SetStateAction<IBoisson[]>>;
  commandeBoisson: IBoisson[];
  setCommandeSupplement: React.Dispatch<React.SetStateAction<ISupplement[]>>
  commandeSupplement: ISupplement[];
  setCommandeCondiment: React.Dispatch<React.SetStateAction<ICondiment[]>>
  commandeCondiment: ICondiment[];
  onButtonAddClick: any;
  buttonTitle: string;
}

const ModalSelectionChoixPizza: FC<ModalSelectionChoixPizzaProps> = ({
  show,
  onCloseModalQuickView,
  choixPizzaSelectionnee,
  handleChange,
  setCommandeBoisson,
  commandeBoisson,
  setCommandeSupplement,
  commandeSupplement,
  setCommandeCondiment,
  commandeCondiment,
  setChoixPizzaSelectionnee,
  onButtonAddClick,
  buttonTitle
}) => {
  console.log("🚀 ~ commandeSupp>>>>>lement:", commandeSupplement)

  // Redux
  const { pizzaFormat, condiment, pate, viande, boisson, supplement } = useSelector((state: IReduxState) => state.pizzaAccompagnement);
  console.log("🚀 ~ supplement<<<<<<<<<<<<<<:", boisson)
  //  Hooks
  // Formater la liste des uppléments par categorie
  const supplementFormate = useMemo(() => formatListeSupplement(supplement), [supplement])
  console.log("🚀 ~ supplementFormate:", supplementFormate)
  const [formErrors, setFormErrors] = useState<any>({})
  // const [selectedSupplements, setSelectedSupplements] = useState<ISupplement[]>([]);

  // Recuperer l'item de la pizza selectioonné
  const pizzaFormatFiltre = pizzaFormat.filter(item => item.pizzaId === choixPizzaSelectionnee.pizzaId)

  const addPizzaToCart = () => {
    try {
      addPizzaPayloadSchema.parse({ quantiteCommande: choixPizzaSelectionnee.quantiteCommande, pizzaFormatId: choixPizzaSelectionnee.pizzaFormatId, pateId: choixPizzaSelectionnee.pateId })
      setFormErrors({})
      onButtonAddClick()
      DisplayNotification({ libelle: "Pizza ajoutée avec succès !", type: "success", time: 1000 })
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
                <div className=" overflow-y-auto  h-[500px] lg:h-[450px] xl:[550px] 2xl:h-[570px]  p-8 rounded-xl">
                  {/* CHoix de la quantité de pizza souhaité */}
                  <CustomSelect1
                    containerClassname="mb-4 flex-col lg:flex-row lg:items-center"
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
                  {/* Choix du format */}
                  <CustomSelect1
                    containerClassname="mb-4 flex-col lg:flex-row lg:items-center"
                    textClassname="w-32"
                    label="Format"
                    id="pizzaFormatId"
                    valuesSelected={choixPizzaSelectionnee?.pizzaFormatId || ""}
                    onChange={(e: any) => handleChange(e)}
                    data={pizzaFormatFiltre}
                    keys={["pizzaFormatId", "nomFormat", "prixPizzaFormat"]}
                    error={formErrors["pizzaFormatId"]}
                    required={true}
                    disabled={choixPizzaSelectionnee?.pizzaGratos ? true : false}
                  />
                  {/* Choix de la pâte */}
                  <CustomSelect1
                    containerClassname="mb-4 flex-col lg:flex-row lg:items-center"
                    textClassname="w-32"
                    label="Pâtes"
                    id="pateId"
                    valuesSelected={choixPizzaSelectionnee?.pateId || ""}
                    onChange={(e: any) => handleChange(e)}
                    data={pate}
                    keys={["pateId", "nomPate"]}
                    error={formErrors["pateId"]}
                    required={true}
                  />
                  {/* Le choix de la viande depend de la pizza sélectionnée, toutes les pizzas n'utilisent pas la viande */}
                  {choixViandeData.includes(choixPizzaSelectionnee?.choixViande || "")
                    ?
                    // Choix de la pizza
                    <CustomSelect1
                      containerClassname="mb-4 flex-col lg:flex-row lg:items-center"
                      textClassname="w-32"
                      label={`${choixViandeitem[choixPizzaSelectionnee?.choixViande!]}`}
                      id="viandeId"
                      valuesSelected={choixPizzaSelectionnee?.viandeId || ""}
                      onChange={(e: any) => handleChange(e)}
                      data={viande}
                      keys={["viandeId", "nomViande"]}
                      required={true}
                    />
                    : null
                  }
                  {/* Choix des condiments */}
                  {/* <CustomSelect1
                    containerClassname="mb-4 flex-col lg:flex-row lg:items-center"
                    textClassname="w-32"
                    label="Condiments"
                    id="condimentId"
                    valuesSelected={choixPizzaSelectionnee?.condimentId || ""}
                    onChange={(e: any) => handleChange(e)}
                    data={condiment}
                    keys={["condimentId", "nomCondiment"]}
                  /> */}
                  {
                    !choixPizzaSelectionnee?.pizzaGratos
                    &&
                    <MultiSelect
                      setCategoriesState={setCommandeCondiment}
                      categoriesState={commandeCondiment}
                      data={condiment}
                      libelle="Condiments"
                      keys={["condimentId", "nomCondiment"]}
                      containerClassname="mb-4"
                    />
                  }
                  {
                    !choixPizzaSelectionnee?.pizzaGratos
                    &&
                    <MultiSelect
                      setCategoriesState={setCommandeBoisson}
                      categoriesState={commandeBoisson}
                      data={boisson} libelle="Boissons"
                      // Pour afficher le nom et le prix de la boisson puisque c'est un composant générique
                      keys={["boissonId", "nomBoisson", "prixBoisson"]}
                      containerClassname="mb-4"
                      disabled={choixPizzaSelectionnee?.pizzaGratos ? true : false}
                    />
                  }
                  {/* Coix des supplements */}
                  {
                    !choixPizzaSelectionnee?.pizzaGratos
                    &&
                    <MultiSelectGroupeParCategorie
                      data={supplementFormate}
                      libelle="Suppléments"
                      keys={['supplementId', 'nomSupplement']}
                      containerClassname="mb-4"
                      categoriesState={commandeSupplement}
                      setCategoriesState={setCommandeSupplement}
                    />
                  }
                  {/* Demande spéciale */}
                  <Textarea name="demandeSpeciale" maxLength={70} value={choixPizzaSelectionnee?.demandeSpeciale || ""} onChange={(e: any) => handleChange({ ["demandeSpeciale"]: e.target.value })} placeholder="Demande spéciale hors supplements" rows={3} />
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

export default ModalSelectionChoixPizza;

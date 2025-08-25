import { FC, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { IBoisson, ICommandeDetail, ICondiment, ISupplement } from "../../store/interfaces";
import { initialiseCommandeDetail } from "../../store/menuSlice";
import { IReduxState } from "../../store/store";
import { BASE_URL_PROD } from "../../utils/constant";
import { addPizzaInCart, formatMontantFCFA, handleOpenModalChoixComplementPizza, recupPrixPizza } from "../../utils/functions";
import { PizzaIconSvg } from "../../utils/svg";
import CustomButton from "./CustomButton";
import CustomHeading from "./CustomHeading";
import ModalSelectionChoixPizza from "./ModalSelectionChoixPizza";
import NcImage from "./NcImage/NcImage";
import Tippy from "@tippyjs/react";
interface ExploreType {
    id: number;
    name: string;
    desc: string;
    image: string;
    svgBg: string;
    color?: string;
}

export interface SectionGridMoreExploreProps {
    className?: string;
    gridClassName?: string;
    boxCard?: "box1" | "box4" | "box6";
    data?: ExploreType[];
}
export interface IItemPizza {
    idPizza: number;
    title: string;
    price: string;
    image: string;
    description: string;
    detailCommande?: {
        quantite: string | number;
        format?: string;
        pate?: string;
        viande?: string;
        condiment?: string;
        supplement?: string;
        boisson?: string;
        demandeSpeciale?: string;
    };

}


const SectionBestChoice: FC<SectionGridMoreExploreProps> = ({
    className = "",
}) => {

    // Redux
    const listePizzas = useSelector((state: IReduxState) => state.menu.listePizzas);
    const pizzaGratosAlreadyUsed = useSelector((state: IReduxState) => state.application.pizzaGratosAlreadyUsed);
    console.log("🚀 ~ pizzaGratosAlreadyUsed:", pizzaGratosAlreadyUsed)
    console.log("🚀 ~ listePizzas:", listePizzas)

    const [openModal, setOpenModal] = useState(false)
    const [choixPizzaSelectionnee, setChoixPizzaSelectionnee] = useState<ICommandeDetail>(initialiseCommandeDetail)
    console.log("🚀 ~ choixPizzaSelectionnee:", choixPizzaSelectionnee)

    const [commandeBoisson, setCommandeBoisson] = useState<IBoisson[]>([])
    const [commandeSupplement, setCommandeSupplement] = useState<ISupplement[]>([])
    const [commandeCondiment, setCommandeCondiment] = useState<ICondiment[]>([])

    const pizzaFavoris = useMemo(() => { return listePizzas.filter(item => item.favoris) }, [listePizzas])

    // const handleOpenModal = (item: any) => {
    //     setOpenModal(true);
    //     setChoixPizzaSelectionnee(prev => ({
    //         ...prev,
    //         ...item,
    //         pizzaFormatId: recupPizzaFormatByPizzaId(item.pizzaId)?.pizzaFormatId,
    //         prixPizzaFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.prixPizzaFormat,
    //         nomFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.nomFormat,
    //         nomPate: recupPateByPateId(prev.pateId)?.nomPate,
    //     }));
    // }

    const handleInputChange = (e: any) => {
        // const { name, value } = e.target
        setChoixPizzaSelectionnee(prev => ({ ...prev, ...e }))
    }

    const onModalClose = () => {
        setOpenModal(false);
        setChoixPizzaSelectionnee(initialiseCommandeDetail)
        setCommandeSupplement([])
        setCommandeBoisson([])
    }


    const onButtonAddClick = () => {
        addPizzaInCart(choixPizzaSelectionnee, commandeBoisson, commandeSupplement, setCommandeBoisson, setCommandeSupplement, setCommandeCondiment, commandeCondiment)
    }

    return (
        <div className=" mb-12 container">
            <div className="py-4">
                <div
                    className={`nc-SectionBestChoice relative ${className}`}
                    data-nc-id="SectionBestChoice"
                >
                    <CustomHeading title="Nos meilleurs choix" classname=" mb-8" />

                    <div className="grid grid-cols-12 gap-6 md:gap-8   2xl:gap-10 ">
                        {
                            pizzaFavoris?.slice(0, 4).map((item, index) => (
                                <div key={index} className="col-span-6  md:col-span-3 xl:col-span-3 mb-8 sm:mb-0">
                                    <Tippy content={item?.descriptionPizza} placement="top" >
                                        <div className=""
                                        // onClick={() => handleOpenModalChoixComplementPizza(item, setOpenModal, setChoixPizzaSelectionnee)}
                                        >
                                            <NcImage
                                                src={`${BASE_URL_PROD}/pizza_image/${item?.libImagePizza}`}
                                                alt={item?.nomPizza}
                                                className="w-full  h-full  object-contain bg-cover rounded-xl"
                                            />
                                        </div>
                                    </Tippy>
                                    <div className="flex items-center justify-center mt-3">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm sm:text-xl">{item.nomPizza}</span>
                                            {/* J'affiche par default le prix du pizza small */}
                                            <span className="text-slate-500 font-bold text-sm sm:text-xl">{formatMontantFCFA(recupPrixPizza(item.pizzaId) || 0)}</span>
                                        </div>
                                        {/* <Button
                                            onClick={() => handleOpenModal(item)}
                                            className={`ttnc-ButtonPrimary w-30 ml-2 rounded-lg disabled:bg-opacity-90 text-black`}
                                        >
                                            <AddIconSvg size="40" />
                                        </Button> */}
                                    </div>
                                    <div className="  mt-2">
                                        <CustomButton onClick={() => handleOpenModalChoixComplementPizza(item, setOpenModal, setChoixPizzaSelectionnee)} title='Commandez' width="w-full" iconSvg={<PizzaIconSvg color="white" />} />
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <ModalSelectionChoixPizza
                buttonTitle="Ajouter au panier"
                setChoixPizzaSelectionnee={setChoixPizzaSelectionnee}
                handleChange={handleInputChange}
                show={openModal}
                onCloseModalQuickView={onModalClose}
                choixPizzaSelectionnee={choixPizzaSelectionnee}
                setCommandeSupplement={setCommandeSupplement}
                commandeSupplement={commandeSupplement}
                setCommandeBoisson={setCommandeBoisson}
                setCommandeCondiment={setCommandeCondiment}
                commandeCondiment={commandeCondiment}
                commandeBoisson={commandeBoisson}
                onButtonAddClick={onButtonAddClick}
            />

        </div>
    );
};

export default SectionBestChoice;

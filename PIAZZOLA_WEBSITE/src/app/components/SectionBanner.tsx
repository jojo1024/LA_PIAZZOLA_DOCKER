import { FC, useEffect, useState } from "react";
import useBoolean from "react-use/lib/useBoolean";
import useInterval from "react-use/lib/useInterval";
import { IBanniereItem, IBoisson, ICommandeDetail, ICondiment, ISupplement } from "../../store/interfaces";
import { initialiseCommandeDetail } from "../../store/menuSlice";
import { addPizzaInCart, handleOpenModalChoixComplementPizza } from "../../utils/functions";
import ModalSelectionChoixPizza from "./ModalSelectionChoixPizza";
import NcImage from "./NcImage/NcImage";
import Next from "./NextPrev/Next";
import Prev from "./NextPrev/Prev";

import { apiClient } from "../../utils/apiClient";
import { BASE_URL_PROD } from "../../utils/constant";
import ModalSelectionChoixPlat from "./ModalSelectionChoixPlat";

export interface SectionHero2Props {
  className?: string;
}

let TIME_OUT: NodeJS.Timeout | null = null;

const SectionBanner: FC<SectionHero2Props> = ({ className = "" }) => {

  //Redux
  // const dispatch = useDispatch()
  // const listePizzas = useSelector((state: IReduxState) => state.menu.listePizzas);

  // Hooks
  const [indexActive, setIndexActive] = useState(0);
  const [isRunning, toggleIsRunning] = useBoolean(true);
  const [choixPizzaSelectionnee, setChoixPizzaSelectionnee] = useState<ICommandeDetail>(initialiseCommandeDetail)
  const [commandeBoisson, setCommandeBoisson] = useState<IBoisson[]>([])
  const [commandeSupplement, setCommandeSupplement] = useState<ISupplement[]>([])
  const [commandeCondiment, setCommandeCondiment] = useState<ICondiment[]>([])
  const [openModal, setOpenModal] = useState(false)
  const [openModalPlat, setOpenModalPlat] = useState(false)
  const [bannieres, setBannieres] = useState<IBanniereItem[]>([])

  // const bannieres = useMemo(() => { return _.orderBy(listePizzas.filter(item => item?.libImageBanniere), ['ordrePizza'], ['desc']) }, [listePizzas])

  // const handleOpenModal = (item: any) => {
  //   setOpenModal(true);
  //   setChoixPizzaSelectionnee(prev => ({
  //     ...prev,
  //     ...item,
  //     pizzaFormatId: recupPizzaFormatByPizzaId(item.pizzaId)?.pizzaFormatId,
  //     prixPizzaFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.prixPizzaFormat,
  //     nomFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.nomFormat,
  //     nomPate: recupPateByPateId(prev.pateId)?.nomPate,
  //   }));
  // }

  // Pour modifier l'état lors de la séléction des choix de la pizza
  const handleInputChange = (e: any) => {
    // const { name, value } = e.target
    setChoixPizzaSelectionnee(prev => ({ ...prev, ...e }))
  }

  // DEBUT ANIMATION BANNIERE
  useInterval(
    () => {
      handleAutoNext();
    },
    isRunning ? 5500 : null
  );
  //

  const handleAutoNext = () => {
    setIndexActive((state) => {
      if (state >= bannieres.length - 1) {
        return 0;
      }
      return state + 1;
    });
  };

  const handleClickNext = () => {
    setIndexActive((state) => {
      if (state >= bannieres.length - 1) {
        return 0;
      }
      return state + 1;
    });
    handleAfterClick();
  };

  const handleClickPrev = () => {
    setIndexActive((state) => {
      if (state === 0) {
        return bannieres.length - 1;
      }
      return state - 1;
    });
    handleAfterClick();
  };

  const handleAfterClick = () => {
    toggleIsRunning(false);
    if (TIME_OUT) {
      clearTimeout(TIME_OUT);
    }
    TIME_OUT = setTimeout(() => {
      toggleIsRunning(true);
    }, 1000);
  };
  // FIN ANIMATION BANNIERE

  const onModalClose = () => {
    setOpenModal(false);
    setOpenModalPlat(false)
    setChoixPizzaSelectionnee(initialiseCommandeDetail)
  }



  const onButtonAddClick = () => {
    addPizzaInCart(choixPizzaSelectionnee, commandeBoisson, commandeSupplement, setCommandeBoisson, setCommandeSupplement, setCommandeCondiment, commandeCondiment)
  }

  const renderItem = (index: number) => {
    const isActive = indexActive === index;
    const item = bannieres[index];
    if (!isActive) {
      return null;
    }
    return (
      <div
        className={`nc-SectionHero2Item nc-SectionHero2Item--animation rounded-3xl flex flex-col-reverse lg:flex-col relative overflow-hidden ${className}`}
        key={index}
      >


        {/* Affichage du compteur en bas */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex justify-center">
          {bannieres.map((_, index) => {
            const isActive = indexActive === index;
            return (
              <div
                key={index}
                onClick={() => {
                  setIndexActive(index);
                  handleAfterClick();
                }}
                className={`relative px-1 py-1.5 cursor-pointer`}
              >
                <div className={`relative w-20 h-1 shadow-sm rounded-md bg-white`}>
                  {isActive && (
                    <div className="nc-SectionHero2Item__dot absolute inset-0 bg-slate-900 rounded-md"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <Prev
          className="absolute left-1 bg-[#ffffffab] rounded-full sm:left-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-white"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickPrev={handleClickPrev}
        />
        <Next
          className="absolute right-1 bg-[#ffffffab] rounded-full sm:right-5 top-3/4 sm:top-1/2 sm:-translate-y-1/2 z-10 !text-white"
          btnClassName="w-12 h-12 hover:border-slate-400 dark:hover:border-slate-400"
          svgSize="w-6 h-6"
          onClickNext={handleClickNext}
        />

        {/* Image bannière*/}
        <div onClick={() => !item?.bannierePublicitaire
          ?
          item?.estUnePizza ?
            handleOpenModalChoixComplementPizza(item, setOpenModal, setChoixPizzaSelectionnee)
            : handleOpenModalChoixComplementPizza(item, setOpenModalPlat, setChoixPizzaSelectionnee)
          : null}
          className="">
          <NcImage
            containerClassName="object-contain  w-full h-full"
            src={`${BASE_URL_PROD}/bannerImage/${item?.libBanniereImage}`}
            alt={item?.nomPizza}
          />
        </div>
      </div>

    );
  };

  const recupBanniere = async () => {
    try {
      const res = await apiClient.get(`/recup_banniere`);
      if (!res?.status) throw res?.error
      const data = res?.data as IBanniereItem[]
      console.log("🚀 ~ recupBanniere ~ data:", data)
      setBannieres(data)
    } catch (error) {
      console.log("🚀 ~ recupClientPointFidelite ~ error:", error)
    }
  }

  useEffect(() => {
    recupBanniere()
  }, [])



  return <>
    {
      bannieres.length
        ?
        bannieres.map((_, index) => renderItem(index))
        :
        <div className="relative h-[430px] bg-slate-200 lg:h-[450px] xl:h-[530px]">
          <NcImage
            containerClassName="absolute w-full h-full "
            src={``}
          />
        </div>
    }
    {/* Modal pour renseigner le choix de la pizza */}
    <ModalSelectionChoixPizza
      buttonTitle="Ajouter au panier"
      setChoixPizzaSelectionnee={setChoixPizzaSelectionnee}
      handleChange={handleInputChange}
      show={openModal}
      onCloseModalQuickView={onModalClose}
      choixPizzaSelectionnee={choixPizzaSelectionnee}
      setCommandeSupplement={setCommandeSupplement}
      setCommandeCondiment={setCommandeCondiment}
      commandeCondiment={commandeCondiment}
      commandeSupplement={commandeSupplement}
      setCommandeBoisson={setCommandeBoisson}
      commandeBoisson={commandeBoisson}
      onButtonAddClick={onButtonAddClick}
    />

    <ModalSelectionChoixPlat
      buttonTitle='Ajouter au panier'
      setChoixPizzaSelectionnee={setChoixPizzaSelectionnee}
      handleChange={handleInputChange}
      show={openModalPlat}
      onCloseModalQuickView={onModalClose}
      choixPizzaSelectionnee={choixPizzaSelectionnee}
      setCommandeBoisson={setCommandeBoisson}
      commandeBoisson={commandeBoisson}
      onButtonAddClick={onButtonAddClick} />
  </>;
};

export default SectionBanner;

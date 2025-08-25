import _ from 'lodash'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { IBoisson, ICommandeDetail, ICondiment, ISupplement } from '../../store/interfaces'
import { initialiseCommandeDetail, setCategoriePizzaActive } from '../../store/menuSlice'
import { IReduxState } from '../../store/store'
import { BASE_URL_PROD } from '../../utils/constant'
import { addPizzaInCart, formatMontantFCFA, grouperListePizzasParCategorie, handleOpenModalChoixComplementPizza, normalizeString, recupAllDataAboutPizza, recupPrixPizza } from '../../utils/functions'
import { PizzaIconSvg, SearchIconSvg } from '../../utils/svg'
import Input from '../components/Input'
import PageLoader from './PageLoader'
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import DisplayNotification from '../components/DisplayNotification'
// Charger les composants dynamiquement
const CustomButton = React.lazy(() => import("../components/CustomButton"));
const CustomHelmet = React.lazy(() => import("../components/CustomHelmet"));
const Heading = React.lazy(() => import("../components/Heading"));
const ModalSelectionChoixPizza = React.lazy(() =>
  import("../components/ModalSelectionChoixPizza")
);
const Nav = React.lazy(() => import("../components/Nav/Nav"));
const NavItem2 = React.lazy(() => import("../components/NavItem2"));
const NcImage = React.lazy(() => import("../components/NcImage/NcImage"));


const Menu = () => {

  // Redux
  const dispatch = useDispatch()
  const { listePizzas, categoriePizzaActive } = useSelector((state: IReduxState) => state.menu);

  //Hooks
  // const [tabActive, setTabActive] = React.useState("Tous");
  const [choixPizzaSelectionnee, setChoixPizzaSelectionnee] = useState<ICommandeDetail>(initialiseCommandeDetail)
  const [openModal, setOpenModal] = useState(false)
  const [commandeBoisson, setCommandeBoisson] = useState<IBoisson[]>([])
  const [commandeSupplement, setCommandeSupplement] = useState<ISupplement[]>([])
  const [commandeCondiment, setCommandeCondiment] = useState<ICondiment[]>([])
  const [recherchePizza, setRecherchePizza] = useState("")
  const [loading, setLoading] = useState(false)


  const listePizzaFiltres = useMemo(() => {

    if (recherchePizza.length === 0) return listePizzas;

    const rechercheNormalisee = normalizeString(recherchePizza.toLowerCase());

    return listePizzas.filter(item =>
      normalizeString(item.nomPizza.toLowerCase()).includes(rechercheNormalisee) ||
      normalizeString(item.descriptionPizza.toLowerCase()).includes(rechercheNormalisee) ||
      normalizeString(item.libelleCategoriePizza.toLowerCase()).includes(rechercheNormalisee)
    );
  }, [recherchePizza, listePizzas]);


  // regrouper la liste des pizzas  par catégorie
  const formatListePizza = useMemo(() => {
    return grouperListePizzasParCategorie(listePizzaFiltres)
  }, [listePizzas, listePizzaFiltres])

  // const handleOpenModal = (item: any) => {
  //   setOpenModal(true);
  //   setChoixPizzaSelectionnee(prev => ({
  //     ...prev,
  //     ...item,
  //     pizzaFormatId: recupPizzaFormatByPizzaId(item.pizzaId)?.pizzaFormatId,
  //     prixPizzaFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.prixPizzaFormat,
  //     nomFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.nomFormat,
  //     nomPate: recupPateByPateId(prev.pateId)?.nomPate,
  //     nomViande: prev.viandeId ? recupViandeByViandeId(prev.viandeId)?.nomViande : "",
  //   }));
  // }

  // Mettre à jour l'état lors de la modification du choix des pizzas
  const handleInputChange = (e: any) => {
    // const { name, value } = e.target
    setChoixPizzaSelectionnee(prev => ({ ...prev, ...e }))
  }

  const onModalClose = () => {
    setOpenModal(false);
    setChoixPizzaSelectionnee(initialiseCommandeDetail)
  }

  // const ajouterPizzaDansLePanier = () => {
  //   dispatch(setCart({
  //     commandeDetails: [
  //       { ...choixPizzaSelectionnee, prixFormatActuel: recupPrixPizzaFormat(choixPizzaSelectionnee.pizzaFormatId), commandeBoissons: commandeBoisson, commandeSupplements: commandeSupplement }, ...cart.commandeDetails,
  //     ],
  //   }))
  //   setCommandeSupplement([])
  //   setCommandeBoisson([])
  // }

  const onButtonAddClick = () => {
    addPizzaInCart(choixPizzaSelectionnee, commandeBoisson, commandeSupplement, setCommandeBoisson, setCommandeSupplement, setCommandeCondiment, commandeCondiment)
  }

  // FIltrer les pizza par categorie
  const listePizzaFiltre = useMemo(() => {
    if (categoriePizzaActive === 0) {
      return formatListePizza
    } else {
      const data = formatListePizza.filter(item => item.categoriePizzaId === categoriePizzaActive)
      return data
    }
  }, [formatListePizza, categoriePizzaActive])

  // On fetch au cas ou il n'y a pas de donnèes dans redux, on se base sur listePizzas
  useEffect(() => {
    !listePizzas?.length && recupAllDataAboutPizza(setLoading)
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <div
        className={`nc-Menu`}
        data-nc-id="Menu"
      >
        <CustomHelmet title='Menu | Piazzola la vraie pizza authentique' />

        <div className=" w-full py-5 bg-red-600 mt-4">
          <Heading
            className="mb-2 text-neutral-900 dark:text-neutral-50"
            fontClass="text-2xl text-white md:text-4xl 2xl:text-4xl font-semibold"
            isCenter
            desc=""
            style={{ fontFamily: "Pacifico" }}
          >
            Nous avons une variété de {listePizzas.length} pizzas
          </Heading>
        </div>


        <div className="container py-16 lg:pb-28 lg:pt-8 space-y-16 sm:space-y-20 lg:space-y-28">
          {
            loading
              ?
              <div className='flex items-center justify-center'>Chargement des données en cours...</div>
              :
              <div className="space-y-10 lg:space-y-14">

                <div className='flex flex-col md:flex-row justify-between'>
                  <div>
                    <div className="relative w-full sm:w-72 lg:w-96 mb-6">
                      <label
                        htmlFor="search-input"
                        className="text-neutral-500 dark:text-neutral-300"
                      >
                        {/* <span className="sr-only">Search all icons</span> */}
                        <Input
                          className="shadow-lg border-0 dark:border"
                          id="search-input"
                          type="search"
                          value={recherchePizza}
                          placeholder="Rechercher une pizza ici..."
                          sizeClass="pl-14 py-4 pr-5 md:pl-16"
                          rounded="rounded-full"
                          onChange={(e: any) => setRecherchePizza(e.target.value)}
                        />

                        <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                          <SearchIconSvg />
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <Nav
                      className="p-1 bg-white dark:bg-neutral-800 rounded-full shadow-lg overflow-x-auto hiddenScrollbar"
                      containerClassName="w-full sm:w-96 w-full text-sm md:text-base"
                    >
                      {[{ libelleCategoriePizza: "Tous", categoriePizzaId: 0 }, ...formatListePizza].map((item, index) => (
                        <NavItem2
                          key={index}
                          isActive={categoriePizzaActive === item.categoriePizzaId}
                          onClick={() => dispatch(setCategoriePizzaActive(item.categoriePizzaId))}
                        >
                          <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-xs sm:text-sm ">
                            <span>{item.libelleCategoriePizza}</span>
                          </div>
                        </NavItem2>
                      ))}
                    </Nav>
                  </div>
                </div>

                {
                  listePizzaFiltre.map((item, index) => (
                    <div key={index}>
                      <div className="max-w-screen-sm">
                        <h2 style={{ fontFamily: "Pacifico" }} className="block text-3xl lg:text-4xl mb-16">
                          {item.libelleCategoriePizza}
                        </h2>
                      </div>

                      <div className="grid grid-cols-12 gap-4 xl:gap-12">
                        {
                          // Afficher les pizzas par ordre alphabetique
                          _.sortBy(item.pizzas, 'nomPizza').map((elt, i) => (
                            <div key={i} className="col-span-6 mb-8">
                              <div
                                className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0 flex-col xl:flex-row"
                              >
                                <Tippy content={elt?.descriptionPizza} placement="top" className='block md:hidden'>
                                  <div
                                    // onClick={() => handleOpenModalChoixComplementPizza(elt, setOpenModal, setChoixPizzaSelectionnee)}
                                    className="relative  w-full h-36 sm:h-56 xl:w-80  flex-shrink-0 overflow-hidden rounded-xl">
                                    <NcImage
                                      src={`${BASE_URL_PROD}/pizza_image/${elt?.libImagePizza}`}
                                      alt={elt?.libImagePizza}
                                      containerClassName=" object-contain w-full h-full"
                                    />

                                  </div>
                                </Tippy>

                                <div className="ml-3 sm:ml-6 ">
                                  <div>
                                    <div className="flex justify-between ">
                                      <div className="flex-[1.5] ">
                                        <h3 style={{ fontFamily: "Pacifico" }} className="text-2xl sm:text-3xl   mt-3">
                                          <Link to="/product-detail">{elt.nomPizza}</Link>
                                        </h3>
                                        <div className='mt-1 text-slate-600 text-lg'>{formatMontantFCFA(recupPrixPizza(elt.pizzaId) || 0)}</div>
                                        <div className="hidden sm:flex mt-1.5 sm:mt-2.5  h-12 text-sm text-slate-600 ">
                                          <div className="flex items-center space-x-1.5  overflow-hidden">
                                            {elt.descriptionPizza}
                                          </div>
                                        </div>
                                        {/* <div className="text-slate-500 font-bold text-xl mt-2">{formatMontantFCFA(recupPrixPizza(1) || 0)}</div> */}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Afficher un modal pour les choix de la pizza lorqu'on clique sur commandez*/}
                                  <div className="mt-4 md:mt-10 mx-1">
                                    <CustomButton onClick={() => elt?.peutEtrelivre
                                      ? handleOpenModalChoixComplementPizza(elt, setOpenModal, setChoixPizzaSelectionnee)
                                      : DisplayNotification
                                      } title='Commandez' width='w-full' iconSvg={<PizzaIconSvg color='white' />} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
          }
        </div>
        <ModalSelectionChoixPizza
          buttonTitle='Ajouter au panier'
          setChoixPizzaSelectionnee={setChoixPizzaSelectionnee}
          handleChange={handleInputChange}
          show={openModal}
          onCloseModalQuickView={onModalClose}
          choixPizzaSelectionnee={choixPizzaSelectionnee}
          setCommandeSupplement={setCommandeSupplement}
          commandeSupplement={commandeSupplement}
          setCommandeBoisson={setCommandeBoisson}
          commandeBoisson={commandeBoisson}
          setCommandeCondiment={setCommandeCondiment}
          commandeCondiment={commandeCondiment}
          onButtonAddClick={onButtonAddClick} />
      </div>
    </Suspense>
  )
}

export default Menu
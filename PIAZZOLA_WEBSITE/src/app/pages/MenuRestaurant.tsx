import Tippy from "@tippyjs/react"
import _ from 'lodash'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { IBoisson, ICommandeDetail, ICondiment, ISupplement } from '../../store/interfaces'
import { initialiseCommandeDetail } from '../../store/menuSlice'
import { IReduxState } from '../../store/store'
import { BASE_URL_PROD } from '../../utils/constant'
import { addPizzaInCart, convertDateToLocaleStringDate, filterByDate, formatMontantFCFA, getTodayDate, handleOpenModalChoixComplementPizza, isToday, normalizeString, recupAllDataAboutPizza, recupPrixPizza } from '../../utils/functions'
import { PizzaIconSvg, SearchIconSvg } from '../../utils/svg'
import DisplayNotification from '../components/DisplayNotification'
import Input from '../components/Input'
import ModalSelectionChoixPlat from '../components/ModalSelectionChoixPlat'
import PageLoader from './PageLoader'
// Charger les composants dynamiquement
const CustomButton = React.lazy(() => import("../components/CustomButton"));
const CustomHelmet = React.lazy(() => import("../components/CustomHelmet"));
const Heading = React.lazy(() => import("../components/Heading"));

// const Nav = React.lazy(() => import("../components/Nav/Nav"));
// const NavItem2 = React.lazy(() => import("../components/NavItem2"));
const NcImage = React.lazy(() => import("../components/NcImage/NcImage"));


const MenuRestaurant = () => {

  // Redux
  // const dispatch = useDispatch()
  const { listePizzas, listePlatsDuJour } = useSelector((state: IReduxState) => state.menu);
  console.log("🚀 ~ MenuRestaurant ~ listePizzas:", listePizzas)

  //Hooks
  // const [tabActive, setTabActive] = React.useState("Tous");
  const [choixPizzaSelectionnee, setChoixPizzaSelectionnee] = useState<ICommandeDetail>(initialiseCommandeDetail)
  console.log("🚀 ~ MenuPlat ~ choixPizzaSelectionnee:", choixPizzaSelectionnee)
  const [openModal, setOpenModal] = useState(false)
  const [commandeBoisson, setCommandeBoisson] = useState<IBoisson[]>([])
  const [commandeSupplement, setCommandeSupplement] = useState<ISupplement[]>([])
  const [commandeCondiment, setCommandeCondiment] = useState<ICondiment[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDate());
  console.log("🚀 ~ MenuRestaurant ~ selectedDate:", selectedDate)
  const [recherchePizza, setRecherchePizza] = useState("")
  const [loading, setLoading] = useState(false)

  // const listePizzaUniquement = useMemo(() => {
  //   return listePizzas.filter(item =>
  //     item?.estUnePizza === 0
  //   );
  // }, [listePizzas]);

  // Plat du jour
  // const listePlatsDuJour = useMemo(() => { return listePizzas?.filter(item => item.categoriePizzaId === 6 && item.estUnePizza === 0) }, [listePizzas])
  const listePlatsDuJourByDate = useMemo(() => { return filterByDate(listePlatsDuJour, selectedDate) }, [listePlatsDuJour, selectedDate])

  // Notre carte
  const listeNotreCarte = useMemo(() => { return listePizzas?.filter(item => item.categoriePizzaId === 7 && item.estUnePizza === 0) }, [listePizzas])

  const listePizzaFiltres = useMemo(() => {

    if (recherchePizza.length === 0) return listeNotreCarte;

    const rechercheNormalisee = normalizeString(recherchePizza.toLowerCase());

    return listeNotreCarte.filter(item =>
      normalizeString(item.nomPizza.toLowerCase()).includes(rechercheNormalisee) ||
      normalizeString(item.descriptionPizza.toLowerCase()).includes(rechercheNormalisee) ||
      normalizeString((item?.libelleCategoriePizza || "")?.toLowerCase())?.includes(rechercheNormalisee)
    );
  }, [recherchePizza, listeNotreCarte]);


  // regrouper la liste des pizzas  par catégorie
  // const formatListePizza = useMemo(() => {
  //   return grouperListePizzasParCategorie(listePizzaFiltres)
  // }, [listePizzas, listePizzaFiltres])


  // Mettre à jour l'état lors de la modification du choix des pizzas
  const handleInputChange = (e: any) => {
    // const { name, value } = e.target
    setChoixPizzaSelectionnee(prev => ({ ...prev, ...e }))
  }

  const onModalClose = () => {
    setOpenModal(false);
    setChoixPizzaSelectionnee(initialiseCommandeDetail)
  }



  const onButtonAddClick = () => {
    addPizzaInCart(choixPizzaSelectionnee, commandeBoisson, commandeSupplement, setCommandeBoisson, setCommandeSupplement, setCommandeCondiment, commandeCondiment)
  }

  // On fetch au cas ou il n'y a pas de donnèes dans redux, on se base sur listePizzas
  useEffect(() => {
    !listePizzas?.length && recupAllDataAboutPizza(setLoading)
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <div
        className={`nc-Menu-Pizza`}
        data-nc-id="Menu-Pizza"
      >
        <CustomHelmet title='Menu - Pizzas | Piazzola la vraie pizza authentique' />

        <div className=" w-full py-5 bg-red-600 mt-4">
          <Heading
            className="mb-2 text-neutral-900 dark:text-neutral-50"
            fontClass="text-2xl text-white md:text-4xl 2xl:text-4xl font-semibold"
            isCenter
            desc=""
            style={{ fontFamily: "Pacifico" }}
          >
            Restaurant
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
                          placeholder="Rechercher un plat ici..."
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
                  {/* <div>
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
                  </div> */}
                </div>

                {/* DEBUT PLATS DU JOUR */}
                <div >
                  <div className={"flex justify-between"}>

                    <h2 style={{ fontFamily: "Pacifico" }} className={`block text-3xl lg:text-4xl mb-16`}>
                      Plats du jour
                    </h2>

                    <div className="mt-1.5 flex">
                      <Input
                        className=""
                        type="date"
                        value={selectedDate}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(event.target.value)}
                        defaultValue={convertDateToLocaleStringDate(new Date())}
                      />
                    </div>

                  </div>

                  <div className={`grid grid-cols-12 gap-4 xl:gap-12 p-4`}>
                    {listePlatsDuJourByDate.length === 0 && <div className='col-span-12 text-center text-slate-500'>Aucun plat n'a été encore defini</div>}
                    {
                      // Afficher les pizzas par ordre alphabetique
                      _.sortBy(listePlatsDuJourByDate, 'nomPizza').map((elt, i) => (
                        <div key={i} className="col-span-6 md:col-span-4 mb-8">
                          <div
                            className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0 flex-col xl:flex-row"
                          >
                            <Tippy content={elt?.descriptionPizza} placement="top" >
                              <div
                                // onClick={() => handleOpenModalChoixComplementPizza(elt, setOpenModal, setChoixPizzaSelectionnee)}
                                className="  ">
                                <NcImage
                                  src={`${BASE_URL_PROD}/pizza_image/${elt?.libImagePizza}`}
                                  alt={elt?.libImagePizza}
                                  containerClassName="w-full h-auto xl:w-40 object-contain  rounded-xl"
                                />

                              </div>
                            </Tippy>

                            <div className="ml-3 sm:ml-6 ">
                              <div>
                                <div className="flex justify-between ">
                                  <div className="flex-[1.5] ">
                                    <h3 style={{ fontFamily: "Pacifico" }} className="text-2xl sm:text-2xl mt-3 ">
                                      <Link to="/product-detail">{elt.nomPizza}</Link>
                                    </h3>
                                    <div className='mt-1 text-slate-600 text-sm'>{formatMontantFCFA(recupPrixPizza(elt.pizzaId) || 0)}</div>
                                    {/* <div className="hidden sm:flex mt-1.5 sm:mt-2.5  h-12 text-sm text-slate-600 ">
                                          <div className="flex items-center space-x-1.5  overflow-hidden">
                                            {elt.descriptionPizza}
                                          </div>
                                        </div> */}
                                    {/* <div className="text-slate-500 font-bold text-xl mt-2">{formatMontantFCFA(recupPrixPizza(1) || 0)}</div> */}
                                  </div>
                                </div>
                              </div>
                              {/* Afficher un modal pour les choix de la pizza lorqu'on clique sur commandez*/}
                              {
                                isToday(new Date(selectedDate)) &&
                                <div className="mt-4 md:mt-6 mx-1">
                                  <CustomButton onClick={() => elt?.peutEtrelivre
                                    ? handleOpenModalChoixComplementPizza(elt, setOpenModal, setChoixPizzaSelectionnee)
                                    : DisplayNotification({ libelle: "Ce plat ne peut être consommé que sur place, il ne peut donc pas être livré !", type: "info", time: 5000 })
                                  } title='Commandez' width='w-full' iconSvg={<PizzaIconSvg color='white' />} />
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
                {/* FIN PLATS DU JOUR */}

                {/* DEBUT NOTRE CARTE */}
                <div className='' >

                  <h2 style={{ fontFamily: "Pacifico" }} className={`block text-3xl lg:text-4xl mb-16 text-center`}>
                    Notre carte
                  </h2>

                </div>


                <div className={`grid grid-cols-12 gap-4 xl:gap-12 p-4 shadow-2xl`}>
                  {
                    // Afficher les pizzas par ordre alphabetique
                    _.sortBy(listePizzaFiltres, 'nomPizza').map((elt, i) => (
                      <div key={i} className="col-span-6 md:col-span-4 mb-8">
                        <div
                          className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0 flex-col xl:flex-row"
                        >
                          <Tippy content={elt?.descriptionPizza} placement="top" >
                            <div
                              // onClick={() => handleOpenModalChoixComplementPizza(elt, setOpenModal, setChoixPizzaSelectionnee)}
                              className="  ">
                              <NcImage
                                src={`${BASE_URL_PROD}/pizza_image/${elt?.libImagePizza}`}
                                alt={elt?.libImagePizza}
                                containerClassName="w-full h-auto xl:w-36 object-contain  rounded-xl"
                              />

                            </div>
                          </Tippy>

                          <div className="ml-3 sm:ml-6 ">
                            <div>
                              <div className="flex justify-between ">
                                <div className="flex-[1.5] ">
                                  <h3 style={{ fontFamily: "Pacifico" }} className="text-2xl sm:text-2xl   mt-3">
                                    <Link to="/product-detail">{elt.nomPizza}</Link>
                                  </h3>
                                  <div className='mt-1 text-slate-600 text-sm'>{formatMontantFCFA(recupPrixPizza(elt.pizzaId) || 0)}</div>
                                  {/* <div className="hidden sm:flex mt-1.5 sm:mt-2.5  h-12 text-sm text-slate-600 ">
                                          <div className="flex items-center space-x-1.5  overflow-hidden">
                                            {elt.descriptionPizza}
                                          </div>
                                        </div> */}
                                  {/* <div className="text-slate-500 font-bold text-xl mt-2">{formatMontantFCFA(recupPrixPizza(1) || 0)}</div> */}
                                </div>
                              </div>
                            </div>
                            {/* Afficher un modal pour les choix de la pizza lorqu'on clique sur commandez*/}
                            <div className="mt-4 md:mt-6 mx-1">
                              <CustomButton onClick={() => elt?.peutEtrelivre
                                ? handleOpenModalChoixComplementPizza(elt, setOpenModal, setChoixPizzaSelectionnee)
                                : DisplayNotification({ libelle: "Ce plat ne peut être consommé que sur place, il ne peut donc pas être livré !", type: "info", time: 5000 })
                              } title='Commandez' width='w-full' iconSvg={<PizzaIconSvg color='white' />} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
          }
          {/* FIN PLATS DU JOUR */}

        </div>

      </div>
      <ModalSelectionChoixPlat
        buttonTitle='Ajouter au panier'
        setChoixPizzaSelectionnee={setChoixPizzaSelectionnee}
        handleChange={handleInputChange}
        show={openModal}
        onCloseModalQuickView={onModalClose}
        choixPizzaSelectionnee={choixPizzaSelectionnee}
        setCommandeBoisson={setCommandeBoisson}
        commandeBoisson={commandeBoisson}
        onButtonAddClick={onButtonAddClick} />

    </Suspense >
  )
}

export default MenuRestaurant
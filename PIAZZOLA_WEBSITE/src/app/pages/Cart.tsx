import PencilIcon from '@heroicons/react/24/outline/PencilIcon'
import PlusIcon from '@heroicons/react/24/outline/PlusIcon'
import TrashIcon from '@heroicons/react/24/outline/TrashIcon'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { IClientPointFidelite, initialisePointFidelite, setAEmporter, setClientPointFidelite, setPizzaGratosAlreadyUsed, setUserConnectedInfo } from '../../store/appSlice'
import { setCart } from '../../store/cartSlice'
import { IBoisson, ICommandeDetail, ICommandeSupplement, ICondiment, IPointLivraison } from '../../store/interfaces'
import { initialiseCommandeDetail, initialiseCommandePayload } from '../../store/menuSlice'
import { initialisePointAdresseSelectionne, setPointLivraison } from '../../store/pointLivraisonSlice'
import { IReduxState } from '../../store/store'
import { apiClient } from '../../utils/apiClient'
import { BASE_URL_PROD, choixViandeitem } from '../../utils/constant'
import { calculerLePrixTotalDuneCommande, calculerSiMontantCommandeSupA4500, formatMontantFCFA, formatTime, getCommandStatus, isDateWithinLastYearFromToday, recupPrixPizzaFormat } from '../../utils/functions'
import { InfoBulle } from '../../utils/svg'
import DisplayNotification from '../components/DisplayNotification'
import Input from '../components/Input'
import Label from '../components/Label'
import PageLoader from './PageLoader'
import CommandStatus from '../components/CommandStatus'

// Importation dynamique
const DeliveryZones = React.lazy(() => import('../components/DeliveryZones'));
const Checkbox = React.lazy(() => import('../components/Checkbox'));
const CustomButton = React.lazy(() => import('../components/CustomButton'));
const CustomHelmet = React.lazy(() => import('../components/CustomHelmet'));
const CustomModal = React.lazy(() => import('../components/CustomModal'));
const ModalSelectionChoixPizza = React.lazy(() => import('../components/ModalSelectionChoixPizza'));
const NcImage = React.lazy(() => import('../components/NcImage/NcImage'));
const NcInputNumber = React.lazy(() => import('../components/NcInputNumber'));
const PickupTimeSelect = React.lazy(() => import('../components/PickupTimeSelect'));


const Cart = () => {
    // Redux    
    const dispatch = useDispatch()
    const pointLivraison = useSelector((state: IReduxState) => state.pointLivraison.pointLivraison);
    const { userConnectedInfo, aEmporter, userLogged, clientPointFidelite, pizzaGratosAlreadyUsed } = useSelector((state: IReduxState) => state.application);
    console.log("🚀 ~ Cart ~ clientPointFidelite:", clientPointFidelite)
    const cart = useSelector((state: IReduxState) => state.cart.cart);
    console.log("🚀 ~ Cart ~ cart>>>>>>>>>>>>>>>>>:", cart)
    console.log("🚀 ~ Cart ~ cart:>>>>>>>>>>>>>>><<", cart.commande, new Date(`${new Date().toISOString().slice(0, 11)}${cart.commande.dateEmport}`))

    // Hooks
    const [errorMessage, setErrorMessage] = useState("")
    const currentDate = new Date();
    const { isOpen, timeRemaining } = getCommandStatus(currentDate);
    const [showModalConfirmCommande, setShowModalConfirmCommande] = useState(false)
    const [showModalDeleteCommande, setShowModalDeleteCommande] = useState(false)
    const [showModalModifierCommande, setShowModalModifierCommande] = useState(false)
    const [choixPizzaSelectionnee, setChoixPizzaSelectionnee] = useState<ICommandeDetail>(initialiseCommandeDetail)
    const [indexCommande, setIndexCommande] = useState(0)
    const [commandeBoisson, setCommandeBoisson] = useState<IBoisson[]>([])
    const [commandeSupplement, setCommandeSupplement] = useState<ICommandeSupplement[]>([])
    const [commandeCondiment, setCommandeCondiment] = useState<ICondiment[]>([])

    const [loadingCreateCommande, setLoadingCreateCommande] = useState(false)
    // const [infoAdresseSup, setInfoAdresseSup] = useState("")
    // const [pointAdresseSelectionne, setPointAdresseSelectionne] = useState<IPointLivraison>(initialisePointAdresseSelectionne)
    const [openPopup, setOpenPopup] = useState(false)
    const navigate = useNavigate();
    // On récupère que les commandes payantes
    const montantTotalCommande = useMemo(() => { return calculerLePrixTotalDuneCommande(cart.commandeDetails.filter(item => !item.pizzaGratos)) }, [cart.commandeDetails, cart?.commande?.idPointLivraison])



    // Pour modifier l'état lors de la séléction des choix de la pizza
    const handleInputChange = (e: any) => {
        // const { name, value } = e.target
        setChoixPizzaSelectionnee(prev => ({ ...prev, ...e }))
    }

    const pointLivraisonClient = useMemo(() => {
        if (!userConnectedInfo?.idPointLivraison) {
            return initialisePointAdresseSelectionne
        }
        const point = pointLivraison.find(item => item?.idPointLivraison === userConnectedInfo?.idPointLivraison)
        dispatch(setCart({ ...cart, commande: { ...cart.commande, ...point } }))
        dispatch(setUserConnectedInfo({ ...userConnectedInfo, idPointLivraison: point?.idPointLivraison }))
        return point
    }, [pointLivraison, userConnectedInfo?.idPointLivraison])


    // Composant qui affiche les pizza dans le panier
    const renderPizzaCommandeInTheCart = (item: ICommandeDetail, index: number) => {

        const { nomPizza, pizzaGratos } = item;

        return (
            <div
                key={index}
                className="relative flex py-8 sm:py-10 xl:py-12 first:pt-0 last:pb-0"
            >
                <div className="relative h-24 w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    <NcImage
                        src={`${BASE_URL_PROD}/pizza_image/${item?.libImagePizza}`}
                        alt={nomPizza}
                        containerClassName="h-full w-full object-contain object-center"
                    />
                </div>

                <div className="ml-3 sm:ml-6 flex flex-1 flex-col">
                    <div>
                        <div className="flex justify-between ">
                            <div className="flex-[1.5] ">
                                <div className='flex flex-col  sm:flex-row justify-between'>
                                    <div className='flex flex-col'>
                                        <div className="flex items-center">
                                            <h3 className="text-base font-medium line-clamp-1 mr-2">{nomPizza}</h3>
                                            <span className="text-sm text-slate-500">( {pizzaGratos ? <span className='text-green-500'>gratuit</span> : formatMontantFCFA(Number(item?.prixPizzaFormat))} )</span>
                                        </div>
                                        {item?.estUnePizza
                                            ?
                                            <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                                {item?.nomFormat}{" - "}{item?.nomPate}
                                            </span>
                                            : null
                                        }
                                    </div>
                                    {/* Quantité pizza */}
                                    <div className="flex justify-center items-center relative my-3 sm:mt-0">
                                        <NcInputNumber disabled={pizzaGratos ? true : false} defaultValue={Number(item.quantiteCommande)} max={10}
                                            onChange={(e: number) => pizzaGratos ? null : dispatch(setCart({ commandeDetails: [...cart.commandeDetails.slice(0, index), { ...item, quantiteCommande: e }, ...cart.commandeDetails.slice(index + 1)] }))}
                                            className="relative z-10"
                                        />
                                        <span className='px-4'>x</span>
                                        {/* montant de la pizza multiplié par la quantité */}
                                        {pizzaGratos ? <span className='text-green-500'>gratuit</span> : formatMontantFCFA(Number(item.prixPizzaFormat) * item.quantiteCommande)}
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row flex-1  justify-between'>
                                    <div>
                                        {/* Boissons */}
                                        {item?.commandeBoissons?.length > 0 ? (
                                            !item?.pizzaGratos &&
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-4">
                                                    <span className="mt-1 mr-2">Boissons:</span>
                                                    {item?.commandeBoissons?.map((elt, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                        >
                                                            {elt.nomBoisson} : {elt.prixBoisson}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        {/* Supplements */}
                                        {item?.commandeSupplements?.length > 0 ? (
                                            !item?.pizzaGratos &&
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-3">
                                                    <span className="mt-1 mr-2">Supplements:</span>
                                                    {item.commandeSupplements.map((elt, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                        >
                                                            {elt.nomSupplement} : {elt.prixSupplement}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        {/* Accompagnement */}
                                        {(item?.nomAccompagnement && item?.avecAccompagnement) ? (
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-3">
                                                    <span className="mt-1 mr-2">Accompagnement:</span>
                                                    <div
                                                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                    >
                                                        {/* {recupPizzaInfo(Number(item.viandeId), viande, "viandeId", "nomViande")} */}
                                                        {item.nomAccompagnement}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        {/* Viande */}
                                        {(item?.nomViande && item?.choixViande) ? (
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-3">
                                                    <span className="mt-1 mr-2">{choixViandeitem[item?.choixViande]}:</span>
                                                    <div
                                                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                    >
                                                        {/* {recupPizzaInfo(Number(item.viandeId), viande, "viandeId", "nomViande")} */}
                                                        {item.nomViande}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}
                                        {/* Condiments */}
                                        {/* {item.nomCondiment ? (
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-4">
                                                    <span className="mt-1 mr-2">Condiment:</span>
                                                    <div
                                                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                    >
                                                        {item.nomCondiment}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null} */}
                                        {item?.commandeCondiments?.length > 0 ? (
                                            !item?.pizzaGratos &&
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-3">
                                                    <span className="mt-1 mr-2">Condiments:</span>
                                                    {item?.commandeCondiments?.map((elt, index) => (
                                                        <div
                                                            key={index}
                                                            className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                        >
                                                            {elt.nomCondiment}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : null}
                                        {/* Demande spéciale */}
                                        {item.demandeSpeciale ? (
                                            <div className="flex items-center">
                                                <div className="flex flex-wrap text-sm mt-4">
                                                    <span className="mt-1 mr-2">Demande Spé.:</span>
                                                    <div
                                                        className={`flex max-w-40 overflow-hidden truncate  py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                                    >
                                                        {item.demandeSpeciale}
                                                    </div>
                                                </div>
                                            </div>

                                        ) : null}
                                    </div>

                                    <div className="flex items-end justify-end text-md  mt-4 sm:mt-0 text-sm">

                                        <div
                                            className="relative z-10 flex items-center mt-3 font-medium text-primary-6000 hover:text-primary-500 text-sm "
                                        >
                                            {/* MODIFICATION DES CHOIX D'UNE PIZZA */}
                                            <div className="mt-1.5 sm:mt-2.5 flex text-sm text-slate-600 dark:text-slate-300">
                                                <div onClick={() => {
                                                    setChoixPizzaSelectionnee(item);
                                                    setCommandeBoisson(item?.commandeBoissons);
                                                    setCommandeSupplement(item?.commandeSupplements)
                                                    setCommandeCondiment(item?.commandeCondiments)
                                                    setShowModalModifierCommande(true)
                                                    setIndexCommande(index)
                                                }}
                                                    className="flex items-center space-x-1.5 cursor-pointer">
                                                    <span>{`Modifier`}</span>
                                                </div>
                                                <span className="mx-4 border-l border-slate-200 dark:border-slate-700 "></span>
                                                {/* SUPPRESSION D'UNE PIZZA */}
                                                <div
                                                    onClick={() => {
                                                        setChoixPizzaSelectionnee(item);
                                                        setShowModalDeleteCommande(true);
                                                        dispatch(setPizzaGratosAlreadyUsed(false))
                                                    }}
                                                    className="flex items-center space-x-1.5 cursor-pointer">
                                                    <TrashIcon className="w-5 h-5 text-red-600" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    /**
     * Ajouter une commande et ses détails dans la base de données
     */
    const ajouterCommande = async () => {
        try {
            setLoadingCreateCommande(true)
            const payload = {
                commande: {
                    clientId: userConnectedInfo?.clientId,
                    valideParVendeur: 0,
                    vendeurId: null,
                    siteId: null,
                    // Commande elligible seulement si client est abonné au programme et si la commande depasse 4500 ou egale
                    commandeEligibleAuProgrammeFidelite: calculerSiMontantCommandeSupA4500(cart?.commandeDetails) && clientPointFidelite && clientPointFidelite?.clientId !== 0,
                    // Si le client n'est pas encore abonné, 0 point, si il est inscrit et que la dernière date qu'il a passé une commande ne depasse pas un an donné ses point sinon 2
                    pointFidelite: clientPointFidelite ? isDateWithinLastYearFromToday(clientPointFidelite?.dateInscriptionFidelite) ? clientPointFidelite?.point : 0 : 0,
                    idPointLivraison: aEmporter ? null : Number(cart?.commande?.idPointLivraison),
                    aEmporte: aEmporter ? 1 : 0,
                    rueDeLaLivraison: userConnectedInfo?.rueDeLaLivraison ? userConnectedInfo?.rueDeLaLivraison?.slice(0, 99) : null,
                    dateEmport: aEmporter ? `${new Date().toISOString().slice(0, 11)}${cart.commande.dateEmport}` : null,
                    prixLivraisonActuel: aEmporter ? 0 : Number(cart?.commande?.prixPointLivraison)
                    // prixLivraisonActuel: aEmporter ? null : recupPrixLivraison(Number(cart?.commande?.idPointLivraison))
                },
                commandeDetails: cart.commandeDetails

            }
            console.log("🚀 ~ ajouterCommande ~ payload:", payload)
            const res = await apiClient.post("/ajouter_commande", payload)
            if (!res.status) throw res.error
            const data = res?.data as { commandeData: any[], clientFidelite: IClientPointFidelite | null }
            dispatch(setCart(initialiseCommandePayload));
            if (data.clientFidelite) dispatch(setClientPointFidelite(data.clientFidelite ? data.clientFidelite : initialisePointFidelite))
            setShowModalConfirmCommande(false)
            DisplayNotification({ libelle: "C'est confirmé, votre commande est bien prise en compte !", type: "success", time: 8000 })
            dispatch(setPizzaGratosAlreadyUsed(false))
            const isCinqiemeCommandeFidelite = calculerSiMontantCommandeSupA4500(cart?.commandeDetails) && clientPointFidelite && clientPointFidelite?.clientId !== 0 && clientPointFidelite?.point === 50
            setOpenPopup(isCinqiemeCommandeFidelite)
            !isCinqiemeCommandeFidelite && setTimeout(() => {
                navigate("/")
            }, 1500);
        } catch (error) {
            console.log("🚀 ~ ajouterCommande ~ error:", error)
            DisplayNotification({ libelle: "Erreur lors de l'ajout de la commande !", type: "error" })
        }
        finally {
            setLoadingCreateCommande(false)
        }
    }

    const recupPointLivraison = async () => {
        try {
            const res = await apiClient.get("/recup_point_livraison")
            if (!res.status) throw res.error
            const data = res.data as IPointLivraison[]
            dispatch(setPointLivraison(data))
        } catch (error) {
            console.log("🚀 ~ recupPointLivraison ~ error:", error)
        }
    }

    useEffect(() => {
        recupPointLivraison();
    }, [])

    const onButtonAddClick = () => {
        let pizzaGratos = false
        console.log("🚀 ~ onButtonAddClick ~ pizzaGratosAlreadyUsed:",
            pizzaGratosAlreadyUsed,
            choixPizzaSelectionnee?.nomFormat,
            isDateWithinLastYearFromToday(clientPointFidelite?.dateInscriptionFidelite),
            clientPointFidelite?.point >= 60
        )

        if (clientPointFidelite && clientPointFidelite?.clientId) {
            if (
                !pizzaGratosAlreadyUsed &&
                choixPizzaSelectionnee?.nomFormat === "Regular" &&
                isDateWithinLastYearFromToday(clientPointFidelite?.dateInscriptionFidelite) &&
                clientPointFidelite?.point >= 60
            ) {
                pizzaGratos = true
                dispatch(setPizzaGratosAlreadyUsed(true))
            }
        }
        dispatch(setCart({
            commandeDetails: [...cart.commandeDetails.slice(0, indexCommande),
            {
                ...choixPizzaSelectionnee,
                prixPizzaFormat: pizzaGratos ? 0 : recupPrixPizzaFormat(Number(choixPizzaSelectionnee.pizzaFormatId)),
                prixFormatActuel: pizzaGratos ? 0 : recupPrixPizzaFormat(Number(choixPizzaSelectionnee.pizzaFormatId)),
                commandeBoissons: pizzaGratos ? [] : commandeBoisson,
                commandeSupplements: pizzaGratos ? [] : commandeSupplement,
                commandeCondiments: commandeCondiment,
                pizzaGratos
            },
            ...cart.commandeDetails.slice(indexCommande + 1)]
        }))
    }

    return (
        <Suspense fallback={<PageLoader />} >
            <div className="nc-CartPage ">
                <CustomHelmet title='Panier || Piazzola' />

                <main className="container py-16 lg:pb-28 lg:pt-20 ">
                    <div className="mb-12 sm:mb-16">
                        <h2 className="block text-2xl sm:text-3xl lg:text-4xl font-semibold ">
                            Panier ({cart?.commandeDetails?.length})
                        </h2>
                    </div>
                    {
                        cart?.commandeDetails?.length
                            ?
                            <div className="flex flex-col lg:flex-row ">
                                <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
                                    {cart?.commandeDetails?.map(renderPizzaCommandeInTheCart)}
                                </div>
                                <div className="border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
                                <div className="flex-1  rounded-xl">

                                    {
                                        <div className="sticky top-28">
                                            <h3 className="text-lg font-semibold ">Recapitulatif commande</h3>


                                            <div className="mt-7 text-sm text-slate-500 ">
                                                {/* Checkbox pour savoir si la personne souhaite livrée ou emporter son plat */}
                                                <Checkbox
                                                    name="aEmporter"
                                                    label={aEmporter ? "Decochez la case si vous souhaitez être livré(e)" : "Cochez la case si vous souhaitez emporter"}
                                                    className='mb-4'
                                                    sizeClassName='w-4 h-4'
                                                    labelClassName='text-sm text-red-500'
                                                    defaultChecked={aEmporter}
                                                    onChange={() => {
                                                        dispatch(setAEmporter(!aEmporter))
                                                        dispatch(setCart({ ...cart, commande: { ...cart.commande } }))
                                                        // setPointAdresseSelectionne(initialisePointAdresseSelectionne)
                                                        setErrorMessage("")
                                                    }
                                                    }
                                                />
                                                {
                                                    aEmporter
                                                        ?
                                                        <div className='mb-2'>
                                                            {/* SELECTION DE L'HEURE SI C'EST A EMPORTER*/}
                                                            <PickupTimeSelect
                                                                onChange={(e: any) => {
                                                                    dispatch(setCart({ ...cart, commande: { ...cart.commande, [e.target.name]: e.target.value, } }))
                                                                    setErrorMessage(e.target.value === "" ? "Veuillez definir la date et l'heure de l'emport" : "")
                                                                }}
                                                                valuesSelected={cart?.commande?.dateEmport || ""}
                                                                error={errorMessage}
                                                                required={true}
                                                            />
                                                        </div>
                                                        :
                                                        // SINON SELECTION DU LIEU DE LA LIVRAISON
                                                        // <CustomSelect1
                                                        //     selectClassname='rounded-md'
                                                        //     containerClassname="mb-4 flex-col"
                                                        //     textClassname="w-fuul"
                                                        //     label="Selectionnez le lieu de la livraison"
                                                        //     id="idPointLivraison"
                                                        //     valuesSelected={cart?.commande?.idPointLivraison || "0"}
                                                        //     onChange={(e: any) => {
                                                        //         dispatch(setCart({ ...cart, commande: { ...cart.commande, ...e } }))
                                                        //         setErrorMessage(e.target.value === "" ? "Veuillez séléctionner le lieu de la livraison." : "")
                                                        //     }}
                                                        //     data={pointLivraison}
                                                        //     keys={["idPointLivraison", "adressePointLivraison", "prixPointLivraison"]}
                                                        //     error={errorMessage.length ? errorMessage : ""}
                                                        // // required={true}
                                                        // />

                                                        <>
                                                            <DeliveryZones
                                                                data={pointLivraison}
                                                                libelle="Selectionnez le lieu de la livraison"
                                                                labelClassname='text-sm'
                                                                // Pour afficher le nom et le prix de la boisson puisque c'est un composant générique
                                                                keys={["idPointLivraison", "adressePointLivraison", "prixPointLivraison", "zone"]}
                                                                containerClassname="mb-5"
                                                                error={(!aEmporter && !cart.commande?.idPointLivraison && errorMessage?.length) ? errorMessage : ""}
                                                                onChange={(e: IPointLivraison) => {
                                                                    dispatch(setCart({ ...cart, commande: { ...cart.commande, ...e } }))
                                                                    dispatch(setUserConnectedInfo({ ...userConnectedInfo, idPointLivraison: e.idPointLivraison }))
                                                                    setErrorMessage(e.idPointLivraison === 0 ? "Veuillez séléctionner le lieu de la livraison." : "")
                                                                }}
                                                                valueSelected={pointLivraisonClient || initialisePointAdresseSelectionne}
                                                            />
                                                            {
                                                                cart.commande.idPointLivraison
                                                                &&
                                                                <div className='flex flex-col mb-4'>
                                                                    <Label className='text-sm'>Plus de précision sur la zone et la rue de la livraison <span className='text-red-600'>*</span></Label>
                                                                    <Input
                                                                        className="shadow-lg border-0 dark:border py-2"
                                                                        id="search-input"
                                                                        type="text"
                                                                        value={userConnectedInfo?.rueDeLaLivraison || ""}
                                                                        placeholder="Ex: mermoz sotrac, rue 10"
                                                                        // sizeClass="pl-14 py-4 pr-5 md:pl-16"
                                                                        rounded="rounded-md"
                                                                        onChange={(e: any) => {
                                                                            dispatch(setCart({ ...cart, commande: { ...cart.commande, rueDeLaLivraison: e.target.value } }));
                                                                            dispatch(setUserConnectedInfo({ ...userConnectedInfo, rueDeLaLivraison: e.target.value }))
                                                                        }}

                                                                    />
                                                                    {!userConnectedInfo?.rueDeLaLivraison && <Label className="text-red-500 text-sm mt-1">{errorMessage}</Label>}
                                                                </div>
                                                            }
                                                            {
                                                                (userLogged && userConnectedInfo && userConnectedInfo?.nomUtilisateurClient)
                                                                    ?
                                                                    <div className='mb-4 flex justify-between'>
                                                                        {
                                                                            userConnectedInfo?.telephoneClient &&
                                                                            <div>
                                                                                Téléphone: <span className='text-black'>{userConnectedInfo?.telephoneClient}, {userConnectedInfo?.telephoneClient2}</span>
                                                                            </div>
                                                                        }
                                                                        <div className='flex'>
                                                                            {!userConnectedInfo?.telephoneClient2 && <PlusIcon onClick={() => navigate("/compte")} className="w-5 h-5 text-blue-600 cursor-pointer" />}</div>
                                                                        <span className="mx-2 border-l h-6 border-slate-200 dark:border-slate-700 "></span>
                                                                        <PencilIcon onClick={() => navigate("/compte")} className="w-5 h-5  text-blue-600 cursor-pointer" />
                                                                    </div>
                                                                    :
                                                                    null

                                                            }

                                                        </>
                                                }

                                                <div className='border-t border-slate-200/70 '>
                                                    {/* Montant total de la commande */}
                                                    <div className="flex justify-between pb-1 pt-4">
                                                        <span>Total</span>
                                                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                                                            {formatMontantFCFA(montantTotalCommande)}
                                                        </span>
                                                    </div>
                                                    {/* Montant de la livraison */}
                                                    <div className="flex justify-between pb-4">
                                                        <span>{aEmporter ? "Date de l'emport" : "Livraison"} </span>
                                                        <span className="font-semibold text-slate-900 dark:text-slate-200">
                                                            {aEmporter
                                                                ?
                                                                formatTime(cart.commande.dateEmport ? cart.commande.dateEmport : null)
                                                                :
                                                                formatMontantFCFA(Number(cart?.commande?.prixPointLivraison || 0))}
                                                        </span>
                                                    </div>
                                                    {/* Montant total de la commande et de la livraison */}
                                                    <div className="flex justify-between font-semibold text-slate-900 dark:text-slate-200 text-base pt-4">
                                                        <span>Total</span>
                                                        <span className='text-red-600'>{formatMontantFCFA(montantTotalCommande + (Number(cart?.commande?.prixPointLivraison || 0)))}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {!isOpen && <CommandStatus isOpen={isOpen} timeRemaining={timeRemaining || ""} />
                                            }
                                            <CustomButton
                                                onClick={() => {
                                                    // Ne pas pouvoir commander si la commande est fermée
                                                    if (!getCommandStatus(new Date()).isOpen) return setShowModalConfirmCommande(false)
                                                    // Lorsque le client n'est pas authentifié, s'il clique sur le bouton commander, on le redirige vers le login
                                                    if (!(userLogged && userConnectedInfo && userConnectedInfo?.nomUtilisateurClient)) return navigate("/authentification");
                                                    // Sinon si la commande est à emporter, on exige qu'il renseigne l'heur
                                                    if (aEmporter && !cart.commande?.dateEmport) return setErrorMessage("Veuillez définir la date de l'emport.");
                                                    // Sinon si il souhaite être livré, on exige de renseigner le lie de la livraison
                                                    if (!aEmporter && !cart.commande?.idPointLivraison) return setErrorMessage("Veuillez sélectionner le lieu de la livraison.");
                                                    if (!aEmporter && cart.commande?.idPointLivraison && !userConnectedInfo?.rueDeLaLivraison) return setErrorMessage("Veuillez préciser le lieu de la livraison.");
                                                    // Si toutes les conditions ci-dessus sont satisfaites, on ouvre un modal pour qu'il confirme son achat
                                                    setShowModalConfirmCommande(true);
                                                }}
                                                title='Commandez'
                                                width='w-full'
                                                classname='rounded-2xl mt-6'
                                            />
                                            <div className="mt-5 text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center">
                                                <p className="block relative pl-5">
                                                    <InfoBulle />
                                                    En validant votre choix, vous acceptez automatiquement {` `}
                                                    <Link
                                                        to={"/conditions-generales-de-vente"}
                                                        className="text-slate-900 dark:text-slate-200 underline font-medium"
                                                    >
                                                        conditions générales de vente
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>
                                    }
                                </div>
                            </div>
                            :
                            // S'il n'y a rien dans le panier, on affiche que le panier est vide
                            <div className='flex justify-center text-2xl text-slate-500'>Le panier est vide</div>
                    }

                </main>

                {/* Popou co;;qnde fidelit2 */}
                <CustomModal
                    modalTitle="Félicitations ! 🥳🎉🎊"
                    onButtonCancelClick={() => null}
                    onButtonConfirmClick={() => null}
                    onCloseModal={() => {
                        setOpenPopup(false);
                        navigate("/")
                    }}
                    showModal={openPopup}
                    loading={false}
                    isPopup
                    content={
                        <div className="text-sm text-center">
                            Grâce à votre inscription sur le site et à votre sixième commande,
                            vous bénéficiez d’une pizza gratuite pour votre prochaine commande,
                            au format Regular, sans ajout de supplément, sur tout notre menu.
                            Seuls les frais de livraison seront à votre charge.
                        </div>
                    }
                />

                {/* Confirmer une commande */}
                <CustomModal
                    modalTitle="Confirmation de la commande"
                    onButtonCancelClick={() => setShowModalConfirmCommande(false)}
                    onButtonConfirmClick={() => ajouterCommande()}
                    onCloseModal={() => setShowModalConfirmCommande(false)}
                    showModal={showModalConfirmCommande}
                    loading={loadingCreateCommande}
                    content={
                        <div className="text-sm">Voulez-vous vraiment confirmer la commande ?</div>
                    }
                />


                {/* Supprimer une commande */}
                <CustomModal
                    modalTitle="Confirmation de suppression de la commande"
                    onButtonCancelClick={() => setShowModalDeleteCommande(false)}
                    onButtonConfirmClick={() => {
                        dispatch(setCart({ commandeDetails: cart.commandeDetails.filter(elt => elt !== choixPizzaSelectionnee) }));
                        setShowModalDeleteCommande(false);
                        dispatch(setPizzaGratosAlreadyUsed(false))

                    }}
                    onCloseModal={() => setShowModalDeleteCommande(false)}
                    showModal={showModalDeleteCommande}
                    content={
                        <div className="text-sm">Voulez-vous vraiment supprimer la commande ?</div>
                    }
                />


                {/* Modifier une commande */}
                <ModalSelectionChoixPizza
                    buttonTitle='Modifier la commande'
                    setChoixPizzaSelectionnee={setChoixPizzaSelectionnee}
                    handleChange={handleInputChange}
                    show={showModalModifierCommande}
                    onCloseModalQuickView={() => {
                        setShowModalModifierCommande(false);
                        setChoixPizzaSelectionnee(initialiseCommandeDetail)
                    }}
                    choixPizzaSelectionnee={choixPizzaSelectionnee}
                    setCommandeSupplement={setCommandeSupplement}
                    commandeSupplement={commandeSupplement}
                    setCommandeBoisson={setCommandeBoisson}
                    commandeBoisson={commandeBoisson}
                    setCommandeCondiment={setCommandeCondiment}
                    commandeCondiment={commandeCondiment}
                    onButtonAddClick={onButtonAddClick}
                />
            </div>
        </Suspense>
    )
}

export default Cart
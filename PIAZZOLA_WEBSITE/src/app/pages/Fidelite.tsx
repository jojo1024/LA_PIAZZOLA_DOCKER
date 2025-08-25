import React, { Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setClientPointFidelite } from "../../store/appSlice";
import { setSInscritAuProgrammeDeFidelite } from "../../store/menuSlice";
import { IReduxState } from "../../store/store";
import { apiClient } from "../../utils/apiClient";
import CustomModal from "../components/CustomModal";
import DisplayNotification from "../components/DisplayNotification";
import PageLoader from "./PageLoader";
import pizza from "/pizza.webp";
import pizza_60 from "/pizza_60.webp";
import two_user_pizza from "/two_user_pizza.webp";
// Lazy-loading pour les composants React
const Faq = React.lazy(() => import("../components/Faq"));
const SectionOrderDelivery = React.lazy(() =>
    import("../components/SectionOrderDelivery")
);
const CustomButton = React.lazy(() => import("../components/CustomButton"));
// const PromoSection = React.lazy(() => import("../components/PromoSection"));

const Fidelite = () => {
    // Redux
    const dispatch = useDispatch()
    const userLogged = useSelector((state: IReduxState) => state.application.userLogged);
    const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);
    const clientPointFidelite = useSelector((state: IReduxState) => state.application.clientPointFidelite);
    const clientId = userConnectedInfo?.clientId;

    //hooks
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [openPopup, setOpenPopup] = useState(false)
    
    const inscrireClientAuProgrammeDeFidelite = async () => {
        // e.preventDefault();
        try {
            // signUpSchema.parse(payload)
            // setFormErrors({})
            setLoading(true);
            const res = await apiClient.post(`/inscrire_prog_fidelite`, { clientId });
            if (!res?.status) throw res?.error
            // const data = res.data as IClient
            setOpenPopup(true)
            dispatch(setClientPointFidelite({ clientId, dateInscriptionFidelite: new Date(), fideliteId: 0, point: 0 }))
            DisplayNotification({ libelle: `Vous êtes désormais inscrit au programme de fidélité. Passez commande pour en profiter !`, type: "success", time: 2000 })
        } catch (error: any) {
            console.log("🚀 ~ insertClient ~ error:", error)
            // On affiche pas les erreurs de zod dans la notification
            !error?.errors && DisplayNotification({ libelle: "Une erreur est survenue lors de l'enregistrement", type: "error" })
            dispatch(setSInscritAuProgrammeDeFidelite(false))
        } finally {
            setLoading(false);
        }
    }

    return (
        <Suspense fallback={<PageLoader />}>
            <div className=" bg-gray-100">
                {/* Section 1 */}
                <SectionOrderDelivery />

                <div className="container sm:px-6 lg:px-8">
                    {/* Section 2: 1 pizza offerte */}
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        {/* Points */}
                        <div style={{ fontFamily: "Pacifico" }} className="text-black flex justify-center flex-col items-center font-bold text-3xl  sm:text-8xl">
                            <span className="">60</span>
                            <span className=" block">Points</span>
                        </div>

                        {/* Égalité */}
                        <div className="text-black text-6xl font-bold">=</div>

                        {/* Récompense */}
                        <div style={{ fontFamily: "Pacifico" }} className="text-red-600 font-bold text-3xl sm:text-6xl flex items-center flex-col">
                            <span>1 pizza regular</span>
                            <span>au choix</span>
                        </div>
                    </div>

                    <div style={{ fontFamily: "Pacifico" }} className="tracking-wide py-16 text-black text-base md:text-4xl mt-4 flex justify-center">Comment fonctionne le programme de fidelité ?</div>


                    {/* Section 3: création de compte */}
                    <div className="bg-gray-200 p-8 rounded-lg flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
                        {/* Image */}
                        <div className="w-full  md:w-1/3">
                            <img
                                src={two_user_pizza} // Remplacez par le lien de votre image
                                alt="Pizza and friends"
                                className="rounded-lg shadow-md w-full h-72"
                            />
                        </div>
                        {/* Texte */}
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <h2 style={{ fontFamily: "Pacifico" }} className="text-xl font-bold mb-4">1. Crée ton compte</h2>
                            <p className="text-gray-700 mb-4">
                                Crée ton compte sur la-piazzola.com et inscris-toi au programme de fidélité.
                            </p>
                            <div className="space-y-4">
                                {/* BOUTON CREATION DE COMPTE */}
                                <CustomButton
                                    onClick={() => {
                                        if (userLogged) return DisplayNotification({ libelle: "Vous êtes dejà connecté(e), vous pouvez vous inscrire au pragramme de fidélité.", type: "info", time: 4000 })
                                        navigate("/enregistrement");
                                        dispatch(setSInscritAuProgrammeDeFidelite(true))
                                    }}
                                    title="JE CRÉE MON COMPTE"
                                />
                                <p className="text-gray-700">Tu as déjà un compte ? Parfait !</p>
                                {/* BOUTON JE M'INSCRIS */}
                                <CustomButton
                                    loading={loading}
                                    onClick={() => {
                                        // S'il est déjà abonné au programme de fidélité
                                        if (clientPointFidelite && clientPointFidelite?.clientId !== 0) return DisplayNotification({ libelle: "Vous êtes dejà inscrit au programme de fidélité.", type: "info", time: 2000 })
                                        //   S'il n'est pas encore connecté et qu'il veut s'inscrire
                                        if (!userConnectedInfo?.clientId) {
                                            navigate("/authentification");
                                            dispatch(setSInscritAuProgrammeDeFidelite(true))
                                            DisplayNotification({ libelle: "Veuillez vous inscrire ou vous connecter pour bénéficier du programme de fidélité.", type: "info", time: 4000 })
                                            return
                                        }
                                        // s'il est connecté mais pas encore inscrire au programme de fidélité
                                        inscrireClientAuProgrammeDeFidelite()
                                        // navigate("/authentification");
                                    }}
                                    title="JE M'INSCRIS"
                                />
                            </div>
                        </div>
                    </div>


                    <div className="bg-gray-100 p-8 space-y-12">
                        {/* Section 4 : Gagne des points */}
                        <div className="flex flex-col justify-between md:flex-row  items-center space-y-8 md:space-y-0 md:space-x-8">
                            {/* Texte */}
                            <div className="md:w-1/2 text-center md:text-left">
                                <h2 style={{ fontFamily: "Pacifico" }} className="text-xl font-bold mb-4">2. Gagne des points</h2>
                                <p className="text-gray-700 mb-2">
                                    Tu gagnes <span className="font-bold">10 points à chaque commande d’une pizza régular passée en ligne  </span>
                                    (sur la-piazzola.com) et dont le total minimum est de 4.500 FCFA ( sans le prix de livraison inclus ).
                                </p>
                                <p className="text-gray-700 mb-2">
                                    Tu peux cumuler 10 points maximum par jour. Assure-toi d’être bien connecté à ton compte
                                    lorsque tu passes ta commande.
                                </p>
                                <p className="text-gray-700">
                                    Les points gagnés sont crédités sur ton compte 48 heures maximum après la commande.
                                </p>
                            </div>

                            {/* Images */}
                            <div className="relative w-96 md:w-72 xl:w-[500px]  flex items-center justify-end">
                                <img
                                    src={pizza} // Remplacez par votre image de pizza
                                    alt="Pizza"
                                    className="rounded-full "
                                />
                            </div>
                        </div>

                        {/* Section 5: Utilise tes points */}
                        <div className="bg-gray-300 p-8 rounded-lg flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
                            {/* Image */}
                            <div className="md:w-1/2 flex justify-center">

                            </div>
                            <div className="w-96 md:w-72 xl:w-96 hidden md:block md:absolute">
                                <img
                                    src={pizza_60} // Remplacez par votre image de pizza 60 points
                                    alt="60 Points Pizza"
                                    className=" "
                                />
                            </div>

                            {/* Texte */}
                            <div className="md:w-1/2 text-center md:text-left">
                                <h2 style={{ fontFamily: "Pacifico" }} className="text-xl font-bold mb-4">3. Utilise tes points</h2>
                                <p className="text-gray-700 mb-2">
                                    Dès 60 points cumulés, tu bénéficies d’une pizza au format Régular !
                                </p>
                                <p className="text-gray-700 mb-2">
                                    Pour consulter tes points, rends-toi dans ton compte puis dans l’onglet
                                    <span className="font-bold"> "Mes points de fidélité"</span>.
                                </p>
                                <p className="text-gray-700">
                                    Tu as 60 points ? Super ! Ajoute ta pizza régulière offerte dans ton panier en cliquant
                                    sur le bouton <span className="font-bold">"Utiliser"</span>.
                                </p>
                                <p className="text-gray-700 font-semibold mt-4">Bon appétit !</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-4">
                        <p className="text-sm text-gray-600">
                            Une pizza au format régular. Hors suppléments pâtes, ingrédients et modifications de recettes.
                        </p>
                        <p className="text-sm text-gray-600">
                            Offre soumise au minimum de commande en livraison Fidélité ci-dessous.
                        </p>
                        <div className="flex justify-center space-x-4">
                            {/* BOUTON CREATION DE COMPTE */}
                            <CustomButton
                                onClick={() => {
                                    if (userLogged) return DisplayNotification({ libelle: "Vous êtes dejà connecté(e), vous pouvez vous inscrire au pragramme de fidélité.", type: "info", time: 4000 })
                                    navigate("/enregistrement");
                                    dispatch(setSInscritAuProgrammeDeFidelite(true))
                                }}
                                title="JE CRÉE MON COMPTE"
                            />
                            {/* BOUTON JE M'INSCRIS */}
                            <CustomButton
                                loading={loading}
                                onClick={() => {
                                    // S'il est déjà abonné au programme de fidélité
                                    if (clientPointFidelite && clientPointFidelite?.clientId !== 0) return DisplayNotification({ libelle: "Vous êtes dejà inscrit au programme de fidélité.", type: "info", time: 2000 })
                                    //   S'il n'est pas encore connecté et qu'il veut s'inscrire
                                    if (!userConnectedInfo?.clientId) {
                                        navigate("/authentification");
                                        dispatch(setSInscritAuProgrammeDeFidelite(true))
                                        DisplayNotification({ libelle: "Veuillez vous inscrire ou vous connecter pour bénéficier du programme de fidélité.", type: "info", time: 4000 })
                                        return
                                    }
                                    // s'il est connecté mais pas encore inscrire au programme de fidélité
                                    inscrireClientAuProgrammeDeFidelite()
                                    // navigate("/authentification");
                                }}
                                title="JE M'INSCRIS"
                            />
                        </div>
                    </div>
                    <Faq />


                </div>

                {/* Popou co;;qnde fidelit2 */}
                <CustomModal
                    modalTitle="Félicitations ! 🥳🎉🎊"
                    onButtonCancelClick={() => null}
                    onButtonConfirmClick={() => null}
                    onCloseModal={() => {
                        setOpenPopup(false);
                    }}
                    showModal={openPopup}
                    loading={false}
                    isPopup
                    content={
                        <div className="text-sm text-center">
                            Vous êtes désormais inscrit au programme de fidélité. Commencez à commander pour accumuler 60 points, et vous pourrez obtenir une pizza gratuite au format regular.                        </div>
                    }
                />

            </div>

        </Suspense>

    );
};

export default Fidelite;

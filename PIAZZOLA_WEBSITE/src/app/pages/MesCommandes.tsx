import _ from "lodash";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICommandeDetail, ICommandex } from "../../store/interfaces";
import { setListeCommandes } from "../../store/menuSlice";
import { IReduxState } from "../../store/store";
import { apiClient } from "../../utils/apiClient";
import { BASE_URL_PROD, choixViandeitem } from "../../utils/constant";
import { calculerLePrixTotalDuneCommande, convertDateToLocaleStringDateTime, formatMontantFCFA } from "../../utils/functions";
import DisplayNotification from "../components/DisplayNotification";
import PageLoader from "./PageLoader";
import Button from "../components/Button/Button";
import CustomModal from "../components/CustomModal";
// Chargement dynamique des composants
const Chip = React.lazy(() => import("../components/Chip"));
const CommonLayout = React.lazy(() => import("../components/CommonLayout"));
const Nav = React.lazy(() => import("../components/Nav/Nav"));
const NavItem2 = React.lazy(() => import("../components/NavItem2"));
const NcImage = React.lazy(() => import("../components/NcImage/NcImage"));

const MesCommandes = () => {

  // Redux
  const dispatch = useDispatch();
  const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);
  const { listeCommandes } = useSelector((state: IReduxState) => state.menu);
  console.log("🚀 ~ MesCommandes ~ listeCommandes:", listeCommandes)

  //Hooks
  const [loading, setLoading] = useState(false)
  const [tabActive, setTabActive] = useState("Tous");
  const [showModalAnnulerCommande, setShowModalAnnulerCommande] = useState(false)
  const [loadingAnnulerCommande, setLoadingAnnulerCommande] = useState(false)
  const [commandeSelectionne, setCommandeSelectionne] = useState<ICommandex | null>(null)
  // Filtrer le liste des commandes en fonction de l'état de la commande reçu, en cours ou  traité
  const listeCommandeFiltre = useMemo(() => {
    if (tabActive === "Tous") {
      return listeCommandes
    } else {
      const data = listeCommandes.filter(item => item.etatCommande === tabActive)
      return data
    }
  }, [listeCommandes, tabActive])

  // Sortir de statistiques en fonction de l'état de la commande
  const stats = useMemo(() => {
    return listeCommandes.reduce(
      (acc, item) => {
        if (item?.etatCommande === "reçu") acc.totalRecu++;
        if (item?.etatCommande === "en cours") acc.totalEnCours++;
        if (item?.etatCommande === "traité") acc.totalTraite++;
        return acc;
      },
      { totalTous: listeCommandes.length, totalRecu: 0, totalEnCours: 0, totalTraite: 0 }
    );
  }, [listeCommandes])

  const renderCommandeItem = (elt: ICommandeDetail, index: number,) => {

    const { nomPizza, prixFormatActuel, descriptionPizza, quantiteCommande } = elt;
    return (
      <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
        <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
          <NcImage
            src={`${BASE_URL_PROD}/pizza_image/${elt?.libImagePizza}`}
            alt={`${nomPizza} ${descriptionPizza}`}
            containerClassName="h-full w-full object-cover object-center"
          />
        </div>

        <div className="ml-4 flex flex-1 flex-col">
          <div>
            <div className="flex flex-col sm:flex-row justify-between">
              <div>
                <div className="flex items-center">
                  <h3 className="text-base font-medium line-clamp-1 mr-2">{nomPizza}</h3>
                  <span className="text-sm text-slate-500">( {elt?.pizzaGratos ? <span className='text-green-500'>gratuit</span> : formatMontantFCFA(Number(elt?.prixFormatActuel))} )</span>
                </div>
                {/* <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patePizza}</span> */}
                {
                  elt?.estUnePizza
                    ?
                    <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {elt.nomFormat}{" - "}
                      {elt.nomPate}
                    </span>
                    : null
                }
              </div>

              <div className="text-sm mt-4 sm:mt-0">
                Qté : <span className="text-black font-semibold">{quantiteCommande}</span>
                <span className="mx-2">x</span>
                <span className="text-black font-semibold">{elt?.pizzaGratos ? <span className='text-green-500'>gratuit</span> : formatMontantFCFA(prixFormatActuel * quantiteCommande)}</span>
              </div>
            </div>

          </div>
          <div className="flex flex-col sm:flex-row flex-1  justify-between text-sm">
            <div>
              {elt.commandeBoissons.length > 0 ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-4">
                    <span className="mt-1 mr-2">Boissons:</span>
                    {elt.commandeBoissons.map((elt, index) => (
                      <div
                        key={index}
                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                      >
                        {elt.nomBoisson} : {elt.prixBoissonActuel}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {elt.commandeSupplements.length > 0 ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-3">
                    <span className="mt-1 mr-2">Supplements:</span>
                    {elt.commandeSupplements.map((elt, index) => (
                      <div
                        key={index}
                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                      >
                        {elt.nomSupplement} : {elt.prixSupplementActuel}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {elt.commandeCondiments.length > 0 ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-3">
                    <span className="mt-1 mr-2">Condiments:</span>
                    {elt.commandeCondiments.map((elt, index) => (
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

              {(elt?.nomAccompagnement && elt?.avecAccompagnement) ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-3">
                    <span className="mt-1 mr-2">Accompagnement:</span>
                    <div
                      className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                    >
                      {/* {recupPizzaInfo(Number(item.viandeId), viande, "viandeId", "nomViande")} */}
                      {elt.nomAccompagnement}
                    </div>
                  </div>
                </div>
              ) : null}

              {(elt?.nomViande && elt?.choixViande) ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-3">
                    <span className="mt-1 mr-2">{choixViandeitem[elt?.choixViande]}:</span>
                    <div
                      className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                    >
                      {elt.nomViande}
                    </div>
                  </div>
                </div>
              ) : null}


              {/* {elt.nomCondiment ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-4">
                    <span className="mt-1 mr-2">Condiment:</span>
                    <div
                      className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                    >
                      {elt.nomCondiment}
                    </div>
                  </div>
                </div>
              ) : null} */}

              {elt.demandeSpeciale ? (
                <div className="flex items-center">
                  <div className="flex flex-wrap text-sm mt-4">
                    <span className="mt-1 mr-2">Demande Spé.:</span>
                    <div
                      className={`flex max-w-40 overflow-hidden truncate  py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                    >
                      {elt.demandeSpeciale}
                    </div>
                  </div>
                </div>

              ) : null}

            </div>

            <div className="flex items-end justify-end text-md  mt-4 sm:mt-0">

              total:
              {/* @ts-ignore */}
              <span className="text-red-500  font-semibold text-base ml-1">{formatMontantFCFA(calculerLePrixTotalDuneCommande([elt], { useActualPrices: true }))}</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderCommande = (item: ICommandex, index: number) => {
    let montantTotal = calculerLePrixTotalDuneCommande(item.commandeDetails, { useActualPrices: true })
    return (
      <div key={index} className="border border-slate-200  rounded-lg overflow-hidden z-0">
        <div className=" p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <div className="">
              <p className="text-lg font-semibold">#{item.commandeId}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                Date de la commande: <span className="text-black">{convertDateToLocaleStringDateTime(item.dateCommande)}</span>
              </p>
              <div className="text-slate-500 text-sm">
                {
                  item.aEmporte
                    ?
                    <span>Date de l'emport: <span className="text-black">{convertDateToLocaleStringDateTime(item.dateEmport)}</span></span>
                    :
                    <span>Lieu et prix de la livraison: <span className="text-black">{item?.zone}, {item?.rueDeLaLivraison}... {formatMontantFCFA(item.prixLivraisonActuel || 0)}</span></span>
                }
              </div>
              <div className="text-slate-500 text-sm">
                <span>Prix total: <span className="text-red-500 text-base font-semibold">{formatMontantFCFA(montantTotal + (item.prixLivraisonActuel || 0))}</span></span>
              </div>
            </div>
            <div className="flex mt-3 sm:mt-0">
              {/* @ts-ignore */}
              <Chip libelle={item.etatCommande} />
            </div>
          </div>
          {
            item.etatCommande === "reçu"
            &&
            <div>
              <Button
                sizeClass="px-4 py-1 mt-2"
                className="bg-slate-300 text-slate-700 rounded-md"
                fontSize="text-sm"
                onClick={() => {
                  setCommandeSelectionne(item);
                  setShowModalAnnulerCommande(true);
                }}
              >
                Annuler
              </Button>
            </div>
          }
        </div>
        <div className="border-t border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
          {item.commandeDetails.map((elt, index) => renderCommandeItem(elt, index))}
        </div>
      </div>
    );
  };

  const recupCommandeParClient = async () => {
    try {
      setLoading(true)
      const payload = { clientId: userConnectedInfo.clientId }
      const res = await apiClient.post("/recup_commande_par_client_vendeur", payload)
      if (!res.status) throw res.error
      const commande = res?.data as ICommandex[]
      dispatch(setListeCommandes(_.orderBy(commande, "commandeId", "desc").slice(0, 60)));
      console.log("🚀 ~ recupCommandeParClient ~ res?.data:", res?.data)
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
      DisplayNotification({ libelle: "Erreur lors de récuperation des commandes !", type: "error" })
    }
    finally {
      setLoading(false)
    }
  }

  /**
 * Attribuer la commande à un site
 * @param commandeId 
 */
  const annulerCommande = async (commandeId: number) => {
    try {
      setLoadingAnnulerCommande(true)
      const payload = { commandeId }
      const res = await apiClient.post("/annuler_commande", payload)
      if (!res.status) throw res.error
      DisplayNotification({ libelle: "Commande annulée avec succès.", type: "success", time: 3000 })
      setShowModalAnnulerCommande(false)
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
      setLoadingAnnulerCommande(false)
    }
  }

  useEffect(() => {
    recupCommandeParClient()
  }, [])

  const navData = [
    { title: "Tous", count: stats.totalTous },
    { title: "reçu", count: stats.totalRecu },
    { title: "en cours", count: stats.totalEnCours },
    { title: "traité", count: stats.totalTraite },

  ]

  return (
    <Suspense fallback={<PageLoader />}>
      <div>
        <CommonLayout>
          <div className="space-y-10 sm:space-y-12">
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl font-semibold">Historique des commandes</h2>
            {loading ? (
              <div>Chargement de l'historique des commandes...</div>
            ) : (
              <>
                <Nav
                  className="p-1 bg-white dark:bg-neutral-800 rounded-full shadow-lg overflow-x-auto hiddenScrollbar"
                  containerClassName="mb-12 lg:mb-14 relative flex justify-center w-full text-sm md:text-base"
                >
                  {navData.map((item, index) => (
                    <NavItem2
                      key={index}
                      isActive={tabActive === item.title}
                      onClick={() => setTabActive(item.title)}
                    >
                      <div className="flex items-center justify-center space-x-1.5 sm:space-x-2.5 text-xs sm:text-sm">
                        <span>{item.title} ({item.count})</span>
                      </div>
                    </NavItem2>
                  ))}
                </Nav>
                {/* _.orderBy(listeCommandeFiltre, ['commandeId'], ['asc']) */}
                {listeCommandeFiltre.map(renderCommande)}
              </>
            )}
          </div>
        </CommonLayout>

        {/* Annuler une commande */}
        <CustomModal
          modalTitle={`Confirmation de l'annulation la commande`}
          onButtonCancelClick={() => setShowModalAnnulerCommande(false)}
          onButtonConfirmClick={() => annulerCommande(commandeSelectionne?.commandeId!)}
          onCloseModal={() => setShowModalAnnulerCommande(false)}
          showModal={showModalAnnulerCommande}
          loading={loadingAnnulerCommande}
          content={
            <div className="text-sm">Voulez-vous vraiment annuler la commande {commandeSelectionne?.commandeId} </div>
          }
        />
      </div>
    </Suspense>

  );
};

export default MesCommandes;

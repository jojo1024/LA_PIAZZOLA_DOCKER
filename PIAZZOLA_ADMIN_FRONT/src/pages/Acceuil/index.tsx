import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tab } from '../../base-components/Headless'
import Lucide from '../../base-components/Lucide'
import Tippy from '../../base-components/Tippy'
import { IListeCommandeItem, setListeCommandes } from '../../stores/commandeSlice'
import { IReduxState } from '../../stores/store'
import { apiClient } from '../../utils/apiClient'
import { BASE_URL, BASE_URL_PROD } from '../../utils/constants'
import { calculerStats, formatMontant, formatMontantFCFA, recupSite } from '../../utils/functions'
import ReportLineChart from "../components/ReportLineChart"
import avatar_profil from "/avatar_profil.png"
import * as xlsx from "xlsx";
import Button from '../../base-components/Button'
import CustomSelect1 from '../components/CustomSelect1'
import LoadingIcon from '../../base-components/LoadingIcon'


const Acceuil = () => {

  // Redux
  const dispatch = useDispatch()
  const listeCommandes = useSelector((state: IReduxState) => state.commande.listeCommandes);
  const connectionInfo = useSelector((state: IReduxState) => state.application.connectionInfo);
  const listeSites = useSelector((state: IReduxState) => state.gestionSiteWeb.listeSites);
  const recalculerDonneDashboard = useSelector((state: IReduxState) => state.commande.recalculerDonneDashboard);

  // Hooks
  const [loading, setLoading] = useState(false)
  const [filtreKey, setFiltreKey] = useState<"day" | "week" | "month" | "year">("year")
  const initialiseSite = { siteId: connectionInfo?.nomRole === "Admin" ? 0 : connectionInfo?.siteId, nomSite: "" }
  const [siteSelectionne, setSiteSelectionne] = useState(initialiseSite)
  console.log("🚀 ~ Acceuil ~ siteSelectionne:", siteSelectionne)


  // Tableau des statistiques
  const tabsData: {
    key: "day" | "week" | "month" | "year";
    labelSuffix: string;
    label: string;
  }[] = [
      { key: "year", labelSuffix: "Cette", label: "année" },
      { key: "month", labelSuffix: "Ce", label: "mois" },
      { key: "week", labelSuffix: "Cette ", label: "semaine" },
      { key: "day", labelSuffix: "Ce ", label: "jour" },
    ];
  // const [stats, setStats] = useState<DashboardStats>({
  //   chiffreAffaireTotal: 0,
  //   chiffreDaffaireParMois: { chiffreAffaireMoisActuel: 0, chiffreAffaireMoisPrecedent: 0, data: [], labels: [] },
  //   colorChiffreAffaire: "", colorClients: "", colorCommande: "", meilleursClients: {}, nombreClients: 0, nombreCommandes: 0, pizzasLesPlusCommande: [], tauxChiffreAffaire: 0, tauxClients: 0, tauxCommande: 0
  // })
  const recupCommandeParClient = async () => {
    try {
      setLoading(true)
      const payload = { thisYear: true }
      const res = await apiClient.post("/recup_commande_par_client_vendeur", payload)
      if (!res.status) throw res.error
      const data = res.data as IListeCommandeItem[]
      console.log("🚀 ~ recupCommandeParClient ~ commandeX:", res?.data?.slice(0, 6))
      dispatch(setListeCommandes(data));
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  const stats = useMemo(() => {
    console.log("🚀 ~ Acceuil ~ siteSelectionne:", siteSelectionne)
    return calculerStats(listeCommandes, Number(siteSelectionne.siteId))
  }, [listeCommandes, recalculerDonneDashboard, siteSelectionne.siteId])
  console.log("🚀 ~ stats ~ stats:", stats)

  const revenusParMois = [{
    "Janvier": stats?.chiffreDaffaireParMois?.data[0],
    "Février": stats?.chiffreDaffaireParMois?.data[1],
    "Mars": stats?.chiffreDaffaireParMois?.data[2],
    "Avril": stats?.chiffreDaffaireParMois?.data[3],
    "Mai": stats?.chiffreDaffaireParMois?.data[4],
    "Juin": stats?.chiffreDaffaireParMois?.data[5],
    "Juillet": stats?.chiffreDaffaireParMois?.data[6],
    "Août": stats?.chiffreDaffaireParMois?.data[7],
    "Septembre": stats?.chiffreDaffaireParMois?.data[8],
    "Octobre": stats?.chiffreDaffaireParMois?.data[9],
    "Novembre": stats?.chiffreDaffaireParMois?.data[10],
    "Decembre": stats?.chiffreDaffaireParMois?.data[11]
  }]

  const clientsParMois = [{
    "Janvier": stats?.nombreClientsParMois?.data[0],
    "Février": stats?.nombreClientsParMois?.data[1],
    "Mars": stats?.nombreClientsParMois?.data[2],
    "Avril": stats?.nombreClientsParMois?.data[3],
    "Mai": stats?.nombreClientsParMois?.data[4],
    "Juin": stats?.nombreClientsParMois?.data[5],
    "Juillet": stats?.nombreClientsParMois?.data[6],
    "Août": stats?.nombreClientsParMois?.data[7],
    "Septembre": stats?.nombreClientsParMois?.data[8],
    "Octobre": stats?.nombreClientsParMois?.data[9],
    "Novembre": stats?.nombreClientsParMois?.data[10],
    "Decembre": stats?.nombreClientsParMois?.data[11]
  }]

  const meilleursClients = stats?.meilleursClients?.map(({ emailClient, nomUtilisateurClient, nombreCommandes, telephoneClient, telephoneClient2 }) => ({
    NOM: nomUtilisateurClient,
    EMAIL: emailClient,
    "NUMERO 1": telephoneClient,
    "NUMERO 2": telephoneClient2,
    "NOMBRE COMMANDES": nombreCommandes
  }))

  const pizzasLesPlusCommande = stats?.pizzasLesPlusCommande?.map(({ nomPizza, quantite }) => ({
    "NOM DE LA PIZZA": nomPizza,
    "QUANTITE COMMANDE": quantite,
  }))

  const onExportXlsx = (newData: any, libFic: string) => {
    const sheet = xlsx.utils.json_to_sheet(newData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, sheet, 'Données');
    xlsx.writeFile(workbook, `${libFic}${!siteSelectionne.nomSite ? "" : siteSelectionne.nomSite}.xlsx`);
  }

  useEffect(() => {
    recupCommandeParClient();
    recupSite();
  }, [])

  return (
    <div className="grid grid-cols-12 gap-6">

    { loading &&   <div className='absolute '><LoadingIcon icon="oval" color="green" className="w-20 h-20 ml-2" /></div>}

      <div className="col-span-12 2xl:col-span-9">
        {
          connectionInfo?.nomRole === "Admin"
            ?
            <div className='flex flex-row-reverse'>
              <CustomSelect1
                id="siteId"
                label="Afficher les données selon le site de la pizzeria"
                valuesSelected={siteSelectionne?.siteId}
                onChange={(e: any) => setSiteSelectionne(prev => ({ ...prev, ...e }))}
                data={listeSites}
                keys={["siteId", "nomSite"]}
                containerClassname='flex-col w-full md:w-96 mt-4'
                initialiseValue={initialiseSite}
              />
            </div>
            :
            <div className='flex flex-row-reverse text-black mt-4 text-base'>{connectionInfo.nomSite}</div>

        }
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <Tab.Group className="col-span-12 md:col-span-10 lg:col-span-6 2xl:col-span-6 mt-8">
            <div className="pr-1 intro-y">
              <div className="p-1 box">
                <Tab.List
                  variant="pills"
                  className=" mx-auto  border border-dashed rounded-md border-slate-300 dark:border-darkmode-300"
                >
                  {tabsData.map(onglet => (
                    <Tab key={onglet.key} >
                      <Tab.Button
                        className={`w-full flex  py-2 text-xs sm:text-sm truncate overflow-hidden `}
                        as="button"
                        onClick={() => setFiltreKey(onglet.key)}
                      >
                        <span className='hidden sm:block sm:pr-1'>{onglet.labelSuffix}</span> {" "}  {onglet.label}
                      </Tab.Button>
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>

          </Tab.Group>
          <div className="col-span-12 ">
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="ShoppingCart"
                        className="w-[28px] h-[28px] text-primary"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className={`cursor-pointer ${stats.colorCommande} py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium`}
                          content={`${stats.tauxClients}% plus grand que le mois dernier`}
                        >
                          {stats.tauxCommande}%{" "}
                          <Lucide icon={stats.colorCommande === "bg-success" ? "ChevronUp" : "ChevronDown"} className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {stats.donneesPourLeFiltre[filtreKey]?.totalCommande}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Total des commandes
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="CreditCard"
                        className="w-[28px] h-[28px] text-pending"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className={`cursor-pointer ${stats.colorChiffreAffaire} py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium`}
                          content={`${stats.tauxChiffreAffaire}% plus grand que le mois dernier`}
                        >
                          {stats.tauxChiffreAffaire}%{" "}
                          <Lucide icon={stats.colorChiffreAffaire === "bg-success" ? "ChevronUp" : "ChevronDown"} className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {formatMontant(stats.donneesPourLeFiltre[filtreKey]?.chiffreAffaire || 0)} F CFA

                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Chiffre d'affaire
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-success"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className={`cursor-pointer ${stats.colorClients} py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium`}
                          content={`${stats.tauxClients}% plus grand que le mois dernier`}
                        >
                          {stats.tauxClients}%{" "}
                          <Lucide icon={stats.colorClients === "bg-success" ? "ChevronUp" : "ChevronDown"} className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                      {stats.donneesPourLeFiltre[filtreKey]?.nombreClient}
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Nombre de clients
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div
                  className={clsx([
                    "relative zoom-in",
                    "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                  ])}
                >
                  <div className="p-5 box">
                    <div className="flex">
                      <Lucide
                        icon="User"
                        className="w-[28px] h-[28px] text-success"
                      />
                      <div className="ml-auto">
                        <Tippy
                          as="div"
                          className="cursor-pointer bg-neutral-200 py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                          content="22% plus grand que le mois dernier"
                        >
                          .{" "}
                          <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="mt-6 text-3xl font-medium leading-8">
                    {formatMontant(stats.donneesPourLeFiltre[filtreKey]?.chiffreAffaireLivraison || 0)} F CFA
                    </div>
                    <div className="mt-1 text-base text-slate-500">
                      Chiffre d'affaire livraison
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BEGIN: Sales Report */}
          {/* END: Sales Report */}
          <div className="col-span-12 mt-8 lg:col-span-6">
            <div className="flex  justify-between flex-col  h-10 intro-y  sm:flex-row">
              <h2 className=" text-lg font-medium truncate">
                Revenus par mois
              </h2>
              <div className=''>
                <Button
                  as="a"
                  href="#"
                  variant="soft-primary"
                  onClick={() => onExportXlsx(revenusParMois, "etat_chiffre_d_affaire_par_mois_de_la_piazzola")}
                  className="mr-2 shadow-md"
                >
                  Exporter
                </Button>
              </div>
            </div>
            {
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex">
                    <div>
                      <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                        {formatMontantFCFA(stats.chiffreDaffaireParMois.chiffreAffaireMoisActuel)}
                      </div>
                      <div className="mt-0.5 text-slate-500">Ce mois</div>
                    </div>
                    <div className="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                    <div>
                      <div className="text-lg font-medium text-slate-500 xl:text-xl">
                        {formatMontantFCFA(stats.chiffreDaffaireParMois.chiffreAffaireMoisPrecedent)}
                      </div>
                      <div className="mt-0.5 text-slate-500">Mois dernier</div>
                    </div>
                  </div>

                </div>
                <div
                  className={clsx([
                    "relative",
                    "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                    "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                  ])}
                >
                  {

                    <ReportLineChart
                      labels={stats.chiffreDaffaireParMois.labels}
                      data={stats.chiffreDaffaireParMois.data}
                      height={275}
                      datasetLabel='revenus du mois'
                      className="mt-6 -mb-6"
                    />
                  }
                </div>
              </div>
            }
          </div>
          <div className="col-span-12 mt-8 lg:col-span-6">
            <div className="flex  justify-between flex-col  h-10 intro-y  sm:flex-row">
              <h2 className="mr-5 text-lg font-medium truncate">
                Client par mois
              </h2>
              <div className=''>
                <Button
                  as="a"
                  href="#"
                  variant="soft-primary"
                  onClick={() => onExportXlsx(clientsParMois, "etat_clients_par_mois_de_la_piazzola")}
                  className="mr-2 shadow-md"
                >
                  Exporter
                </Button>
              </div>
            </div>
            {
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div className="flex flex-col md:flex-row md:items-center">
                  <div className="flex">
                    <div>
                      <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                        {stats.nombreClientsParMois.nombreClientsMoisActuel}
                      </div>
                      <div className="mt-0.5 text-slate-500">Ce mois</div>
                    </div>
                    <div className="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                    <div>
                      <div className="text-lg font-medium text-slate-500 xl:text-xl">
                        {stats.nombreClientsParMois.nombreClientsMoisPrecedent}
                      </div>
                      <div className="mt-0.5 text-slate-500">Mois dernier</div>
                    </div>
                  </div>

                </div>
                <div
                  className={clsx([
                    "relative",
                    "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                    "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                  ])}
                >
                  {

                    <ReportLineChart
                      labels={stats.nombreClientsParMois.labels}
                      data={stats.nombreClientsParMois.data}
                      height={275}
                      datasetLabel='clients du mois'
                      className="mt-6 -mb-6"
                    />
                  }
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <div className="col-span-12 2xl:col-span-3">
        <div className="pb-10 -mb-10 2xl:border-l">
          <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
            {/* BEGIN: Transactions */}
            <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
              <div className="flex  justify-between flex-col  h-10 intro-y  sm:flex-row">
                <h2 className="mr-5 text-lg font-medium truncate">
                  Les meilleurs clients
                </h2>
                <div className=''>
                  <Button
                    as="a"
                    href="#"
                    variant="soft-primary"
                    onClick={() => onExportXlsx(meilleursClients, "etat_meilleurs_clients_de_la_piazzola")}
                    className="mr-2 shadow-md"
                  >
                    Exporter
                  </Button>
                </div>
              </div>
              <div className="mt-5">
                {stats.meilleursClients.slice(0, 5).map((item, fakerKey) => (
                  <div key={fakerKey} className="intro-x">
                    <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                      <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                        <img
                          alt="X"
                          src={avatar_profil}
                        />
                      </div>
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">{item?.nomUtilisateurClient}</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {item?.telephoneClient}
                        </div>
                      </div>
                      <div
                      >
                        <Tippy
                          as="div"
                          className={`py-[3px] flex rounded-full text-success text-xs pl-2 pr-1 items-center font-medium`}
                          content={`Nombre de commandes: ${item?.nombreCommandes}`}
                        >
                          {item?.nombreCommandes}
                        </Tippy>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* END: Transactions */}

            {/* BEGIN: Recent Activities */}
            <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
              <div className="flex  justify-between flex-col  h-10 intro-y  sm:flex-row">
                <h2 className="mr-5 text-lg font-medium truncate">
                  Les pizzas les plus commandés
                </h2>
                <div className=''>
                  <Button
                    as="a"
                    href="#"
                    variant="soft-primary"
                    onClick={() => onExportXlsx(pizzasLesPlusCommande, "etat_des_pizzas_les_plus_commandes_de_la_piazzola")}
                    className="mr-2 shadow-md"
                  >
                    Exporter
                  </Button>
                </div>
              </div>
              <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                {
                  stats.pizzasLesPlusCommande?.slice(0, 5).map((item, index) => (
                    <div key={index} className="relative flex items-center mb-3 intro-x">
                      <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                        <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                          <img
                            alt="Y"
                            src={`${BASE_URL_PROD}/pizza_image/${item?.libImagePizza}`}
                          />
                        </div>
                      </div>
                      <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                        <div className="flex items-center">
                          <div className="font-medium">
                            {item?.nomPizza}
                          </div>
                          <div className="ml-auto text-xs text-success">
                            <Tippy
                              as="div"
                              className={`py-[3px] flex rounded-full text-success text-xs pl-2 pr-1 items-center font-medium`}
                              content={`Nombre de commandes: ${item?.quantite}`}
                            >
                              {item?.quantite}
                            </Tippy>
                          </div>
                        </div>
                        <div className="mt-1 text-slate-500">
                          {item?.descriptionPizza?.slice(0, 35)}...
                        </div>
                      </div>
                    </div>
                  ))
                }


              </div>
            </div>
            {/* END: Recent Activities */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Acceuil
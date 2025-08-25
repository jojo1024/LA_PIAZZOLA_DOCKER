import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { ICommandeDetail, IEtatCommande, IListeCommandeItem, setListeCommandes } from '../../stores/commandeSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import { calculerPrixTotalDuneCommande, checkCommandesForAlarm, convertDateToLocaleStringDateTime, formatMontantFCFA } from '../../utils/functions';
import Chip from '../components/Chip';
import CustomSelect from '../components/CustomSelect';
import DialogBox from '../components/DialogBox';
import { Tab } from '../../base-components/Headless';
import { Pagination } from '../components/Pagination';
import { CustomNotification, INotification, INotificationProps } from '../components/Notification';
import { NotificationElement } from '../../base-components/Notification';
import _ from 'lodash';
import Alert from "../../base-components/Alert";
import { BASE_URL } from '../../utils/constants';
import ringTone from "/ring_tone.mp3"
import ConfirmeBox from '../components/ConfirmeBox';
import CommandeCard from './CommandeCard';

const pizzerias = [{ idPizzeria: 1, nomPizzeria: "Pizzeria 1" }, { idPizzeria: 2, nomPizzeria: "Pizzeria 2" }, { idPizzeria: 3, nomPizzeria: "Pizzeria 3" }]

const GestionCommandes = () => {

  // Redux
  const dispatch = useDispatch()
  const listeCommandes = useSelector((state: IReduxState) => state.commande.listeCommandes);
  const connectionInfo = useSelector((state: IReduxState) => state.application.connectionInfo);
  console.log("🚀 ~ GestionCommandes ~ listeCommandes:", listeCommandes)

  // Hooks
  const [openDialogAttribuerPizza, setOpenDialogAttribuerPizza] = useState(false)
  const [pizzeriaSelectionne, setPizzeriaSelectionne] = useState(0)
  console.log("🚀 ~ GestionCommandes ~ pizzeriaSelectionne:", pizzeriaSelectionne)
  const [rechercheForm, setRechercheForm] = useState<{ siteId: number | string }>({ siteId: connectionInfo?.nomRole === "Admin" ? 0 : connectionInfo.siteId })
  const [commandeSelectionne, setCommandeSelectionne] = useState<IListeCommandeItem>()
  const [openAnnulerCommandeConfirmBox, setOpenAnnulerCommandeConfirmBox] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<INotification | undefined>()
  const notificationRef = useRef<NotificationElement>();
  const showNotification = () => notificationRef.current?.showToast();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [loadingGestionCommande, setLoadingGestionCommande] = useState(false)
  const [indexSelected, setIndexSelected] = useState(-1)

  // Table hooks
  const [pageIndex, setPageIndex] = useState(0);
  const itemsPerPage = 16
  const startIndex = pageIndex * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;


  const handleCloseDialogAttribuerPizza = () => {
    setOpenDialogAttribuerPizza(false)
    setPizzeriaSelectionne(0)
  }

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setRechercheForm({ ...rechercheForm, [name]: Number(value) })
  }

  /**
   * Filtré la liste des commande par site, en fonction de la personne connecté
   * Si c'est un admin on affiche tout, sinon que pour le site de celui qui est connecté ou bien 
   * ceux qui n'ont pas encore été validé
   */
  const listeCommandeParSite = useMemo(() => {
    if (connectionInfo?.nomRole === "Admin") {
      return listeCommandes
    } else {
      const data = listeCommandes.filter(item => (item.siteId === rechercheForm.siteId) || (item.siteId === null))
      return data
    }
  }, [listeCommandes])

  /**
   * Statistiqes des commandes en fonction de ceux reçu, en cours et traité
   */
  const stats = useMemo(() => {
    return listeCommandeParSite.reduce(
      (acc, item) => {
        if (item?.etatCommande === "reçu") acc.totalRecu++;
        if (item?.etatCommande === "en cours") acc.totalEnCours++;
        if (item?.etatCommande === "traité") acc.totalTraite++;
        return acc;
      },
      { totalTous: listeCommandeParSite.length, totalRecu: 0, totalEnCours: 0, totalTraite: 0 }
    );
  }, [listeCommandes])

  /**
   * Récuperer la liste sistes dans les commandes pour le combo du filtre
   */
  const sites = useMemo(() => {
    // Étape 1: Filtrer les objets uniques par 'name'
    const uniqById = _.uniqBy(listeCommandeParSite, 'siteId');
    // Étape 2: Extraire uniquement les propriétés nécessaires
    return _.map(uniqById, ({ siteId, nomSite }) => ({ siteId, nomSite }));
  }, [listeCommandeParSite]); // Recalcule uniquement si `data` change

  // Tableau des statistiques
  const tabsData = [
    { id: "tous", label: "Tous", count: stats.totalTous },
    { id: "reçu", label: "Reçu", count: stats.totalRecu },
    { id: "en cours", label: "En cours", count: stats.totalEnCours },
    { id: "traité", label: "Traité", count: stats.totalTraite },
  ];

  // Etat commande à afficher sur les boutons
  const etat: { [key: string]: { label: string, etatCommande: IEtatCommande } } = {
    "reçu": { label: "Accepter", etatCommande: "en cours" },
    "en cours": { label: "Terminer", etatCommande: "traité" },
    "traité": { label: "Terminer", etatCommande: "terminé" }
  }

  const [selectedTab, setSelectedTab] = useState<string>(tabsData[0].id);

  /**
   * Filtrer les commandes en fonction de l'état de la commande
   */
  const listeCommandeFiltre = useMemo(() => {
    if (selectedTab === "tous") {
      return listeCommandeParSite
    } else {
      const data = listeCommandeParSite.filter(item => item.etatCommande === selectedTab)
      return data
    }
  }, [listeCommandeParSite, selectedTab])



  /**
   * Filtrer la liste des commande par siteId ou par commande id
   * Laissr les commandes réçus au dessus
   */
  const commandesTriees = useMemo(() => {
    const isSiteEmpty = rechercheForm.siteId === 0;
    let data = listeCommandeFiltre
    // if (isSiteEmpty) return data

    // Filtrer par siteId si ce n'est pas vide
    if (!isSiteEmpty) {
      data = data.filter((item) => (item.siteId === rechercheForm.siteId) || (item.siteId === null));
    }

    // Appliquer les transformations en chaîne
    data = _.chain(data)
      // Trier par l'état "reçu" prioritaire et par commandeId
      .orderBy(
        [
          (item) => item.etatCommande === "reçu" ? 0 : 1, // Prioriser "reçu"
          "commandeId" // Ensuite trier par commandeId
        ],
        ["asc", "desc"] // Ordre : "reçu" (asc), commandeId (desc)
      )
      .slice(startIndex, endIndex) // Appliquer la pagination
      .value();

    console.log("🚀 ~ commandesTriees ~ data>>>>>>>>>:", data)
    return data;
  }, [listeCommandeFiltre, startIndex, endIndex, rechercheForm]);

  const pageCount = listeCommandeFiltre!.length / itemsPerPage

  // Fonction pour gérer la sélection de l'onglet
  const handleTabSelect = (id: string) => {
    setSelectedTab(id);
  };

  /**
   * Modifier l'état d'une commande
   * @param etatCommande 
   * @param commandeId 
   * @param nomUtilisateurClient 
   * @param emailClient 
   */
  const gestionEtatCommande = async (item: IListeCommandeItem) => {
    try {
      setLoading(true)
      const payload = { ...item, valideParUtilisateur: 1, utilisateurId: connectionInfo.utilisateurId, siteId: connectionInfo.siteId }
      const res = await apiClient.post("/gerer_commande", payload)
      if (!res.status) throw res.error
      displayNotification({ content: `Commande ${item.etatCommande === "en cours" ? "accepté" : "terminé"} avec succès !`, type: "success" })

    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  /**
   * Attribuer la commande à un site
   * @param commandeId 
   */
  const attribuerCommande = async (commandeId: number) => {
    try {
      setLoading(true)
      const payload = { siteId: pizzeriaSelectionne, commandeId }
      const res = await apiClient.post("/attribuer_commande", payload)
      if (!res.status) throw res.error
      displayNotification({ content: `Commande attribuée avec succès !`, type: "success" })

    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
      setOpenDialogAttribuerPizza(false)
    }
  }

  /**
   * Attribuer la commande à un site
   * @param commandeId 
   */
  const annulerCommande = async (commandeId: number) => {
    try {
      setLoading(true)
      const payload = { siteId: pizzeriaSelectionne, commandeId }
      const res = await apiClient.post("/annuler_commande", payload)
      if (!res.status) throw res.error
      displayNotification({ content: `Commande annulée avec succès !`, type: "success" })

    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
      setOpenAnnulerCommandeConfirmBox(false)
    }
  }



  const recupToutesLesCommandes = async () => {
    try {
      setLoading(true)
      const payload = {}
      const res = await apiClient.post("/recup_commande_par_client_vendeur", payload)
      if (!res.status) throw res.error
      const data = res.data as IListeCommandeItem[]
      console.log("🚀 ~ recupToutesLesCommandes ~ commandeX:", res?.data)
      dispatch(setListeCommandes(data));
    } catch (error) {
      console.log("🚀 ~ ajouterCommande ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }

  /**
   * Affiche la notification, le setTimeout est necessaire (les notifications ne s'affichent pas sans)
   * @param notification 
   */
  const displayNotification = (notification: INotification) => {
    setNotification(notification)
    setTimeout(() => {
      showNotification();
    }, 5);
  }

  useEffect(() => {
    recupToutesLesCommandes()
  }, [])



  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (audioRef.current) {
  //       if (isPlaying) {
  //         audioRef.current.pause();
  //       } else {
  //         audioRef.current.play();
  //       }
  //       setIsPlaying(!isPlaying);
  //     }
  //   }, 5000); // chaque seconde

  //   // Cleanup pour éviter les fuites de mémoire
  //   return () => clearInterval(interval);
  // }, [isPlaying]); // Ajouter isPlaying comme dépendance pour que l'effet se déclenche chaque fois que isPlaying change

  const isTimeForAlert = checkCommandesForAlarm(listeCommandeParSite)
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     if (isTimeForAlert) {
  //       console.log("🚀 ~ interval ~ isTimeForAlert:", isTimeForAlert)
  //       // Si la condition est remplie, on déclenche l'alarme
  //       if (audioRef.current) {
  //         if (!isPlaying) {
  //           audioRef.current.play();
  //           setIsPlaying(true); // Alarme activée
  //         }
  //       }
  //     } else {
  //       // Si la condition n'est plus remplie, on arrête l'alarme
  //       if (audioRef.current && isPlaying) {
  //         audioRef.current.pause();
  //         setIsPlaying(false); // Alarme désactivée
  //       }
  //     }
  //   }, 5000); // Vérifier toutes les secondes


  //   // Cleanup pour éviter les fuites de mémoire
  //   return () => clearInterval(interval);

  // }, [listeCommandeParSite, isPlaying]); // Ajouter data et isPlaying comme dépendances pour que l'effet se déclenche à chaque changement


  const alarmPlaying = useRef<boolean>(false); // Pour suivre l'état de l'alarme

  // Joue le son d'alarme
  const playAlarm = () => {
    if (!alarmPlaying.current && audioRef.current) {
      audioRef.current.play();
      audioRef.current.loop = true; // Joue en boucle
      alarmPlaying.current = true;
    }
  };

  // Arrête le son d'alarme
  const stopAlarm = () => {
    if (alarmPlaying.current && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Réinitialise l'audio
      alarmPlaying.current = false;
    }
  };
  // Vérifie les commandes périodiquement
  useEffect(() => {
    const checkCommandes = () => {
      const now = new Date();
      let hasExpiredCommande = false;
  
      listeCommandes.forEach((commande) => {
        if (commande.etatCommande === "reçu") {
          const commandeDate = new Date(commande.dateCommande);
          const diffInMinutes = (now.getTime() - commandeDate.getTime()) / 1000 / 60;
  
          if (diffInMinutes > 2) {
            hasExpiredCommande = true;
          }
        }
      });
  
      if (hasExpiredCommande) {
        playAlarm();
      } else {
        stopAlarm();
      }
    };
  
    // Appelle immédiatement la vérification au chargement
    checkCommandes();
  
    // Vérifie toutes les secondes
    const interval = setInterval(() => {
      checkCommandes();
    }, 1000);
  
    return () => clearInterval(interval); // Nettoie l'intervalle
  }, [listeCommandes]);
  

  // Cette fonction est appelée lorsque la musique finit de jouer
  const handleEnd = () => {
    setIsPlaying(false);  // Repasse à "Play" lorsque la musique est terminée
  };

  return (
    <>
      {
        connectionInfo?.nomRole === "Admin"
          ?
          <div className='flex flex-row-reverse'>
            <CustomSelect
              id="siteId"
              label="Site de la pizzeria"
              valuesSelected={rechercheForm.siteId}
              onChange={handleChange}
              data={sites}
              keys={["siteId", "nomSite"]}
              className='w-56 mt-4'
            />
          </div>
          :
          <div className='flex flex-row-reverse text-black mt-4 text-base'>{connectionInfo.nomSite}</div>

      }
      {
        isTimeForAlert &&
        <Alert variant="soft-warning" className="my-2">
          Des commandes reçues n'ont pas encore été validées
        </Alert>
      }
      <div className="flex flex-col items-center mt-8  sm:flex-row">

        <h2 className="mr-auto text-lg font-medium">Liste des commandes</h2>


        <audio ref={audioRef} src={ringTone} onEnded={handleEnd}  // Ajout de l'événement onEnded
        />
        <button onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="mt-2 sm:mt-0">
          <Tab.Group className="col-span-12 lg:col-span-3 2xl:col-span-3">
            <div className="pr-1 intro-y">
              <div className="p-1 box">
                <Tab.List variant="pills">
                  {tabsData.map(onglet => (
                    <Tab key={onglet.id} >
                      <Tab.Button
                        className={`w-full flex py-2 text-xs sm:text-sm truncate `}
                        as="button"
                        onClick={() => handleTabSelect(onglet.id)}
                      >
                        {onglet.label} <span className='hidden sm:block'> ( {onglet.count} )</span>
                      </Tab.Button>
                    </Tab>
                  ))}
                </Tab.List>
              </div>
            </div>

          </Tab.Group>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-5 ">
        {
          commandesTriees
            .map((item, index) => (
              <div key={index} className="col-span-12 2xl:col-span-6">
                <CommandeCard
                  etat={etat}
                  gestionEtatCommande={gestionEtatCommande}
                  index={index}
                  item={item}
                  setCommandeSelectionne={setCommandeSelectionne}
                  setOpenAnnulerCommandeConfirmBox={setOpenAnnulerCommandeConfirmBox}
                  setOpenDialogAttribuerPizza={setOpenDialogAttribuerPizza}
                  key={index}
                  loading={loading}
                  setIndexSelected={setIndexSelected}
                  indexSelected={indexSelected}
                />
                {/* {CommandeCard({ item, index, etat, gestionEtatCommande, setCommandeSelectionne, setOpenAnnulerCommandeConfirmBox, setOpenDialogAttribuerPizza })} */}
              </div>
            ))
        }

        {/* BEGIN: Pagination */}
        <div className="col-span-12">
          <div className='flex mr-2 justify-end items-center'>
            <Pagination
              pageIndex={pageIndex!}
              setPageIndex={setPageIndex!}
              pageCount={Math.ceil(pageCount!)}
            />
          </div>
        </div>
        {/* END: Pagination */}
      </div>

      {/* BEGIN: Attribuer commande Modal */}
      <DialogBox
        dialogProps={{
          dialogTitle: "Attribuer la commande à une pizzeria",
          dialogSubTitle: "",
          iconSvg: <></>,
          dialogFooterButtonTitle: "Attribuer",
          handleCloseDialog: handleCloseDialogAttribuerPizza,
          disable: pizzeriaSelectionne === 0,
          loading: loading,
          openDialog: openDialogAttribuerPizza,
          onButtonAnnulerClick: handleCloseDialogAttribuerPizza,
          onButtonSaveClick: () => attribuerCommande(commandeSelectionne?.commandeId || 0),
          dialogBoxContentHeader: "",
          dialogBoxContent:
            <div className="w-full h-auto rounded-lg rounded-t-lg overflow-y-auto">
              <CustomSelect
                id="siteId"
                label="Choix du site de la pizzeria"
                valuesSelected={pizzeriaSelectionne}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPizzeriaSelectionne(Number(e.target.value))}
                data={sites}
                keys={["siteId", "nomSite"]}
                className='w-full'
              />
            </div>,
          handleSearch: () => null,
          size: "md",
          height: "1/2"
        }}
      />
      {/* END: Annuler commande confirm box */}

      <ConfirmeBox
        confirmBoxProps={{
          intitule: `Voulez-vous vraiment annuler la commande ${commandeSelectionne?.commandeId} ?`,
          handleConfirme: () => annulerCommande(commandeSelectionne?.commandeId || 0),
          loading: loading,
          buttonSaveLabel: "Confirmer",
          type: "danger",
          openConfirmeBox: openAnnulerCommandeConfirmBox,
          handleCloseConfirmeBox: () => {
            setOpenAnnulerCommandeConfirmBox(false);
            setLoading(false)
          },
        }}
      />

      <CustomNotification
        message={notification?.content}
        notificationRef={notificationRef}
        title={"Info"}
        type={notification?.type}
      />
    </>
  )
}

export default GestionCommandes
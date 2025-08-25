import CryptoJS from "crypto-js";
import { z } from "zod";
import { IAppState, IClientPointFidelite, setClientPointFidelite, setPizzaGratosAlreadyUsed } from "../store/appSlice";
import { ICartState, setCart } from "../store/cartSlice";
import { IBoisson, ICommandeDetail, ICondiment, IPizzaItem, IPlatItem, ISupplement } from "../store/interfaces";
import { setListePizza, setListePlat, setListePlatsDuJour } from "../store/menuSlice";
import { IPizzaAccompagnementState, setAccompagnement, setBoisson, setCondiment, setPate, setPizzaFormat, setSupplement, setViande } from "../store/pizzaAccompagnementSlice";
import { store } from "../store/store";
import { apiClient } from "./apiClient";
import { sessionId } from "./constant";
import { setPointLivraison } from "../store/pointLivraisonSlice";

export default function ncNanoId(prefix = "nc_") {
  return (
    prefix + Date.now() + "_" + Math.floor(Math.random() * 999999999999999)
  );
}

export const formatTime = (date: any) => {
  console.log("🚀 ~ formatTime ~ date>>>>>>>>>>>>>>>>>>>>>>>>>>:", date)
  // Vérifier si la date est vide ou non définie
  if (!date) {
    return "__:__";
  }

  return date
};

export interface InviewPortType {
  callback: () => void;
  target: HTMLElement;
  options: IntersectionObserverInit | undefined;
  freezeOnceVisible: boolean;
}

/**
 * Fonction pour observer un élément DOM et exécuter une fonction de rappel 
 * lorsqu'il entre dans la zone visible définie par les options.
 * Utilise l'API IntersectionObserver, avec une option pour arrêter 
 * l'observation une fois que l'élément est visible.
 *
 * @param {HTMLElement} target - L'élément DOM à observer.
 * @param {object} options - Options de l'IntersectionObserver (root, rootMargin, threshold).
 * @param {Function} callback - Fonction exécutée lorsque l'élément devient visible.
 * @param {boolean} freezeOnceVisible - Si true, arrête l'observation après la première intersection.
 */
export const checkInViewIntersectionObserver = ({
  target, // Élément DOM que nous voulons observer
  options = { root: null, rootMargin: `0%`, threshold: 0 }, // Options de configuration de l'IntersectionObserver
  callback, // Fonction appelée lorsque la condition d'intersection est remplie
  freezeOnceVisible = false, // Si vrai, l'observation s'arrête une fois que l'élément est visible
}: InviewPortType) => {
  // Fonction de rappel utilisée par l'IntersectionObserver
  const _funCallback: IntersectionObserverCallback = (
    entries: IntersectionObserverEntry[], // Entrées observées
    observer: IntersectionObserver // Instance de l'observateur
  ) => {
    // Parcours de chaque entrée d'intersection
    entries.map((entry: IntersectionObserverEntry) => {
      // Vérifie si l'élément est en intersection (visible)
      if (entry.isIntersecting) {
        // Appelle la fonction de rappel utilisateur
        callback();
        // Si l'option freezeOnceVisible est activée, on arrête l'observation
        if (freezeOnceVisible) {
          observer.unobserve(entry.target);
        }
      }
      return true;
    });
  };

  // Vérifie si le navigateur prend en charge IntersectionObserver
  if (typeof window.IntersectionObserver === "undefined") {
    console.error(
      "window.IntersectionObserver === undefined! => Votre navigateur ne supporte pas cette fonctionnalité."
    );
    return;
  }

  // Crée un nouvel observateur avec la fonction de rappel et les options fournies
  const observer = new IntersectionObserver(_funCallback, options);

  // Démarre l'observation de l'élément cible s'il est défini
  target && observer.observe(target);
};

export const twFocusClass = (hasRing = false) => {
  if (!hasRing) {
    return "focus:outline-none";
  }
  return "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0";
}

export function formatMontantFCFA(montant: number) {
  // Convertit le montant en chaîne avec séparateurs de milliers
  return montant.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'XOF', // XOF correspond à la devise FCFA
    minimumFractionDigits: 0, // Pas de chiffres après la virgule
    maximumFractionDigits: 0, // Pas de chiffres après la virgule
  }).replace('XOF', 'FCFA'); // Remplace XOF par FCFA si nécessaire
}


interface IFormatListeSupplement {
  label: string;
  data: ISupplementData[];
}

interface ISupplementData {
  supplementId: number;
  nomSupplement: string;
  prixSupplement: string;
}
/**
 * Formate la liste des supplments venus de la base et la rend selon l'interface pour l'affiche dans le combo par categorie
 * @param data 
 * @returns 
 */
export const formatListeSupplement = (data: any[]): IFormatListeSupplement[] => {
  // Créer un objet pour regrouper les commandes par commandeId
  const supplementsMap: Record<number, IFormatListeSupplement> = {};

  data.forEach((item) => {
    // Si la commandeId n'existe pas encore dans le map, on la crée
    if (!supplementsMap[item.categorieSupplementId]) {
      supplementsMap[item.categorieSupplementId] = {
        label: item.nomCategorieSupplement,
        data: [],
      };
    }

    // Ajouter le détail de la boisson à l'entrée correspondante
    supplementsMap[item.categorieSupplementId].data.push({
      supplementId: item.supplementId,
      nomSupplement: item.nomSupplement,
      prixSupplement: item.prixSupplement
    });
  });

  // Retourner un tableau des commandes formatées
  return Object.values(supplementsMap);
}

type FormErrors = Record<string, string>;
/**
 * Extrait les messages d'erreur d'une instance ZodError.
 * @param error - L'instance de ZodError
 * @returns Un objet contenant les erreurs, avec les noms des champs comme clés et les messages d'erreur comme valeurs.
 */
export const extractZodErrors = (error: unknown): FormErrors => {
  if (error instanceof z.ZodError) {
    const errors: FormErrors = {};
    error?.errors?.forEach((err) => {
      const fieldName = err.path[0] as string; // On suppose que les chemins sont des clés de premier niveau.
      errors[fieldName] = err.message;
    });
    return errors;
  }
  return {};
};

/**
 * On récupère le prix de la pizza à partir de l'identifiant la pizza, pizzaFormat contient la liste des pizza etleurs prix par format
 * @param pizzaFormatId 
 * @returns 
 */
export const recupPrixPizzaFormat = (pizzaFormatId: number) => {
  const pizzaAccompagnement = store?.getState()?.pizzaAccompagnement as IPizzaAccompagnementState;
  const { pizzaFormat } = pizzaAccompagnement
  console.log("🚀 ~ recupPrixPizzaFormat ~ pizzaFormat:", pizzaFormat)
  return pizzaFormat.find(item => item.pizzaFormatId === pizzaFormatId)?.prixPizzaFormat || 0
}

/**
 * On récupère l'identifiant du format de la pizza parceque pizza et format font une table composée   à partir de l'identifiant la pizza, pizzaFormat contient la liste des pizza etleurs prix par format
 * @param pizzaId 
 * @returns 
 */
export const recupPizzaFormatByPizzaId = (pizzaId: number) => {
  const pizzaAccompagnement = store?.getState()?.pizzaAccompagnement as IPizzaAccompagnementState;
  const { pizzaFormat } = pizzaAccompagnement
  return pizzaFormat.find(item => item.pizzaId === pizzaId)
}


export const recupPateByPateId = (pateId: number) => {
  const pizzaAccompagnement = store?.getState()?.pizzaAccompagnement as IPizzaAccompagnementState;
  const { pate } = pizzaAccompagnement
  return pate.find(item => item.pateId === pateId)
}

export const recupViandeByViandeId = (viandeId: number) => {
  const pizzaAccompagnement = store?.getState()?.pizzaAccompagnement as IPizzaAccompagnementState;
  const { viande } = pizzaAccompagnement
  return viande.find(item => item.viandeId === viandeId)
}

export const recupViandeByAccompagnementId = (accompagnementId: number) => {
  const pizzaAccompagnement = store?.getState()?.pizzaAccompagnement as IPizzaAccompagnementState;
  const { accompagnement } = pizzaAccompagnement
  return accompagnement.find(item => item.accompagnementId === accompagnementId)
}

// On récupère le prix de la pizza  à partir du format sélectionné
/**
 * On récupère le prix de livraison de la pizza en fonction de l'identifiant du point de livraison
 * @param idPointLivraison 
 * @returns 
 */
// export const recupPrixLivraison = (idPointLivraison: number) => {
//   const menu = store?.getState()?.menu as IMenuState;
//   const { pointLivraison } = menu
//   return pointLivraison.find(item => item.idPointLivraison === idPointLivraison)?.prixPointLivraison || 0
// }

/**
 * On récupère le prix de la pizza à partir de l'identifiant la pizza
 * Puisque chaque pizza à plusieurs formats notamment plusieurs prix alors
 * on récupère le premier prix de la pizza le format sall pour afficher
 * par defaut sur le sur le site en bas de chaque pizza
 * @param pizzaId 
 * @returns 
 */
export const recupPrixPizza = (pizzaId: number) => {
  const pizzaAccompagnement = store?.getState()?.pizzaAccompagnement as IPizzaAccompagnementState;
  const { pizzaFormat } = pizzaAccompagnement
  return pizzaFormat.find(item => item.pizzaId === pizzaId)?.prixPizzaFormat || 0
}

// On récupère le prix de la pizza en fonction à partir du format sélectionné
/**
 * C'est une fonction générique recupère l'information du pizza en fonction des paramètres passés
 * @param id Reprensente ce qu'on compare à dataKey pour prendre ce qu'on a trouvé
 * @param data reprensente la donnée dans laquelle on veut prendre l'information
 * @param dataKey reprensente la clé dans la donnée sur laquelle on se base pour comparer
 * @param dataValue reprensente l'information qu'on veut récuperer soir prix ou libellé
 * @returns 
 */
export const recupPizzaInfo = (id: number, data: any[], dataKey: string, dataValue: string) => {
  return data.find((item: any) => item[dataKey] === id)[dataValue] || 0
}

export const calculerSiMontantCommandeSupA4500 = (data: ICommandeDetail[]): boolean => {
  // Filtrer uniquement les pizzas
  const total = data
    .filter(pizza => pizza.estUnePizza === 1) // Vérifier si c'est une pizza
    .reduce((total, pizza) => {
      return total + pizza.prixPizzaFormat * pizza.quantiteCommande;
    }, 0);

  // Retourner true si le total est supérieur ou égal à 4500
  return total >= 4500;
};


export const calculerLePrixTotalDuneCommande = (
  data: ICommandeDetail[],
  options: {
    useActualPrices?: boolean; // Indique si on doit utiliser les prix actuels
  } = {}
): number => {
  const { useActualPrices = false } = options;

  // Utiliser reduce pour accumuler le total
  const total = data.reduce((total, pizza) => {
    // Calculer le total des boissons
    const boissonsTotal = pizza.commandeBoissons.reduce(
      (sum, boisson) =>
        sum + (useActualPrices ? boisson?.prixBoissonActuel || 0 : boisson.prixBoisson),
      0
    );

    // Calculer le total des suppléments
    const supplementsTotal = pizza.commandeSupplements.reduce(
      (sum, supplement) =>
        sum + (useActualPrices ? supplement?.prixSupplementActuel || 0 : supplement.prixSupplement),
      0
    );

    // Ajouter le prix de la pizza avec quantité
    const prixPizza = useActualPrices
      ? pizza.prixFormatActuel
      : pizza.prixPizzaFormat;

    return total + boissonsTotal + supplementsTotal + prixPizza * pizza.quantiteCommande;
  }, 0);

  // Retourner le montant total calculé
  return total;
};


// export const calculerLePrixTotalDuneCommandex = (data: ICommandeDetail[]): number => {
//   // Utiliser reduce pour accumuler le total à travers toutes les pizzas
//   const total = data.reduce((total, pizza) => {
//     // Calculer le total des boissons pour une pizza
//     const boissonsTotal = pizza.commandeBoissons.reduce(
//       (sum, boisson) => sum + (boisson?.prixBoissonActuel || 0), // Ajouter le prix de chaque boisson
//       0 // Initialiser la somme des boissons à 0
//     );

//     // Calculer le total des suppléments pour une pizza
//     const supplementsTotal = pizza.commandeSupplements.reduce(
//       (sum, supplement) => sum + (supplement?.prixSupplementActuel || 0), // Ajouter le prix de chaque supplément
//       0 // Initialiser la somme des suppléments à 0
//     );

//     // Ajouter le prix format (prix de la pizza) au total
//     // et y inclure les totaux des boissons et des suppléments
//     return total + boissonsTotal + supplementsTotal + (pizza.prixFormatActuel * pizza.quantiteCommande);
//   }, 0); // Initialiser le total global à 0

//   // Retourner le montant total calculé
//   return total;
// };

export type CategoryGroup = {
  categoriePizzaId: number; // Identifiant unique de la catégorie de pizza
  libelleCategoriePizza: string; // Libellé de la catégorie de pizza
  pizzas: Omit<IPizzaItem, 'categoriePizzaId' | 'libelleCategoriePizza'>[]; // Liste des pizzas, sans les champs de catégorie
};

export type CategoryGroupPlat = {
  platDuJour: number; // Identifiant unique de la catégorie de pizza
  libelleCategoriePlat: string; // Identifiant unique de la catégorie de pizza
  plats: Omit<IPlatItem, 'platDuJour'>[]; // Liste des pizzas, sans les champs de catégorie; // Liste des pizzas, sans les champs de catégorie
};

export const grouperListePizzasParCategorie = (pizzas: IPizzaItem[]): CategoryGroup[] => {
  // Utilisation de reduce pour regrouper les pizzas par leur identifiant de catégorie
  const groupedByCategory = pizzas.reduce(
    (acc: { [key: number]: CategoryGroup }, pizza: IPizzaItem) => {
      // Déstructuration de l'objet pizza pour séparer les informations de catégorie des autres détails
      const { categoriePizzaId, libelleCategoriePizza, ...pizzaDetails } = pizza;

      // Si la catégorie n'existe pas encore dans l'accumulateur, on la crée
      if (!acc[categoriePizzaId]) {
        acc[categoriePizzaId] = {
          categoriePizzaId, // Identifiant de la catégorie
          libelleCategoriePizza, // Libellé de la catégorie
          pizzas: [] // Initialisation de la liste des pizzas
        };
      }

      // Ajout des détails de la pizza (sans les infos de catégorie) à la catégorie correspondante
      acc[categoriePizzaId].pizzas.push(pizzaDetails);
      return acc; // Retourne l'accumulateur mis à jour
    },
    {} // Initialisation de l'accumulateur en tant qu'objet vide
  );

  // Retourne un tableau des catégories regroupées en utilisant Object.values
  return Object.values(groupedByCategory);
};

export const grouperListePlatsParCategorie = (plats: IPlatItem[]): CategoryGroupPlat[] => {
  // Utilisation de reduce pour regrouper les pizzas par leur identifiant de catégorie
  const groupedByCategory = plats.reduce(
    (acc: { [key: number]: CategoryGroupPlat }, pizza: IPlatItem) => {
      // Déstructuration de l'objet pizza pour séparer les informations de catégorie des autres détails
      const { platDuJour, ...platDetails } = pizza;

      // Si la catégorie n'existe pas encore dans l'accumulateur, on la crée
      if (!acc[platDuJour]) {
        acc[platDuJour] = {
          platDuJour, // Identifiant de la catégorie
          libelleCategoriePlat: platDuJour === 1 ? "Plats du jour" : "Nos plats", // Libellé de la catégorie
          plats: [] // Initialisation de la liste des pizzas
        };
      }

      // Ajout des détails de la pizza (sans les infos de catégorie) à la catégorie correspondante
      acc[platDuJour].plats.push(platDetails);
      return acc; // Retourne l'accumulateur mis à jour
    },
    {} // Initialisation de l'accumulateur en tant qu'objet vide
  );

  // Retourne un tableau des catégories regroupées en utilisant Object.values
  return Object.values(groupedByCategory);
};

export const convertDateToLocaleStringDateTime = (date: any) => {
  return new Date(date).toLocaleString("fr-FR", {
    timeZone: "UTC",
    month: "numeric",
    day: "numeric",
    year: "numeric",
    minute: "numeric",
    hour: "numeric",
    second: "2-digit",
  })
}

export const convertDateToLocaleStringDate = (date: any) => {
  return new Date(date).toLocaleString("fr-FR", {
    timeZone: "UTC",
    month: "numeric",
    day: "numeric",
    year: "numeric",
  })
}

// Fonction pour récupérer la date du jour au format YYYY-MM-DD
export const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0]; // Extrait "YYYY-MM-DD"
};

//Crypter les payloads qui par du front
export const encryptPayload = (data: any): string => {

  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), sessionId).toString();
  return ciphertext
};

//Decrypter le resultat qui vient du back
export function decryptPayload(data: any) {
  const bytes = CryptoJS.AES.decrypt(data, sessionId);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData
}


export const recupAllDataAboutPizza = async (setLoading?: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading && setLoading(true)
    const [
      resPlatJour,
      resListePizza,
      resCondiment,
      resFormat,
      resPate,
      resViande,
      resSupplement,
      resAccompagnement,
      resBoisson,
      resPointLivraison,
    ] = await Promise.all([
      apiClient.get("/recup_plat_du_jour"),
      apiClient.get("/recup_liste_pizza"),
      apiClient.get("/recup_condiment"),
      apiClient.get("/recup_pizza_format"),
      apiClient.get("/recup_pate"),
      apiClient.get(`/recup_viande`),
      apiClient.get(`/recup_supplement`),
      apiClient.get(`/recup_accompagnement`),
      apiClient.get(`/recup_boisson`),
      apiClient.get(`/recup_point_livraison`),
    ]);

    store.dispatch(setListePlatsDuJour(resPlatJour.status ? resPlatJour?.data : []))
    store.dispatch(setListePizza(resListePizza.status ? resListePizza?.data : []))
    store.dispatch(setCondiment(resCondiment.status ? resCondiment?.data : []))
    store.dispatch(setPizzaFormat(resFormat.status ? resFormat?.data : []))
    store.dispatch(setPate(resPate.status ? resPate?.data : []))
    store.dispatch(setViande(resViande.status ? resViande?.data : []))
    store.dispatch(setSupplement(resSupplement.status ? resSupplement?.data : []))
    store.dispatch(setAccompagnement(resAccompagnement.status ? resAccompagnement?.data : []))
    store.dispatch(setBoisson(resBoisson.status ? resBoisson?.data : []))
    store.dispatch(setPointLivraison(resPointLivraison.status ? resPointLivraison?.data : []))
    console.log("🚀 ~ recupAllDataAboutPizza ~ resSupplement:", resSupplement)
    console.log("🚀 ~ recupAllDataAboutPizza ~ resListePizza:", resListePizza)

  } catch (error) {
    console.log("🚀 ~ recupAllDataAboutPizza ~ error:", error)
  } finally {
    setLoading && setLoading(false)
  }
}

export const recupAllDataAboutPlat = async (setLoading?: React.Dispatch<React.SetStateAction<boolean>>) => {
  try {
    setLoading && setLoading(true)
    const [
      resListePlat,
      resAccompagnement,
      resBoisson,
      resPointLivraison,
    ] = await Promise.all([
      apiClient.get("/recup_liste_plat"),
      apiClient.get("/recup_accompagnement"),
      apiClient.get(`/recup_boisson`),
      apiClient.get(`/recup_point_livraison`),
    ]);

    store.dispatch(setListePlat(resListePlat.status ? resListePlat?.data : []))
    store.dispatch(setAccompagnement(resAccompagnement.status ? resAccompagnement?.data : []))
    store.dispatch(setBoisson(resBoisson.status ? resBoisson?.data : []))
    store.dispatch(setPointLivraison(resPointLivraison.status ? resPointLivraison?.data : []))

  } catch (error) {
    console.log("🚀 ~ recupAllDataAboutPizza ~ error:", error)
  } finally {
    setLoading && setLoading(false)
  }
}

export const recupClientPointFidelite = async () => {
  try {
    const { userConnectedInfo } = store?.getState()?.application as IAppState;
    const res = await apiClient.get(`/recupclientpointfidelite/${userConnectedInfo?.clientId}`);
    if (!res?.status) throw res?.error
    const data = res?.data as IClientPointFidelite
    store.dispatch(setClientPointFidelite(data))
  } catch (error) {
    console.log("🚀 ~ recupClientPointFidelite ~ error:", error)
  }
}

export const hasProperties = (obj: object): boolean => {
  return Object.keys(obj).length > 0;
};

/**
 * Vérifier que la date ne passe plus 1 an à partir de maintenant
 * @param dateToCheck 
 * @returns 
 */
export const isDateWithinLastYearFromToday = (dateToCheck: Date) => {
  const now = new Date(); // Date actuelle
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1); // Date d'il y a un an

  const inputDate = new Date(dateToCheck); // Convertir la date fournie en objet Date

  // Vérifie si la date est entre il y a un an et aujourd'hui
  return inputDate >= oneYearAgo && inputDate <= now;
};

export const addPizzaInCart = (
  choixPizzaSelectionnee: ICommandeDetail,
  commandeBoisson: IBoisson[],
  commandeSupplement: ISupplement[],
  setCommandeBoisson: React.Dispatch<React.SetStateAction<IBoisson[]>>,
  setCommandeSupplement: React.Dispatch<React.SetStateAction<ISupplement[]>>,
  setCommandeCondiment: React.Dispatch<React.SetStateAction<ICondiment[]>>,
  commandeCondiment: ICondiment[]
) => {
  const { clientPointFidelite } = store?.getState()?.application as IAppState;
  const { cart } = store?.getState()?.cart as ICartState;
  const { pizzaGratosAlreadyUsed, } = store?.getState()?.application as IAppState;

  let pizzaGratos = false
  // Si le client est inscrit au programme de fidélité
  if (clientPointFidelite && clientPointFidelite?.clientId) {
    if (
      !pizzaGratosAlreadyUsed &&
      choixPizzaSelectionnee?.nomFormat === "Regular" &&
      isDateWithinLastYearFromToday(clientPointFidelite?.dateInscriptionFidelite) &&
      clientPointFidelite?.point >= 60
    ) {
      pizzaGratos = true
      store.dispatch(setPizzaGratosAlreadyUsed(true))
    }
  }
  store.dispatch(setCart({
    commandeDetails: [
      {
        ...choixPizzaSelectionnee,
        prixPizzaFormat: pizzaGratos ? 0 : recupPrixPizzaFormat(Number(choixPizzaSelectionnee.pizzaFormatId)),
        prixFormatActuel: pizzaGratos ? 0 : recupPrixPizzaFormat(Number(choixPizzaSelectionnee.pizzaFormatId)),
        commandeBoissons: pizzaGratos ? [] : commandeBoisson,
        commandeSupplements: pizzaGratos ? [] : commandeSupplement,
        commandeCondiments: commandeCondiment,
        pizzaGratos
      },
      ...cart.commandeDetails,
    ],
  }))
  setCommandeSupplement([])
  setCommandeBoisson([])
  setCommandeCondiment([])
}

export const handleOpenModalChoixComplementPizza = (item: any, setOpenModal: React.Dispatch<React.SetStateAction<boolean>>, setChoixPizzaSelectionnee: React.Dispatch<React.SetStateAction<ICommandeDetail>>) => {
  setOpenModal(true);
  setChoixPizzaSelectionnee(prev => ({
    ...prev,
    ...item,
    pizzaFormatId: recupPizzaFormatByPizzaId(item.pizzaId)?.pizzaFormatId,
    prixPizzaFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.prixPizzaFormat,
    nomFormat: recupPizzaFormatByPizzaId(item.pizzaId)?.nomFormat,
    nomPate: recupPateByPateId(prev.pateId)?.nomPate,
    nomViande: prev.viandeId ? recupViandeByViandeId(prev.viandeId)?.nomViande : "",
    nomAccompagnement: prev.accompagnementId ? recupViandeByAccompagnementId(prev.accompagnementId)?.nomAccompagnement : "",
  }));
}

export const generateRandomCode = (): string => {
  const min = 1000; // Plus petit nombre à 4 chiffres
  const max = 9999; // Plus grand nombre à 4 chiffres
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomCode.toString();
}

export const normalizeString = (str: string) =>
  str
    .normalize("NFD") // Décompose les accents en caractères de base + diacritiques
    .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques

// Fonction pour obtenir le temps restant jusqu'à la fermeture (22h45)
const getRemainingTime = (date: Date): string | null => {
  const closeHour = 23;
  const closeMinute = 45;

  const closeDate = new Date(date);
  closeDate.setHours(closeHour, closeMinute, 0, 0); // Définit l'heure de fermeture à 22h45

  const timeDifference = closeDate.getTime() - date.getTime(); // Différence en millisecondes

  if (timeDifference <= 0) return null; // La commande est déjà fermée

  const minutesRemaining = Math.ceil(timeDifference / (1000 * 60)); // Convertir en minutes

  // Calculer les minutes restantes et formater l'affichage
  return minutesRemaining <= 60 ? `${minutesRemaining} minutes` : null;
};

// Fonction combinée pour vérifier l'état de la commande
export const getCommandStatus = (date: Date): { isOpen: boolean; timeRemaining: string | null } => {
  const hours = date.getHours();
  console.log("🚀 ~ getCommandStatus ~ hours:", hours);
  const minutes = date.getMinutes();

  // Commande ouverte entre 11h30 et 23h45
  const isOpen = (hours > 11 || (hours === 11 && minutes >= 30)) && (hours < 23 || (hours === 23 && minutes <= 45));

  // Calculer le temps restant pour l'alerte si la commande est ouverte
  const timeRemaining = isOpen ? getRemainingTime(date) : null;

  return { isOpen, timeRemaining };
};


export const filterByDate = (data: IPizzaItem[], date: string): IPizzaItem[] => {
  const targetDate = new Date(date);

  return data.filter(item => {
      const itemDate = new Date(item.dateHeurPlatDuJour);

      // Comparer uniquement l'année, le mois et le jour
      return (
          itemDate.getUTCFullYear() === targetDate.getUTCFullYear() &&
          itemDate.getUTCMonth() === targetDate.getUTCMonth() &&
          itemDate.getUTCDate() === targetDate.getUTCDate()
      );
  });
}

export const isToday = (date: Date): boolean => {
  const today = new Date();
  
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}
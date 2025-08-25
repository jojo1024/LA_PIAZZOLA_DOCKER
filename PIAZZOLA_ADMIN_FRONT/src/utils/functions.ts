import CryptoJS from "crypto-js";
import { ICommandeDetail, IListeCommandeItem } from "../stores/commandeSlice";
import { IListePizzaItem, IListePizzaItemFormated } from "../stores/menuSlice";
import { sessionId } from "./constants";
import { store } from "../stores/store";
import { IAppState } from "../stores/appSlice";
import { apiClient } from "./apiClient";
import { ISite, setListeSites } from "../stores/gestionSiteWebSlice";

export const calculerPrixTotalDuneCommande = (data: ICommandeDetail[]): number => {
    // Utiliser reduce pour accumuler le total à travers toutes les pizzas
    const total = data.reduce((total, pizza) => {
        // Calculer le total des boissons pour une pizza
        const boissonsTotal = pizza.commandeBoissons.reduce(
            (sum, boisson) => sum + boisson.prixBoissonActuel, // Ajouter le prix de chaque boisson
            0 // Initialiser la somme des boissons à 0
        );

        // Calculer le total des suppléments pour une pizza
        const supplementsTotal = pizza.commandeSupplements.reduce(
            (sum, supplement) => sum + supplement.prixSupplementActuel, // Ajouter le prix de chaque supplément
            0 // Initialiser la somme des suppléments à 0
        );

        // Ajouter le prix format (prix de la pizza) au total
        // et y inclure les totaux des boissons et des suppléments
        return total + boissonsTotal + supplementsTotal + (pizza.prixFormatActuel * pizza.quantiteCommande);
    }, 0); // Initialiser le total global à 0

    // Retourner le montant total calculé
    return total || 0;
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

export function formatMontantFCFA(montant: number) {
    // Convertit le montant en chaîne avec séparateurs de milliers
    return montant.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'XOF', // XOF correspond à la devise FCFA
        minimumFractionDigits: 0, // Pas de chiffres après la virgule
        maximumFractionDigits: 0, // Pas de chiffres après la virgule
    }).replace('XOF', 'FCFA'); // Remplace XOF par FCFA si nécessaire
}



export const formatPizzaData = (data: IListePizzaItem[]): IListePizzaItemFormated[] => {
    const groupedPizzas: { [key: string]: IListePizzaItemFormated } = {};

    data.forEach((item) => {
        // Vérifie si la pizza est déjà dans le groupe
        if (!groupedPizzas[item.pizzaId]) {
            // @ts-ignore
            groupedPizzas[item.pizzaId] = {
                ...item,
                pizzaFormat: [],
            };
        }

        // Ajoute le format pizzaId le prix à la pizza correspondante
        groupedPizzas[item.pizzaId].pizzaFormat.push({
            pizzaFormatId: item.pizzaFormatId,
            formatId: item.formatId,
            nomFormat: item.nomFormat,
            prixPizzaFormat: item.prixPizzaFormat,

        });
    });

    // Retourne un tableau à partir des objets groupés
    return Object.values(groupedPizzas);
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

export const checkCommandesForAlarm = (data: IListeCommandeItem[]) => {
    const currentTime = new Date(); // L'heure actuelle
    let shouldTriggerAlarm = false; // Variable pour savoir si l'alarme doit se déclencher

    data.forEach(commande => {
        // Convertir la date de commande en objet Date
        const commandeDate = new Date(commande.dateCommande);

        // Vérifier si la date est valide
        if (isNaN(commandeDate.getTime())) {
            console.error("Date invalide pour la commande:", commande.dateCommande);
            return;  // Ignore cette commande si la date est invalide
        }

        // Calculer la différence de temps en minutes
        const timeDifference: number = (currentTime.getTime() - commandeDate.getTime()) / 1000 / 60; // Différence en minutes

        // Vérifie si la commande est reçue et si la différence de temps est supérieure à 2 minutes
        if (commande.etatCommande === 'reçu' && timeDifference > 2) {
            shouldTriggerAlarm = true; // Si la condition est remplie, on déclenche l'alarme
        }
    });

    return shouldTriggerAlarm;
};

export const userHasRight = (right: string) => {
    console.log("🚀 ~ userHasRight ~ right:", right)
    const appState = store?.getState()?.application as IAppState;
    const connectionInfo = appState?.connectionInfo;
    if (connectionInfo.nomRole === "Admin") return true
    return connectionInfo.nomRole === right ? true : false;
};


// Fonction de formatage des montants
export const formatMontant = (montant: number): string => {
    if (montant >= 1_000_000) {
        return `${(montant / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
    } else if (montant >= 1_000) {
        return `${(montant / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
    }
    return montant.toString();
};


// export interface DashboardStats {
//     nombreCommandes: number;
//     chiffreAffaireTotal: number;
//     nombreClients: number;
//     meilleursClients: Array<{
//         emailClient: string;
//         nombreCommandes: number;
//         nomUtilisateurClient: string;
//         telephoneClient: string;
//     }>;
//     pizzasLesPlusCommande: Array<{
//         nomPizza: string;
//         quantite: number;
//         descriptionPizza: string;
//         libImagePizza: string;
//     }>;
//     chiffreDaffaireParMois: {
//         labels: string[];
//         data: number[];
//         chiffreAffaireMoisActuel: number;
//         chiffreAffaireMoisPrecedent: number;
//     };
//     tauxCommande: number;
//     tauxChiffreAffaire: number;
//     tauxClients: number;
//     colorCommande: string;
//     colorChiffreAffaire: string;
//     colorClients: string;
// }

// export const calculerStats = (commandes: IListeCommandeItem[]): DashboardStats => {
//     console.log("🚀 ~ calculerStats ~ commandes:", commandes);

//     // Maps pour stocker les informations des clients et des pizzas
//     const clientsMap = new Map<string, { nombreCommandes: number, nomUtilisateurClient: string, telephoneClient: string, dateInscription: Date }>();
//     const pizzasMap = new Map<string, { quantite: number, descriptionPizza: string, libImagePizza: string }>();

//     // Tableau pour stocker le chiffre d'affaires par mois
//     const chiffreAffaireMois = Array(12).fill(0);

//     let nombreCommandes = 0;
//     let chiffreAffaireTotal = 0;

//     const now = new Date();
//     const moisActuel = now.getMonth(); // Mois en cours
//     const moisPrecedent = (moisActuel - 1 + 12) % 12; // Mois précédent (cycle de 12 mois)

//     commandes
//         .filter(commande => commande.etatCommande === "traité") // Filtrer les commandes traitées
//         .forEach(commande => {
//             nombreCommandes++; // Compter le nombre de commandes traitées

//             let chiffreAffaireCommande = commande.prixLivraisonActuel; // Commencer par le prix de livraison

//             // Parcours des détails de chaque commande pour calculer le chiffre d'affaire
//             commande.commandeDetails.forEach(detail => {
//                 chiffreAffaireCommande += detail.quantiteCommande * detail.prixFormatActuel; // Calcul du prix des pizzas
//                 chiffreAffaireCommande += detail.commandeSupplements.reduce((sum, supp) => sum + supp.prixSupplementActuel, 0); // Calcul des suppléments
//                 chiffreAffaireCommande += detail.commandeBoissons.reduce((sum, boisson) => sum + boisson.prixBoissonActuel, 0); // Calcul des boissons

//                 // Mise à jour des statistiques des pizzas
//                 const pizzaStats = pizzasMap.get(detail.nomPizza) || {
//                     quantite: 0,
//                     descriptionPizza: detail.descriptionPizza || '',
//                     libImagePizza: detail.libImagePizza || ''
//                 };
//                 pizzaStats.quantite += detail.quantiteCommande;
//                 pizzasMap.set(detail.nomPizza, pizzaStats);
//             });

//             chiffreAffaireTotal += chiffreAffaireCommande; // Ajout au chiffre d'affaires total

//             const moisCommande = new Date(commande.dateCommande).getMonth(); // Mois de la commande
//             chiffreAffaireMois[moisCommande] += chiffreAffaireCommande; // Ajout au chiffre d'affaires du mois

//             // Mise à jour des statistiques des clients
//             const clientStats = clientsMap.get(commande.emailClient) || {
//                 nombreCommandes: 0,
//                 nomUtilisateurClient: commande.nomUtilisateurClient || '',
//                 telephoneClient: commande.telephoneClient || '',
//                 dateInscription: commande.dateInscription
//             };
//             clientStats.nombreCommandes++;
//             clientsMap.set(commande.emailClient, clientStats);
//         });

//     // Calcul du chiffre d'affaire pour le mois actuel et précédent
//     const chiffreAffaireMoisActuel = chiffreAffaireMois[moisActuel];
//     const chiffreAffaireMoisPrecedent = chiffreAffaireMois[moisPrecedent];

//     // Calcul du nombre de clients
//     const nombreClientsActuel = clientsMap.size;
//     const nombreClientsPrecedent = Array.from(clientsMap.values()).filter(client => new Date(client.dateInscription).getMonth() === moisPrecedent).length;

//     // Calcul des taux de variation pour les commandes, le chiffre d'affaire et les clients
//     const tauxCommande = chiffreAffaireMoisPrecedent > 0
//         ? ((chiffreAffaireMoisActuel - chiffreAffaireMoisPrecedent) / chiffreAffaireMoisPrecedent) * 100
//         : (chiffreAffaireMoisActuel > 0 ? 100 : 0);

//     const tauxChiffreAffaire = chiffreAffaireMoisPrecedent > 0
//         ? ((chiffreAffaireMoisActuel - chiffreAffaireMoisPrecedent) / chiffreAffaireMoisPrecedent) * 100
//         : (chiffreAffaireMoisActuel > 0 ? 100 : 0);

//     const tauxClients = nombreClientsPrecedent > 0
//         ? ((nombreClientsActuel - nombreClientsPrecedent) / nombreClientsPrecedent) * 100
//         : (nombreClientsActuel > 0 ? 100 : 0);

//     // Détermination des couleurs pour l'affichage des taux (vert si positif, rouge si négatif)
//     const colorCommande = tauxCommande >= 0 ? "bg-success" : "bg-danger";
//     const colorChiffreAffaire = tauxChiffreAffaire >= 0 ? "bg-success" : "bg-danger";
//     const colorClients = tauxClients >= 0 ? "bg-success" : "bg-danger";

//     // Classement des meilleurs clients par nombre de commandes
//     const meilleursClients = Array.from(clientsMap.entries())
//         .map(([emailClient, stats]) => ({
//             emailClient,
//             ...stats
//         }))
//         .sort((a, b) => b.nombreCommandes - a.nombreCommandes);

//     // Classement des pizzas les plus commandées
//     const pizzasLesPlusCommande = Array.from(pizzasMap.entries())
//         .map(([nomPizza, stats]) => ({
//             nomPizza,
//             ...stats
//         }))
//         .sort((a, b) => b.quantite - a.quantite);

//     // Données de chiffres d'affaire par mois pour affichage
//     const chiffreDaffaireParMois = {
//         labels: [
//             "Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
//             "Juil", "Aou", "Sep", "Oct", "Nov", "Dec",
//         ],
//         data: chiffreAffaireMois,
//         chiffreAffaireMoisActuel,
//         chiffreAffaireMoisPrecedent
//     };

//     // Données de nombre de client par mois pour affichage
//     const nombreClientsParMois = {
//         labels: [
//             "Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
//             "Juil", "Aou", "Sep", "Oct", "Nov", "Dec",
//         ],
//         data: chiffreAffaireMois,
//         chiffreAffaireMoisActuel,
//         chiffreAffaireMoisPrecedent
//     };

//     return {
//         nombreCommandes,
//         chiffreAffaireTotal,
//         nombreClients: nombreClientsActuel,
//         meilleursClients,
//         pizzasLesPlusCommande,
//         chiffreDaffaireParMois,
//         tauxCommande, // Ajout des taux de variation
//         tauxChiffreAffaire,
//         tauxClients,
//         colorCommande, // Ajout de la couleur pour chaque taux
//         colorChiffreAffaire,
//         colorClients
//     };
// };



export interface DashboardStats {
    nombreCommandes: number;
    chiffreAffaireTotal: number;
    nombreClients: number;
    meilleursClients: Array<{
        emailClient: string;
        nombreCommandes: number;
        nomUtilisateurClient: string;
        telephoneClient: string;
        telephoneClient2: string;
    }>;
    pizzasLesPlusCommande: Array<{
        nomPizza: string;
        quantite: number;
        descriptionPizza: string;
        libImagePizza: string;
    }>;
    chiffreDaffaireParMois: {
        labels: string[];
        data: number[];
        chiffreAffaireMoisActuel: number;
        chiffreAffaireMoisPrecedent: number;
    };
    nombreClientsParMois: {
        labels: string[];
        data: number[];
        nombreClientsMoisActuel: number;
        nombreClientsMoisPrecedent: number;
    };
    tauxCommande: number;
    tauxChiffreAffaire: number;
    tauxClients: number;
    colorCommande: string;
    colorChiffreAffaire: string;
    colorClients: string;
    chiffreAffaireLivraisonTotal: number;
    // Nouvelle section pour les données filtrées par jour, semaine, mois et année
    donnePourLeFiltre: {
        day: {
            totalCommande: number;
            chiffreAffaire: number;
            chiffreAffaireLivraison: number;
            nombreClient: number;
        };
        week: {
            totalCommande: number;
            chiffreAffaire: number;
            chiffreAffaireLivraison: number;
            nombreClient: number;
        };
        month: {
            totalCommande: number;
            chiffreAffaire: number;
            chiffreAffaireLivraison: number;
            nombreClient: number;
        };
        year: {
            totalCommande: number;
            chiffreAffaire: number;
            chiffreAffaireLivraison: number;
            nombreClient: number;
        };
    };
}



export const calculerStats = (
    commandes: IListeCommandeItem[],
    siteId?: number // Paramètre optionnel pour filtrer par site
): DashboardStats & { donneesPourLeFiltre: any } => {
    // Si siteId est fourni, on filtre les commandes selon le siteId, sinon on garde toutes les commandes
    const commandesFiltrees = siteId
        ? commandes.filter((commande) => commande.siteId === siteId)
        : commandes;
    console.log("🚀 ~ commandesFiltrees:", commandesFiltrees)

    // Maps pour collecter des statistiques sur les clients et les pizzas
    const clientsMap = new Map<
        string,
        { nombreCommandes: number; nomUtilisateurClient: string; telephoneClient: string; telephoneClient2: string; dateInscription: Date }
    >();
    const pizzasMap = new Map<
        string,
        { quantite: number; descriptionPizza: string; libImagePizza: string }
    >();

    // Variables pour les statistiques mensuelles
    const chiffreAffaireMois = Array(12).fill(0);
    const nombreClientsParMoisData = Array(12).fill(0);
    const clientsUniquesParMois: Set<string>[] = Array.from({ length: 12 }, () => new Set<string>());

    // Variables globales pour les statistiques générales
    let nombreCommandes = 0;
    let chiffreAffaireTotal = 0;
    let chiffreAffaireLivraisonTotal = 0;

    // Définir la date actuelle et les périodes de filtrage
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000 - 1);

    const startOfWeek = new Date(startOfDay.getTime() - now.getDay() * 24 * 60 * 60 * 1000);
    const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);

    const donneesPourLeFiltre = {
        day: { totalCommande: 0, chiffreAffaire: 0, chiffreAffaireLivraison: 0, nombreClient: new Set<string>() },
        week: { totalCommande: 0, chiffreAffaire: 0, chiffreAffaireLivraison: 0, nombreClient: new Set<string>() },
        month: { totalCommande: 0, chiffreAffaire: 0, chiffreAffaireLivraison: 0, nombreClient: new Set<string>() },
        year: { totalCommande: 0, chiffreAffaire: 0, chiffreAffaireLivraison: 0, nombreClient: new Set<string>() },
    };

    // Parcours des commandes filtrées
    commandesFiltrees
        .filter((commande) => commande.etatCommande === "traité")
        .forEach((commande) => {
            nombreCommandes++;
            let chiffreAffaireCommande = 0;

            // Ajout du prix de livraison
            chiffreAffaireLivraisonTotal += commande.prixLivraisonActuel;

            // Calcul du chiffre d'affaires pour les détails de la commande
            commande.commandeDetails.forEach((detail) => {
                chiffreAffaireCommande += detail.quantiteCommande * detail.prixFormatActuel;
                chiffreAffaireCommande += detail.commandeSupplements.reduce(
                    (sum, supp) => sum + supp.prixSupplementActuel,
                    0
                );
                chiffreAffaireCommande += detail.commandeBoissons.reduce(
                    (sum, boisson) => sum + boisson.prixBoissonActuel,
                    0
                );

                // Mise à jour des statistiques pour chaque pizza
                const pizzaStats = pizzasMap.get(detail.nomPizza) || {
                    quantite: 0,
                    descriptionPizza: detail.descriptionPizza || "",
                    libImagePizza: detail.libImagePizza || "",
                };
                pizzaStats.quantite += detail.quantiteCommande;
                pizzasMap.set(detail.nomPizza, pizzaStats);
            });

            chiffreAffaireTotal += chiffreAffaireCommande;

            const dateCommande = new Date(commande.dateCommande);

            // Ajout des statistiques pour chaque période (jour, semaine, mois, année)
            if (dateCommande >= startOfDay && dateCommande <= endOfDay) {
                donneesPourLeFiltre.day.totalCommande++;
                donneesPourLeFiltre.day.chiffreAffaire += chiffreAffaireCommande;
                donneesPourLeFiltre.day.chiffreAffaireLivraison += commande.prixLivraisonActuel;
                donneesPourLeFiltre.day.nombreClient.add(commande.emailClient);
            }
            if (dateCommande >= startOfWeek && dateCommande <= endOfWeek) {
                donneesPourLeFiltre.week.totalCommande++;
                donneesPourLeFiltre.week.chiffreAffaire += chiffreAffaireCommande;
                donneesPourLeFiltre.week.chiffreAffaireLivraison += commande.prixLivraisonActuel;
                donneesPourLeFiltre.week.nombreClient.add(commande.emailClient);
            }
            if (dateCommande >= startOfMonth && dateCommande <= endOfMonth) {
                donneesPourLeFiltre.month.totalCommande++;
                donneesPourLeFiltre.month.chiffreAffaire += chiffreAffaireCommande;
                donneesPourLeFiltre.month.chiffreAffaireLivraison += commande.prixLivraisonActuel;
                donneesPourLeFiltre.month.nombreClient.add(commande.emailClient);
            }
            if (dateCommande >= startOfYear && dateCommande <= endOfYear) {
                donneesPourLeFiltre.year.totalCommande++;
                donneesPourLeFiltre.year.chiffreAffaire += chiffreAffaireCommande;
                donneesPourLeFiltre.year.chiffreAffaireLivraison += commande.prixLivraisonActuel;
                donneesPourLeFiltre.year.nombreClient.add(commande.emailClient);
            }

            // Mise à jour des statistiques mensuelles
            const moisCommande = dateCommande.getMonth();
            if (dateCommande.getFullYear() === now.getFullYear()) {
                chiffreAffaireMois[moisCommande] += chiffreAffaireCommande;
                clientsUniquesParMois[moisCommande].add(commande.emailClient);
            }

            // Mise à jour des statistiques pour chaque client
            const clientStats = clientsMap.get(commande.emailClient) || {
                nombreCommandes: 0,
                nomUtilisateurClient: commande.nomUtilisateurClient || "",
                telephoneClient: commande.telephoneClient || "",
                telephoneClient2: commande.telephoneClient2 || "",
                dateInscription: commande.dateInscription,
            };
            clientStats.nombreCommandes++;
            clientsMap.set(commande.emailClient, clientStats);
        });

    // Mise à jour des données par mois
    for (let mois = 0; mois < 12; mois++) {
        nombreClientsParMoisData[mois] = clientsUniquesParMois[mois].size;
    }

    const chiffreAffaireMoisActuel = chiffreAffaireMois[now.getMonth()];
    const chiffreAffaireMoisPrecedent = chiffreAffaireMois[(now.getMonth() - 1 + 12) % 12];
    const nombreClientsMoisActuel = nombreClientsParMoisData[now.getMonth()];
    const nombreClientsMoisPrecedent = nombreClientsParMoisData[(now.getMonth() - 1 + 12) % 12];

    const tauxCommande =
        parseFloat((chiffreAffaireMoisPrecedent > 0
            ? ((chiffreAffaireMoisActuel - chiffreAffaireMoisPrecedent) / chiffreAffaireMoisPrecedent) * 100
            : chiffreAffaireMoisActuel > 0
                ? 100
                : 0).toFixed(2));

    const tauxChiffreAffaire = parseFloat(tauxCommande.toFixed(2));

    const tauxClients =
        parseFloat((nombreClientsMoisPrecedent > 0
            ? ((nombreClientsMoisActuel - nombreClientsMoisPrecedent) / nombreClientsMoisPrecedent) * 100
            : nombreClientsMoisActuel > 0
                ? 100
                : 0).toFixed(2));

    const colorCommande = tauxCommande >= 0 ? "bg-success" : "bg-danger";
    const colorChiffreAffaire = tauxChiffreAffaire >= 0 ? "bg-success" : "bg-danger";
    const colorClients = tauxClients >= 0 ? "bg-success" : "bg-danger";

    const meilleursClients = Array.from(clientsMap.entries())
        .map(([emailClient, stats]) => ({
            emailClient,
            ...stats,
        }))
        .sort((a, b) => b.nombreCommandes - a.nombreCommandes);

    const pizzasLesPlusCommande = Array.from(pizzasMap.entries())
        .map(([nomPizza, stats]) => ({
            nomPizza,
            ...stats,
        }))
        .sort((a, b) => b.quantite - a.quantite);

    const chiffreDaffaireParMois = {
        labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"],
        data: chiffreAffaireMois,
        chiffreAffaireMoisActuel,
        chiffreAffaireMoisPrecedent,
    };

    const nombreClientsParMois = {
        labels: ["Jan", "Fev", "Mar", "Avr", "Mai", "Jui", "Juil", "Aou", "Sep", "Oct", "Nov", "Dec"],
        data: nombreClientsParMoisData,
        nombreClientsMoisActuel,
        nombreClientsMoisPrecedent,
    };
    // @ts-ignore
    return {
        nombreCommandes,
        chiffreAffaireTotal,
        nombreClients: clientsMap.size,
        meilleursClients,
        pizzasLesPlusCommande,
        chiffreDaffaireParMois,
        nombreClientsParMois,
        tauxCommande,
        tauxChiffreAffaire,
        tauxClients,
        colorCommande,
        colorChiffreAffaire,
        colorClients,
        chiffreAffaireLivraisonTotal,
        donneesPourLeFiltre: {
            day: {
                ...donneesPourLeFiltre.day,
                nombreClient: donneesPourLeFiltre.day.nombreClient.size,
            },
            week: {
                ...donneesPourLeFiltre.week,
                nombreClient: donneesPourLeFiltre.week.nombreClient.size,
            },
            month: {
                ...donneesPourLeFiltre.month,
                nombreClient: donneesPourLeFiltre.month.nombreClient.size,
            },
            year: {
                ...donneesPourLeFiltre.year,
                nombreClient: donneesPourLeFiltre.year.nombreClient.size,
            },
        },
    };
};



// export const calculerStats = (
//   commandes: IListeCommandeItem[]
// ): DashboardStats & { donneesPourLeFiltre: any } => {
//   // Maps pour les statistiques
//   const clientsMap = new Map<
//     string,
//     { nombreCommandes: number; nomUtilisateurClient: string; telephoneClient: string; dateInscription: Date }
//   >();
//   const pizzasMap = new Map<
//     string,
//     { quantite: number; descriptionPizza: string; libImagePizza: string }
//   >();

//   // Variables globales
//   const chiffreAffaireMois = Array(12).fill(0);
//   const nombreClientsParMoisData = Array(12).fill(0);
//   const clientsUniquesParMois: Set<string>[] = Array.from({ length: 12 }, () => new Set<string>());

//   let nombreCommandes = 0;
//   let chiffreAffaireTotal = 0;
//   let chiffreAffaireLivraisonTotal = 0;

//   const now = new Date();
//   const moisActuel = now.getMonth();
//   const moisPrecedent = (moisActuel - 1 + 12) % 12;

//   // Nouveaux filtres
//   const donneesPourLeFiltre = {
//     day: { totalCommande: 0, chiffreAffaire: 0, nombreClient: new Set<string>() },
//     week: { totalCommande: 0, chiffreAffaire: 0, nombreClient: new Set<string>() },
//     month: { totalCommande: 0, chiffreAffaire: 0, nombreClient: new Set<string>() },
//     year: { totalCommande: 0, chiffreAffaire: 0, nombreClient: new Set<string>() },
//   };

//   const startOfDay = new Date(now.setHours(0, 0, 0, 0));
//   const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
//   const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//   const startOfYear = new Date(now.getFullYear(), 0, 1);

//   commandes
//     .filter((commande) => commande.etatCommande === "traité")
//     .forEach((commande) => {
//       nombreCommandes++;
//       let chiffreAffaireCommande = 0;

//       chiffreAffaireLivraisonTotal += commande.prixLivraisonActuel;

//       // Détails de commande
//       commande.commandeDetails.forEach((detail) => {
//         chiffreAffaireCommande += detail.quantiteCommande * detail.prixFormatActuel;
//         chiffreAffaireCommande += detail.commandeSupplements.reduce(
//           (sum, supp) => sum + supp.prixSupplementActuel,
//           0
//         );
//         chiffreAffaireCommande += detail.commandeBoissons.reduce(
//           (sum, boisson) => sum + boisson.prixBoissonActuel,
//           0
//         );

//         const pizzaStats = pizzasMap.get(detail.nomPizza) || {
//           quantite: 0,
//           descriptionPizza: detail.descriptionPizza || "",
//           libImagePizza: detail.libImagePizza || "",
//         };
//         pizzaStats.quantite += detail.quantiteCommande;
//         pizzasMap.set(detail.nomPizza, pizzaStats);
//       });

//       chiffreAffaireTotal += chiffreAffaireCommande;

//       const dateCommande = new Date(commande.dateCommande);

//       // Ajout des filtres jour, semaine, mois, année
//       if (dateCommande >= startOfDay) {
//         donneesPourLeFiltre.day.totalCommande++;
//         donneesPourLeFiltre.day.chiffreAffaire += chiffreAffaireCommande;
//         donneesPourLeFiltre.day.nombreClient.add(commande.emailClient);
//       }
//       if (dateCommande >= startOfWeek) {
//         donneesPourLeFiltre.week.totalCommande++;
//         donneesPourLeFiltre.week.chiffreAffaire += chiffreAffaireCommande;
//         donneesPourLeFiltre.week.nombreClient.add(commande.emailClient);
//       }
//       if (dateCommande >= startOfMonth) {
//         donneesPourLeFiltre.month.totalCommande++;
//         donneesPourLeFiltre.month.chiffreAffaire += chiffreAffaireCommande;
//         donneesPourLeFiltre.month.nombreClient.add(commande.emailClient);
//       }
//       if (dateCommande >= startOfYear) {
//         donneesPourLeFiltre.year.totalCommande++;
//         donneesPourLeFiltre.year.chiffreAffaire += chiffreAffaireCommande;
//         donneesPourLeFiltre.year.nombreClient.add(commande.emailClient);
//       }

//       const moisCommande = dateCommande.getMonth();
//       chiffreAffaireMois[moisCommande] += chiffreAffaireCommande;

//       const clientStats = clientsMap.get(commande.emailClient) || {
//         nombreCommandes: 0,
//         nomUtilisateurClient: commande.nomUtilisateurClient || "",
//         telephoneClient: commande.telephoneClient || "",
//         dateInscription: commande.dateInscription,
//       };
//       clientStats.nombreCommandes++;
//       clientsMap.set(commande.emailClient, clientStats);

//       clientsUniquesParMois[moisCommande].add(commande.emailClient);
//     });

//   // Mise à jour des données par mois
//   for (let mois = 0; mois < 12; mois++) {
//     nombreClientsParMoisData[mois] = clientsUniquesParMois[mois].size;
//   }

//   const chiffreAffaireMoisActuel = chiffreAffaireMois[moisActuel];
//   const chiffreAffaireMoisPrecedent = chiffreAffaireMois[moisPrecedent];
//   const nombreClientsMoisActuel = nombreClientsParMoisData[moisActuel];
//   const nombreClientsMoisPrecedent = nombreClientsParMoisData[moisPrecedent];

//   const tauxCommande =
//     chiffreAffaireMoisPrecedent > 0
//       ? ((chiffreAffaireMoisActuel - chiffreAffaireMoisPrecedent) / chiffreAffaireMoisPrecedent) * 100
//       : chiffreAffaireMoisActuel > 0
//       ? 100
//       : 0;

//   const tauxChiffreAffaire =
//     chiffreAffaireMoisPrecedent > 0
//       ? ((chiffreAffaireMoisActuel - chiffreAffaireMoisPrecedent) / chiffreAffaireMoisPrecedent) * 100
//       : chiffreAffaireMoisActuel > 0
//       ? 100
//       : 0;

//   const tauxClients =
//     nombreClientsMoisPrecedent > 0
//       ? ((nombreClientsMoisActuel - nombreClientsMoisPrecedent) / nombreClientsMoisPrecedent) * 100
//       : nombreClientsMoisActuel > 0
//       ? 100
//       : 0;

//   const colorCommande = tauxCommande >= 0 ? "bg-success" : "bg-danger";
//   const colorChiffreAffaire = tauxChiffreAffaire >= 0 ? "bg-success" : "bg-danger";
//   const colorClients = tauxClients >= 0 ? "bg-success" : "bg-danger";

//   const meilleursClients = Array.from(clientsMap.entries())
//     .map(([emailClient, stats]) => ({
//       emailClient,
//       ...stats,
//     }))
//     .sort((a, b) => b.nombreCommandes - a.nombreCommandes);

//   const pizzasLesPlusCommande = Array.from(pizzasMap.entries())
//     .map(([nomPizza, stats]) => ({
//       nomPizza,
//       ...stats,
//     }))
//     .sort((a, b) => b.quantite - a.quantite);

//   const chiffreDaffaireParMois = {
//     labels: [
//       "Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
//       "Juil", "Aou", "Sep", "Oct", "Nov", "Dec",
//     ],
//     data: chiffreAffaireMois,
//     chiffreAffaireMoisActuel,
//     chiffreAffaireMoisPrecedent,
//   };

//   const nombreClientsParMois = {
//     labels: [
//       "Jan", "Fev", "Mar", "Avr", "Mai", "Jui",
//       "Juil", "Aou", "Sep", "Oct", "Nov", "Dec",
//     ],
//     data: nombreClientsParMoisData,
//     nombreClientsMoisActuel,
//     nombreClientsMoisPrecedent,
//   };

//   return {
//     nombreCommandes,
//     chiffreAffaireTotal,
//     nombreClients: clientsMap.size,
//     meilleursClients,
//     pizzasLesPlusCommande,
//     chiffreDaffaireParMois,
//     nombreClientsParMois,
//     tauxCommande,
//     tauxChiffreAffaire,
//     tauxClients,
//     colorCommande,
//     colorChiffreAffaire,
//     colorClients,
//     donneesPourLeFiltre: {
//       day: {
//         ...donneesPourLeFiltre.day,
//         nombreClient: donneesPourLeFiltre.day.nombreClient.size,
//       },
//       week: {
//         ...donneesPourLeFiltre.week,
//         nombreClient: donneesPourLeFiltre.week.nombreClient.size,
//       },
//       month: {
//         ...donneesPourLeFiltre.month,
//         nombreClient: donneesPourLeFiltre.month.nombreClient.size,
//       },
//       year: {
//         ...donneesPourLeFiltre.year,
//         nombreClient: donneesPourLeFiltre.year.nombreClient.size,
//       },
//     },
//   };
// };



export const recupSite = async (setLoading?: React.Dispatch<React.SetStateAction<boolean>>, loading?: boolean) => {
    try {
        setLoading && setLoading(true)
        const res = await apiClient.get("/recup_site")
        if (!res.status) throw res.error
        const data = res.data as ISite[]
        store.dispatch(setListeSites(data))
    } catch (error) {
        console.log("🚀 ~ recupSite ~ error:", error)
    }
    finally {
        setLoading && setLoading(false)
    }
}

export const normalizeString = (str: string) =>
    str
        .normalize("NFD") // Décompose les accents en caractères de base + diacritiques
        .replace(/[\u0300-\u036f]/g, "") // Supprime les diacritiques

export const filterByDate = (data: IListePizzaItemFormated[], date: string): IListePizzaItemFormated[] => {
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

// Fonction pour récupérer la date du jour au format YYYY-MM-DD
export const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Extrait "YYYY-MM-DD"
  };
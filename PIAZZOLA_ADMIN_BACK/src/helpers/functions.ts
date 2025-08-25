import CryptoJS from "crypto-js"
import { sessionId } from "./constant";
import _ from "lodash"

type FormattedCommande = {
  commandeId: number;
  etatCommande: string;
  dateCommande: string;
  valideParVendeur: number;
  aEmporte: number;
  dateEmport: string | null;
  prixLivraisonActuel: number;
  nomUtilisateurClient: string;
  emailClient: string;
  telephoneClient: string;
  commandeDetails: any[];
};

export const formatCommandess = (data: any[]): FormattedCommande[] => {
  const grouped = data.reduce((acc, item) => {
    const {
      commandeId,
      etatCommande,
      dateCommande,
      valideParVendeur,
      aEmporte,
      dateEmport,
      rueDeLaLivraison,
      zone,
      prixLivraisonActuel,
      nomUtilisateurClient,
      nomUtilisateur,
      emailClient,
      telephoneClient,
      telephoneClient2,
      commandeDetailId,
      quantiteCommande,
      demandeSpeciale,
      nomPizza,
      estUnePizza,
      nomAccompagnement,
      accompagnementId,
      choixViande,
      avecAccompagnement,
      descriptionPizza,
      nomFormat,
      prixFormatActuel,
      nomPate,
      nomViande,
      peutEtrelivre,
      nomCondiment,
      libImagePizza,
      adressePointLivraison,
      siteId,
      nomSite,
      pizzaGratos,
      dateInscription,
    } = item;

    if (!acc[commandeId]) {
      acc[commandeId] = {
        commandeId,
        etatCommande,
        dateCommande,
        valideParVendeur,
        aEmporte,
        dateEmport,
        peutEtrelivre,
        zone,
        nomUtilisateur,
        rueDeLaLivraison,
        prixLivraisonActuel,
        nomUtilisateurClient,
        dateInscription,
        emailClient,
        telephoneClient,
        telephoneClient2,
        adressePointLivraison,
        siteId,
        nomSite,
        commandeDetails: [],
      };
    }

    acc[commandeId].commandeDetails.push({
      commandeDetailId,
      quantiteCommande,
      demandeSpeciale,
      nomPizza,
      choixViande,
      descriptionPizza,
      nomFormat,
      estUnePizza,
      prixFormatActuel,
      nomPate,
      nomViande,
      nomCondiment,
      nomAccompagnement,
      accompagnementId,
      avecAccompagnement,
      libImagePizza,
      pizzaGratos
    });

    return acc;
  }, {} as Record<number, FormattedCommande>);

  return Object.values(grouped);
}

export const formatCommandePlat = (data: any[]): FormattedCommande[] => {
  const grouped = data.reduce((acc, item) => {
    const {
      commandePlatId,
      etatCommande,
      dateCommande,
      valideParVendeur,
      aEmporte,
      dateEmport,
      rueDeLaLivraison,
      zone,
      avecAccompagnement,
      platDuJour,
      prixLivraisonActuel,
      nomUtilisateurClient,
      nomUtilisateur,
      emailClient,
      telephoneClient,
      telephoneClient2,
      commandePlatDetailId,
      quantiteCommande,
      nomPlat,
      descriptionPlat,
      nomFormat,
      prixPlatActuel,
      libImagePlat,
      adressePointLivraison,
      siteId,
      nomSite,
      dateInscription,
    } = item;

    if (!acc[commandePlatId]) {
      acc[commandePlatId] = {
        commandePlatId,
        etatCommande,
        dateCommande,
        valideParVendeur,
        aEmporte,
        dateEmport,
        zone,
        nomUtilisateur,
        rueDeLaLivraison,
        prixLivraisonActuel,
        nomUtilisateurClient,
        dateInscription,
        emailClient,
        telephoneClient,
        telephoneClient2,
        adressePointLivraison,
        siteId,
        nomSite,
        commandeDetails: [],
      };
    }

    acc[commandePlatId].commandeDetails.push({
      commandePlatDetailId,
      quantiteCommande,
      nomPlat,
      descriptionPlat,
      nomFormat,
      prixPlatActuel,
      avecAccompagnement,
      libImagePlat,
      platDuJour
    });

    return acc;
  }, {} as Record<number, FormattedCommande>);

  return Object.values(grouped);
}
interface Commandes {
  commandeId: number;
  nomClient: string;
  commandeSupplements: any[];
}

export const formatDataSupplement = (data: any[]): Commandes[] => {
  // Créer un objet pour regrouper les commandes par commandeId
  const commandesMap: Record<number, Commandes> = {};

  data.forEach((item) => {
    // Si la commandeId n'existe pas encore dans le map, on la crée
    if (!commandesMap[item.commandeId]) {
      commandesMap[item.commandeId] = {
        commandeId: item.commandeId,
        nomClient: item.nomUtilisateurClient,
        commandeSupplements: [],
      };
    }

    // Ajouter le détail de la commande à l'entrée correspondante
    commandesMap[item.commandeId].commandeSupplements.push({
      nomSupplement: item.nomSupplement,
      prixSupplementActuel: item.prixSupplementActuel,
      commandeDetailId: item.commandeDetailId,
    });
  });

  // Retourner un tableau des commandes formatées
  return Object.values(commandesMap);
};

interface Commandess {
  commandeId: number;
  nomClient: string;
  commandeBoissons: any[];
}

interface ICommandeCondiment {
  commandeId: number;
  nomUtilisateurClient: string;
  commandeCondiments: any[];
}

export const formatDataBoisson = (data: any[]): Commandess[] => {
  // Créer un objet pour regrouper les commandes par commandeId
  const commandesMap: Record<number, Commandess> = {};

  data.forEach((item) => {
    // Si la commandeId n'existe pas encore dans le map, on la crée
    if (!commandesMap[item.commandeId]) {
      commandesMap[item.commandeId] = {
        commandeId: item.commandeId,
        nomClient: item.nomUtilisateurClient,  // Assurez-vous d'avoir cette clé correctement mappée
        commandeBoissons: [],
      };
    }

    // Ajouter le détail de la boisson à l'entrée correspondante
    commandesMap[item.commandeId].commandeBoissons.push({
      nomBoisson: item.nomBoisson,
      prixBoissonActuel: item.prixBoissonActuel,
      commandeDetailId: item.commandeDetailId,
    });
  });

  // Retourner un tableau des commandes formatées
  return Object.values(commandesMap);
};

export const formatDataCondiment = (data: any[]): ICommandeCondiment[] => {
  // Créer un objet pour regrouper les commandes par commandeId
  const commandesMap: Record<number, ICommandeCondiment> = {};

  data?.forEach((item) => {
    // Si la commandeId n'existe pas encore dans le map, on la crée
    if (!commandesMap[item.commandeId]) {
      commandesMap[item.commandeId] = {
        commandeId: item.commandeId,
        nomUtilisateurClient: item.nomUtilisateurClient,  // Assurez-vous d'avoir cette clé correctement mappée
        commandeCondiments: [],
      };
    }

    // Ajouter le détail de la boisson à l'entrée correspondante
    commandesMap[item.commandeId].commandeCondiments.push({
      nomCondiment: item.nomCondiment,
      commandeDetailId: item.commandeDetailId,
    });
  });

  // Retourner un tableau des commandes formatées
  return Object.values(commandesMap);
};

export const fusionnerCommandes = (
  commandes: any[],
  commandeSupplements: any[],
  commandeBoissons: any[],
  commandeCondiments: any[],
): any[] => {
  return commandes.map((commande) => {
    // Récupérer les suppléments liés à cette commande
    const supplements = commandeSupplements.find(
      (supp) => supp.commandeId === commande.commandeId
    )?.commandeSupplements || [];

    // Récupérer les boissons liées à cette commande
    const boissons = commandeBoissons.find(
      (boisson) => boisson.commandeId === commande.commandeId
    )?.commandeBoissons || [];

    // Récupérer les condiments liées à cette commande
    const condiments = commandeCondiments.find(
      (condiment) => condiment.commandeId === commande.commandeId
    )?.commandeCondiments || [];

    // Associer les suppléments et boissons aux détails
    const detailsAvecSupplementsEtBoissons = commande.commandeDetails.map((detail: any) => {
  
      const detailSupplements = supplements.filter(
        (supplement: any) => supplement.commandeDetailId === detail.commandeDetailId
      );
      const detailBoissons = boissons.filter(
        (boisson: any) => boisson.commandeDetailId === detail.commandeDetailId
      );
      const detailCondiments = condiments.filter(
        (condiment: any) => condiment.commandeDetailId === detail.commandeDetailId
      );

      return {
        ...detail,
        commandeSupplements: detailSupplements,
        commandeBoissons: detailBoissons,
        commandeCondiments: detailCondiments,
      };
    });

    return {
      ...commande,
      commandeDetails: detailsAvecSupplementsEtBoissons,
    };
  });
}

export const fusionnerCommandesPlat = (
  commandes: any[],
  commandeBoissons: any[],
): any[] => {
  return commandes.map((commande) => {

    // Récupérer les boissons liées à cette commande
    const boissons = commandeBoissons.find(
      (boisson) => boisson.commandeId === commande.commandeId
    )?.commandeBoissons || [];


    // Associer les suppléments et boissons aux détails
    const detailsAvecSupplementsEtBoissons = commande.commandeDetails.map((detail: any) => {

      const detailBoissons = boissons.filter(
        (boisson: any) => boisson.commandeDetailId === detail.commandeDetailId
      );

      return {
        ...detail,
        commandeBoissons: detailBoissons,
      };
    });

    return {
      ...commande,
      commandeDetails: detailsAvecSupplementsEtBoissons,
    };
  });
}


/**
 * Décrypter le payload venant du web client
 * @param data payload crypté
 * @param key la clé de dechiffrement
 */
export function decryptPayload(data: any, key?: string) {
  const bytes = CryptoJS.AES.decrypt(data, sessionId);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData
}
export const encryptPayload = (data: any, key?: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), sessionId).toString();
  return ciphertext
};

export const generateRandomCode = (): string =>{
  const min = 1000; // Plus petit nombre à 4 chiffres
  const max = 9999; // Plus grand nombre à 4 chiffres
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomCode.toString();
}

/**
 * Vérifie si une date correspond à la date d'aujourd'hui.
 * @param pointageDujour - La date de pointage (objet Date ou chaîne de date).
 * @returns `true` si la date correspond à aujourd'hui, sinon `false`.
 */
export const clientADejaPointeAujourdhui = (pointageDujour: Date | string): boolean => {
  if (!pointageDujour) return false; // Si pas de date, retourne false

  // Convertir en objet Date si c'est une chaîne
  const datePointage = new Date(pointageDujour);

  // Obtenir aujourd'hui
  const aujourdHui = new Date();

  // Comparer l'année, le mois et le jour
  return (
    datePointage.getDate() === aujourdHui.getDate() &&
    datePointage.getMonth() === aujourdHui.getMonth() &&
    datePointage.getFullYear() === aujourdHui.getFullYear()
  );
};

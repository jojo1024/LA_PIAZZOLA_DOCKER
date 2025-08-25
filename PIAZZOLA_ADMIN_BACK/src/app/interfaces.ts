import { z } from 'zod';
import { BoissonSchema, CategoriePizzaSchema, ClientSchema, clientSchema, CommandeBoissonSchema, CommandeCondiemntSchema, CommandeDetailSchema, CommandeSchema, CommandeSupplementSchema, CondimentSchema, CreateCommandeBoissonPayloadSchema, CreateCommandeDetailPayloadSchema, CreateCommandePayloadSchema, CreateCommandePlatDetailPayloadSchema, CreateCommandeSupplementPayloadSchema, FormatSchema, PateSchema, PizzaComposeSchema, PizzaSchema, PointLivraisonSchema, RoleSchema, SiteSchema, SupplementSchema, updatePasswordSchemaPayload, UtilisateurRoleSchema, utilisateurSchema, VendeurSchema, ViandeSchema } from '@/schemas';







export type ICreateClientPayloads = z.infer<typeof clientSchema>
export interface IAjouterAvisClient { libPhoto: string, nomPrenom: string, avis: string, imageEnBase64: string }

export interface IBanniere { banniereId: number, pizzaId: number, libBanniereImage: string, banniereImageEnBase64: string, bannierePublicitaire: number }
export interface IVideo { videoId: number, titre: string, lienVideo: string, status: 0 | 1 }

export type ICreateSitePayload = z.infer<typeof SiteSchema>;
export type ICreateVendeurPayload = z.infer<typeof VendeurSchema>;
export type ICreateUtilisateurPayload = z.infer<typeof utilisateurSchema>;
export type ICreateClientPayload = z.infer<typeof ClientSchema>;
export type ICreateRolePayload = z.infer<typeof RoleSchema>;
export type ICreateUtilisateurRolePayload = z.infer<typeof UtilisateurRoleSchema>;
export type ICreateCategoriePizzaPayload = z.infer<typeof CategoriePizzaSchema>;
export type ICreatePizzaPayload = z.infer<typeof PizzaSchema>;
export type ICreateFormatPayload = z.infer<typeof FormatSchema>;
export type ICreatePatePayload = z.infer<typeof PateSchema>;
export type ICreateViandePayload = z.infer<typeof ViandeSchema>;
export type ICreateCondimentPayload = z.infer<typeof CondimentSchema>;
export type ICreateSupplementPayload = z.infer<typeof SupplementSchema>;
export type ICreateBoissonPayload = z.infer<typeof BoissonSchema>;
export type ICreatePointLivraisonPayload = z.infer<typeof PointLivraisonSchema>;
// export type ICreateCommandePayload = z.infer<typeof CommandeSchema>;
// export type ICreateCommandeDetailPayload = z.infer<typeof CommandeDetailSchema>;
export type ICreatePizzaComposePayload = z.infer<typeof PizzaComposeSchema>;
// export type ICreateCommandeSupplementPayload = z.infer<typeof CommandeSupplementSchema>;
// export type ICreateCommandeBoissonPayload = z.infer<typeof CommandeBoissonSchema>;
export type ICreateCommandeBoissonPayload = z.infer<typeof CreateCommandeBoissonPayloadSchema>;
export type ICreateCommandePayload = z.infer<typeof CreateCommandePayloadSchema>;
export type ICreateCommandeDetailPayload = z.infer<typeof CreateCommandeDetailPayloadSchema>;
export type ICreateCommandePlatDetailPayload = z.infer<typeof CreateCommandePlatDetailPayloadSchema>;
export type ICreateCommandeSupplementPayload = z.infer<typeof CreateCommandeSupplementPayloadSchema>;
export type ICommandeSupplementPayload = z.infer<typeof CommandeSupplementSchema>;
export type ICommandeBoissonSchemaPayload = z.infer<typeof CommandeBoissonSchema>;
export type ICommandeCondimentSchemaPayload = z.infer<typeof CommandeCondiemntSchema>;
export type IUpdatePassword = z.infer<typeof updatePasswordSchemaPayload>;

export interface IFidelite {
    clientId: number;
    point: number;
    dateInscriptionFidelite: Date;
    pointageDujour: Date;
}

export interface IAccompagnement {
    accompagnementId: number;
    nomAccompagnement: string;
    status: number;
}

export interface IGestionCommande { commandeId: number, etatCommande: "reçu" | "en cours" | "traité", valideParUtilisateur: number, utilisateurId: number, siteId: number, nomUtilisateurClient: string, emailClient: string }
export interface IListeCommandeItem {
    commandeId: number;
    etatCommande: IEtatCommande;
    dateCommande: string;
    siteId: number;
    nomSite: string;
    nomUtilisateurVendeur: string;
    nomUtilisateur: string;
    utilisateurId: number;
    valideParUtilisateur: number;
    aEmporte: number;
    dateEmport: string;
    prixLivraisonActuel: number;
    nomUtilisateurClient: string;
    emailClient: string;
    telephoneClient: string;
    adressePointLivraison: null;
    commandeDetails: ICommandeDetail[];
    montantTotalCommande?: number;
}

export interface IGestionCommandePlat {
    commandePlatId: number;
    etatCommande: IEtatCommande;
    utilisateurId: number;
    valideParUtilisateur: number;
    siteId: number;
    nomUtilisateurClient: string;
    nomUtilisateur: string,
    commandeId: number;
    montantTotalCommande: number;
    emailClient: string
}

export interface IAjoutPlat {
    platId: number;
    nomPlat: string;
    descriptionPlat: string;
    libImagePlat: string;
    avecAccompagnement: number;
    platDuJour: number;
    prixPlat: number;
    platImageEnBase64: string;
}
export interface IAjoutCommandePlatDetail {
    commandePlatId: number;
    quantiteCommande: number;
    prixPlatActuel: number;
    accompagnementId: number;
    platId: number;
}

export interface IAttribuerCommande { commandeId: number, siteId: number, nomSite: string }

export interface ICommandeDetail {
    commandeDetailId: number;
    quantiteCommande: number;
    demandeSpeciale: null;
    nomPizza: string;
    descriptionPizza: string;
    formatPizza: string;
    prixFormatActuel: number;
    patePizza: string;
    viandePizza: null;
    condimentPizza: null;
    libImagePizza: string;
    commandeSupplements: any[];
    commandeBoissons: any[];
}

export type IEtatCommande = "reçu" | "en cours" | "traité" | "terminé";

export interface ICreatePizzaFormatPayload { pizzaFormatId: number, prixPizzaFormat: number, formatId: number, pizzaId: number }

export interface IInsertPizzaPayload {
    pizzaId: number
    nomPizza: string;
    descriptionPizza: string;
    libImagePizza: string;
    pizzaImageEnBase64: string;
    categoriePizzaId: number;
    favoris: number;
    avecViande: number;
    choixViande: "avecJambon" | "avecCharcuterie" | "avecChoriso" | null;
    status: number;
    pizzaFormat: PizzaFormat[];
    estUnePizza: number,
    avecAccompagnement: number,
    peutEtrelivre: number,
    datePlatDuJour: Date
}

interface PizzaFormat {
    pizzaFormatId: number;
    formatId: number;
    libFormat: string;
    prixFormat: number;
    prixPizzaFormat: number;
}
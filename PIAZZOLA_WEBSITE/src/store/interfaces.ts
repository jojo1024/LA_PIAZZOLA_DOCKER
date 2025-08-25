import { z } from "zod";
import { banniereSchema, BoissonSchema, clientSchema, CommandeBoissonSchema, CommandeDetailSchema, CommandePayloadSchema, CommandePlatDetailSchema, CommandeSchema, CommandeSupplementSchema, CondimentSchema, FormatSchema, PateSchema, pizzaSchema, pointLivraisonSchcema, SupplementSchema, ViandeSchema } from "./schemas";

export type IFormat = z.infer<typeof FormatSchema>;
export type IPate = z.infer<typeof PateSchema>;
export type IViande = z.infer<typeof ViandeSchema>;
export type ICondiment = z.infer<typeof CondimentSchema>;

export type ISupplement = z.infer<typeof SupplementSchema>;
export type IBoisson = z.infer<typeof BoissonSchema>;
export type IPizzaItem = z.infer<typeof pizzaSchema>;
export type IBanniereItem = z.infer<typeof banniereSchema>;

export type ICommande = z.infer<typeof CommandeSchema>;
export type ICommandeDetail = z.infer<typeof CommandeDetailSchema>;
export type ICommandePlatDetail = z.infer<typeof CommandePlatDetailSchema>;
export type ICommandeBoisson = z.infer<typeof CommandeBoissonSchema>;
export type ICommandeSupplement = z.infer<typeof CommandeSupplementSchema>;
export type ICart = z.infer<typeof CommandePayloadSchema>;
export type IPointLivraison = z.infer<typeof pointLivraisonSchcema>;
export type IClient = z.infer<typeof clientSchema>;

export interface ICommandeListeFormate {
  commandeId: number;
  commandeBoissons: ICommandeBoisson[];
  commandeSupplements: ICommandeSupplement[];
  [key: string]: any; // Permet de conserver les champs additionnels provenant de la donnée brute
}

export interface ICommandex {
  commandeId: number;
  etatCommande: string;
  dateCommande: string;
  valideParVendeur: number;
  aEmporte: number;
  dateEmport: Date | null;
  rueDeLaLivraison?: string;
  zone: string;
  prixLivraisonActuel: number;
  adressePointLivraison: string;
  nomUtilisateurClient: string;
  emailClient: string;
  telephoneClient: string;
  commandeDetails: ICommandeDetail[];
}

export interface ICommandePlatx {
  commandePlatId: number;
  etatCommande: string;
  dateCommande: string;
  valideParVendeur: number;
  aEmporte: number;
  dateEmport: Date | null;
  rueDeLaLivraison?: string;
  zone: string;
  prixLivraisonActuel: number;
  adressePointLivraison: string;
  nomUtilisateurClient: string;
  emailClient: string;
  telephoneClient: string;
  commandePlatDetails: ICommandePlatDetail[];
}

export interface IPlatItem {
  platId: number;
  nomPlat: string;
  descriptionPlat: string;
  libImagePlat: string;
  avecAccompagnement: number;
  status: number;
  platDuJour: number;
  prixPlat: number;
}

export interface IDetail {
  commandeDetailId: number;
  quantiteCommande: number;
  demandeSpeciale: null;
  nomPizza: string;
  libImagePizza: string;
  descriptionPizza: string;
  pizzaFormatId: number;
  formatPizza: string;
  prixFormatActuel: number;
  pizzaGratos: boolean;
  patePizza: string;
  viandePizza: string;
  condimentPizza: null | string;
  commandeSupplements: Supplement[];
  commandeBoissons: Boisson[];
}

interface Boisson {
  nomBoisson: string;
  prixBoissonActuel: number;
  commandeDetailId: number;
}

interface Supplement {
  nomSupplement: string;
  prixSupplementActuel: number;
  commandeDetailId: number;
}

export interface IPizzaFormat {
  pizzaFormatId: number;
  nomPizza: string;
  nomFormat: string;
  pizzaId: number;
  prixPizzaFormat: number;
  avecViande: number;
}

export interface IListeSupplementItem {
  supplementId: number;
  nomSupplement: string;
  prixSupplement: number;
  nomCategorieSupplement: string;
  categorieSupplementId: number;
}
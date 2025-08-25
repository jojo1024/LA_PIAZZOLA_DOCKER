import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICondiment } from "./menuSlice";

export interface ICommandeState {
  listeCommandes: IListeCommandeItem[];
  recalculerDonneDashboard: boolean;
}

export type IEtatCommande = "reçu" | "en cours" | "traité" | "terminé";
export interface IListeCommandeItem {
  commandeId: number;
  etatCommande: IEtatCommande;
  dateCommande: string;
  siteId: number;
  nomSite: string;
  nomUtilisateurVendeur: string;
  utilisateurId: number;
  valideParUtilisateur: number;
  aEmporte: number;
  dateEmport: string;
  prixLivraisonActuel: number;
  nomUtilisateurClient: string;
  nomUtilisateur: string;
  emailClient: string;
  dateInscription: Date;
  telephoneClient: string;
  telephoneClient2: string;
  adressePointLivraison: string;
  zone: string;
  rueDeLaLivraison: string;
  commandeDetails: ICommandeDetail[];
}

export type IChoixViande = "avecJambon" | "avecCharcuterie" | "avecChoriso" | null;
export interface ICommandeDetail {
  commandeDetailId: number;
  quantiteCommande: number;
  demandeSpeciale: null;
  nomPizza: string;
  descriptionPizza: string;
  nomFormat: string;
  prixFormatActuel: number;
  nomPate: string;
  choixViande: IChoixViande;
  nomViande: string | null;
  nomCondiment: null;
  libImagePizza: string;
  nomAccompagnement: string;
  avecAccompagnement: number;
  accompagnementId: number;
  peutEtrelivre: number;
  estUnePizza: number;
  commandeSupplements: ICommandeSupplements[];
  commandeBoissons: ICommandeBoissons[];
  commandeCondiments: ICondiment[];
}

interface ICommandeSupplements {
  nomSupplement: string;
  prixSupplementActuel: number;
  commandeDetailId: number;
}

interface ICommandeBoissons {
  nomBoisson: string;
  prixBoissonActuel: number;
  commandeDetailId: number;
}
export interface IGestionCommande { commandeId: number, etatCommande: "reçu" | "en cours" | "traité", valideParVendeur: number, vendeurId: number, siteId: number }


const initialState: ICommandeState = {
  listeCommandes: [],
  recalculerDonneDashboard: false,
}

export const commandeSlice = createSlice({
  name: "commande",
  initialState: initialState,
  reducers: {
    setListeCommandes: (state, action: PayloadAction<IListeCommandeItem[]>) => {
      console.log("🚀 ~ action.payload:>>>>>>>>>>>", action.payload)
      state.listeCommandes = action.payload
    },
    addCommande: (state, action: PayloadAction<IListeCommandeItem>) => {
      state.listeCommandes.unshift(action.payload)
    },
    updateCommande: (state, action: PayloadAction<IListeCommandeItem>) => {
      const index = state.listeCommandes.findIndex((item) => item.commandeId === action.payload.commandeId)
      if (index !== -1) {
        state.listeCommandes[index] = { ...state.listeCommandes[index], ...action.payload }
      }
    },
    deleteCommande: (state, action: PayloadAction<{ commandeId: number }>) => {
      state.listeCommandes = state.listeCommandes.filter(item => item.commandeId !== action.payload.commandeId);
    },
    setRecalculerDonneDashboard: (state, action: PayloadAction<boolean>) => {
      state.recalculerDonneDashboard = !action.payload
    },
  },
});


export const {
  setListeCommandes,
  addCommande,
  updateCommande,
  deleteCommande,
  setRecalculerDonneDashboard
} = commandeSlice.actions

export default commandeSlice.reducer;
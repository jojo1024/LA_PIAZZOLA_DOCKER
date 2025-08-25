import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMenuState {
  listeCommandes: IListeCommandeItem[];
}

export interface IListeCommandeItem {
  commandeId: number;
  etatCommande: string;
  dateCommande: string;
  valideParVendeur: number;
  aEmporte: number;
  dateEmport: string;
  prixLivraisonActuel: number;
  nomUtilisateurClient: string;
  emailClient: string;
  telephoneClient: string;
  adressePointLivraison: null;
  commandeDetails: ICommandeDetail[];
}

interface ICommandeDetail {
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






const initialState: IMenuState = {
  listeCommandes: []
}

export const menuSlice: any = createSlice({
  name: "menu",
  initialState: initialState,
  reducers: {
    setListeCommandes: (state, action: PayloadAction<IListeCommandeItem[]>) => {
      state.listeCommandes = action.payload
    },
  },
});


export const {

  setListeCommandes
} = menuSlice.actions

export default menuSlice.reducer;
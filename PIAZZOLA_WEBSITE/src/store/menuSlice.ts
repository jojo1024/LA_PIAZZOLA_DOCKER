import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICart, ICommande, ICommandeDetail, ICommandePlatDetail, ICommandePlatx, ICommandex, IPizzaItem } from "./interfaces";

export interface IMenuState {
  // supplement: ISupplement[];
  // boisson: IBoisson[];
  // pizzaFormat: IPizzaFormat[];
  // pate: IPate[];
  // viande: IViande[];
  // condiment: ICondiment[];
  listePizzas: IPizzaItem[];
  listePlatsDuJour: IPizzaItem[];
  listePlats: any[]
  listeCommandes: ICommandex[];
  listeCommandesPlat: ICommandePlatx[];
  categoriePizzaActive: number;
  sInscritAuProgrammeDeFidelite: boolean;
}

export const initialiseCommandeDetail: ICommandeDetail = {
  pizzaId: 0,
  pizzaFormatId: 1,
  pateId: 1,
  viandeId: 1,
  condimentId: null,
  demandeSpeciale: null,
  quantiteCommande: 1,
  prixFormatActuel: 0,
  nomViande: "",    
  nomCondiment: "",
  categoriePizzaId: 0,
  descriptionPizza: "",
  nomFormat: "",
  nomPate: "",
  prixPizzaFormat: 0,
  favoris: false,
  libelleCategoriePizza: "",
  nomPizza: "",
  choixViande: null,
  libImagePizza: undefined,
  avecViande: 0,
  commandeBoissons: [],
  commandeSupplements: [],
  accompagnementId: 1,
  nomAccompagnement: "",
  commandeCondiments: [],
  avecAccompagnement: 0,
  estUnePizza: 1,
  platDuJour: 0, 
  peutEtrelivre: 1,
  datePlatDuJour: new Date(),
  dateHeurPlatDuJour: new Date(),
}

export const initialiseCommandePlatDetail: ICommandePlatDetail = {
  platId: 0,
  accompagnementId: 0,
  nomAccompagnement: "",
  quantiteCommande: 0,
  prixPlat: 0,
  prixPlatActuel: 0,    
  commandeBoissons: [],
  avecAccompagnement: 0,
  nomPlat: "",
  descriptionPlat: "",
  libImagePlat: ""

}

export const initialiseCommande: ICommande = {
  clientId: 0,
  etatCommande: "récu",
  valideParVendeur: false,
}

export const initialiseCommandePayload: ICart = {
  commande: initialiseCommande,
  commandeDetails: [],
}

export const initialiseCommandePlatPayload: ICart = {
  commande: initialiseCommande,
  commandeDetails: [],
}








const initialState: IMenuState = {
  // supplement: [],
  // boisson: [],
  // pizzaFormat: [],
  // pate: [],
  // viande: [],
  // condiment: [],
  listePizzas: [],
  listeCommandes: [],
  categoriePizzaActive: 0,
  sInscritAuProgrammeDeFidelite: false,
  listePlats: [],
  listeCommandesPlat: [],
  listePlatsDuJour: []

}

export const menuSlice: any = createSlice({
  name: "menu",
  initialState: initialState,
  reducers: {

    setListePizza: (state, action: PayloadAction<IPizzaItem[]>) => {
      state.listePizzas = action.payload
    },
    setListePlat: (state, action: PayloadAction<any[]>) => {
      state.listePlats = action.payload
    },
    addPizza: (state, action: PayloadAction<IPizzaItem>) => {
      state.listePizzas.unshift(action.payload)
    },

    setListeCommandes: (state, action: PayloadAction<ICommandex[]>) => {
      state.listeCommandes = action.payload
    },
    deleteCommande: (state, action: PayloadAction<{ commandeId: number }>) => {
      state.listeCommandes = state.listeCommandes.filter(item => item.commandeId !== action.payload.commandeId);
    },

    setListeCommandesPlat: (state, action: PayloadAction<ICommandePlatx[]>) => {
      state.listeCommandesPlat = action.payload
    },
    deleteCommandePlat: (state, action: PayloadAction<{ commandePlatId: number }>) => {
      state.listeCommandesPlat = state.listeCommandesPlat.filter(item => item.commandePlatId !== action.payload.commandePlatId);
    },
    setSInscritAuProgrammeDeFidelite: (state, action: PayloadAction<boolean>) => {
      state.sInscritAuProgrammeDeFidelite = action.payload
    },
    setCategoriePizzaActive: (state, action: PayloadAction<number>) => {
      state.categoriePizzaActive = action.payload
    },

    setListePlatsDuJour: (state, action: PayloadAction<IPizzaItem[]>) => {
      state.listePlatsDuJour = action.payload
    },
  },
});


export const {
  // setSupplement,
  // setBoisson,
  // setPizzaFormat,
  // setPate,
  // setViande,
  // setCondiment,
  setListePizza,
  setListeCommandes,
  setCategoriePizzaActive,
  addPizza,
  setSInscritAuProgrammeDeFidelite,
  deleteCommande,
  setListePlat,
  setListeCommandesPlat,
  deleteCommandePlat,
  setListePlatsDuJour
} = menuSlice.actions

export default menuSlice.reducer;
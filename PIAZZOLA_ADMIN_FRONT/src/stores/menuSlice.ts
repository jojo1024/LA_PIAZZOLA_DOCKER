import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IChoixViande } from "./commandeSlice";

export interface IMenuState {
  listePizzas: IListePizzaItemFormated[];
  listePlatsDuJour: IListePizzaItemFormated[];
  listeBoissons: Iboisson[];
  listeCondiments: ICondiment[];
  listeSupplements: ISupplement[];
}

export interface Iboisson { boissonId: number, nomBoisson: string, descriptionBoisson: string, prixBoisson: number | null }
export interface ICondiment { condimentId: number, nomCondiment: string }
export interface ISupplement { supplementId: number, nomSupplement: string, prixSupplement: number | null, categorieSupplementId: number, nomCategorieSupplement: string }

export interface IListePizzaItem {
  pizzaFormatId: number;
  nomPizza: string;
  nomFormat: string;
  libImagePizza: string;
  pizzaId: number;
  prixPizzaFormat: number;
  descriptionPizza: string;
  avecViande: number;
  choixViande: IChoixViande;
  favoris: number;
  status: number;
  categoriePizzaId: number;
  formatId: number;
}
export interface IListePizzaItemFormated {
  nomPizza: string;
  libImagePizza: string | null;
  pizzaFormat: IPizzaFormat[];
  status: number; // 1 pour actif (par exemple)
  descriptionPizza: string;
  avecViande: number;
  favoris: number;
  categoriePizzaId: number;
  pizzaId: number;
  pizzaImageEnBase64?: string | null;
  choixViande: IChoixViande;
  avecAccompagnement: number;
  peutEtrelivre: number;
  estUnePizza: number;
  datePlatDuJour: Date;
  dateHeurPlatDuJour: Date;
  accompagnementId?: number;
  platDuJourId: number;
};

export interface IPizzaFormat { pizzaFormatId?: number, nomFormat: string; prixPizzaFormat: number | null, formatId: number }

const initialState: IMenuState = {
  listePizzas: [],
  listeBoissons: [],
  listeCondiments: [],
  listeSupplements: [],
  listePlatsDuJour: []
}

export const menuSlice: any = createSlice({
  name: "menu",
  initialState: initialState,
  reducers: {
    // PIZZA
    setListePizzas: (state, action: PayloadAction<IListePizzaItemFormated[]>) => {
      state.listePizzas = action.payload
    },
    updatePizza: (state, action: PayloadAction<IListePizzaItemFormated>) => {
      const index = state.listePizzas.findIndex((pizza) => pizza.pizzaId === action.payload.pizzaId)
      if (index !== -1) {
        state.listePizzas[index] = action.payload
      }
    },
    deletePizza: (state, action: PayloadAction<{ status: 0 | 1, pizzaId: number }>) => {
      console.log("🚀 ~ pizzaId:", action.payload.pizzaId);
      state.listePizzas = state.listePizzas.filter(item => item.pizzaId !== action.payload.pizzaId);
    },
    addPizza: (state, action: PayloadAction<IListePizzaItemFormated>) => {
      state.listePizzas.unshift(action.payload)
    },
    // BOISSONS
    setListeBoissons: (state, action: PayloadAction<Iboisson[]>) => {
      state.listeBoissons = action.payload
    },
    addBoisson: (state, action: PayloadAction<Iboisson>) => {
      state.listeBoissons.unshift(action.payload)
    },
    updateBoisson: (state, action: PayloadAction<Iboisson>) => {
      const index = state.listeBoissons.findIndex((item) => item.boissonId === action.payload.boissonId)
      if (index !== -1) {
        state.listeBoissons[index] = action.payload
      }
    },
    deleteBoisson: (state, action: PayloadAction<{ status: 0 | 1, boissonId: number }>) => {
      state.listeBoissons = state.listeBoissons.filter(item => item.boissonId !== action.payload.boissonId);
    },
    // CONDIMENT
    setListeCondiments: (state, action: PayloadAction<ICondiment[]>) => {
      state.listeCondiments = action.payload
    },
    addCondiment: (state, action: PayloadAction<ICondiment>) => {
      state.listeCondiments.unshift(action.payload)
    },
    updateCondiment: (state, action: PayloadAction<ICondiment>) => {
      const index = state.listeCondiments.findIndex((item) => item.condimentId === action.payload.condimentId)
      if (index !== -1) {
        state.listeCondiments[index] = action.payload
      }
    },
    deleteCondiment: (state, action: PayloadAction<{ status: 0 | 1, condimentId: number }>) => {
      state.listeCondiments = state.listeCondiments.filter(item => item.condimentId !== action.payload.condimentId);
    },
    // SUPPLEMENT
    setListeSupplements: (state, action: PayloadAction<ISupplement[]>) => {
      state.listeSupplements = action.payload
    },
    addSupplement: (state, action: PayloadAction<ISupplement>) => {
      state.listeSupplements.unshift(action.payload)
    },
    updateSupplement: (state, action: PayloadAction<ISupplement>) => {
      const index = state.listeSupplements.findIndex((item) => item.supplementId === action.payload.supplementId)
      if (index !== -1) {
        state.listeSupplements[index] = action.payload
      }
    },
    deleteSupplement: (state, action: PayloadAction<{ status: 0 | 1, supplementId: number }>) => {
      state.listeSupplements = state.listeSupplements.filter(item => item.supplementId !== action.payload.supplementId);
    },

    setListePlatsDuJour: (state, action: PayloadAction<IListePizzaItemFormated[]>) => {
      state.listePlatsDuJour = action.payload
    },
    updatePlatsDuJour: (state, action: PayloadAction<IListePizzaItemFormated>) => {
      const index = state.listePlatsDuJour.findIndex((pizza) => pizza.platDuJourId === action.payload.platDuJourId)
      if (index !== -1) {
        state.listePlatsDuJour[index] = action.payload
      }
    },
    addPlatsDuJour: (state, action: PayloadAction<IListePizzaItemFormated[]>) => {
      state.listePlatsDuJour = [...state.listePlatsDuJour, ...action.payload]
    },
    deletePlatDuJour: (state, action: PayloadAction<{ status: 0 | 1, platDuJourId: number }>) => {
      state.listePlatsDuJour = state.listePlatsDuJour.filter(item => item.platDuJourId !== action.payload.platDuJourId);
    },
  },
});


export const {
  // PIZZA
  setListePizzas,
  updatePizza,
  deletePizza,
  addPizza,
  // BOISSON
  setListeBoissons,
  updateBoisson,
  addBoisson,
  deleteBoisson,
  // SUPPLEMEMNT
  setListeSupplements,
  updateSupplement,
  deleteSupplement,
  addSupplement,
  // CONDIMENT
  setListeCondiments,
  updateCondiment,
  deleteCondiment,
  addCondiment,

  setListePlatsDuJour,
  updatePlatsDuJour,
  addPlatsDuJour,
  deletePlatDuJour

} = menuSlice.actions

export default menuSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICart, ICommande } from "./interfaces";

export interface ICartState {
  cart: ICart;
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


const initialState: ICartState = {
  cart: initialiseCommandePayload,
}

export const cartSlice: any = createSlice({
  name: "cart",
  initialState: initialState,
  reducers: {
    setCart: (state, action: PayloadAction<ICart>) => {
      state.cart = { ...state.cart, ...action.payload }
    },
  },
});


export const {
  setCart,
} = cartSlice.actions

export default cartSlice.reducer;
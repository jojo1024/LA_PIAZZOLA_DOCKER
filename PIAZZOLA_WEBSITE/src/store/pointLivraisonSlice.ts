import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPointLivraison } from "./interfaces";

export interface pointLivraisonState {
  pointLivraison: IPointLivraison[]
}

const initialState: pointLivraisonState = {
  pointLivraison: [],

}

export const initialisePointAdresseSelectionne = { idPointLivraison: 0, adressePointLivraison: "", prixPointLivraison: 0, zone: "" }


export const pointLivraisonSlice: any = createSlice({
  name: "pointLivraison",
  initialState: initialState,
  reducers: {
    setPointLivraison: (state, action: PayloadAction<IPointLivraison[]>) => {
      state.pointLivraison = action.payload
    },
  },
});


export const {
  setPointLivraison
} = pointLivraisonSlice.actions

export default pointLivraisonSlice.reducer;
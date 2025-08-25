import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBoisson, ICondiment, IPate, IPizzaFormat, ISupplement, IViande } from "./interfaces";

export interface IPizzaAccompagnementState {
  supplement: ISupplement[];
  boisson: IBoisson[];
  pizzaFormat: IPizzaFormat[];
  pate: IPate[];
  viande: IViande[];
  condiment: ICondiment[];
  accompagnement: IAccompagnement[]
}


interface IAccompagnement {
  accompagnementId: number;
  nomAccompagnement: string;
}


const initialState: IPizzaAccompagnementState = {
  supplement: [],
  boisson: [],
  pizzaFormat: [],
  pate: [],
  viande: [],
  condiment: [],
  accompagnement: []
}

export const pizzaAccompagnementSlice: any = createSlice({
  name: "pizzaAccompagnement",
  initialState: initialState,
  reducers: {

    setSupplement: (state, action: PayloadAction<ISupplement[]>) => {
      state.supplement = action.payload;
    },
    setBoisson: (state, action: PayloadAction<IBoisson[]>) => {
      state.boisson = action.payload;
    },
    setPizzaFormat: (state, action: PayloadAction<IPizzaFormat[]>) => {
      state.pizzaFormat = action.payload
    },
    setPate: (state, action: PayloadAction<IPate[]>) => {
      state.pate = action.payload
    },
    setViande: (state, action: PayloadAction<IViande[]>) => {
      state.viande = action.payload
    },
    setCondiment: (state, action: PayloadAction<ICondiment[]>) => {
      state.condiment = action.payload
    },
    setAccompagnement: (state, action: PayloadAction<IAccompagnement[]>) => {
      state.accompagnement = action.payload
    },
  },
});


export const {
  setSupplement,
  setBoisson,
  setPizzaFormat,
  setPate,
  setViande,
  setCondiment,
  setAccompagnement
} = pizzaAccompagnementSlice.actions

export default pizzaAccompagnementSlice.reducer;
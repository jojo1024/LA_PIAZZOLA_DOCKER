import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IClient } from "./interfaces";

export interface IAppState {
    userConnectedInfo: IClient
    aEmporter: boolean;
    userLogged: boolean;
    clientPointFidelite: IClientPointFidelite
    pizzaGratosAlreadyUsed: boolean;
    // todayPointFideliteAlreadyUse: boolean;
}

export interface IClientPointFidelite { fideliteId: number, clientId: number, point: number, dateInscriptionFidelite: Date }
export const initialiseConnectionInfo = { rueDeLaLivraison: "", adresseClient: "", emailClient: "", motDePasseClient: "", nomUtilisateurClient: "", telephoneClient: "", telephoneClient2: "" }
export const initialisePointFidelite = { clientId: 0, dateInscriptionFidelite: new Date(), fideliteId: 0, point: 0 }
const initialState: IAppState = {
    userConnectedInfo: initialiseConnectionInfo,
    aEmporter: false,
    userLogged: false,
    clientPointFidelite: initialisePointFidelite,
    pizzaGratosAlreadyUsed: false,
    // todayPointFideliteAlreadyUse: false,
}

export const appSlice: any = createSlice({
    name: "application",
    initialState: initialState,
    reducers: {
        setUserConnectedInfo: (state, action: PayloadAction<IClient>) => {
            state.userConnectedInfo = action.payload;
        },
        setAEmporter: (state, action: PayloadAction<boolean>) => {
            state.aEmporter = action.payload;
        },
        setUserLogged: (state, action: PayloadAction<boolean>) => {
            state.userLogged = action.payload;
        },
        // FIDELITE
        setClientPointFidelite: (state, action: PayloadAction<IClientPointFidelite>) => {
            state.clientPointFidelite = action.payload
        },
        setPizzaGratosAlreadyUsed: (state, action: PayloadAction<boolean>) => {
            state.pizzaGratosAlreadyUsed = action.payload
        },
        // setTodayPointFideliteAlreadyUse: (state, action: PayloadAction<boolean>) => {
        //     state.todayPointFideliteAlreadyUse = action.payload
        // },
    },
});

export const { setUserConnectedInfo, 
    setAEmporter, setUserLogged, 
    setClientPointFidelite, 
    setPizzaGratosAlreadyUsed, 
    // setTodayPointFideliteAlreadyUse
 } = appSlice.actions


export default appSlice.reducer;
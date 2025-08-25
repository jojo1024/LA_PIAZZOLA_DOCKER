import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAppState {
    connectionInfo: IUtilisateur
    userLogged: boolean;
}

export interface IUtilisateur {
    utilisateurId: number;
    nomUtilisateur: string;
    siteId: number;
    nomSite: string;
    nomRole: string;
    roleId: number;
    status?: number;
}

export const initialiseConnectionInfo = { utilisateurId: 0, nomUtilisateur: "", siteId: 0, nomSite: "", roleId: 0, nomRole: "" };

const initialState: IAppState = {
    connectionInfo: initialiseConnectionInfo,
    userLogged: false
}

export const appSlice: any = createSlice({
    name: "application",
    initialState: initialState,
    reducers: {
        setConnectionInfo: (state, action: PayloadAction<IUtilisateur>) => {
            state.connectionInfo = action.payload;
        },
     
        setUserLogged: (state, action: PayloadAction<boolean>) => {
            state.userLogged = action.payload;
        }
    },
});

export const { setConnectionInfo, setUserLogged } = appSlice.actions


export default appSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IUtilisateurState {
    listeUtilisateurs: IUtilisateur[];
    listeRoles: IRole[];
    listeSites: ISite[];
}

export interface IRole {
    roleId: number;
    nomRole: string
}

export interface ISite {
    siteId: number;
    nomSite: string
}

export interface IUtilisateur {
    utilisateurId: number;
    nomUtilisateur: string;
    nomRole: string;
    siteId: number;
    nomSite: string;
    roleId: number;
    motDePasseUtilisateur: string;
    status?: number;
    dateDerniereConnexion?: Date;
    superAdmin?: number;
}

const initialState: IUtilisateurState = {
    listeUtilisateurs: [],
    listeRoles: [],
    listeSites: []
}

export const utilisateurSlice: any = createSlice({
    name: "utilisateur",
    initialState: initialState,
    reducers: {
        setListeUtilisateurs: (state, action: PayloadAction<IUtilisateur[]>) => {
            state.listeUtilisateurs = action.payload
        },
        addUtilisateur: (state, action: PayloadAction<IUtilisateur>) => {
            state.listeUtilisateurs.unshift(action.payload)
        },
        updateUtilisateur: (state, action: PayloadAction<IUtilisateur>) => {
            const index = state.listeUtilisateurs.findIndex((item) => item.utilisateurId === action.payload.utilisateurId)
            if (index !== -1) {
                state.listeUtilisateurs[index] = action.payload
            }
        },
        deleteUtilisateur: (state, action: PayloadAction<{ status: 0 | 1, utilisateurId: number }>) => {
            state.listeUtilisateurs = state.listeUtilisateurs.filter(item => item.utilisateurId !== action.payload.utilisateurId);
        },
        setListeRoles: (state, action: PayloadAction<IRole[]>) => {
            state.listeRoles = action.payload;
        },
        setListeSites: (state, action: PayloadAction<ISite[]>) => {
            state.listeSites = action.payload;
        },
    },
});

export const {
    setListeUtilisateurs,
    addUtilisateur,
    updateUtilisateur,
    deleteUtilisateur,
    setListeRoles,
    setListeSites
} = utilisateurSlice.actions
export default utilisateurSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IClientState {
    listeClients: IClient[];

}

export interface IClient {
    clientId: number;
    nomUtilisateurClient: string;
    emailClient: string;
    telephoneClient: string;
    telephoneClient2: string;
    commentaire: string
    dateInscription: Date
}

const initialState: IClientState = {
    listeClients: []
}

export const clientSlice: any = createSlice({
    name: "client",
    initialState: initialState,
    reducers: {
        setListeClients: (state, action: PayloadAction<IClient[]>) => {
            state.listeClients = action.payload
        },
        deleteClient: (state, action: PayloadAction<{ status: 0 | 1, clientId: number }>) => {
            state.listeClients = state.listeClients.filter(item => item.clientId !== action.payload.clientId);
        },
        updateClient: (state, action: PayloadAction<IClient>) => {
            const index = state.listeClients.findIndex((item) => item.clientId === action.payload.clientId)
            if (index !== -1) {
                state.listeClients[index] = { ...state.listeClients[index], ...action.payload }
            }
        },
    },
});

export const {
    setListeClients,
    deleteClient,
    updateClient,
} = clientSlice.actions
export default clientSlice.reducer;
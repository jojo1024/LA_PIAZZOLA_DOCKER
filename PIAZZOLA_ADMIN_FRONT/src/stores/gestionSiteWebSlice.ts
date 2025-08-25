import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IListePizzaItem } from "./menuSlice";

export interface IGestionSiteWebState {
  listeSites: ISite[];
  listePointLivraison: IPointLivraison[];
  listeBannieres: IBanniere[];
  listeVideos: IVideo[];
  listeAccompagnements: IAccompagnement[];
}

export interface IAccompagnement { accompagnementId: number, nomAccompagnement: string }
export interface ISite { siteId: number, nomSite: string }
export interface IPointLivraison { idPointLivraison: number, zone: string, adressePointLivraison: string, prixPointLivraison: number | null }
export interface IBanniere { banniereId: number, pizzaId: number | null, libBanniereImage: string, banniereImageEnBase64?: string | null, bannierePublicitaire: number }
export interface IVideo { videoId: number, titre: string, lienVideo: string, status: number }

const initialState: IGestionSiteWebState = {
  listeSites: [],
  listePointLivraison: [],
  listeBannieres: [],
  listeVideos: [],
  listeAccompagnements: [],
}

export const gestionSiteWebSlice: any = createSlice({
  name: "gestionSIteWeb",
  initialState: initialState,
  reducers: {
    // SITE
    setListeSites: (state, action: PayloadAction<ISite[]>) => {
      state.listeSites = action.payload
    },
    updateSite: (state, action: PayloadAction<ISite>) => {
      const index = state.listeSites.findIndex((item) => item.siteId === action.payload.siteId)
      if (index !== -1) {
        state.listeSites[index] = action.payload
      }
    },
    deleteSite: (state, action: PayloadAction<{ status: 0 | 1, siteId: number }>) => {
      state.listeSites = state.listeSites.filter(item => item.siteId !== action.payload.siteId);
    },
    addSite: (state, action: PayloadAction<ISite>) => {
      state.listeSites.unshift(action.payload)
    },
    // VIDEO
    setListeVideos: (state, action: PayloadAction<IVideo[]>) => {
      state.listeVideos = action.payload
    },
    updateVideo: (state, action: PayloadAction<IVideo>) => {
      const index = state.listeVideos.findIndex((item) => item.videoId === action.payload.videoId)
      if (index !== -1) {
        state.listeVideos[index] = action.payload
      }
    },
    deleteVideo: (state, action: PayloadAction<{ status: 0 | 1, videoId: number }>) => {
      state.listeVideos = state.listeVideos.filter(item => item.videoId !== action.payload.videoId);
    },
    addVideo: (state, action: PayloadAction<IVideo>) => {
      state.listeVideos.unshift(action.payload)
    },
    // BANNIERE
    setListeBannieres: (state, action: PayloadAction<IBanniere[]>) => {
      state.listeBannieres = action.payload
    },
    updateBanniere: (state, action: PayloadAction<IBanniere>) => {
      const index = state.listeBannieres.findIndex((item) => item.banniereId === action.payload.banniereId)
      if (index !== -1) {
        state.listeBannieres[index] = action.payload
      }
    },
    deleteBanniere: (state, action: PayloadAction<{ status: 0 | 1, banniereId: number }>) => {
      state.listeBannieres = state.listeBannieres.filter(item => item.banniereId !== action.payload.banniereId);
    },
    addBanniere: (state, action: PayloadAction<IBanniere>) => {
      state.listeBannieres.unshift(action.payload)
    },
    // POINT LIVRAISON
    setListePointLivraison: (state, action: PayloadAction<IPointLivraison[]>) => {
      state.listePointLivraison = action.payload
    },
    addPointLivraison: (state, action: PayloadAction<IPointLivraison>) => {
      state.listePointLivraison.unshift(action.payload)
    },
    updatePointLivraison: (state, action: PayloadAction<IPointLivraison>) => {
      const index = state.listePointLivraison.findIndex((item) => item.idPointLivraison === action.payload.idPointLivraison)
      if (index !== -1) {
        state.listePointLivraison[index] = action.payload
      }
    },
    deletePointLivraison: (state, action: PayloadAction<{ status: 0 | 1, idPointLivraison: number }>) => {
      state.listePointLivraison = state.listePointLivraison.filter(item => item.idPointLivraison !== action.payload.idPointLivraison);
    },
    // ACCOMPAGNEMENT
    setListeAccompagnements: (state, action: PayloadAction<IAccompagnement[]>) => {
      state.listeAccompagnements = action.payload
    },
    addAccompagnement: (state, action: PayloadAction<IAccompagnement>) => {
      state.listeAccompagnements.unshift(action.payload)
    },
    updateAccompagnement: (state, action: PayloadAction<IAccompagnement>) => {
      const index = state.listeAccompagnements.findIndex((item) => item.accompagnementId === action.payload.accompagnementId)
      if (index !== -1) {
        state.listeAccompagnements[index] = action.payload
      }
    },
    deleteAccompagnement: (state, action: PayloadAction<{ status: 0 | 1, accompagnementId: number }>) => {
      state.listeAccompagnements = state.listeAccompagnements.filter(item => item.accompagnementId !== action.payload.accompagnementId);
    },

  },
});


export const {
  // SITE
  setListeSites,
  updateSite,
  deleteSite,
  addSite,
  // VIDEO
  addVideo,
  deleteVideo,
  updateVideo,
  setListeVideos,
  // POINT LIVRAISON
  setListePointLivraison,
  addPointLivraison,
  updatePointLivraison,
  deletePointLivraison,
  // BANNIERE
  setListeBannieres,
  updateBanniere,
  deleteBanniere,
  addBanniere,
  // ACCOMPAGNEMENT
  setListeAccompagnements,
  addAccompagnement,
  updateAccompagnement,
  deleteAccompagnement
} = gestionSiteWebSlice.actions

export default gestionSiteWebSlice.reducer;
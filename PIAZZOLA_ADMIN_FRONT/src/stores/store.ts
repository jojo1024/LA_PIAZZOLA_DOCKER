import { configureStore, ThunkAction, Action, combineReducers } from "@reduxjs/toolkit";
import darkModeReducer, { DarkModeState } from "./darkModeSlice";
import colorSchemeReducer, { ColorSchemeState } from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
import simpleMenuReducer, { SimpleMenuState } from "./simpleMenuSlice";
import { persistReducer } from "redux-persist";
import topMenuReducer, { TopMenuState } from "./topMenuSlice";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import commandeReducer, { ICommandeState } from "./commandeSlice";
import menuReducer, { IMenuState } from "./menuSlice";
import utilisateurReducer, { IUtilisateurState } from "./utilisateurSlice";
import appReducer, { IAppState } from "./appSlice";
import gestionSiteWebReducer, { IGestionSiteWebState } from "./gestionSiteWebSlice";
import clientReducer, { IClientState } from "./clientSlice";

export interface IReduxState {
  application: IAppState;
  darkMode: DarkModeState;
  colorScheme: ColorSchemeState;
  sideMenu: SimpleMenuState;
  simpleMenu: SimpleMenuState;
  topMenu: TopMenuState;
  commande: ICommandeState;
  menu: IMenuState;
  utilisateur: IUtilisateurState;
  gestionSiteWeb: IGestionSiteWebState;
  client: IClientState;
}

const reducers = combineReducers({
  application: appReducer,
  darkMode: darkModeReducer,
  colorScheme: colorSchemeReducer,
  sideMenu: sideMenuReducer,
  simpleMenu: simpleMenuReducer,
  topMenu: topMenuReducer,
  commande: commandeReducer,
  menu: menuReducer,
  utilisateur: utilisateurReducer,
  gestionSiteWeb: gestionSiteWebReducer,
  client: clientReducer,

});

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["application"], // liste des slices qui doivent etre persister
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

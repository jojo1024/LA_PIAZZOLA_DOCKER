import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import { base } from "../utils/constants";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  right:string;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
  currentSideMenu: Menu
}

export const initialSideMenu = {
  icon: "Activity",
  pathname: `${base}/`,
  title: "Aceuil",
  right:"Admin",
}


const initialState: SideMenuState = {
  menu: [
    {
      icon: "LayoutDashboard",
      pathname: `${base}/`,
      title: "Tableau de bord",
      right:"Caissier(ière)",
    },
    {
      icon: "Users",
      pathname: `${base}/gestion-utilisateurs`,
      title: "Gestion des utilisateurs",
      right:"Admin",
    },
    {
      icon: "ListOrdered",
      pathname: `${base}/gestion-commandes`,
      title: "Commandes",
      right:"Pizzaiolo",
    },
    {
      icon: "Album",
      pathname:`${base}/gestion-site`,
      title: "Gestion du site",
      right:"Admin",
    },
    {
      icon: "Menu",
      pathname:`${base}/menu`,
      title: "Menu",
      right:"Admin",
    },
    {
      icon: "Users",
      pathname:`${base}/gestion-clients`,
      title: "Liste clients",
      right:"Admin",
    },
  ],
  currentSideMenu: {
    icon: "Activity",
    pathname: `${base}/`,
    title: "Aceuil",
    right:"Admin",
  }
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    setCurrentSideMenu: (state, action: PayloadAction<Menu>) => {
      state.currentSideMenu = action.payload;
    },
  },
});

export const {
  setCurrentSideMenu,
} = sideMenuSlice.actions;


export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;

import { NavItemType } from "../app/components/Navigation/NavigationItem";
import ncNanoId from "./functions";
import facebook from "/facebook.png"
import tiktok from "/tiktok.jpg"
import youtube from "/youtube.svg";


export const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
export const BASE_URL_PROD: string = "https://admin.la-piazzola.com"
export const BASE_URL: string = isDev ? BASE_URL_PROD : BASE_URL_PROD;
// export const BASE_URL: string = isDev ? "http://127.0.0.1:50001" : BASE_URL_PROD;
// export const BASE_URL: string = BASE_URL_PROD;

export const choixViandeData = ["avecJambon", "avecCharcuterie", "avecChoriso"]

export const choixViandeitem = {
  "avecJambon": "Jambon",
  "avecCharcuterie": "Charcuterie",
  "avecChoriso": "Chorizo",
}

const OTHER_PAGE_MENU: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/menu",
    name: "Pizzas",
  },
  {
    id: ncNanoId(),
    href: "/restaurant",
    name: "Restaurant",
  },
]
// Liens pour la navigation
export const NAVIGATION_DATA: NavItemType[] = [
  {
    id: ncNanoId(),
    href: "/",
    name: "Accueil",
  },
  {
    id: ncNanoId(),
    href: "/menu",
    name: "Menu",
    type: "dropdown",
    children: OTHER_PAGE_MENU,
  },
  {
    id: ncNanoId(),
    href: "/contenu",
    name: "Contenus",
  },

  {
    id: ncNanoId(),
    href: "/fidelite",
    name: "Fidelité",
  },
  {
    id: ncNanoId(),
    href: "/contact",
    name: "Contact",
  },
];

export const liensImportantPiedDePage = [
  {
    id: "1",
    title: "Acceuil",
    lien: "/"
  },
  {
    id: "2",
    title: "Menu",
    lien: "/menu"
  },
  {
    id: "3",
    title: "Contenu",
    lien: "/contenu"
  },
  {
    id: "4",
    title: "Fidélité",
    lien: "/fidelite"
  },
  {
    id: "5",
    title: "Contact",
    lien: "/contact"
  },

]

export const reseauxSociauxImageData = [
  {
    id: 1,
    img: facebook,
    lien: "https://www.facebook.com/LAPIAZZOLA.PIZZERIA",
    alt:"facebook",
    ariaLabel:"Visitez notre page Facebook Pizzeria La Piazzola"
  },
  {
    id: 2,
    img: tiktok,
    lien: "https://www.tiktok.com/@lapiazzola",
    alt:"tiktok",
    ariaLabel:"Suivez-nous sur TikTok @lapiazzola"
  },
  {
    id: 3,
    img: youtube,
    lien: "https://youtube.com",
    alt:"youtube",
    ariaLabel:"Visitez notre chaîne YouTube"
  },
];

export const quantitePizzaData = [
  { idQuantiteCommande: 1, quantiteCommande: 1 },
  { idQuantiteCommande: 2, quantiteCommande: 2 },
  { idQuantiteCommande: 3, quantiteCommande: 3 },
  { idQuantiteCommande: 4, quantiteCommande: 4 },
  { idQuantiteCommande: 5, quantiteCommande: 5 },
  { idQuantiteCommande: 6, quantiteCommande: 6 },
  { idQuantiteCommande: 7, quantiteCommande: 7 },
  { idQuantiteCommande: 8, quantiteCommande: 8 },
  { idQuantiteCommande: 9, quantiteCommande: 9 },
  { idQuantiteCommande: 10, quantiteCommande: 10 },
]

export const sessionId = "zokdzokdpo@fddgtghhiudfsd"
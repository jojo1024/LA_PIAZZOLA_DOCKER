import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "../app/components/Footer";
import Header from "../app/components/Header";
import TermsOfSale from "../app/components/TermsOfSale";
import TermsOfUse from "../app/components/TermsOfUse";
import Cart from "../app/pages/Cart";
import ChangePassword from "../app/pages/ChangePassword";
import CompteClient from "../app/pages/CompteClient";
import Contact from "../app/pages/Contact";
import ContenuVideo from "../app/pages/ContenuVideo";
import Fidelite from "../app/pages/Fidelite";
import Home from "../app/pages/Home";
import LegalMentions from "../app/pages/LegalMentions";
import Login from "../app/pages/Login";
import MesCommandes from "../app/pages/MesCommandes";
import Page404 from "../app/pages/Page404";
import PasswordResetPage from "../app/pages/PasswordResetPage";
import SignUp from "../app/pages/SignUp";
import MenuPizza from "../app/pages/MenuPizza";
import ScrollToTop from "./ScrollToTop";
import { Page } from "./types";
import { useEffect } from "react";
import socketIO from "../socket/SocketIoClient";
import { BASE_URL } from "../utils/constant";
import MenuRestaurant from "../app/pages/MenuRestaurant";




const pages2: Page[] = [
  { path: "/", component: Home },
  { path: "/authentification", component: Login },
  { path: "/enregistrement", component: SignUp },
  { path: "/panier", component: Cart },
  { path: "/contact", component: Contact },
  { path: "/fidelite", component: Fidelite },
  { path: "/contenu", component: ContenuVideo },
  { path: "/menu", component: MenuPizza },
  { path: "/restaurant", component: MenuRestaurant },
  { path: "/compte", component: CompteClient },
  { path: "/mes-commandes", component: MesCommandes },
  { path: "/changer-mot-de-passe", component: ChangePassword },
  { path: "/mentions-legales", component: LegalMentions },
  { path: "/conditions-generales-de-vente", component: TermsOfSale },
  { path: "/conditions-generales-d-utilisation", component: TermsOfUse },
  { path: "/reinitialiser-mot-de-passe", component: PasswordResetPage },
]

const MyRoutes = () => {

  useEffect(() => {
    if (BASE_URL?.length > 0) {
      socketIO.initialize();
    }
  }, [BASE_URL]);
  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <Header />
      <Routes>
        {pages2.map(({ component: Component, path }, index) => {
          return <Route key={index} element={<Component />} path={path} />;
        })}
        <Route element={<Page404 />} path="*" />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default MyRoutes;
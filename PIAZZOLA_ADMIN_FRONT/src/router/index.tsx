import { useEffect, useState } from "react";
import { useNavigate, useRoutes } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import Acceuil from "../pages/Acceuil";
import GestionCommandes from "../pages/GestionCommandes";
import GestionSite from "../pages/GestionSite";
import GestionUtilisateurs from "../pages/GestionUtilisateurs";
import Menu from "../pages/Menu";
import socketIO from "../socket/SocketIoClient";
import { base, BASE_URL, MAX_INACTIVITY_TIME } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { IReduxState } from "../stores/store";
import Login from "../pages/Login";
import { initialiseConnectionInfo, setConnectionInfo, setUserLogged } from "../stores/appSlice";
import GestionClients from "../pages/GestionClient";
import UpdatePassword from "../pages/Login/UpdatePassword";
import {
  requestNotificationPermission,
  listenToForegroundMessages,
} from "../firebase-config";

function Router() {

  //Redux
  const dispatch = useDispatch();
  const { userLogged, connectionInfo } = useSelector((state: IReduxState) => state.application);
  console.log("🚀 ~ Router ~ connectionInfo:", connectionInfo)

  // Hooks
  const navigate = useNavigate()
  // const [lastActivity, setLastActivity] = useState(Date.now());
  const [doitChangerDeMotdepasse, setDoitChangerDeMotdepasse] = useState(false)
  const [utilisateurId, setUtilisateurId] = useState(0)

  const routes = [
    {
      path: `${base}/`,
      element: <SideMenu />,
      children: [
        {
          path: `${base}/`,
          element: <Acceuil />,
        },
        {
          path: `${base}/gestion-utilisateurs`,
          element: <GestionUtilisateurs />,
        },
        {
          path: `${base}/gestion-commandes`,
          element: <GestionCommandes />,
        },
        {
          path: `${base}/gestion-site`,
          element: <GestionSite />,
        },
        {
          path: `${base}/menu`,
          element: <Menu />,
        },
        {
          path: `${base}/gestion-clients`,
          element: <GestionClients />,
        },
      ],
    },

  ];

  const handleLogout = async () => {
    try {
      navigate('/')
      // dispatch(setCurrentSideMenu(initialSideMenu))
      dispatch(setUserLogged(false))
      dispatch(setConnectionInfo(initialiseConnectionInfo))
    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error)
    }
  }

  useEffect(() => {
    if (BASE_URL.length > 0) {
      socketIO.initialize();
    }
  }, [BASE_URL]);

  // Si l'utilisateur n'est pas un admin toujours le redirger vers la gestion des commandes
  useEffect(() => {
    if (!(connectionInfo?.nomRole === "Admin" || connectionInfo?.nomRole === "Caissier(ière)") ) return navigate("/gestion-commandes")
  }, [])


  // useEffect(() => {
  //   const handleActivity = () => setLastActivity(Date.now());
  //   window.addEventListener('mousemove', handleActivity);
  //   window.addEventListener('keydown', handleActivity);
  //   return () => {
  //     window.removeEventListener('mousemove', handleActivity);
  //     window.removeEventListener('keydown', handleActivity);
  //   };
  // }, []);

  // useEffect(() => {
  //   const timeoutId = setTimeout(() => {
  //     handleLogout();
  //   }, MAX_INACTIVITY_TIME);
  //   return () => clearTimeout(timeoutId);
  // }, [lastActivity]);

  useEffect(() => {
    // requestNotificationPermission();
    listenToForegroundMessages();
  }, []);

  return (
    !userLogged && !connectionInfo?.nomUtilisateur
    ?
    // Rendre le composant Login si l'utilisateur n'est pas connecté
    doitChangerDeMotdepasse
      ?
      <UpdatePassword utilisateurId={utilisateurId} setDoitChangerDeMotdepasse={setDoitChangerDeMotdepasse} />
      :
      <Login setUtilisateurId={setUtilisateurId} setDoitChangerDeMotdepasse={setDoitChangerDeMotdepasse} />
    :
    // Utiliser les routes si l'utilisateur est connecté
    useRoutes(routes));
}

export default Router;

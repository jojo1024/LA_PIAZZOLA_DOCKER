import io from "socket.io-client";
import { store } from "../stores/store";
// import { IConnectionInfos, setConnectionInfos } from "../stores/appSlice";

import { BASE_URL } from "../utils/constants";
import { addCommande, deleteCommande, ICommandeState, IGestionCommande, IListeCommandeItem, setListeCommandes, setRecalculerDonneDashboard, updateCommande } from "../stores/commandeSlice";
import { addUtilisateur, deleteUtilisateur, IUtilisateur, updateUtilisateur } from "../stores/utilisateurSlice";
import { addBanniere, addPointLivraison, addSite, deleteBanniere, deletePointLivraison, deleteSite, IBanniere, IPointLivraison, ISite, updateBanniere, updatePointLivraison, updateSite } from "../stores/gestionSiteWebSlice";
import { addPizza, addPlatsDuJour, deletePizza, deletePlatDuJour, IListePizzaItem, IListePizzaItemFormated, updatePizza, updatePlatsDuJour } from "../stores/menuSlice";

export interface IServerConnectionInfos {
  ip: string;
  port: number;
  socketID?: string;
}


const socketIO = {
  initialize: () => {
    const query = {
      type: "webClient",
    };

    // @ts-ignore
    const socket = io(BASE_URL, { transports: ["websocket"], query: query });

    //  à la connexion
    socket.on("connected", (cnxInfos: any) => {
      console.log("🚀 ~ socket.on ~ cnxInfos:", cnxInfos)
      // store.dispatch(setConnectionInfos({ ...cnxInfos }));
    });

    // UTILISATEUR
    socket.on('ajouter_utilisateur', (data: IUtilisateur) => {
      store.dispatch(addUtilisateur(data))
    });
    socket.on('modifier_utilisateur', (data: IUtilisateur) => {
      store.dispatch(updateUtilisateur(data))
    });
    socket.on('supprimer_utilisateur', (utilisateurId: number) => {
      store.dispatch(deleteUtilisateur({ utilisateurId, status: 0 }))
    });
    socket.on('gestion_commande', (data: IListeCommandeItem) => {
      store.dispatch(updateCommande(data))
    });

    // SITE
    socket.on('ajouter_site', (data: ISite) => {
      store.dispatch(addSite(data))
    });
    socket.on('modifier_site', (data: ISite) => {
      store.dispatch(updateSite(data))
    });
    socket.on('supprimer_site', (siteId: number) => {
      store.dispatch(deleteSite({ siteId, status: 0 }))
    });

    // POINT LIVRAISON
    socket.on('ajouter_point_livraison', (data: IPointLivraison) => {
      store.dispatch(addPointLivraison(data))
    });
    socket.on('modifier_point_livraison', (data: IPointLivraison) => {
      store.dispatch(updatePointLivraison(data))
    });
    socket.on('supprimer_point_livraison', (idPointLivraison: number) => {
      store.dispatch(deletePointLivraison({ idPointLivraison, status: 0 }))
    });

    // PIZZA
    socket.on('ajouter_pizza', (data: IListePizzaItem) => {
      store.dispatch(addPizza(data))
    });
    socket.on('modifier_pizza', (data: IListePizzaItem) => {
      store.dispatch(updatePizza(data))
    });
    socket.on('supprimer_pizza', (pizzaId: number) => {
      store.dispatch(deletePizza({ pizzaId, status: 0 }))
    });

    // BANNIERE
    socket.on('ajouter_banniere', (data: IBanniere) => {
      store.dispatch(addBanniere(data))
    });
    socket.on('modifier_banniere', (data: IBanniere) => {
      store.dispatch(updateBanniere(data))
    });
    socket.on('supprimer_banniere', (banniereId: number) => {
      store.dispatch(deleteBanniere({ banniereId, status: 0 }))
    });

    // COMMANDE
    socket.on('gestion_commande', (data: IListeCommandeItem) => {
      store.dispatch(updateCommande(data))
    });

    socket.on('ajouter_commande', (data: { commandeData: IListeCommandeItem, pointFidelite: number }) => {
      console.log("🚀 ~ socket.on ~ data:", data)
      store.dispatch(addCommande(data.commandeData))
      store.dispatch(setRecalculerDonneDashboard(true))
    });

    socket.on('attribuer_commande', (data: IListeCommandeItem) => {
      console.log("🚀 ~ socket.on ~ data:", data)
      store.dispatch(updateCommande(data))
    });

    socket.on('annuler_commande', (data: { commandeId: number }) => {
      console.log("🚀 ~ socket.on ~ data:", data)
      store.dispatch(deleteCommande(data))
    });

    // PLAT DU JOUR
    socket.on('ajouter_plat_jour', (data: IListePizzaItemFormated[]) => {
      store.dispatch(addPlatsDuJour(data))
    });
    socket.on('modifier_plat_jour', (data: IListePizzaItemFormated[]) => {
      store.dispatch(updatePlatsDuJour(data[0]))
    });
    socket.on('supprimer_plat_du_jour', (platDuJourId: number) => {
      store.dispatch(deletePlatDuJour({ platDuJourId, status: 0 }))
    });
  },
};

export default socketIO;

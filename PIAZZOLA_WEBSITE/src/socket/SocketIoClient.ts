import io from "socket.io-client";
import { store } from "../store/store";
import { deleteCommande } from "../store/menuSlice";
import { BASE_URL } from "../utils/constant";
// import { IConnectionInfos, setConnectionInfos } from "../stores/appSlice";


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


    socket.on('annuler_commande', (data: { commandeId: number }) => {
      console.log("🚀 ~ socket.on ~ data:", data)
      store.dispatch(deleteCommande(data))
    });
 

    // socket.on('ajouter_pizza', (data: IPizzaItem) => {
    //   console.log("🚀 ~ socket.on ~ dat>>>>>>>a:", data)
    //   store.dispatch(addPizza(data))
    // });


  },
};

export default socketIO;

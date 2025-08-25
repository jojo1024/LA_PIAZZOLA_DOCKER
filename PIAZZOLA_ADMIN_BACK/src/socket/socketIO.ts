import { Socket } from "socket.io";

export interface IDevice {
  socketID: string;
  deviceType: "Desktop" | "Phone" | "Tablet" | undefined;
  modelName: string | undefined;
  connectedAt: string;
  appID: string;
  appName: string;
  userPhone: string;
  userName: string;
  deviceName: string;
}

// array des devices et postes clients connectés
//const devices: IDevice[] = [];

module.exports = (io, cnxInfos) => {
  console.log("Initialisation du socket");
  /**
   * Toutes les applications qui vont se connecter au serveur
   * doivent fournir un objet contenant userphone et appID
   * Ces informations sont récupérée ici avec socket.handshake.query
   */
  io.on("connection", (socket: Socket) => {
    // console.log("socket.handshake.query...", socket.handshake.query);




    io.to(socket.id).emit("connected");

    socket.on("disconnect", () => {
      console.log("🚀 ~ socket.on ~ disconnect:")
    });
  });
};

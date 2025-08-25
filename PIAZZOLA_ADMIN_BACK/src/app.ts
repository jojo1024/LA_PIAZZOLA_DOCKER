import express, { NextFunction, Response } from "express";
import path from "path";
import router from "./app/routes";
import { decryptPayload, encryptPayload } from "./helpers/functions";
import { IMAGE_DIR } from "./app/constants";
process.env.TZ = 'Africa/Abidjan';
const app = express();
const compression = require("compression");
const cors = require("cors");
const pkgJson = require('../package.json')
const IP = require("ip").address();
require('dotenv').config();

// creation du serveur
const httpServer = require("http").createServer(app);
// const API_VERSION = "/v1"
const PORT = 50001
const bannerImageDir = `${IMAGE_DIR}/banniere`;
const pizzaImageDir = `${IMAGE_DIR}/pizzaImage`;
// const pizzaImageDir = path.join(__dirname, "../public/pizza_image");


//instanciation du socket
const options = {
    transports: ["websocket"],
    pingTimeout: 2500,
    pingInterval: 5000,
    cors: {
        origin: "*",
        methods: ["*"],
    },
};

const io = require("socket.io")(httpServer, options);
const ioMiddleware = (req: any, res: Response, next: NextFunction) => {
    req.io = io;
    next();
};

// Middleware pour le déchiffrement du payload
const decryptPayloadMiddleware = (req, res, next) => {

    if (Object.keys(req.body).length) {
        // décrypter le payload
        const dataDecrypt = decryptPayload(req.body.data, req?.session?.id)
        // Stocker les données décryptées dans l'objet req.body
        req.body = dataDecrypt;
    }
    next();
};

// Middleware pour le chiffrement des réponses de l'API
const encryptionMiddleware = (req, res, next) => {
    const originalJson = res.json;

    // Redéfinir la méthode res.json pour crypter la réponse avant de l'envoyer
    res.json = function (data) {

        // Vérifiez si la réponse est un objet JSON
        if (typeof data === 'object' && data.status) {
            // Crypter les données JSON
            const encryptedData = encryptPayload(data.data, req?.session?.id);
            // Modifiez la réponse avec les données chiffrées
            data.data = encryptedData;
        }
        // Appelez la méthode d'origine res.json avec la réponse modifiée
        // console.log("🚀 ~ file: app.ts:67 ~ encryptionMiddleware ~ data.data:", data.data)
        originalJson.call(this, data);
    };

    next();
};

// middlewares
app.use(express.urlencoded({ limit: '50mb', extended: true, }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(compression());
app.use(ioMiddleware);

// Appliquez le middleware globalement à toutes les routes
app.use(decryptPayloadMiddleware);
app.use(encryptionMiddleware);


// routes
app.use(router);
app.use("/bannerImage", express.static(bannerImageDir));
app.use("/pizza_image", express.static(pizzaImageDir));


app.get(`/test`, function (_: any, res: any) {
    const msg = "Connecté au serveur avec succès de piazzola!";
    console.log(msg);
    res.status(201).send({
        status: 1,
        data: {
            message: msg,
        },
    });
});

// Initialisation du socket 
const cnxInfos = {
    port: PORT
};

require("./socket/socketIO")(io, cnxInfos);

const piazzolaBackAdminPath = path.resolve(__dirname, '..', 'views', 'piazzola_admin_front')
app.use('/', express.static(piazzolaBackAdminPath));
app.get("/*", function (req, res) {
    res.sendFile(`${piazzolaBackAdminPath}/index.html`);
});


//Lancement du server
const welcomeMsg = `
    ==============================
    PIAZZOLA-SERVER c v ${pkgJson.version}
    Ip: ${IP}
    Port: ${PORT}
    Site: http://${IP}:${PORT}
    Start: ${new Date().toLocaleString("fr-FR")}
    ==============================
`;

httpServer.listen(PORT, () => {
    console.log(welcomeMsg);
});

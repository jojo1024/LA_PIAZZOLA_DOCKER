import express, { NextFunction, Response } from "express";
import path from "path";
process.env.TZ = 'Africa/Abidjan';
const app = express();
const compression = require("compression");
const cors = require("cors");
const pkgJson = require('../package.json')
require('dotenv').config();

// creation du serveur
const httpServer = require("http").createServer(app);
const PORT = 50002



// middlewares
app.use(express.urlencoded({ limit: '50mb', extended: true, }));
app.use(express.json({ limit: '50mb' }));
app.use(cors());
app.use(compression());


app.get(`/test`, function (_: any, res: any) {
    const msg = "Connecté au serveur avec succès au site de piazzola!";
    console.log(msg);
    res.status(201).send({
        status: 1,
        data: {
            message: msg,
        },
    });
});




const piazzolaPath = path.resolve(__dirname, '..', 'views', 'piazzola_front')
app.use('/', express.static(piazzolaPath));
app.get("/*", function (req, res) {
    res.sendFile(`${piazzolaPath}/index.html`);
});

//Lancement du server
const welcomeMsg = `
    ==============================
    PIAZZOLA-WEBSITE  v ${pkgJson.version}
    Port: ${PORT}
    Start: ${new Date().toLocaleString("fr-FR")}
    ==============================
`;

httpServer.listen(PORT, "127.0.0.1" ,() => {
    console.log(welcomeMsg);
});

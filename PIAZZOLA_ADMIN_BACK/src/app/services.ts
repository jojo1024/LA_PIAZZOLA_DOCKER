import { randomBytes } from 'crypto';
import { clientADejaPointeAujourdhui, formatCommandess, formatDataBoisson, formatDataCondiment, formatDataSupplement, fusionnerCommandes, generateRandomCode } from "../helpers/functions";
import { ContactInfo, sendEmail } from "../helpers/sendEMail";
import { IMAGE_DIR } from "./constants";
import functions from "./functions";
import { IAccompagnement, IAttribuerCommande, IBanniere, ICreateBoissonPayload, ICreateClientPayloads, ICreateCommandeDetailPayload, ICreateCommandePayload, ICreateCondimentPayload, ICreatePointLivraisonPayload, ICreateSitePayload, ICreateSupplementPayload, ICreateUtilisateurPayload, IFidelite, IInsertPizzaPayload, IListeCommandeItem, IUpdatePassword, IVideo } from "./interfaces";
const bcrypt = require('bcrypt');
const path = require('path');
const fs = require("fs");
require("dotenv").config();
import { Message } from 'firebase-admin/lib/messaging/messaging-api';
import admin from "../firebase/firebaseAdmin";

//         // Chiffrez les données avant de les envoyer
//DEBUT CLIENT DE PIAZZOLA

/**
 * Service pour insérer un client avec mot de passe crypté
 * @param data Objet contenant les données du client
 * @returns Promise<Boolean>
 */
const insertClientService = async (data: ICreateClientPayloads, sInscritAuProgrammeDeFidelite?: boolean): Promise<ICreateClientPayloads> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Importation de bcrypt pour le hachage du mot de passe
      // const bcrypt = require('bcrypt');
      const saltRounds = 10;


      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(data?.motDePasseClient, saltRounds);

      // Mise à jour de l'objet data avec le mot de passe crypté
      const newData = { ...data, motDePasseClient: hashedPassword };

      // Appel de la fonction d'insertion
      const clientId = await functions.ajouterClient(newData);
      delete data.motDePasseClient
      if (sInscritAuProgrammeDeFidelite) {
        await functions.ajouterOuModifierClientAuProgrammeDeFidelite(clientId)
      }
      resolve({ ...data, clientId })
    } catch (error) {
      reject(error);
    }
  })
};


const inscrireClientAuProgrammeDeFidelite = async (clientId: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.ajouterOuModifierClientAuProgrammeDeFidelite(clientId);
      resolve(true)
    } catch (error) {
      reject(error);
    }
  })
};


const updateClient = async (data: ICreateClientPayloads): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.updateClient(data);
      resolve(true)
    } catch (error) {
      reject(error);
    }
  })
};

const deleteClient = async (clientId: number): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.deleteClient(clientId);
      resolve(clientId)
    } catch (error) {
      reject(error);
    }
  })
};

const updateClientPassword = async (data: IUpdatePassword): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await authenticateClient(data.emailOrnomUtilisateur, data.oldPassword);
      console.log("🚀 ~ returnnewPromise ~ client:", client)
      // console.log("🚀 ~ returnnewPromise ~ client:", client)
      if (client) {
        const saltRounds = 10;
        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(data?.newPassword, saltRounds);
        await functions.updateClientPassword(hashedPassword, data.clientId);
      }
      resolve(true)
    } catch (error) {
      reject(error);
    }
  })
};

const authenticateClient = async (emailOrnomUtilisateur: string, motDePasseClient: string, sInscritAuProgrammeDeFidelite?: boolean): Promise<object | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await functions.getClientIfExists(emailOrnomUtilisateur);
      if (client) {
        // Vérification du mot de passe
        const passwordMatch = await bcrypt.compare(motDePasseClient, client.motDePasseClient);
        if (passwordMatch) {
          // Suppression du mot de passe avant de retourner les informations
          delete client.motDePasseClient;
          if (sInscritAuProgrammeDeFidelite) {
            await functions.ajouterOuModifierClientAuProgrammeDeFidelite(client.clientId)
          }
          resolve(client);
        }
      }
      return reject({ name: "USER_NOT_EXIST", message: "Login ou mot de passe incorrecte !" })
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  })
};

const authenticateClientByEmail = async (email: string, sInscritAuProgrammeDeFidelite: boolean): Promise<object | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await functions.getClientIfExists(email);
      if (client) {
        // Suppression du mot de passe avant de retourner les informations
        delete client.motDePasseClient;
        if (sInscritAuProgrammeDeFidelite) {
          await functions.ajouterOuModifierClientAuProgrammeDeFidelite(client.clientId)
        }
        resolve(client);
      }
      resolve(null)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  })
};


const envoyerMotDePasseOublieClient = async (emailClientMDPOublie: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const client = await functions.getClientIfExists(emailClientMDPOublie);
      if (client) {
        // Générez un jeton unique
        const token = randomBytes(16).toString('hex');

        // Stockez le jeton dans la base avec une expiration
        const expires = new Date();
        expires.setHours(expires.getHours() + 1); // Valide pendant 1 heure
        await functions.ajouterResetPassword(client.clientId, token, expires)
        // Lien de réinitialisation
        const resetLink = `https://la-piazzola.com/reinitialiser-mot-de-passe?token=${token}`;
        // Envoyez l'email
        const message = `
    Bonjour ${client.nomUtilisateurClient},

    Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.

    Vous pouvez réinitialiser votre mot de passe en cliquant sur le lien suivant :
    ${resetLink}

    Ce lien expirera dans 1 heure.

    Si vous n'avez pas demandé de réinitialisation, ignorez cet email.

    Merci,
    L'équipe Support
  `;
        await sendEmail({ name: client.nomUtilisateurClient, email: client.emailClient, emailTo: client.emailClient, subject: "RECUPERATION DE MOT DE PASSE", message });
        resolve(true);
      }
      return reject({ name: "EMAIL_ERROR", message: "L'email entré n'existe pas !" })
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  })
};


const resetPassword = async (token: string, newPassword: string): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Recherchez le jeton
      const passwordReset: any = await functions.findResetPasswordByToken(token);
      if (!passwordReset || passwordReset?.expires < new Date()) {
        return reject({ name: "Error", message: "Jeton invalide ou expiré" })
      }
      // Recherchez par id
      const client = await functions.getClientById(passwordReset.clientId);
      if (!client) return reject({ name: "Error", message: "Utilisateur non trouvé" })
      // Hash le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await functions.updateClientPassword(hashedPassword, client?.clientId)
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  })
};

const recupListeClients = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const listeCLients = await functions.recupListeClients();
      resolve(listeCLients)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  })
};


const envoyerCodeConfirmationDeCompteParMail = (data: ICreateClientPayloads) => {
  return new Promise(async (resolve, reject) => {
    try {
      const codeConfirmation = generateRandomCode()
      const res = await sendEmail({ name: data.nomUtilisateurClient, email: data.emailClient, message: `Bonjour ${data.nomUtilisateurClient}, le code de confirmation de votre compte est: ${codeConfirmation}`, subject: "CODE DE CONFIRMATION", emailTo: data.emailClient });
      await functions.ajouterCodeConfirmationMail(data.emailClient, codeConfirmation)
      if (res) return resolve(true)
      return reject(false)
    } catch (error) {
      reject(error)
      console.log("🚀 ~ returnnewPromise ~ error:", error)
    }
  })
}


const verifierCodeInsertionClient = (data: ICreateClientPayloads, codeConfirmation: string, sInscritAuProgrammeDeFidelite?: boolean) => {
  return new Promise(async (resolve, reject) => {
    try {
      const codes: any = await functions.recupListeCodeConfirmationByEmailClient(data.emailClient)
      if (!codes || codes.length === 0) {
        return reject({ name: "ERROR_CHECK_ERROR", message: "Aucun code de confirmation trouvé pour cet email. !" });
      }

      if (codes[0].code !== codeConfirmation) {
        return reject({ name: "ERROR_CHECK_ERROR", message: "Le code que vous avez fourni n'est pas correct !" });
      }

      const client = insertClientService(data, sInscritAuProgrammeDeFidelite)
      // await functions.supprimerCodeConfirmation(data.emailClient)
      resolve(client)
    } catch (error) {
      reject(error)
      console.log("🚀 ~ returnnewPromise ~ error:", error)
    }
  })
}

// FIN CLIENT

// DEBUT UTILISATEUR


const insertUtilisateurService = async (data: ICreateUtilisateurPayload): Promise<ICreateUtilisateurPayload> => {
  return new Promise(async (resolve, reject) => {
    try {
      const motDePasseInitial = generateRandomCode()
      const utilisateurId = await functions.insertUtilisateur(data, motDePasseInitial);
      // delete data.motDePasseUtilisateur
      resolve({ ...data, utilisateurId, motDePasseInitial })
    } catch (error) {
      reject(error);
    }
  })
};

const updateUtilisateurPassword = async (utilisateurId: number, motDePasse: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Importation de bcrypt pour le hachage du mot de passe
      const bcrypt = require('bcrypt');
      const saltRounds = 10;

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(motDePasse, saltRounds);

      await functions.updateUtilisateurPassword(utilisateurId, hashedPassword);
      const utilisateur = await functions.recupListeUtilisateurs(utilisateurId)
      resolve(utilisateur[0])
    } catch (error) {
      reject(error);
    }
  })
};

const updateUtilisateur = async (data: ICreateUtilisateurPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.updateUtilisateur(data);
      const utilisateur = await functions.recupListeUtilisateurs(data.utilisateurId)
      resolve(utilisateur[0])
    } catch (error) {
      reject(error);
    }
  })
};

const authenticateUtilisateur = async (nomUtilisateur: string, motDePasse: string): Promise<object | null> => {
  try {
    const utilisateur = await functions.getUtilisateurIfExists(nomUtilisateur);
    if (!utilisateur) {
      throw { name: "USER_NOT_EXIST", message: "Login ou mot de passe incorrect !" };
    }

    if (utilisateur.motDePasseAChange === 1 && utilisateur?.motDePasseInitial !== motDePasse) {
      throw { name: "USER_NOT_EXIST", message: "Login ou mot de passe incorrect !" };
    }

    // Vérifier si l'utilisateur doit changer son mot de passe
    if (utilisateur.motDePasseAChange === 1) {
      throw { name: "USER_HAS_TO_CHANGE_PASSWORD", message: "Vous devez changer votre mot de passe", utilisateurId: utilisateur?.utilisateurId };
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasseUtilisateur);
    if (!passwordMatch) {
      throw { name: "USER_NOT_EXIST", message: "Login ou mot de passe incorrect !" };
    }
    const date = new Date()
    await functions.modifierDateDerniereConnexionUtilisateur(utilisateur.utilisateurId, date);
    // Utilisateur avec toutes les informations
    const utilisateurFinal = await functions.recupListeUtilisateurs(utilisateur.utilisateurId);

    // Supprimer le mot de passe avant de retourner l'utilisateur
    const { motDePasseUtilisateur, ...userWithoutPassword } = utilisateurFinal[0];
    return userWithoutPassword;
  } catch (error) {
    console.error("🚀 ~ authenticateUtilisateur ~ error:", error);
    throw error;
  }
};


const recupListeUtilisateurs = async (): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      const listeUtilisateurs = await functions.recupListeUtilisateurs();
      resolve(listeUtilisateurs)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  })
};

const deleteUtilisateur = (utilisateurId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.deleteUtilisateur(utilisateurId)
      resolve(utilisateurId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

// FIN UTILISATEUR

// PIZZA

const insertPizza = (data: IInsertPizzaPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pizzaImageEnBase64, pizzaFormat } = data
      // let newPizzaFormat = []
      // const imageDir = path.join(__dirname, "../../public/pizza_image");
      const imageDir = `${IMAGE_DIR}/pizzaImage`;
      // Vérifie que le dossier d'enregistrement existe, sinon le crée
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
      }
      // Ajouter l'image de la pizza dans le dossier banner
      const filename = `${Date.now()}.webp`;
      const filepath = path.join(imageDir, filename);
      const binaryData = Buffer.from(pizzaImageEnBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
      fs.writeFileSync(filepath, binaryData);
      const pizzaId = await functions.insertPizza({ ...data, libImagePizza: filename })
      for (const item of pizzaFormat) {
        const pizzaFormatId = await functions.insertPizzaFormat({ prixPizzaFormat: item.prixPizzaFormat, formatId: item.formatId, pizzaId })
        // newPizzaFormat.push({ pizzaFormatId, prixPizzaFormat: item.prixPizzaFormat, formatId: item.formatId })
      }
      // const pizza = await functions.recupListePizza(pizzaId)
      resolve({ ...data, libImagePizza: filename, pizzaId })
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "INSERT_PIZZA8ERROR", message: "Erreur lors de l'enregistrement de la pizza!" });
    }
  });
};

const modifierPizza = (data: IInsertPizzaPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { pizzaId, pizzaFormat, libImagePizza } = data
      let filename = libImagePizza
      if (data?.pizzaImageEnBase64) {
        filename = `${Date.now()}.webp`;
        const imageDir = `${IMAGE_DIR}/pizzaImage`;
        const filepath = path.join(imageDir, filename);
        const binaryData = Buffer.from(data.pizzaImageEnBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
        fs.writeFileSync(filepath, binaryData);
        // Supprimer le fichier si ça existe
        fs.access(`${imageDir}/${libImagePizza}`, fs.constants.F_OK, (err) => {
          if (err) {
            console.error("Le fichier n'existe pas !");
          } else {
            fs.unlink(`${imageDir}/${libImagePizza}`, (err) => {
              if (err) throw err;
              console.log("Le fichier a été supprimé avec succès !");
            });
          }
        });
      }

      await functions.modifierPizza({ ...data, libImagePizza: filename })

      for (const item of pizzaFormat) {
        await functions.modifierPizzaFormat({ prixPizzaFormat: item.prixPizzaFormat, formatId: item.formatId, pizzaId, pizzaFormatId: item.pizzaFormatId })
      }
      resolve(data)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

const recupListePizza = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pizzas = await functions.recupListePizza()
      console.log("🚀 ~ returnnewPromise ~ pizzas:", pizzas)
      resolve(pizzas)
    } catch (error) {
      reject(error);
    }
  });
};

const recupPizzaFormat = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const format = await functions.recupPizzaFormat()
      resolve(format)
    } catch (error) {
      reject(error);
    }
  });
};

const supprimerPizza = (pizzaId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerPizza(pizzaId)
      resolve(pizzaId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

// BOISSONS

const recupBoisson = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const boissons = await functions.recupBoisson()
      resolve(boissons);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const ajouterBoisson = (data: ICreateBoissonPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const boissonId = await functions.ajouterBoisson(data)
      resolve({ ...data, boissonId });
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierBoisson = (data: ICreateBoissonPayload) => {
  console.log("🚀 ~ modifierBoisson ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierBoisson(data)
      resolve(data);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerBoisson = (boissonId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerBoisson(boissonId)
      resolve(boissonId);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

// CONDIMENT

const recupCondiment = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const boissons = await functions.recupCondiment()
      resolve(boissons);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const ajouterCondiment = (data: ICreateCondimentPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const condimentId = await functions.ajouterCondiment(data)
      resolve({ ...data, condimentId });
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierCondiment = (data: ICreateBoissonPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierBoisson(data)
      resolve(data);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerCondiment = (condimentId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerCondiment(condimentId)
      resolve(condimentId);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

// SUPPLEMENT


const recupSupplement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const supplement = await functions.recupSupplement()
      resolve(supplement);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const ajouterSupplement = (data: ICreateSupplementPayload) => {
  console.log("🚀 ~ ajouterSupplement ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      const supplementId = await functions.ajouterSupplement(data)
      resolve({ ...data, supplementId });
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierSupplement = (data: ICreateSupplementPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierSupplement(data)
      resolve(data);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerSupplement = (supplementId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerSupplement(supplementId)
      resolve(supplementId);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};



// COMMANDE PIZZA

// const gererCommande = async (data: IListeCommandeItem): Promise<any> => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       await functions.gererCommande(data);
//       if (data.etatCommande === "en cours") {
//         const message = `
//         Bonjour ${data?.nomUtilisateurClient},

//         je suis ${data?.nomUtilisateur} et je me charge de votre commande .
//         Votre commande #${data?.commandeId} vient d’être acceptée et nos chefs sont déjà en train de la préparer avec passion (et une bonne dose de gourmandise) 😊!
//         Encore un peu de patience… Dès que votre pizza sera prête, on vous enverra un message pour vous prévenir que le livreur est en route.

//         En rappel merci de préparer la somme de ${data?.montantTotalCommande || 0} F CFA

//         🍕L'équipe de La Piazzola.
//       `;

//         sendEmail({ name: data.nomUtilisateurClient, email: data.emailClient, emailTo: data.emailClient, subject: "VOTRE COMMANDE A BIEN ETE RECUE", message });
//       }
//       if (data?.etatCommande === "traité") {
//         const message = `
//       C’est officiel ${data?.nomUtilisateurClient},

//       votre commande #${data?.commandeId} est prête et notre livreur est en route pour vous la livrer bien chaude !😁👋
//       En rappel merci d’apprêter la somme de ${data?.montantTotalCommande || 0} F CFA

//       Vous avez été servis par ${data?.nomUtilisateur}

//       Merci et à très bientôt  chez nous !    

//       🍕L'équipe de La Piazzola.
//     `;
//         sendEmail({ name: data.nomUtilisateurClient, email: data.emailClient, emailTo: data.emailClient, subject: "CONFIRMATION DE VOTRE COMMANDE POUR LA LIVRAISON", message });

//       }
//       resolve(data)
//     } catch (error) {
//       reject(error);
//     }
//   })
// };

const gererCommande = async (data: IListeCommandeItem): Promise<IListeCommandeItem> => {
  try {
    await functions.gererCommande(data);

    const messages: Record<string, { subject: string; message: string }> = {
      "en cours": {
        subject: "VOTRE COMMANDE A BIEN ÉTÉ REÇUE",
        message: `
          Bonjour ${data.nomUtilisateurClient},

          Je suis ${data.nomUtilisateur} et je me charge de votre commande.
          Votre commande #${data.commandeId} vient d’être acceptée et nos chefs sont déjà en train de la préparer avec passion (et une bonne dose de gourmandise) 😊!
          Encore un peu de patience… Dès que votre pizza sera prête, nous vous informerons que le livreur est en route.

          En rappel, merci de préparer la somme de ${data.montantTotalCommande || 0} F CFA.

          🍕 **L'équipe de La Piazzola**.
        `,
      },
      "traité": {
        subject: "CONFIRMATION DE VOTRE COMMANDE POUR LA LIVRAISON",
        message: `
          C’est officiel ${data.nomUtilisateurClient},

          Votre commande #${data.commandeId} est prête et notre livreur est en route pour vous la livrer bien chaude !😁👋
          En rappel, merci d’apprêter la somme de ${data.montantTotalCommande || 0} F CFA.

          Vous avez été servi par ${data.nomUtilisateur}.

          Merci et à très bientôt chez nous !

          🍕 **L'équipe de La Piazzola**.
        `,
      },
    };

    if (messages[data.etatCommande]) {
      sendEmail({
        name: data.nomUtilisateurClient,
        email: data.emailClient,
        emailTo: data.emailClient,
        ...messages[data.etatCommande],
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};



const attribuerCommande = async (data: IAttribuerCommande): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.attribuerCommande(data);
      resolve(data)
    } catch (error) {
      reject(error);
    }
  })
};

const annulerCommande = async (commandeId: number): Promise<any> => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.annulerCommande(commandeId);
      resolve({ commandeId })
    } catch (error) {
      reject(error);
    }
  })
};

/**
 * 
 * @param clientId 
 * @param commandeId 
 * @param thisYear recuperer que les commande de l'année en cours
 * @returns 
 */
const recupCommandeParClient = (clientId: number | null = null, commandeId: number | null = null, thisYear: boolean = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const commande: any = await functions.recupCommandeParClient(clientId, commandeId, thisYear)
      const supplements: any = await functions.recupCommandeSupplementsParClientOuEtParVendeur(clientId, commandeId, thisYear)
      const boissons: any = await functions.recupCommandeBoissonsParClientOuEtParVendeur(clientId, commandeId, thisYear)
      const condiments: any = await functions.recupCommandeCondimentsParClientOuEtParVendeur(clientId, commandeId, thisYear)
      const commandeFusionX = fusionnerCommandes(formatCommandess(commande), formatDataSupplement(supplements), formatDataBoisson(boissons), formatDataCondiment(condiments))
      resolve(commandeFusionX)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};


const ajouterCommande = (commande: ICreateCommandePayload, commandeDetails: ICreateCommandeDetailPayload[]) => {
  console.log("🚀 ~ ajouterCommande ~ commande:", commande?.rueDeLaLivraison)
  return new Promise(async (resolve, reject) => {
    try {
      let pointFidelite = commande?.pointFidelite
      // Insérer la commande et récupérer son ID
      const commandeId = await functions.ajouterCommande(commande);
      let clientFidelite: IFidelite[] | null = null
      if (commande?.commandeEligibleAuProgrammeFidelite) {
        console.log("🚀 ~ returnnewPromise ~ commande?.commandeEligibleAuProgrammeFidelite:", commande?.commandeEligibleAuProgrammeFidelite)
        // Recuperer le client avec ses points si sa commande est elligible au programme de fidélité
        clientFidelite = await functions.recupPointFidelite(commande?.clientId) as IFidelite[]
        console.log("🚀 ~ returnnewPromise ~ clientFidelite:", clientFidelite)
        if (clientFidelite.length) {
          // Si le client n'a pas encore pointé pour la date d'aujourd'hui, on lui rajoute 10 points
          console.log("🚀 ~ returnnewPromise ~ clientADejaPoinxxxteAujourdhui(clientFidelite[0]?.pointageDujour):", clientADejaPointeAujourdhui(clientFidelite[0]?.pointageDujour))
          if (!clientADejaPointeAujourdhui(clientFidelite[0]?.pointageDujour)) {
            pointFidelite = (clientFidelite[0]?.point + 10) >= 60 ? 60 : pointFidelite + 10;
            await functions.modifierClientPointPizza(commande?.clientId, clientFidelite[0]?.dateInscriptionFidelite, pointFidelite, new Date())
          }
        }
      }
      // Insérer les détails de commande, boissons et suppléments
      for (const detail of commandeDetails) {
        const commandeDetailId = await functions.ajouterCommandeDetail({ commandeId, ...detail });

        // S'il a une pizza gratos, lui retirer 60 point et modifier de la d'inscription fidélité à aujourd'hui
        if (detail?.pizzaGratos) {
          pointFidelite = 0
          await functions.modifierClientPointPizza(commande?.clientId, new Date(), 0, new Date())
        }

        // Associer les boissons au détail de commande
        if (detail?.commandeBoissons?.length) {
          for (const boisson of detail.commandeBoissons) {
            await functions.ajouterCommandeBoisson(commandeDetailId, boisson);
          }
        }

        // Associer les suppléments au détail de commande
        if (detail?.commandeSupplements?.length) {
          for (const supplement of detail.commandeSupplements) {
            await functions.ajouterCommandeSupplement(commandeDetailId, supplement);
          }
        }

        // Associer les condiments au détail de commande
        if (detail?.commandeCondiments?.length) {
          for (const condiment of detail.commandeCondiments) {
            await functions.ajouterCommandeCondiment(commandeDetailId, condiment?.condimentId);
          }
        }
      }
      await sendNotification()
      const commandeData = await recupCommandeParClient(commande.clientId, commandeId)
      resolve({ commandeData: commandeData[0], clientFidelite: clientFidelite ? { ...clientFidelite[0], point: pointFidelite } : null })

    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

const recupCommandeBoissonsParClientOuEtParVendeur = (clientId: number | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const boissons = await functions.recupCommandeBoissonsParClientOuEtParVendeur(clientId)
      resolve(boissons)
    } catch (error) {
      reject(error);
    }
  });
};

const recupCommandeSupplementsParClientOuEtParVendeur = (clientId: number | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const supplements = await functions.recupCommandeSupplementsParClientOuEtParVendeur(clientId)
      resolve(supplements)
    } catch (error) {
      reject(error);
    }
  });
};





/**BANNIERE */

const ajouterBanniere = (banniereImageEnBase64: string, pizzaId: number, bannierePublicitaire: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const imageDir = `${IMAGE_DIR}/banniere`;
      // Vérifie que le dossier d'enregistrement existe, sinon le crée
      if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir);
      }
      // Ajouter les images des bannières dans le dossier banner

      const filename = `${Date.now()}.webp`;
      const filepath = path.join(imageDir, filename);
      const binaryData = Buffer.from(banniereImageEnBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
      fs.writeFileSync(filepath, binaryData);
      const bannerId = await functions.ajouterBanniere(filename, pizzaId, bannierePublicitaire)
      // bannerIds.push(bannerId)
      const banner = await functions.recupBanniere(bannerId)
      resolve(banner[0])
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

const recupBanniere = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const banner = await functions.recupBanniere()
      resolve(banner)
    } catch (error) {
      reject(error);
    }
  });
};

const modifierBanniere = (data: IBanniere) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { libBanniereImage } = data
      let filename = libBanniereImage
      if (data?.banniereImageEnBase64) {
        filename = `${Date.now()}.webp`;
        const imageDir = `${IMAGE_DIR}/pizzaImage`;
        const filepath = path.join(imageDir, filename);
        const binaryData = Buffer.from(data.banniereImageEnBase64.replace(/^data:image\/\w+;base64,/, ""), "base64");
        fs.writeFileSync(filepath, binaryData);
        // Supprimer le fichier si ça existe
        fs.access(`${imageDir}/${libBanniereImage}`, fs.constants.F_OK, (err) => {
          if (err) {
            console.error("Le fichier n'existe pas !");
          } else {
            fs.unlink(`${imageDir}/${libBanniereImage}`, (err) => {
              if (err) throw err;
              console.log("Le fichier a été supprimé avec succès !");
            });
          }
        });
      }

      await functions.modifierBanniere({ ...data, libBanniereImage: filename })

      resolve(data)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject(error);
    }
  });
};

const supprimerBanniere = (banniereId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerBanniere(banniereId)
      resolve(banniereId)
    } catch (error) {
      reject(error);
    }
  });
};


// POINT LIVRAISON

const recupPointLivraison = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const point = await functions.recupPointLivraison()
      resolve(point)
    } catch (error) {
      reject(error);
    }
  });
};

const ajouterPointLivraison = (data: ICreatePointLivraisonPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const idPointLivraison = await functions.ajouterPointLivraison(data)
      resolve({ ...data, idPointLivraison });
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierPointLivraison = (data: ICreatePointLivraisonPayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierPointLivraison(data)
      resolve(data);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerPointLivraison = (idPointLivraison: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerPointLivraison(idPointLivraison)
      resolve(idPointLivraison);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

// SITE

const recupSite = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const point = await functions.recupSite()
      resolve(point)
    } catch (error) {
      reject(error);
    }
  });
};

const ajouterSite = (data: ICreateSitePayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      const siteId = await functions.ajouterSite(data)
      resolve({ ...data, siteId });
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierSite = (data: ICreateSitePayload) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierSite(data)
      resolve(data);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerSite = (siteId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerSite(siteId)
      resolve(siteId);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};
// PATE

const recupPate = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pate = await functions.recupPate()
      resolve(pate)
    } catch (error) {
      reject(error);
    }
  });
};

// VIANDE 

const recupViande = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const viande = await functions.recupViande()
      resolve(viande)
    } catch (error) {
      reject(error);
    }
  });
};

// ROLE

const recupRole = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const role = await functions.recupRole()
      resolve(role)
    } catch (error) {
      reject(error);
    }
  });
};



const envoyerMail = (data: ContactInfo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await sendEmail({ ...data, message: `Bonjour je suis ${data.name}, \n Email: ${data.email} \nMessage : ${data.message}`, });
      if (res) resolve(true)
      return reject(false)
    } catch (error) {
      reject(error)
      console.log("🚀 ~ returnnewPromise ~ error:", error)
    }
  })
}

// INFO SUP

const recupInfoSupByKey = (cle: string) => {
  console.log("🚀 ~ recupInfoSupByKey ~ cle:", cle)
  return new Promise(async (resolve, reject) => {
    try {
      const res = await functions.recupInfoSupByKey(cle)
      console.log("🚀 ~ returnnewPromise ~ res:", res)
      resolve({ ...res[0], data: res[0]?.data ? JSON.parse(res[0]?.data) : [] })
    } catch (error) {
      reject(error)
      console.log("🚀 ~ returnnewPromise ~ error:", error)
    }
  })
}

const ajouterOuModifierInfoSup = (cle: string, data: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await functions.ajouterOuModifierInfoSup(cle, JSON.stringify(data))
      resolve(res)
    } catch (error) {
      reject(error)
      console.log("🚀 ~ returnnewPromise ~ error:", error)
    }
  })
}

// FIDELITE

const recupClientPointFidelite = (clientId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await functions.recupClientPointFidelite(clientId)
      resolve(res[0])
    } catch (error) {
      reject(error)
      console.log("🚀 ~ returnnewPromise ~ error:", error)
    }
  })
}

// VIDEO CONTENT

const recupVideoContent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const video = await functions.recupVideoContent()
      resolve(video);
    } catch (error) {
      reject(error);
    }
  });
};

const ajouterVideo = (data: IVideo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const videoId = await functions.ajouterVideo(data)
      resolve({ ...data, videoId });
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierOuSupprimerVideo = (data: IVideo) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierOuSupprimerVideo(data)
      resolve(data);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};



// ACCOMPAGNEMENT

const recupListeAccompagnement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const accompagnement = await functions.recupAccompagnement()
      resolve(accompagnement)
    } catch (error) {
      reject(error);
    }
  });
};

const ajouterAccompagnement = (data: IAccompagnement) => {
  return new Promise(async (resolve, reject) => {
    try {
      const accompagnementId = await functions.ajouterAccompagnement(data)
      resolve({ ...data, accompagnementId });
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierOuSupprimerAccompagnement = (data: IAccompagnement) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierOuSupprimerAccompagnement(data)
      resolve(data);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

// PLAT DU JOUR

const ajouterPlatDuJour = async (pizzaIds: number[], dateHeurPlatDuJour: Date) => {
  try {
    // Utilisation de map + await pour collecter les IDs
    const platDuJourIds = await Promise.all(
      pizzaIds.map(async (item) => await functions.ajouterPlatDuJour(item, dateHeurPlatDuJour))
    );

    // Récupération des plats associés aux IDs
    const plats = await functions.recupPlatDuJour(platDuJourIds);
    return plats;
  } catch (error) {
    throw { name: "Error", message: "Une erreur inattendue est survenue." };
  }
};


const modifierPlatDuJour = (platDuJourId: number, pizzaId: number, dateHeurPlatDuJour: Date) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierPlatDuJour(platDuJourId, pizzaId, dateHeurPlatDuJour)
      const plats = await functions.recupPlatDuJour([platDuJourId])
      resolve(plats);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const recupPlatDuJour = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const plats = await functions.recupPlatDuJour()
      resolve(plats)
    } catch (error) {
      reject(error);
    }
  });
};

const supprimerPlatDuJour = (platDuJourId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.supprimerPlatDuJour(platDuJourId)
      resolve(platDuJourId);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

interface NotificationData {
  title: string;
  body: string;
}

export const sendNotification = async (
  fcmToken?: string,
  data?: NotificationData
): Promise<void> => {
  console.log("🚀 ~joelitho ndjabo:", data)
  // const message: Message = {
  //   notification: {
  //     title: "LA PIAZZOLA",
  //     body: "nouvelle commande ajoutée",
  //   },
  //   token: "flC0WYhLv9fhWBjo_Jv7Ke:APA91bFAW83sN2MAIU7xmeBVlxH7lzojoBDyv57ND6uEtYlIVR8mamqp-_x_PB2roXzrB5eGNALjXF5nuVhfUx9gQ1ZbHQTsO3Ik-kkBiF5TG4rNPYtJpfY",
  //   android: {
  //     notification: {
  //       sound: "default",
  //     },
  //   },
  //   webpush: {
  //     notification: {
  //       icon: "https://la-piazzola.com/logo_piazzola.png", // à personnaliser
  //       sound: "default",
  //     },
  //   },
  // };

  try {
    const utilisateurs = await functions.recupListeUtilisateurs()
    const pushTokens = utilisateurs
      .filter((utilisateur) => utilisateur.pushToken !== null) // Filtrer les utilisateurs avec un pushToken non-null
      .map((utilisateur) => utilisateur.pushToken); // Récupérer les pushTokens
    console.log("🚀 ~ pushTokens:", pushTokens)

    const message = {
      notification: {
        title: "LA PIAZZOLA",
        body: "nouvelle commande ajoutée",
      },
      data: {
        title: "LA PIAZZOLA",
        body: "nouvelle commande ajoutée",
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          // Options spécifiques aux navigateurs
          icon: "https://la-piazzola.com/logo_piazzola.png", // à personnaliser
          badge: "https://la-piazzola.com/logo_piazzola.png", // à personnaliser
          vibrate: [100, 50, 100],
          requireInteraction: true,
          // Ajoutez d'autres options selon vos besoins
        },
        fcmOptions: {
          link: 'https://admin.la-piazzola.com/gestion-commandes'  // URL à ouvrir quand l'utilisateur clique sur la notification
        }
      }
    };

    // pushTokens.map(async (token) => {
    //   const response = await admin.messaging().send({...message, token});
    //   console.log("🚀 ~ pushTokens.map ~ response:", response)
    // })

    await Promise.all(
      pushTokens.map(async (token) => {
        const response = await admin.messaging().send({ ...message, token });
        console.log("🚀 ~ pushTokens.map ~ response:", response)
      })
    );


    // const response = await admin.messaging().send(message);
  } catch (error) {
    console.error("❌ Erreur d’envoi de notification :", error);
  }
};

const modifierPushToken = (utilisateurId: number, pushToken: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      await functions.modifierPushToken(utilisateurId, pushToken)
      resolve(true);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

export default {
  // CLIENT
  insertClientService,
  updateClient,
  deleteClient,
  updateClientPassword,
  authenticateClient,
  authenticateClientByEmail,
  recupListeClients,
  envoyerCodeConfirmationDeCompteParMail,
  verifierCodeInsertionClient,
  envoyerMotDePasseOublieClient,
  resetPassword,
  inscrireClientAuProgrammeDeFidelite,
  // UTILISATEUR
  insertUtilisateurService,
  updateUtilisateur,
  authenticateUtilisateur,
  recupListeUtilisateurs,
  deleteUtilisateur,
  updateUtilisateurPassword,
  // PIZZA
  recupPizzaFormat,
  insertPizza,
  modifierPizza,
  supprimerPizza,
  recupListePizza,
  // COMMANDE PIZZA
  recupCommandeParClient,
  gererCommande,
  ajouterCommande,
  recupCommandeBoissonsParClientOuEtParVendeur,
  recupCommandeSupplementsParClientOuEtParVendeur,
  attribuerCommande,
  annulerCommande,

  // BOISSON
  recupBoisson,
  ajouterBoisson,
  modifierBoisson,
  supprimerBoisson,
  // CONDIMENT
  recupCondiment,
  ajouterCondiment,
  modifierCondiment,
  supprimerCondiment,
  // SUPPLEMENT
  recupSupplement,
  ajouterSupplement,
  modifierSupplement,
  supprimerSupplement,
  // SITE
  recupSite,
  ajouterSite,
  modifierSite,
  supprimerSite,
  //BANNIERE
  recupBanniere,
  supprimerBanniere,
  ajouterBanniere,
  modifierBanniere,
  // POINT LIVRAISON
  recupPointLivraison,
  ajouterPointLivraison,
  modifierPointLivraison,
  supprimerPointLivraison,
  // PATE
  recupPate,
  // VIANDE
  recupViande,
  // ROLE
  recupRole,
  envoyerMail,
  // INFO SUP
  recupInfoSupByKey,
  ajouterOuModifierInfoSup,
  // FIDELITE
  recupClientPointFidelite,
  // VIDEO CONTENT
  recupVideoContent,
  ajouterVideo,
  modifierOuSupprimerVideo,
  // ACCOMPAGNEMENT
  recupListeAccompagnement,
  ajouterAccompagnement,
  modifierOuSupprimerAccompagnement,
  // PLAT DU JOUR
  ajouterPlatDuJour,
  modifierPlatDuJour,
  recupPlatDuJour,
  supprimerPlatDuJour,
  sendNotification,
  modifierPushToken
};

import { _executeSql, _selectSql } from '../databases/mysql';
import { IAccompagnement, IAjoutCommandePlatDetail, IAjoutPlat, IAttribuerCommande, IBanniere, ICommandeBoissonSchemaPayload, ICommandeCondimentSchemaPayload, ICommandeSupplementPayload, ICreateBoissonPayload, ICreateClientPayloads, ICreateCommandeDetailPayload, ICreateCommandePayload, ICreateCommandePlatDetailPayload, ICreateCondimentPayload, ICreateFormatPayload, ICreatePatePayload, ICreatePizzaFormatPayload, ICreatePizzaPayload, ICreatePointLivraisonPayload, ICreateSitePayload, ICreateSupplementPayload, ICreateUtilisateurPayload, IGestionCommande, IGestionCommandePlat, IInsertPizzaPayload, IListeCommandeItem, IVideo } from './interfaces';


//DEBUT CLIENT DE PIAZZOLA

/**
 * Insérer un nouveau client dans la table `clients`
 * @param data Objet contenant les données du client
 * @returns Promise<Boolean>
 */
const ajouterClient = (data: ICreateClientPayloads): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO client ( nomUtilisateurClient, emailClient, telephoneClient, motDePasseClient) VALUES (?, ?, ?, ?)`;
      const values = [
        data.nomUtilisateurClient,
        data.emailClient,
        data.telephoneClient,
        data.motDePasseClient
      ];
      const client: any = await _executeSql(sql, values);
      resolve(client.insertId)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('emailClient')) {
          reject({ name: "DuplicateEmailError", message: "L'adresse e-mail est déjà utilisée." });
        } else if (error.message.includes('telephoneClient')) {
          reject({ name: "DuplicatePhoneError", message: "Le numéro de téléphone est déjà utilisé." });
        } else if (error.message.includes('nomUtilisateurClient')) {
          reject({ name: "DuplicateUernameError", message: "Le nom utilisateur est déjà utilisé." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de l'insertion du client :", error.message || error);
        reject({ name: "insertClientError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};


const ajouterCodeConfirmationMail = (emailClient: string, code: string): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO codeVerificationTemp ( email, code) VALUES (?, ?)`;
      const values = [
        emailClient,
        code,
      ];
      const codeConf: any = await _executeSql(sql, values);
      resolve(codeConf.insertId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const ajouterResetPassword = (clientId: number, token: string, expires: Date): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO resetPassword ( clientId, token, expires) VALUES (?, ?, ?)`;
      const values = [
        clientId,
        token,
        expires
      ];
      const codeConf: any = await _executeSql(sql, values);
      resolve(codeConf.insertId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const findResetPasswordByToken = (token: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM resetPassword WHERE token = ? ORDER BY resetPasswordId DESC;`;
      const result: any = await _executeSql(sql, [token]);
      resolve(result[0])
    } catch (error) {
      console.log("🚀 ~ newPromise<void> ~ error:", error)
      reject(error)
    }
  })
}

const recupListeCodeConfirmationByEmailClient = (emailClient: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM codeVerificationTemp WHERE email = ? ORDER BY codeVerificationId DESC;`;
      const result: any = await _executeSql(sql, [emailClient]);
      resolve(result)
    } catch (error) {
      console.log("🚀 ~ newPromise<void> ~ error:", error)
      reject(error)
    }
  })
}

const supprimerCodeConfirmation = (emailClient: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `DELETE FROM codeVerificationTemp WHERE codeVerificationId = ?`;
      const values = [emailClient]
      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise<void> ~ error:", error)
      reject(error)
    }
  })
}


/**
 * Modifier un client existant dans la table `clients`
 * @param clientId ID du client à modifier
 * @param data Objet contenant les nouvelles données du client
 * @returns Promise<Boolean>
 */
const updateClient = (data: ICreateClientPayloads): Promise<boolean> => {
  console.log("🚀 ~ updateClient ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE client SET 
        nomUtilisateurClient = ?, 
        telephoneClient = ?,
        telephoneClient2 = ?,
        adresseClient = ?,
        idPointLivraison = ?,
        rueDeLaLivraison = ?,
        commentaire = ?
      WHERE clientId = ?`;

      const values = [
        data.nomUtilisateurClient,
        data.telephoneClient,
        data.telephoneClient2,
        data?.adresseClient,
        data?.idPointLivraison,
        data?.rueDeLaLivraison,
        data?.commentaire,
        data.clientId,
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('emailClient')) {
          reject({ name: "DuplicateEmailError", message: "L'adresse e-mail est déjà utilisée." });
        } else if (error.message.includes('telephoneClient')) {
          reject({ name: "DuplicatePhoneError", message: "Le numéro de téléphone est déjà utilisé." });
        } else if (error.message.includes('nomUtilisateurClient')) {
          reject({ name: "DuplicateUernameError", message: "Le nom utilisateur est déjà utilisé." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification du client :", error.message || error);
        reject({ name: "updateClientError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

/**
 * Supprimer un client dans la table `clients` en changeant son statut à 0
 * @param clientId 
 * @param status 
 * @returns 
 */
const deleteClient = (clientId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE client SET status = ? WHERE clientId = ?`;
      const values = [0, clientId]
      const result: any = await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise<void> ~ error:", error)
      reject(error)
    }
  })
}

/**
 * Récuperer la liste des clients
 */
const recupListeClients = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM client WHERE status = 1;`;
      const result: any = await _selectSql(sql);
      resolve(result)
    } catch (error) {
      console.log("🚀 ~ newPromise<void> ~ error:", error)
      reject(error)
    }
  })
}

/**
 * Vérifier si un nom d'utilisateur ou un email existe déjà dans la table `client`
 * @param nomUtilisateur Nom d'utilisateur à vérifier
 * @param email Email à vérifier
 * @returns Promise<object | null>
 */
const getClientIfExists = (emailOrnomUtilisateur: string): Promise<ICreateClientPayloads | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM client WHERE (nomUtilisateurClient = ? OR emailClient = ?) AND status = 1`;
      const values = [emailOrnomUtilisateur, emailOrnomUtilisateur];
      const result: any = await _executeSql(sql, values);
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
};
const getClientById = (clientId: number | null = null): Promise<ICreateClientPayloads | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM client WHERE clientId = ?`;
      const values = [clientId];
      const result: any = await _executeSql(sql, values);
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Modifier le mot de passe d'un client
 * @param passwordHached 
 * @param clientId 
 * @returns 
 */
const updateClientPassword = (passwordHached: string, clientId: number): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE client SET 
        motDePasseClient = ? 
      WHERE clientId = ?`;

      const values = [
        passwordHached,
        clientId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      reject({ name: "updateClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};

// FIN CLIENT

// DEBUT UTILISATEUR DE PIAZZOLA ADMIN FRONT

/**
 * Insérer un nouvel utilisateur dans la table `utilisateur`
 * @param data Objet contenant les données de l'utilisateur
 * @returns Promise<Boolean>
 */
const insertUtilisateur = (data: ICreateUtilisateurPayload, motDePasseInitial: string): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO utilisateur ( nomUtilisateur, siteId,  roleId, motDePasseInitial) VALUES (?, ?, ?, ?)`;
      const values = [
        data.nomUtilisateur,
        data?.siteId,
        data.roleId,
        motDePasseInitial
      ];
      const client: any = await _executeSql(sql, values);
      resolve(client.insertId)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomUtilisateur')) {
          reject({ name: "DuplicateNomUtilisateur", message: "Ce nom utilisateur est déjà utilisée." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de l'insertion de l'utilisateur :", error.message || error);
        reject({ name: "insertUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

/**
 * Modifier un utilisateur existant dans la table `utilisateur`
 * @param utilisateurId ID de l'utilisateur à modifier
 * @param data Objet contenant les nouvelles données de l'utilisateur
 * @returns Promise<Boolean>
 */
const updateUtilisateur = (data: ICreateUtilisateurPayload): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE utilisateur SET 
        nomUtilisateur = ?, 
        roleId = ?, 
        siteId = ?
      WHERE utilisateurId = ?`;

      const values = [
        data.nomUtilisateur,
        data?.roleId,
        data?.siteId,
        data.utilisateurId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomUtilisateur')) {
          reject({ name: "DuplicateNomUtilisateur", message: "Ce nom utilisateur est déjà utilisée." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
        reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
}
const updateUtilisateurPassword = (utilisateurId: number, motDePasse: string): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE utilisateur SET 
        motDePasseUtilisateur = ?, 
        motDePasseAChange = ?
      WHERE utilisateurId = ?`;

      const values = [
        motDePasse,
        0,
        utilisateurId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomUtilisateur')) {
          reject({ name: "DuplicateNomUtilisateur", message: "Ce nom utilisateur est déjà utilisée." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
        reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

/**
 * Supprimer un utilisateur dans la table `utilisateur` en changeant son statut à 0
 * @param utilisateurId 
 * @param status 
 * @returns 
 */
const deleteUtilisateur = (utilisateurId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE utilisateur SET status = ? WHERE utilisateurId = ?`;
      const values = [0, utilisateurId]
      await _executeSql(sql, values);
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });

    }
  });
}

const modifierDateDerniereConnexionUtilisateur = (utilisateurId: number, dateDerniereConnexion: Date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE utilisateur SET dateDerniereConnexion = ? WHERE utilisateurId = ?`;
      const values = [dateDerniereConnexion, utilisateurId]
      await _executeSql(sql, values);
      resolve({ dateDerniereConnexion, utilisateurId })
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });

    }
  });
}

/**
 * Récuperer la liste des utilisateurs
 */
interface Utilisateur {
  utilisateurId: number;
  nomUtilisateur: string;
  roleUtilisateur: string;
  motDePasseUtilisateur: string;
  nomSite: string;
  siteId: number;
  nomRole: string;
  roleId: number;
  pushToken: string;
}

const recupListeUtilisateurs = (utilisateurId: number | null = null): Promise<Utilisateur[]> => {
  return new Promise<Utilisateur[]>(async (resolve, reject) => {
    try {
      let sql = `
        SELECT 
          u.utilisateurId, 
          u.dateDerniereConnexion, 
          u.nomUtilisateur, 
          u.motDePasseInitial, 
          u.superAdmin,
          u.pushToken,
          u.roleUtilisateur, 
          s.nomSite,
          s.siteId,
          r.nomRole,
          r.roleId
        FROM utilisateur u
        INNER JOIN site s ON u.siteId = s.siteId
        INNER JOIN role r ON r.roleId = u.roleId
        WHERE u.status = 1 
      `;

      const params: any[] = [];
      if (utilisateurId !== null) {
        sql += ` AND u.utilisateurId = ?`;
        params.push(utilisateurId);
      }

      sql += ` ORDER BY u.utilisateurId DESC`
      const result: Utilisateur[] = await _selectSql(sql, params);
      console.log("🚀 ~ recupListeUtilisateurs ~ result:", result);
      resolve(result);
    } catch (error) {
      console.error("🚀 ~ recupListeUtilisateurs ~ error:", error);
      reject(new Error("Failed to fetch user list"));
    }
  });
};


/**
 * Vérifier si un nom d'utilisateur  existe déjà dans la table `utilisateur`
 * @param nomUtilisateur Nom d'utilisateur à vérifier
 * @returns Promise<object | null>
 */
const getUtilisateurIfExists = (nomUtilisateur: string): Promise<ICreateUtilisateurPayload | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM utilisateur WHERE nomUtilisateur = ?`;
      const values = [nomUtilisateur];
      const result: any = await _selectSql(sql, values);
      if (result.length > 0) {
        resolve(result[0]);
      } else {
        resolve(null);
      }
    } catch (error) {
      reject(error);
    }
  });
};

// FIN UTILISATEUR

// DEBUT PIZZA

const insertPizza = (data: ICreatePizzaPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO pizza ( nomPizza, descriptionPizza, categoriePizzaId, favoris, libImagePizza, avecViande, choixViande, estUnePizza, avecAccompagnement, peutEtrelivre, datePlatDuJour) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const values = [
        data.nomPizza,
        data.descriptionPizza,
        data?.categoriePizzaId,
        data.favoris,
        data.libImagePizza,
        data.avecViande,
        data?.choixViande,
        data?.estUnePizza,
        data?.avecAccompagnement,
        data?.peutEtrelivre,
        new Date(data?.datePlatDuJour),
      ];
      const pizza: any = await _executeSql(sql, values);
      resolve(pizza.insertId)
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomPizza')) {
          reject({ name: "DuplicateNomPizza", message: "Ce nom de pizza existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de l'insertion de pizza :", error.message || error);
        reject({ name: "insertUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const insertPizzaFormat = (data: { prixPizzaFormat: number, formatId: number, pizzaId: number }): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO pizzaFormat ( prixPizzaFormat, formatId, pizzaId) VALUES (?, ?, ?)`;
      const values = [
        data.prixPizzaFormat,
        data.formatId,
        data?.pizzaId
      ];
      const pizzaFormat: any = await _executeSql(sql, values);
      resolve(pizzaFormat.insertId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "insertUtilisateurError", message: `Une erreur inattendue est survenue.` });

    }
  });
};

const recupListePizza = (pizzaId?: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT 
        p.pizzaId AS pizzaId,
        p.nomPizza AS nomPizza,
        p.descriptionPizza AS descriptionPizza,
        p.favoris,
        p.libImagePizza,
        p.ordrePizza,
        p.avecViande,
        p.peutEtrelivre,
        p.choixViande,
        p.estUnePizza,
        p.avecAccompagnement,
        p.platDuJour,
        p.datePlatDuJour,
        pl.dateHeurPlatDuJour,
        pl.platDuJourId,
        c.categoriepizzaId AS categoriePizzaId,
        c.libellecategoriepizza AS libelleCategoriePizza
      FROM pizza p
      LEFT JOIN categoriePizza c ON p.categoriepizzaId = c.categoriepizzaId
      LEFT JOIN platDuJour pl ON pl.pizzaId = p.pizzaId
      WHERE p.status = 1
      `;

      if (pizzaId) {
        sql += ` AND p.pizzaId = ?`;
      }

      sql += ` ORDER BY p.ordrePizza ASC;`;

      const choix = await _selectSql(sql, pizzaId ? [pizzaId] : []);
      resolve(choix);
    } catch (error) {
      reject(error);
    }
  });
};


const recupPizzaFormat = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT 
    pf.pizzaFormatId,
    p.nomPizza,
    f.nomFormat,
    p.libImagePizza,
    p.pizzaId,
    p.avecViande,
    p.descriptionPizza,
    p.favoris,
    p.peutEtrelivre,
    p.choixViande,
    p.estUnePizza,
    p.avecAccompagnement,
    p.platDuJour,
    p.datePlatDuJour,
    p.categoriePizzaId,
    pl.dateHeurPlatDuJour,
    pl.platDuJourId,
    p.status,
    pf.prixPizzaFormat,
    peutEtrelivre,
    pf.formatId
FROM 
    pizzaFormat pf
LEFT JOIN 
    pizza p ON pf.pizzaId = p.pizzaId
LEFT JOIN 
    platDuJour pl ON pl.pizzaId = p.pizzaId
LEFT JOIN 
    format f ON pf.formatId = f.formatId
WHERE 
    p.status = 1
ORDER BY 
    p.pizzaId DESC;

    ;`;

      const format = await _selectSql(sql, []);
      resolve(format);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierPizza = (data: IInsertPizzaPayload): Promise<boolean> => {
  console.log("🚀 ~ modifierPizza ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE pizza SET 
        nomPizza = ?, 
        descriptionPizza = ?, 
        categoriePizzaId = ?, 
        favoris = ?, 
        libImagePizza = ?, 
        avecViande = ?,
        choixViande = ?,
        estUnePizza = ?, 
        avecAccompagnement = ?,
        peutEtrelivre = ?,
        datePlatDuJour = ?
      WHERE pizzaId = ?`;

      const values = [
        data.nomPizza,
        data?.descriptionPizza,
        data?.categoriePizzaId,
        data.favoris,
        data.libImagePizza,
        data.avecViande,
        data.choixViande,
        data?.estUnePizza,
        data?.avecAccompagnement,
        data?.peutEtrelivre,
        new Date(data?.datePlatDuJour),
        data.pizzaId,
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomPizza')) {
          reject({ name: "DuplicateNomPizza", message: "Ce nom de pizza existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
        reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const modifierPizzaFormat = (data: ICreatePizzaFormatPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE pizzaFormat SET prixPizzaFormat = ?, formatId = ?, pizzaId = ? WHERE pizzaFormatId = ?`;
      const values = [
        data.prixPizzaFormat,
        data.formatId,
        data?.pizzaId,
        data.pizzaFormatId
      ];
      const pizzaFormat: any = await _executeSql(sql, values);
      resolve(pizzaFormat.insertId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "updatePizzaFormatError", message: `Une erreur inattendue est survenue.` });

    }
  });
};

const supprimerPizza = (pizzaId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE pizza SET status = ? WHERE pizzaId = ?`;
      const values = [0, pizzaId]
      await _executeSql(sql, values);
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });

    }
  });
}


// COMMANDE PIZZA

/**
 * Permet d'attribuer un commande à un site et à un utilisateur et aussi son état (reçu, en cours et traité)
 * @param data 
 * @returns 
 */
const gererCommande = (data: IListeCommandeItem): Promise<boolean> => {
  console.log("🚀 ~ gererCommande ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE commande SET 
        etatCommande = ?, 
        valideParUtilisateur = ?, 
        utilisateurId = ?, 
        siteId = ? 
      WHERE commandeId = ?`;

      const values = [
        data.etatCommande,
        data.valideParUtilisateur,
        data.utilisateurId,
        data.siteId,
        data.commandeId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      console.error("Erreur lors de l'insertion du client :", error.message || error);
      reject({ name: "updateManageOrderError", message: `Une erreur inattendue est survenue.` });
    }
  });
};


const ajouterCommande = async (data: ICreateCommandePayload): Promise<number> => {
  try {

    const sql = `INSERT INTO commande (
      clientId, valideParUtilisateur, utilisateurId,
      siteId, idPointLivraison, aEmporte, dateEmport, prixLivraisonActuel, rueDeLaLivraison
    ) VALUES (?,  ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
      data.clientId,
      data.valideParUtilisateur,
      data.utilisateurId,
      data.siteId,
      data.idPointLivraison,
      data.aEmporte,
      data.dateEmport,
      data.prixLivraisonActuel,
      data?.rueDeLaLivraison
    ];
    console.log("🚀 ~ ajouterCommande ~ values:", values)

    const commande: any = await _executeSql(sql, values);
    return commande?.insertId;
  } catch (error) {
    console.error("Validation ou insertion échouée:", error);
    throw { name: "InsertError", message: `Une erreur inattendue est survenue.` };
  }
};

/**
 * Ajouter un nouveau détail dans la table `commandeDetail`
 * @param data Objet contenant les données du détail
 * @returns Promise<Boolean>
 */
const ajouterCommandeDetail = (data: ICreateCommandeDetailPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {

      const sql = `INSERT INTO commandeDetail (
        commandeId,
        pizzaId,
        pizzaFormatId,
        pateId,
        viandeId,
        condimentId,
        demandeSpeciale,
        quantiteCommande,
        prixFormatActuel,
        pizzaGratos,
        accompagnementId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        data.commandeId,
        data.pizzaId,
        data.pizzaFormatId,
        data.pateId,
        data.viandeId,
        data.condimentId || null, // Si condimentId est optionnel, définir null si non fourni
        data.demandeSpeciale || null, // Idem pour demandeSpeciale
        data.quantiteCommande,
        data.prixFormatActuel,
        data.pizzaGratos,
        data?.accompagnementId
      ];

      const commandeDetail: any = await _executeSql(sql, values);

      resolve(commandeDetail?.insertId);
    } catch (error) {
      console.error("Validation ou insertion échouée:", error);
      reject({ name: "InsertClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};

/**
 * Insérer une nouvelle boisson dans la table `commandeBoisson`
 * @param data Objet contenant les données de la boisson
 * @returns Promise<Boolean>
 */
const ajouterCommandeBoisson = (commandeDetailId: number, data: ICommandeBoissonSchemaPayload): Promise<Boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Validation des données avec Zod
      // const validatedData = CreateCommandeBoissonPayloadSchema.parse(data);

      const sql = `INSERT INTO commandeBoisson (
        commandeDetailId,
        boissonId,
        prixBoissonActuel
      ) VALUES (?, ?, ?)`;

      const values = [
        commandeDetailId,
        data.boissonId,
        data.prixBoisson
      ];

      const boisson: any = await _executeSql(sql, values);
      resolve(boisson?.insertId);
    } catch (error) {
      console.error("Validation ou insertion échouée:", error);
      reject({ name: "InsertClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};


/**
 * Insérer un nouveau supplément dans la table `commandeSupplement`
 * @param data Objet contenant les données du supplément
 * @returns Promise<Boolean>
 */
const ajouterCommandeSupplement = (commandeDetailId: number, data: ICommandeSupplementPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {

      const sql = `INSERT INTO commandeSupplement (
        commandeDetailId,
        supplementId,
        prixSupplementActuel
      ) VALUES (?, ?, ?)`;

      const values = [
        commandeDetailId,
        data.supplementId,
        data.prixSupplement
      ];

      const commandeSupplement: any = await _executeSql(sql, values);
      resolve(commandeSupplement?.insertId);
    } catch (error) {
      console.error("Validation ou insertion échouée:", error);
      reject({ name: "InsertClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};


const ajouterCommandeCondiment = (commandeDetailId: number, condimentId: number): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {

      const sql = `INSERT INTO commandeCondiment (
        commandeDetailId,
        condimentId
      ) VALUES (?, ?)`;

      const values = [
        commandeDetailId,
        condimentId
      ];

      const commandeCondiment: any = await _executeSql(sql, values);
      resolve(commandeCondiment?.insertId);
    } catch (error) {
      console.error("Validation ou insertion échouée:", error);
      reject({ name: "InsertClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const attribuerCommande = (data: IAttribuerCommande): Promise<Boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE commande SET siteId = ? WHERE commandeId = ? `;
      const values = [
        data.siteId,
        data.commandeId
      ];

      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "InsertClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const annulerCommande = (commandeId: number): Promise<Boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE commande SET status = ? WHERE commandeId = ? `;
      const values = [
        0,
        commandeId
      ];

      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "InsertClientError", message: `Une erreur inattendue est survenue.` });
    }
  });
};


/**
 * Fonction pour récupérer les commandes d'un utilisateur (client ou vendeur) avec tous leurs détails.
 * @returns 
 */

const recupCommandeBoissonsParClientOuEtParVendeur = (
  clientId: number | null = null,
  commandeId: number | null = null,
  thisYear: boolean = false
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construction dynamique de la clause WHERE
      let conditions = [];
      let values: (number | null | string)[] = [];

      if (clientId !== null) {
        conditions.push("c.clientId = ?");
        values.push(clientId);
      }

      if (commandeId !== null) {
        conditions.push("co.commandeId = ?");
        values.push(commandeId);
      }

      if (thisYear) {
        conditions.push("YEAR(co.dateCommande) = YEAR(CURRENT_DATE)");
      }

      // Ajout des conditions ou récupération de toutes les commandes
      const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

      const sql = `
        SELECT 
          c.nomUtilisateurClient,
          b.nomBoisson,
          cb.prixBoissonActuel,
          co.commandeId,
          cd.commandeDetailId,
          co.dateCommande
        FROM 
          client c
        JOIN 
          commande co ON c.clientId = co.clientId
        JOIN 
          commandeDetail cd ON co.commandeId = cd.commandeId
        JOIN 
          commandeBoisson cb ON cd.commandeDetailId = cb.commandeDetailId
        JOIN 
          boisson b ON cb.boissonId = b.boissonId
        WHERE b.status = 1 ${whereClause};
      `;

      const commande = await _selectSql(sql, values);
      resolve(commande);
    } catch (error) {
      reject(error);
    }
  });
};


const recupCommandeSupplementsParClientOuEtParVendeur = (
  clientId: number | null = null,
  commandeId: number | null = null,
  thisYear: boolean = false
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construction dynamique de la clause WHERE
      let conditions = [];
      let values: (number | null | string)[] = [];

      if (clientId !== null) {
        conditions.push("c.clientId = ?");
        values.push(clientId);
      }

      if (commandeId !== null) {
        conditions.push("co.commandeId = ?");
        values.push(commandeId);
      }

      if (thisYear) {
        conditions.push("YEAR(co.dateCommande) = YEAR(CURRENT_DATE)");
      }

      // Ajout des conditions ou récupération de toutes les commandes
      const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

      const sql = `
        SELECT 
          c.nomUtilisateurClient,
          sp.nomSupplement,
          cs.prixSupplementActuel,
          co.commandeId,
          cd.commandeDetailId,
          co.dateCommande
        FROM 
          client c
        JOIN 
          commande co ON c.clientId = co.clientId
        JOIN 
          commandeDetail cd ON co.commandeId = cd.commandeId
        JOIN 
          commandeSupplement cs ON cd.commandeDetailId = cs.commandeDetailId
        JOIN 
          supplement sp ON cs.supplementId = sp.supplementId
        WHERE sp.status = 1 ${whereClause};
      `;

      const commande = await _selectSql(sql, values);
      resolve(commande);
    } catch (error) {
      reject(error);
    }
  });
};

const recupCommandeCondimentsParClientOuEtParVendeur = (
  clientId: number | null = null,
  commandeId: number | null = null,
  thisYear: boolean = false
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construction dynamique de la clause WHERE
      let conditions = [];
      let values: (number | null | string)[] = [];

      if (clientId !== null) {
        conditions.push("c.clientId = ?");
        values.push(clientId);
      }

      if (commandeId !== null) {
        conditions.push("co.commandeId = ?");
        values.push(commandeId);
      }

      if (thisYear) {
        conditions.push("YEAR(co.dateCommande) = YEAR(CURRENT_DATE)");
      }

      // Ajout des conditions ou récupération de toutes les commandes
      const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

      const sql = `
        SELECT 
          c.nomUtilisateurClient,
          cond.nomCondiment,
          co.commandeId,
          cd.commandeDetailId,
          co.dateCommande
        FROM 
          client c
        JOIN 
          commande co ON c.clientId = co.clientId
        JOIN 
          commandeDetail cd ON co.commandeId = cd.commandeId
        JOIN 
          commandeCondiment cc ON cd.commandeDetailId = cc.commandeDetailId
        JOIN 
          condiment cond ON cc.condimentId = cond.condimentId
        WHERE cond.status = 1 ${whereClause};
      `;

      const commandeCondiment = await _selectSql(sql, values);
      resolve(commandeCondiment);
    } catch (error) {
      reject(error);
    }
  });
};



const recupCommandeParClient = (
  clientId: number | null = null,
  commandeId: number | null = null,
  thisYear: boolean = false
) => {
  console.log("🚀 ~ recupCommandeParClient ~ clientId:", clientId);
  return new Promise(async (resolve, reject) => {
    try {
      // Construction dynamique de la clause WHERE
      let conditions = [];
      let values: (number | null | string)[] = [];

      if (clientId !== null) {
        conditions.push("cl.clientId = ?");
        values.push(clientId);
      }

      if (commandeId !== null) {
        conditions.push("c.commandeId = ?");
        values.push(commandeId);
      }

      if (thisYear) {
        conditions.push("YEAR(c.dateCommande) = YEAR(CURRENT_DATE)");
      }

      // Ajout des conditions ou récupération de toutes les commandes
      const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

      const sql = `
        SELECT 
          c.commandeId,
          c.etatCommande,
          c.dateCommande,
          c.valideParUtilisateur,
          c.aEmporte,
          c.dateEmport,
          c.rueDeLaLivraison,
          c.prixLivraisonActuel,
          ac.accompagnementId,
          ac.nomAccompagnement,
          pl.adressePointLivraison,
          pl.zone,
          cl.nomUtilisateurClient,
          cl.emailClient,
          cl.telephoneClient,
          cl.telephoneClient2,
          cl.dateInscription,
          cd.commandeDetailId,
          cd.quantiteCommande,
          cd.demandeSpeciale,
          cd.prixFormatActuel,
          cd.pizzaGratos,
          p.nomPizza,
          p.choixViande,
          p.descriptionPizza,
          p.libImagePizza,
          p.estUnePizza,
          p.peutEtrelivre,
          p.avecAccompagnement,
          p.datePlatDuJour,
          f.nomFormat,
          pa.nomPate,
          v.nomViande,
          s.nomSite,
          s.siteId,
          u.utilisateurId,
          u.nomUtilisateur,
          co.nomCondiment 
        FROM 
          commande c
        JOIN 
          client cl ON c.clientId = cl.clientId
        LEFT JOIN 
          commandeDetail cd ON c.commandeId = cd.commandeId
        LEFT JOIN 
          pointLivraison pl ON c.idPointLivraison = pl.idPointLivraison
        LEFT JOIN 
          pizza p ON cd.pizzaId = p.pizzaId
        LEFT JOIN 
          pizzaFormat pf ON cd.pizzaFormatId = pf.pizzaFormatId
        LEFT JOIN 
          format f ON f.formatId = pf.formatId
        LEFT JOIN 
          pate pa ON cd.pateId = pa.pateId
        LEFT JOIN 
          viande v ON cd.viandeId = v.viandeId
        LEFT JOIN 
          accompagnement ac ON cd.accompagnementId = ac.accompagnementId
        LEFT JOIN 
          site s ON s.siteId = c.siteId
        LEFT JOIN 
          utilisateur u ON u.utilisateurId = c.utilisateurId
        LEFT JOIN 
          condiment co ON cd.condimentId = co.condimentId
        WHERE c.status = 1 ${whereClause}
        ORDER BY 
          c.commandeId DESC;
      `;

      const commande = await _selectSql(sql, values);
      resolve(commande);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error);
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};



// POINT LIVRAISON

/**
 * Insérer un nouveau point de livraison dans la table `pointLivraison`
 * @param data Objet contenant les données du point de livraison
 * @returns Promise<Boolean>
 */
const ajouterPointLivraison = (data: ICreatePointLivraisonPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO pointLivraison (zone, adressePointLivraison, prixPointLivraison) VALUES (?, ?, ?)`;
      const values = [
        data?.zone,
        data.adressePointLivraison,
        data.prixPointLivraison
      ];
      const pointLivraison: any = await _executeSql(sql, values);
      resolve(pointLivraison?.insertId);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const recupPointLivraison = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM pointLivraison WHERE status = 1`;

      const point = await _selectSql(sql, []);
      resolve(point);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierPointLivraison = (data: ICreatePointLivraisonPayload): Promise<boolean> => {
  console.log("🚀 ~ modifierPointLivraison ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE pointLivraison SET 
      zone = ?,
        adressePointLivraison = ?, 
        prixPointLivraison = ?
      WHERE idPointLivraison = ?`;

      const values = [
        data?.zone,
        data.adressePointLivraison,
        data?.prixPointLivraison,
        data?.idPointLivraison
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerPointLivraison = (idPointLivraison: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE pointLivraison SET status = ? WHERE idPointLivraison = ?`;
      const values = [0, idPointLivraison]
      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
}

// BOISSONS

/**
 * Insérer une nouvelle boisson dans la table `boisson`
 * @param data Objet contenant les données de la boisson
 * @returns Promise<Boolean>
 */
const ajouterBoisson = (data: ICreateBoissonPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO boisson (nomBoisson, prixBoisson, descriptionBoisson) VALUES (?, ?, ?)`;
      const values = [
        data.nomBoisson,
        data.prixBoisson,
        data.descriptionBoisson
      ];
      const boisson: any = await _executeSql(sql, values);
      resolve(boisson?.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomBoisson')) {
          reject({ name: "DuplicateNomPizza", message: "Ce nom de boisson existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
        reject({ name: "InsertBoissonError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const recupBoisson = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM boisson WHERE status = 1 ORDER BY boissonId DESC`;

      const boisson = await _selectSql(sql, []);
      resolve(boisson);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierBoisson = (data: ICreateBoissonPayload): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE boisson SET 
        nomBoisson = ?, 
        prixBoisson = ?,
        descriptionBoisson = ?
      WHERE boissonId = ?`;

      const values = [
        data.nomBoisson,
        data?.prixBoisson,
        data?.descriptionBoisson,
        data?.boissonId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomBoisson')) {
          reject({ name: "DuplicateNomPizza", message: "Ce nom de boisson existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
        reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const supprimerBoisson = (boissonId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE boisson SET status = ? WHERE boissonId = ?`;
      const values = [0, boissonId]
      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
}

// CONDIMENT


/**
 * Insérer un nouveau condiment dans la table `condiment`
 * @param data Objet contenant les données du condiment
 * @returns Promise<Boolean>
 */
const ajouterCondiment = (data: ICreateCondimentPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO condiment (nomCondiment) VALUES (?)`;
      const values = [data.nomCondiment];
      const condiment: any = await _executeSql(sql, values);
      resolve(condiment?.insertId);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomCondiment')) {
          reject({ name: "DuplicatenomCondiment", message: "Ce nom de condiment existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification  :", error.message || error);
        reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const recupCondiment = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM condiment WHERE status = 1 ORDER BY condimentId DESC`;

      const condiment = await _selectSql(sql, []);
      resolve(condiment);
    } catch (error) {
      reject(error);
    }
  });
};

const modifierCondiment = (data: ICreateCondimentPayload): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE condiment SET 
        nomcondiment = ?
      WHERE condimentId = ?`;

      const values = [
        data.nomCondiment,
        data?.status,
        data?.condimentId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomCondiment')) {
          reject({ name: "DuplicatenomCondiment", message: "Ce nom de condiment existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification  :", error.message || error);
        reject({ name: "updateUtilisateurError", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const supprimerCondiment = (condimentId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE condiment SET status = ? WHERE condimentId = ?`;
      const values = [0, condimentId]
      const result: any = await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
}


// SUPPLEMENT

const recupSupplement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT 
  s.supplementId,
  s.nomSupplement,
  s.prixSupplement,
  c.nomCategorieSupplement,
  c.categorieSupplementId
FROM supplement s
INNER JOIN categorieSupplement c 
  ON s.categorieSupplementId = c.categorieSupplementId WHERE s.status = 1;
      `;

      const supplement = await _selectSql(sql, []);
      resolve(supplement);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Insérer un nouveau supplément dans la table `supplement`
 * @param data Objet contenant les données du supplément
 * @returns Promise<Boolean>
 */
const ajouterSupplement = (data: ICreateSupplementPayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO supplement (nomSupplement, prixSupplement, categorieSupplementId) VALUES (?, ?, ?)`;
      const values = [
        data.nomSupplement,
        data.prixSupplement,
        data.categorieSupplementId
      ];
      const supplement: any = await _executeSql(sql, values);
      resolve(supplement?.insertId);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierSupplement = (data: ICreateSupplementPayload): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE supplement SET 
        nomSupplement = ?, 
        prixSupplement = ?,
        categorieSupplementId = ?
      WHERE supplementId = ?`;

      const values = [
        data.nomSupplement,
        data?.prixSupplement,
        data?.categorieSupplementId,
        data.supplementId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('nomPizza')) {
          reject({ name: "DuplicateNomPizza", message: "Ce nom de pizza existe déjà." });
        }
        else {
          reject({ name: "DuplicateEntryError", message: "Un doublon a été détecté." });
        }
      } else {
        console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
        reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
      }
    }
  });
};

const supprimerSupplement = (supplementId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE supplement SET status = ? WHERE supplementId = ?`;
      const values = [0, supplementId]
      const result: any = await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
}


/**BANNIERE */

const ajouterBanniere = (libBanniere: string, pizzaId: number, bannierePublicitaire: number): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO banniere (libBanniereImage, pizzaId, bannierePublicitaire) VALUES (?, ?, ?)`
      const bannerInserted: any = await _executeSql(sql, [libBanniere, pizzaId, bannierePublicitaire]);
      resolve(bannerInserted.insertId)
    } catch (error) {
      reject(error);
    }
  });
};

const recupBanniere = (banniereId: number | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Préparer les conditions dynamiques
      let conditions = [];
      let values: (number | string | null)[] = [];

      if (banniereId) {
        conditions.push("b.banniereId = ?");
        values.push(banniereId);
      }

      const whereClause = conditions.length > 0 ? `AND ${conditions.join(" AND ")}` : "";

      // Requête SQL pour récupérer les données
      let sql = `
        SELECT 
          b.banniereId,
          b.pizzaId,
          b.libBanniereImage,
          b.bannierePublicitaire,
          b.status,
          p.nomPizza,
          p.estUnePizza,
          p.choixViande,
          p.peutEtrelivre,
          p.descriptionPizza
        FROM banniere b
        LEFT JOIN pizza p ON b.pizzaId = p.pizzaId
        WHERE b.status = 1 AND p.status = 1 ${whereClause}
        ORDER BY b.banniereId DESC;
      `;

      // Exécuter la requête avec les paramètres
      const banners = await _selectSql(sql, values);

      resolve(banners);
    } catch (error) {
      reject(error);
    }
  });
};

const modifierBanniere = (data: IBanniere): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE banniere SET 
        pizzaId = ?, 
        libBanniereImage = ?,
        bannierePublicitaire = ?       
      WHERE banniereId = ?`;

      const values = [
        data?.pizzaId,
        data?.libBanniereImage,
        data?.bannierePublicitaire,
        data.banniereId,
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      console.error("Erreur lors de la modification de l'utilisateur :", error.message || error);
      reject({ name: "updateBanniere", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerBanniere = (banniereId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE banniere SET status = ? WHERE banniereId = ?`;
      await _executeSql(sql, [0, banniereId]);
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
};



// SITE

const recupSite = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM site WHERE status = 1;`;
      const site = await _selectSql(sql, []);
      resolve(site);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Insérer un nouveau site dans la table `site`
 * @param data Objet contenant les données du site
 * @returns Promise<Boolean>
 */
const ajouterSite = (data: ICreateSitePayload): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO site (nomSite, adresseSite, villeSite, telephoneSite) VALUES (?, ?, ?, ?)`;
      const values = [
        data.nomSite,
        data.adresseSite || null,
        data.villeSite || null,
        data.telephoneSite,
      ];
      const site: any = await _executeSql(sql, values);
      resolve(site.insertId)
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierSite = (data: ICreateSitePayload): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE site SET 
        nomSite = ?,
        adresseSite = ?,
        villeSite = ?,
        telephoneSite = ?
      WHERE siteId = ?`;
      const values = [
        data.nomSite,
        data?.adresseSite,
        data?.villeSite,
        data?.telephoneSite,
        data?.siteId
      ];

      const result: any = await _executeSql(sql, values);

      // Vérifie si au moins une ligne a été modifiée
      resolve(result.affectedRows > 0);
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerSite = (siteId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE site SET status = ? WHERE siteId = ?`;
      await _executeSql(sql, [0, siteId]);
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Insérer un nouveau format dans la table `format`
 * @param data Objet contenant les données du format
 * @returns Promise<Boolean>
 */
const ajouterFormat = (data: ICreateFormatPayload): Promise<Boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO format (nomFormat, prixFormat, prixFormatAncien) VALUES (?, ?, ?)`;
      const values = [
        data.nomFormat,
        data.prixFormat,
        data.prixFormatAncien
      ];
      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};



/**
 * Insérer une nouvelle pâte dans la table `pate`
 * @param data Objet contenant les données de la pâte
 * @returns Promise<Boolean>
 */
const ajouterPate = (data: ICreatePatePayload): Promise<Boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO pate (nomPate) VALUES (?)`;
      const values = [data.nomPate];
      await _executeSql(sql, values);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};

const recupPate = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM pate`;

      const pate = await _selectSql(sql, []);
      resolve(pate);
    } catch (error) {
      reject(error);
    }
  });
};

const recupViande = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM viande`;

      const viande = await _selectSql(sql, []);
      resolve(viande);
    } catch (error) {
      reject(error);
    }
  });
};

const recupRole = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM role`;
      const role = await _selectSql(sql, []);
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};


// INFO SUP

const recupInfoSupByKey = (cle: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM infoSup WHERE cle = ?`;
      const role = await _executeSql(sql, [cle]);
      resolve(role);
    } catch (error) {
      reject(error);
    }
  });
};



const ajouterOuModifierInfoSup = (cle: string, data: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `REPLACE INTO  infoSup (cle, data) VALUES (?, ?)`;
      const infoSup: any = await _executeSql(sql, [cle, data]);
      resolve(infoSup.insertId);
    } catch (error) {
      reject(error);
    }
  });
};


// FIDELITE

const ajouterOuModifierClientAuProgrammeDeFidelite = (clientId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Pour ne pas deranger le pointage du jour
      const hier = new Date();
      hier.setDate(hier.getDate() - 1); const sql = `REPLACE INTO  fidelite (clientId, pointageDujour) VALUES (?, ?)`;
      console.log("🚀 ~ returnnewPromise ~ hier:", hier)
      const infoSup: any = await _executeSql(sql, [clientId, hier]);
      resolve(infoSup.insertId);
    } catch (error) {
      reject(error);
    }
  });
};

const recupClientPointFidelite = (clientId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM fidelite WHERE clientId = ?`;
      const point = await _executeSql(sql, [clientId]);
      resolve(point);
    } catch (error) {
      reject(error);
    }
  });
};

const modifierClientPointPizza = (clientId: number, dateInscriptionFidelite: Date, point: number, pointageDujour: Date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE fidelite SET point = ?, dateInscriptionFidelite = ?, pointageDujour = ? WHERE clientId = ?`;
      const infoSup: any = await _executeSql(sql, [point, dateInscriptionFidelite, pointageDujour, clientId]);
      resolve(infoSup.insertId);
    } catch (error) {
      reject(error);
    }
  });
};

// const ajouterPointFidelite = (clientId: number, point: number) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const sql = `UPDATE fidelite SET point = ? WHERE clientId = ?`;
//       const infoSup: any = await _executeSql(sql, [point, clientId]);
//       resolve(infoSup.insertId);
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

const recupPointFidelite = (clientId: number | null = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Requête SQL de base
      let sql = `SELECT * FROM fidelite`;
      const params: any[] = [];

      // Ajoute une condition si clientId est fourni
      if (clientId !== null) {
        sql += ` WHERE clientId = ?`;
        params.push(clientId);
      }
      const clientFidelite: any = await _executeSql(sql, params);
      resolve(clientFidelite)
    } catch (error) {
      reject(error);
    }
  });
};

// VIDEO CONTENT

const recupVideoContent = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM video  WHERE status = 1 ORDER BY videoId DESC `;
      const video = await _selectSql(sql);
      resolve(video);
    } catch (error) {
      reject(error);
    }
  });
};

const ajouterVideo = (data: IVideo): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO video (titre, lienVideo) VALUES (?, ?)`;
      const values = [
        data.titre,
        data.lienVideo
      ];
      const video: any = await _executeSql(sql, values);
      resolve(video.insertId)
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierOuSupprimerVideo = (data: IVideo): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `REPLACE INTO video (videoId, titre, lienVideo, status) VALUES (?, ?, ?, ?)`;
      const values = [
        data.videoId,
        data.titre,
        data.lienVideo,
        data.status
      ];
      const video: any = await _executeSql(sql, values);
      resolve(video.insertId)
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};




// Accompagnement
const recupAccompagnement = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `SELECT * FROM accompagnement WHERE status = 1 ORDER BY accompagnementId DESC `;

      const pate = await _selectSql(sql, []);
      resolve(pate);
    } catch (error) {
      reject(error);
    }
  });
};

const ajouterAccompagnement = (data: IAccompagnement): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO accompagnement (nomAccompagnement) VALUES (?)`;
      const values = [
        data.nomAccompagnement
      ];
      const accompgnement: any = await _executeSql(sql, values);
      resolve(accompgnement.insertId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierOuSupprimerAccompagnement = (data: IAccompagnement): Promise<number> => {
  console.log("🚀 ~ modifierOuSupprimerAccompagnement ~ data:", data)
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `REPLACE INTO accompagnement (accompagnementId, nomAccompagnement, status) VALUES (?, ?, ?)`;
      const values = [
        data.accompagnementId,
        data.nomAccompagnement,
        data.status
      ];
      const accompgnement: any = await _executeSql(sql, values);
      resolve(accompgnement.insertId)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

// PLAT DU JOUR

const recupPlatDuJour = async (platDuJourIds?: number[]) => {
  try {
    const sql = `
      SELECT 
        p.pizzaId, p.nomPizza, p.descriptionPizza, p.favoris, 
        p.libImagePizza, p.ordrePizza, p.avecViande, p.peutEtrelivre, 
        p.choixViande, p.estUnePizza, p.avecAccompagnement, 
        p.platDuJour, p.datePlatDuJour, 
        pl.platDuJourId, pl.dateHeurPlatDuJour, 
        c.categoriepizzaId AS categoriePizzaId, c.libellecategoriepizza AS libelleCategoriePizza
      FROM platDuJour pl
      LEFT JOIN pizza p ON pl.pizzaId = p.pizzaId
      LEFT JOIN categoriePizza c ON p.categoriepizzaId = c.categoriepizzaId
      WHERE p.status = 1 AND pl.status = 1
      ${platDuJourIds && platDuJourIds.length > 0 ? `AND pl.platDuJourId IN (${platDuJourIds.map(() => '?').join(', ')})` : ''}`;

    return await _selectSql(sql, platDuJourIds && platDuJourIds.length > 0 ? platDuJourIds : []);
  } catch (error) {
    throw error;
  }
};



const ajouterPlatDuJour = (pizzaId: number, dateHeurPlatDuJour: Date): Promise<number> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `INSERT INTO platDuJour (pizzaId, dateHeurPlatDuJour) VALUES (?, ?)`;
      const values = [
        pizzaId,
        new Date(dateHeurPlatDuJour)
      ];
      const platDuJour: any = await _executeSql(sql, values);
      resolve(platDuJour.insertId)
    } catch (error) {
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const modifierPlatDuJour = (platDuJourId: number, pizzaId: number, dateHeurPlatDuJour: Date): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `REPLACE INTO platDuJour (platDuJourId, pizzaId, dateHeurPlatDuJour) VALUES (?, ?, ?)`;
      const values = [
        platDuJourId,
        pizzaId,
        new Date(dateHeurPlatDuJour)
      ];
      await _executeSql(sql, values);
      resolve(true)
    } catch (error) {
      console.log("🚀 ~ returnnewPromise ~ error:", error)
      reject({ name: "Error", message: `Une erreur inattendue est survenue.` });
    }
  });
};

const supprimerPlatDuJour = (platDuJourId: number) => {
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE platDuJour SET status = ? WHERE platDuJourId = ?`;
      await _executeSql(sql, [0, platDuJourId]);
      resolve(true)
    } catch (error) {
      reject(error);
    }
  });
};
const modifierPushToken = (utilisateurId: number, pushToken: string) => {
  console.log("🚀 ~ modifierPushToken ~ utilisateurId:", utilisateurId)
  return new Promise(async (resolve, reject) => {
    try {
      const sql = `UPDATE utilisateur SET pushToken = ? WHERE utilisateurId = ?`;
      await _executeSql(sql, [pushToken, utilisateurId]);
      resolve(true);
    } catch (error) {
      reject(error);
    }
  });
};
export default {
  // CLIENT
  ajouterClient,
  updateClient,
  updateClientPassword,
  getClientIfExists,
  deleteClient,
  recupListeClients,
  ajouterCodeConfirmationMail,
  recupListeCodeConfirmationByEmailClient,
  supprimerCodeConfirmation,
  ajouterResetPassword,
  findResetPasswordByToken,
  getClientById,
  // UTILISATEUR
  insertUtilisateur,
  updateUtilisateur,
  getUtilisateurIfExists,
  deleteUtilisateur,
  recupListeUtilisateurs,
  updateUtilisateurPassword,
  // PIZZA
  insertPizza,
  insertPizzaFormat,
  recupListePizza,
  recupPizzaFormat,
  modifierPizza,
  modifierPizzaFormat,
  supprimerPizza,
  // COMMANDE PIZZA
  ajouterCommande,
  ajouterCommandeDetail,
  ajouterCommandeSupplement,
  ajouterCommandeBoisson,
  ajouterCommandeCondiment,
  recupCommandeParClient,
  gererCommande,
  annulerCommande,
  attribuerCommande,
  recupCommandeBoissonsParClientOuEtParVendeur,
  recupCommandeSupplementsParClientOuEtParVendeur,
  recupCommandeCondimentsParClientOuEtParVendeur,

  // POINT LIVRAISON
  recupPointLivraison,
  ajouterPointLivraison,
  modifierPointLivraison,
  supprimerPointLivraison,
  // BOISSON
  recupBoisson,
  ajouterBoisson,
  modifierBoisson,
  supprimerBoisson,
  // CONDIMENT,
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
  // BANNIERE
  ajouterBanniere,
  recupBanniere,
  supprimerBanniere,
  modifierBanniere,
  // PATE
  recupPate,
  // VIANDE
  recupViande,
  // ROLE
  recupRole,
  modifierDateDerniereConnexionUtilisateur,
  // INFO SUP
  recupInfoSupByKey,
  ajouterOuModifierInfoSup,
  // FIDELITE
  recupPointFidelite,
  ajouterOuModifierClientAuProgrammeDeFidelite,
  recupClientPointFidelite,
  modifierClientPointPizza,
  // ajouterPointFidelite,
  // VIDEO CONTENT
  recupVideoContent,
  ajouterVideo,
  modifierOuSupprimerVideo,
  // ACCOMPAGNEMENT
  recupAccompagnement,
  ajouterAccompagnement,
  modifierOuSupprimerAccompagnement,
  // PLAT DU JOUR
  ajouterPlatDuJour,
  modifierPlatDuJour,
  recupPlatDuJour,
  supprimerPlatDuJour,
  modifierPushToken
}
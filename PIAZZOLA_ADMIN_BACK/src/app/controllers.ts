import { Request, Response } from "express";
import services from "./services";

// CLIENT

const insertClientService = (req: Request, res: Response) => {
  const { data, sInscritAuProgrammeDeFidelite } = req.body
  console.log("🚀 ~ insertClientService ~ data:", req.body)
  services
    .insertClientService(data, sInscritAuProgrammeDeFidelite)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deleteClient = (req: Request, res: Response) => {
  const { clientId } = req.body
  services
    .deleteClient(clientId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const inscrireClientAuProgrammeDeFidelite = (req: Request, res: Response) => {
  const { clientId } = req.body
  services
    .inscrireClientAuProgrammeDeFidelite(clientId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerCodeConfirmationDeCompteParMail = (req: Request, res: Response) => {
  const data = req.body
  services
    .envoyerCodeConfirmationDeCompteParMail(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const verifierCodeInsertionClient = (req: Request, res: Response) => {
  const { data, codeConfirmation, sInscritAuProgrammeDeFidelite } = req.body
  services
    .verifierCodeInsertionClient(data, codeConfirmation, sInscritAuProgrammeDeFidelite)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const authenticateClientByEmail = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { email, sInscritAuProgrammeDeFidelite } = req.body
  services
    .authenticateClientByEmail(email, sInscritAuProgrammeDeFidelite)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updateClientPassword = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .updateClientPassword(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      // io.emit("insertClientService", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updateClient = (req: Request, res: Response) => {
  const data = req.body
  services
    .updateClient(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const envoyerMotDePasseOublieClient = (req: Request, res: Response) => {
  const { emailClientMDPOublie } = req.body
  services
    .envoyerMotDePasseOublieClient(emailClientMDPOublie)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const resetPassword = (req: Request, res: Response) => {
  const { token, newPassword } = req.body
  services
    .resetPassword(token, newPassword)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const authenticateClient = (req: Request, res: Response) => {
  const { emailOrnomUtilisateur, motDePasseClient, sInscritAuProgrammeDeFidelite } = req.body
  services
    .authenticateClient(emailOrnomUtilisateur, motDePasseClient, sInscritAuProgrammeDeFidelite)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const recupListeClients = (req: Request, res: Response) => {
  services
    .recupListeClients()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

// FIN CLIENT

// UTILISATEUR

const insertUtilisateurService = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .insertUtilisateurService(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("ajouter_utilisateur", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updateUtilisateur = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .updateUtilisateur(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("modifier_utilisateur", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const authenticateUtilisateur = (req: Request, res: Response) => {
  const { nomUtilisateur, motDePasse } = req.body
  services
    .authenticateUtilisateur(nomUtilisateur, motDePasse)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const updateUtilisateurPassword = (req: Request, res: Response) => {
  const { utilisateurId, motDePasse } = req.body
  services
    .updateUtilisateurPassword(utilisateurId, motDePasse)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const recupListeUtilisateurs = (req: Request, res: Response) => {
  services
    .recupListeUtilisateurs()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const deleteUtilisateur = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { utilisateurId } = req.body
  services
    .deleteUtilisateur(utilisateurId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("supprimer_utilisateur", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

// FIN UTILISATEUR

// PIZZA

const insertPizza = (req: Request, res: Response) => {
  const data = req.body
  const io = (req as any).io;
  services
    .insertPizza(data)
    .then((result: any) => {
      io.emit("ajouter_pizza", result)
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierPizza = (req: Request, res: Response) => {
  const data = req.body
  const io = (req as any).io;
  services
    .modifierPizza(data)
    .then((result: any) => {
      io.emit("modifier_pizza", result)
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const recupListePizza = (req: Request, res: Response) => {
  services
    .recupListePizza()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerPizza = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { pizzaId } = req.body
  services
    .supprimerPizza(pizzaId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("supprimer_pizza", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const recupPizzaFormat = (req: Request, res: Response) => {
  services
    .recupPizzaFormat()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// COMMANDE PIZZA

const gererCommande = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .gererCommande(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("gestion_commande", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const attribuerCommande = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .attribuerCommande(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("attribuer_commande", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const annulerCommande = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { commandeId } = req.body
  services
    .annulerCommande(commandeId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("annuler_commande", result)
    })
    .catch((error: any) => res.send({ status: 0, error }));
};

const recupCommandeParClient = (req: Request, res: Response) => {
  const { clientId, commandeId, thisYear } = req.body
  console.log("🚀 ~ recupCommandeParClient ~ thisYear:", thisYear)
  services
    .recupCommandeParClient(clientId, commandeId, thisYear)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterCommande = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { commande, commandeDetails } = req.body
  services
    .ajouterCommande(commande, commandeDetails)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("ajouter_commande", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const recupCommandeBoissonsParClientOuEtParVendeur = (req: Request, res: Response) => {
  const { clientId } = req.body
  services
    .recupCommandeBoissonsParClientOuEtParVendeur(clientId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const recupCommandeSupplementsParClientOuEtParVendeur = (req: Request, res: Response) => {
  const { clientId } = req.body
  services
    .recupCommandeSupplementsParClientOuEtParVendeur(clientId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// BOISSON

const recupBoisson = (req: Request, res: Response) => {
  services
    .recupBoisson()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterBoisson = (req: Request, res: Response) => {
  const data = req.body
  services
    .ajouterBoisson(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierBoisson = (req: Request, res: Response) => {
  const data = req.body
  services
    .modifierBoisson(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerBoisson = (req: Request, res: Response) => {
  const { boissonId } = req.body
  services
    .supprimerBoisson(boissonId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};


// CONDIMENT

const recupCondiment = (req: Request, res: Response) => {
  services
    .recupCondiment()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterCondiment = (req: Request, res: Response) => {
  const data = req.body
  services
    .ajouterCondiment(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierCondiment = (req: Request, res: Response) => {
  const data = req.body
  services
    .modifierCondiment(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerCondiment = (req: Request, res: Response) => {
  const { condimentId } = req.body
  services
    .supprimerCondiment(condimentId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// SUPPLEMENT

const recupSupplement = (req: Request, res: Response) => {
  services
    .recupSupplement()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterSupplement = (req: Request, res: Response) => {
  const data = req.body
  services
    .ajouterSupplement(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierSupplement = (req: Request, res: Response) => {
  const data = req.body
  services
    .modifierSupplement(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerSupplement = (req: Request, res: Response) => {
  const { supplementId } = req.body
  services
    .supprimerSupplement(supplementId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// POINT LIVRAISON

const recupPointLivraison = (req: Request, res: Response) => {
  services
    .recupPointLivraison()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterPointLivraison = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  console.log("🚀 ~ ajouterPointLivraison ~ data:", data)
  services
    .ajouterPointLivraison(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("ajouter_point_livraison", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierPointLivraison = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  console.log("🚀 ~ modifierPointLivraison ~ data:", data)
  services
    .modifierPointLivraison(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("modifier_point_livraison", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerPointLivraison = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { idPointLivraison } = req.body
  services
    .supprimerPointLivraison(idPointLivraison)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("supprimer_point_livraison", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const envoyerMail = (req: Request, res: Response) => {
  const data = req.body
  services
    .envoyerMail(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// BANNIERE

const ajouterBanniere = (req: Request, res: Response) => {
  const { banniereImageEnBase64, pizzaId, bannierePublicitaire } = req.body
  const io = (req as any).io;
  services
    .ajouterBanniere(banniereImageEnBase64, pizzaId, bannierePublicitaire)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("ajouter_banniere", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const recupBanniere = (req: Request, res: Response) => {
  services
    .recupBanniere()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierBanniere = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .modifierBanniere(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("modifier_banniere", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerBanniere = (req: Request, res: Response) => {
  const io = (req as any).io;
  services
    .supprimerBanniere(req.body?.banniereId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("supprimer_banniere", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};


// SITE

const recupSite = (req: Request, res: Response) => {
  services
    .recupSite()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterSite = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .ajouterSite(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("ajouter_site", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierSite = (req: Request, res: Response) => {
  const io = (req as any).io;
  const data = req.body
  services
    .modifierSite(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("modifier_site", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerSite = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { siteId } = req.body
  services
    .supprimerSite(siteId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("supprimer_site", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// PATE

const recupPate = (req: Request, res: Response) => {
  services
    .recupPate()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// VIANDE 

const recupViande = (req: Request, res: Response) => {
  services
    .recupViande()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// ROLE 

const recupRole = (req: Request, res: Response) => {
  services
    .recupRole()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// INFO SUP

const recupInfoSupByKey = (req: Request, res: Response) => {
  const { cle } = req?.params
  services
    .recupInfoSupByKey(cle)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterOuModifierInfoSup = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { cle, data } = req.body
  services
    .ajouterOuModifierInfoSup(cle, data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("modifier_info_sup", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// FIDELITE

const recupClientPointFidelite = (req: Request, res: Response) => {
  const { clientId } = req?.params
  services
    .recupClientPointFidelite(Number(clientId))
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// VIDEO CONTENT

const recupVideoContent = (req: Request, res: Response) => {
  services
    .recupVideoContent()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterVideo = (req: Request, res: Response) => {
  const data = req.body
  services
    .ajouterVideo(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierOuSupprimerVideo = (req: Request, res: Response) => {
  const data = req.body
  services
    .modifierOuSupprimerVideo(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};


// ACCOMPAGNEMENT

const recupListeAccompagnement = (req: Request, res: Response) => {
  services
    .recupListeAccompagnement()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const ajouterAccompagnement = (req: Request, res: Response) => {
  const data = req.body
  services
    .ajouterAccompagnement(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierOuSupprimerAccompagnement = (req: Request, res: Response) => {
  const data = req.body
  services
    .modifierOuSupprimerAccompagnement(data)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

// PLAT DU JOUR

const ajouterPlatDuJour = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { pizzaIds, dateHeurPlatDuJour } = req.body
  services
    .ajouterPlatDuJour(pizzaIds, dateHeurPlatDuJour)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("ajouter_plat_jour", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierPlatDuJour = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { platDuJourId, pizzaId, dateHeurPlatDuJour } = req.body
  console.log("🚀 ~ modifierPlatDuJour ~ platDuJourId:", platDuJourId, pizzaId, dateHeurPlatDuJour)
  services
    .modifierPlatDuJour(platDuJourId, pizzaId, dateHeurPlatDuJour)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("modifier_plat_jour", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const recupPlatDuJour = (req: Request, res: Response) => {
  services
    .recupPlatDuJour()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const supprimerPlatDuJour = (req: Request, res: Response) => {
  const io = (req as any).io;
  const { platDuJourId } = req.body
  services
    .supprimerPlatDuJour(platDuJourId)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
      io.emit("supprimer_plat_du_jour", result)
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const sendNotification = (req: Request, res: Response) => {
  services
    .sendNotification()
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

const modifierPushToken = (req: Request, res: Response) => {
  const {utilisateurId, pushToken} = req.body
  console.log("🚀 ~ modifierPushToken ~ req.body:", req.body)
  services
    .modifierPushToken(utilisateurId, pushToken)
    .then((result: any) => {
      res.status(200).send({ status: 1, data: result });
    })
    .catch((error: any) => res.status(400).send({ status: 0, error }));
};

export default {
  // CLIENT
  insertClientService,
  updateClient,
  deleteClient,
  updateClientPassword,
  authenticateClient,
  recupListeClients,
  authenticateClientByEmail,
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
  insertPizza,
  modifierPizza,
  recupListePizza,
  recupPizzaFormat,
  supprimerPizza,
  // BOISSON
  recupBoisson,
  ajouterBoisson,
  modifierBoisson,
  supprimerBoisson,
  // COMMANDE PIZZA
  recupCommandeParClient,
  gererCommande,
  annulerCommande,
  attribuerCommande,
  ajouterCommande,
  recupCommandeSupplementsParClientOuEtParVendeur,
  recupCommandeBoissonsParClientOuEtParVendeur,
  // SUPPLEMENT
  recupSupplement,
  ajouterSupplement,
  modifierSupplement,
  supprimerSupplement,
  // CONDIMENT
  recupCondiment,
  ajouterCondiment,
  modifierCondiment,
  supprimerCondiment,
  // POINT LIVRAISON
  recupPointLivraison,
  ajouterPointLivraison,
  modifierPointLivraison,
  supprimerPointLivraison,
  //BANNIERE
  recupBanniere,
  supprimerBanniere,
  ajouterBanniere,
  modifierBanniere,
  // SITE
  recupSite,
  ajouterSite,
  modifierSite,
  supprimerSite,
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


import express, { Router } from "express";
import controllers from "./controllers";


const router: Router = express.Router();

// CLIENT
router.post("/insert_client", controllers.insertClientService);
router.post("/inscrire_prog_fidelite", controllers.inscrireClientAuProgrammeDeFidelite);
router.post("/supprimer_client", controllers.deleteClient);
router.post("/update_client", controllers.updateClient);
router.post("/update_password", controllers.updateClientPassword);
router.post("/authentificate_client", controllers.authenticateClient);
router.post("/authentificate_client_by_email", controllers.authenticateClientByEmail);
router.get("/recup_clients", controllers.recupListeClients);
router.post("/envoyercodeconfirmation", controllers.envoyerCodeConfirmationDeCompteParMail);
router.post("/verifiercodeajoutclient", controllers.verifierCodeInsertionClient);
router.post("/envoyeremailauclient", controllers.envoyerMotDePasseOublieClient);
router.post("/reinitialisermotdepasse", controllers.resetPassword);

// UTILISATEUR
router.post("/ajouter_utilisateur", controllers.insertUtilisateurService);
router.post("/modifier_motdepasse", controllers.updateUtilisateurPassword);
router.post("/modifier_utilisateur", controllers.updateUtilisateur);
router.post("/authentifier_utilisateur", controllers.authenticateUtilisateur);
router.post("/supprimer_utilisateur", controllers.deleteUtilisateur);
router.get("/recup_utilisateurs", controllers.recupListeUtilisateurs);

// PIZZA
router.post("/ajouter_pizza", controllers.insertPizza);
router.post("/modifier_pizza", controllers.modifierPizza);
router.post("/supprimer_pizza", controllers.supprimerPizza);
router.get("/recup_liste_pizza", controllers.recupListePizza);
router.get("/recup_pizza_format", controllers.recupPizzaFormat);

// COMMANDE PIZZA
router.post("/ajouter_commande", controllers.ajouterCommande);
router.post("/attribuer_commande", controllers.attribuerCommande);
router.post("/annuler_commande", controllers.annulerCommande);
router.post("/recup_commande_par_client_vendeur", controllers.recupCommandeParClient);
router.post("/gerer_commande", controllers.gererCommande);
router.post("/recup_commande_plat_par_client", controllers.recupCommandeParClient);
router.post("/recup_commande_boisson_par_client_vendeur", controllers.recupCommandeBoissonsParClientOuEtParVendeur);
router.post("/recup_commande_supplement_par_client_vendeur", controllers.recupCommandeSupplementsParClientOuEtParVendeur);


// BOISSON
router.get("/recup_boisson", controllers.recupBoisson);
router.post("/ajouter_boisson", controllers.ajouterBoisson);
router.post("/modifier_boisson", controllers.modifierBoisson);
router.post("/supprimer_boisson", controllers.supprimerBoisson);

// CONDIMENTS
router.get("/recup_condiment", controllers.recupCondiment);
router.post("/ajouter_condiment", controllers.ajouterCondiment);
router.post("/modifier_condiment", controllers.modifierCondiment);
router.post("/supprimer_condiment", controllers.supprimerCondiment);

// SUPPLEMENTS
router.get("/recup_supplement", controllers.recupSupplement);
router.post("/ajouter_supplement", controllers.ajouterSupplement);
router.post("/modifier_supplement", controllers.modifierSupplement);
router.post("/supprimer_supplement", controllers.supprimerSupplement);

// POINT LIVRAISON
router.get("/recup_point_livraison", controllers.recupPointLivraison);
router.post("/ajouter_point_livraison", controllers.ajouterPointLivraison);
router.post("/modifier_point_livraison", controllers.modifierPointLivraison);
router.post("/supprimer_point_livraison", controllers.supprimerPointLivraison);

// BANNIERE 
router.post("/ajouter_banniere", controllers.ajouterBanniere);
router.get("/recup_banniere", controllers.recupBanniere);
router.post("/supprimer_banniere", controllers.supprimerBanniere);
router.post("/modifier_banniere", controllers.modifierBanniere);

// SITE 
router.post("/ajouter_site", controllers.ajouterSite);
router.get("/recup_site", controllers.recupSite);
router.post("/modifier_site", controllers.modifierSite);
router.post("/supprimer_site", controllers.supprimerSite);

// PATE

router.get("/recup_pate", controllers.recupPate);

// VIANDE

router.get("/recup_viande", controllers.recupViande);

// ROLE

router.get("/recup_role", controllers.recupRole);

// INFO SUP
router.get("/recup_infosup/:cle", controllers.recupInfoSupByKey);
router.post("/modifierinfosup", controllers.ajouterOuModifierInfoSup);

// FIDELITE
router.get("/recupclientpointfidelite/:clientId", controllers.recupClientPointFidelite);

// VIDEO CONTENT
router.get("/recup_video", controllers.recupVideoContent);
router.post("/ajouter_video", controllers.ajouterVideo);
router.post("/modifier_video", controllers.modifierOuSupprimerVideo);

// ACCOMPAGNEMENT
router.get("/recup_accompagnement", controllers.recupListeAccompagnement);
router.post("/ajouter_accompagnement", controllers.ajouterAccompagnement);
router.post("/modifier_accompagnement", controllers.modifierOuSupprimerAccompagnement);

// PLAT DU JOUR
router.get("/recup_plat_du_jour", controllers.recupPlatDuJour);
router.post("/ajouter_plat_du_jour", controllers.ajouterPlatDuJour);
router.post("/modifier_plat_du_jour", controllers.modifierPlatDuJour);
router.post("/supprimer_plat_du_jour", controllers.supprimerPlatDuJour);

router.post("/envoyer_mail", controllers.envoyerMail);
router.get("/sendNotification", controllers.sendNotification);
router.post("/modifier_push_token", controllers.modifierPushToken);

export default router;


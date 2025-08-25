import { z } from "zod";

export const clientSchema = z.object({
    clientId: z.number().optional(),
    idPointLivraison: z.number().optional(),
    nomUtilisateurClient: z.string().min(1, 'Le nom et prénom sont requis').max(100),
    emailClient: z.string().min(1, 'Le nom d\'utilisateur est requis').max(100),
    rueDeLaLivraison: z.string(),
    commentaire: z.string(),
    adresseClient: z.string().min(1, 'L\' adresse est requis').max(100),
    telephoneClient: z.string().email('Adresse email invalide').max(100),
    telephoneClient2: z.string().email('Adresse email invalide').max(100),
    motDePasseClient: z.string().max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères'),
});



// Schéma Zod pour valider les données du site
export const SiteSchema = z.object({
    siteId: z.number().optional(),
    nomSite: z.string().min(1, "Le nom du site est obligatoire"),
    adresseSite: z.string().optional(),
    villeSite: z.string().optional(),
    telephoneSite: z.string().min(1, "Le téléphone est obligatoire"),
});

export const updatePasswordSchemaPayload = z.object({
    clientId: z.number(),
    emailOrnomUtilisateur: z.string(),
    oldPassword: z.string().min(1, "L'ancien mot de passe est obligatoire"),
    newPassword: z.string(),
    confirmPassword: z.string(),
});

// Schéma Zod pour valider les données du vendeur
export const VendeurSchema = z.object({
    nomUtilisateurVendeur: z.string().min(1, "Le nom du vendeur est obligatoire"),
    emailVendeur: z.string().optional(),
    telephoneVendeur: z.string().optional(),
    siteId: z.number().int().positive().optional(),
    motDePasseVendeur: z.string().min(1, "Le mot de passe est obligatoire"),
});

// Schéma Zod pour valider les données de l'utilisateur
export const utilisateurSchema = z.object({
    utilisateurId: z.number().optional(),
    motDePasseAChange: z.number(),
    nomUtilisateur: z.string().min(1, "Le nom du vendeur est obligatoire"),
    roleId: z.number(),
    siteId: z.number().int().positive().optional(),
    motDePasseUtilisateur: z.string().min(1, "Le mot de passe est obligatoire"),
    motDePasseInitial: z.string().min(1, "Le mot de passe est obligatoire"),
});

// Schéma Zod pour valider les données du client
export const ClientSchema = z.object({
    nomUtilisateurClient: z.string().min(1, "Le nom du client est obligatoire"),
    emailClient: z.string().email("L'email du client doit être valide").optional(),
    telephoneClient: z
        .string()
        .min(1, "Le téléphone est obligatoire")
        .max(15, "Le numéro de téléphone ne peut pas dépasser 15 caractères"),
    motDePasseClient: z.string().min(1, "Le mot de passe est obligatoire"),
    adresseClient: z.string().min(1, "L'adresse est obligatoire"),
});

// Schéma Zod pour valider les données du rôle
export const RoleSchema = z.object({
    nomRole: z.string().min(1, "Le nom du rôle est obligatoire").max(50, "Le nom du rôle ne peut pas dépasser 50 caractères"),
});

export const UtilisateurRoleSchema = z.object({
    vendeurId: z.number().int().positive().min(1, "Le vendeurId est obligatoire"),
    roleId: z.number().int().positive().min(1, "Le roleId est obligatoire"),
});

export const CategoriePizzaSchema = z.object({
    libelleCategoriePizza: z.string().min(1, "Le libellé de la catégorie de pizza est obligatoire").max(100, "Le libellé ne peut pas dépasser 100 caractères"),
});

export const PizzaSchema = z.object({
    nomPizza: z.string().min(1, "Le nom de la pizza est obligatoire").max(255, "Le nom de la pizza ne peut pas dépasser 255 caractères"),
    descriptionPizza: z.string().optional(),
    categoriePizzaId: z.number().int().positive().min(1, "La catégorie de la pizza est obligatoire"),
    favoris: z.number(), //1: favoris   0: non favoris
    libImagePizza: z.string(),
    avecViande: z.number(),
    estUnePizza: z.number(),
    avecAccompagnement: z.number(),
    peutEtrelivre: z.number(),
    choixViande: z
    .union([
      z.enum(["avecJambon", "avecCharcuterie", "avecChoriso"]),
      z.null(),
    ])
    .default(null),
    datePlatDuJour: z.date()
});

export const FormatSchema = z.object({
    nomFormat: z.string().min(1, "Le nom du format est obligatoire").max(50, "Le nom du format ne peut pas dépasser 50 caractères"),
    prixFormat: z.number().min(0, "Le prix du format doit être un nombre positif"),
    prixFormatAncien: z.number().min(0, "Le prix ancien du format doit être un nombre positif"),
});

export const PateSchema = z.object({
    nomPate: z.string().min(1, "Le nom de la pâte est obligatoire").max(50, "Le nom de la pâte ne peut pas dépasser 50 caractères"),
});

export const ViandeSchema = z.object({
    nomViande: z.string().min(1, "Le nom de la viande est obligatoire").max(50, "Le nom de la viande ne peut pas dépasser 50 caractères"),
});

export const CondimentSchema = z.object({
    condimentId: z.number().optional(),
    status: z.number().optional(),
    nomCondiment: z.string().min(1, "Le nom du condiment est obligatoire").max(50, "Le nom du condiment ne peut pas dépasser 50 caractères"),
});

export const SupplementSchema = z.object({
    nomSupplement: z.string().min(1, "Le nom du supplément est obligatoire").max(50, "Le nom du supplément ne peut pas dépasser 50 caractères"),
    prixSupplement: z.number().min(0, "Le prix du supplément doit être un nombre positif"),
    categorieSupplementId: z.number(),
    supplementId: z.number().optional(),
});

export const BoissonSchema = z.object({
    boissonId: z.number().optional(),
    status: z.number().optional(),
    nomBoisson: z.string().min(1, "Le nom de la boisson est obligatoire").max(50, "Le nom de la boisson ne peut pas dépasser 50 caractères"),
    prixBoisson: z.number().min(0, "Le prix de la boisson doit être un nombre positif"),
    descriptionBoisson: z.string(),
});

export const PointLivraisonSchema = z.object({
    idPointLivraison: z.number().optional(),
    zone: z.string().min(1, "La zone est obligatoire").max(255, "L'adresse ne peut pas dépasser 255 caractères"),
    adressePointLivraison: z.string().min(1, "L'adresse du point de livraison est obligatoire").max(255, "L'adresse ne peut pas dépasser 255 caractères"),
    prixPointLivraison: z.number().min(0, "Le prix du point de livraison doit être un nombre positif"),
});

export const CommandeSchema = z.object({
    clientId: z.number().int().min(1, "Le client est obligatoire"),
    etatCommande: z.enum(["reçu", "en cours", "traité"]).default("reçu"),
    valideParVendeur: z.boolean().default(false),
    vendeurId: z.number().int().nullable(),
    siteId: z.number().int().nullable(),
    idPointLivraison: z.number().int().nullable(),
    aEmporte: z.boolean().default(false),
    dateEmport: z.date().nullable(),
    prixLivraisonActuel: z.number().nullable(),
});

export const CommandeDetailSchema = z.object({
    commandeId: z.number().int().min(1, "La commande est obligatoire"),
    pizzaId: z.number().int().min(1, "La pizza est obligatoire"),
    formatId: z.number().int().min(1, "Le format est obligatoire"),
    pateId: z.number().int().min(1, "La pâte est obligatoire"),
    viandeId: z.number().int().min(1, "La viande est obligatoire"),
    condimentId: z.number().int().min(1, "Le condiment est obligatoire"),
    demandeSpeciale: z.string().nullable(),
    quantiteCommande: z.number().int().min(1, "La quantité doit être positive"),
    prixFormatActuel: z.number().min(0, "Le prix actuel doit être positif"),
});

export const PizzaComposeSchema = z.object({
    pizzaId: z.number().int().min(1, "La pizza est obligatoire"),
    formatId: z.number().int().min(1, "Le format est obligatoire"),
    pateId: z.number().int().min(1, "La pâte est obligatoire").nullable(),
    viandeId: z.number().int().min(1, "La viande est obligatoire").nullable(),
    condimentId: z.number().int().min(1, "Le condiment est obligatoire").nullable(),
    demandeSpeciale: z.string().nullable(),
    quantiteCommande: z.number().int().min(1, "La quantité doit être positive"),
    prixFormatActuel: z.number().min(0, "Le prix actuel doit être positif"),
});

export const CommandeSupplementSchema = z.object({
    supplementId: z.number(), // ID du supplément
    prixSupplement: z.number(), // Prix actuel du supplément
    nomSupplement: z.number(),
});

export const CommandeBoissonSchema = z.object({
    boissonId: z.number(), // ID de la boisson
    prixBoisson: z.number(), // Prix actuel de la boisson
    nomBoisson: z.number(),
});

export const CommandeCondiemntSchema = z.object({
    condimentId: z.number(), 
    nomCondiment: z.number()
});


export const CreateCommandeBoissonPayloadSchema = z.object({
    commandeDetailId: z.number().int().min(1, "commandeDetailId doit être un entier positif"),
    boissonId: z.number().int().min(1, "boissonId doit être un entier positif"),
    prixBoissonActuel: z.number().min(0, "prixBoissonActuel doit être un nombre positif")
});


export const CreateCommandePayloadSchema = z.object({
    clientId: z.number().int().min(1, "clientId doit être un entier positif"),
    commandeEligibleAuProgrammeFidelite: z.boolean().optional(),
    pointFidelite: z.number(),
    etatCommande: z.enum(["reçu", "en cours", "traité"]).optional(),
    valideParUtilisateur: z.boolean().optional(),
    utilisateurId: z.number().int().min(1).nullable().optional(),
    siteId: z.number().int().min(1).nullable().optional(),
    idPointLivraison: z.number().int().min(1).nullable().optional(),
    aEmporte: z.boolean().optional(),
    dateEmport: z.string().optional(),
    rueDeLaLivraison: z.string().nullable().optional(),
    prixLivraisonActuel: z.number().min(0, "prixLivraisonActuel doit être un nombre positif").optional()
});


export const CreateCommandeDetailPayloadSchema = z.object({
    commandeId: z.number().int().min(1, "commandeId doit être un entier positif"),
    pizzaGratos: z.boolean().optional(),
    pizzaId: z.number().int().min(1, "pizzaId doit être un entier positif"),
    pizzaFormatId: z.number().int().min(1, "formatId doit être un entier positif"),
    accompagnementId: z.number().int().min(1, "accompagnementId doit être un entier positif"),
    pateId: z.number().int().min(1, "pateId doit être un entier positif"),
    viandeId: z.number().int().min(1, "viandeId doit être un entier positif"),
    condimentId: z.number().int().min(1, "condimentId doit être un entier positif").optional(),
    demandeSpeciale: z.string().max(500, "demandeSpeciale ne peut pas dépasser 500 caractères").optional(),
    quantiteCommande: z.number().int().min(1, "quantiteCommande doit être un entier positif"),
    prixFormatActuel: z.number().min(0, "prixFormatActuel doit être un nombre positif"),
    commandeBoissons: z.array(CommandeBoissonSchema), // Liste des boissons
    commandeSupplements: z.array(CommandeSupplementSchema), // Liste des suppléments  
    commandeCondiments: z.array(CommandeCondiemntSchema), // Liste des condiments  
});

export const CreateCommandePlatDetailPayloadSchema = z.object({
    commandePlatId: z.number().int().min(1, "commandeId doit être un entier positif"),
    platId: z.number().int().min(1, "platId doit être un entier positif").optional(),
    accompagnementId: z.number().int().min(1, "platId doit être un entier positif").optional(),
    quantiteCommande: z.number().int().min(1, "quantiteCommande doit être un entier positif"),
    prixPlatActuel: z.number().min(0, "prixFormatActuel doit être un nombre positif"),
    commandeBoissons: z.array(CommandeBoissonSchema), // Liste des boissons
});

export const CreateCommandeSupplementPayloadSchema = z.object({
    commandeDetailId: z.number().int().min(1, "commandeDetailId doit être un entier positif"),
    supplementId: z.number().int().min(1, "supplementId doit être un entier positif"),
    prixSupplementActuel: z.number().min(0, "prixSupplementActuel doit être un nombre positif")
});


import z from "zod"

export const clientSchema = z.object({
    clientId: z.number().optional(),
    idPointLivraison: z.number().optional(),
    nomUtilisateurClient: z.string().min(1, "Le nom de l'utiliateur est obligatoire").max(50, "Le nom du format ne peut pas dépasser 50 caractères"),
    emailClient: z.string(),
    rueDeLaLivraison: z.string(),
    telephoneClient: z.string().max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères'),
    telephoneClient2: z.string().max(20, 'Le numéro de téléphone ne peut pas dépasser 20 caractères'),
    motDePasseClient: z.string().min(4, 'Le mot de passe de doit contenir au moins 4 caractères'),
    adresseClient: z.string(),
});

export const clientSchemaPayload = z.object({
    nomUtilisateurClient: z
        .string({
            required_error: "Le nom de l'utilisateur est obligatoire.",
            invalid_type_error: "Le nom de l'utilisateur doit être une chaîne de caractères.",
        })
        .min(1, "Le nom de l'utilisateur est obligatoire.")
        .max(50, "Le nom de l'utilisateur ne peut pas dépasser 50 caractères."),

    telephoneClient: z
        .string({
            required_error: "Le numéro de téléphone est requis.",
            invalid_type_error: "Le numéro de téléphone doit être une chaîne de caractères.",
        })
        .min(8, "Le numéro de téléphone doit comporter au moins 8 caractères.")
        .max(50, "Le numéro de téléphone ne peut pas dépasser 50 caractères."),

    idPointLivraison: z
        .number({
            required_error: "Le lieu de la livraison est requis.",
            invalid_type_error: "Le lieu de la livraison doit être un nombre.",
        })
        .min(1, "Le lieu de la livraison doit être valide."),
});


export const FormatSchema = z.object({
    formatId: z.number(),
    nomFormat: z.string().min(1, "Le nom du format est obligatoire").max(50, "Le nom du format ne peut pas dépasser 50 caractères"),
    prixFormat: z.number().min(0, "Le prix du format doit être un nombre positif"),
    prixFormatAncien: z.number().min(0, "Le prix ancien du format doit être un nombre positif"),
});

export const PateSchema = z.object({
    pateId: z.number(),
    nomPate: z.string().min(1, "Le nom de la pâte est obligatoire").max(50, "Le nom de la pâte ne peut pas dépasser 50 caractères"),
});

export const ViandeSchema = z.object({
    viandeId: z.number(),
    nomViande: z.string().min(1, "Le nom de la viande est obligatoire").max(50, "Le nom de la viande ne peut pas dépasser 50 caractères"),
});

export const CondimentSchema = z.object({
    condimentId: z.number(),
    nomCondiment: z.string().min(1, "Le nom du condiment est obligatoire").max(50, "Le nom du condiment ne peut pas dépasser 50 caractères"),
});

export const SupplementSchema = z.object({
    supplementId: z.number(),
    nomSupplement: z.string().min(1, "Le nom du supplément est obligatoire").max(50, "Le nom du supplément ne peut pas dépasser 50 caractères"),
    prixSupplement: z.number().min(0, "Le prix du supplément doit être un nombre positif"),
    prixSupplementActuel: z.number().min(0, "Le prix ancien du supplément doit être un nombre positif"),
});

export const BoissonSchema = z.object({
    boissonId: z.number(),
    nomBoisson: z.string().min(1, "Le nom de la boisson est obligatoire").max(50, "Le nom de la boisson ne peut pas dépasser 50 caractères"),
    prixBoisson: z.number().min(0, "Le prix de la boisson doit être un nombre positif"),
    prixBoissonActuel: z.number().min(0, "Le prix ancien de la boisson doit être un nombre positif"),
});

export const pizzaSchema = z.object({
    pizzaId: z.number(), // ID de la pizza
    avecViande: z.number(),
    choixViande: z
        .union([
            z.enum(["avecJambon", "avecCharcuterie", "avecChoriso"]),
            z.null(),
        ])
        .default(null),
    nomPizza: z.string(), // Nom de la pizza
    descriptionPizza: z.string(), // Description de la pizza
    favoris: z.boolean(), // Indique si la pizza est un favori
    peutEtrelivre: z.number(), // ID de la catégorie de la pizza
    categoriePizzaId: z.number(), // ID de la catégorie de la pizza
    libelleCategoriePizza: z.string(), // Nom de la catégorie
    libImagePizza: z.string().optional(),
    libImageBanniere: z.string().optional(),
    estUnePizza: z.number(),
    avecAccompagnement: z.number(),
    platDuJour: z.number(),
    datePlatDuJour: z.date(),
    dateHeurPlatDuJour: z.date(),
});

export const platSchema = z.object({
    platId: z.number(), // ID de la pizza
    avecAccompagnement: z.number(),
    nomPlat: z.string(), // Nom de la pizza
    descriptionPlat: z.string(), // Description de la pizza
    libImagePlat: z.string().optional()
});

export const banniereSchema = z.object({
    pizzaId: z.number(), // ID de la pizza
    bannierePublicitaire: z.number(), // ID de la pizza
    nomPizza: z.string(), // Nom de la pizza
    descriptionPizza: z.string(), // Description de la pizza
    libBanniereImage: z.string().optional(),
    estUnePizza: z.number(),
    avecAccompagnement: z.number(),
    platDuJour: z.number(),
    choixViande: z
        .union([
            z.enum(["avecJambon", "avecCharcuterie", "avecChoriso"]),
            z.null(),
        ])
        .default(null),
});

// Schéma pour ICommande
export const CommandeSchema = z.object({
    clientId: z.number(), // ID du client
    etatCommande: z.enum(["récu", "en cours", "traité"]), // État de la commande
    valideParVendeur: z.boolean(), // Validation par le vendeur
    vendeurId: z.number().nullable().optional(), // ID du vendeur (optionnel et nullable)
    siteId: z.number().nullable().optional(), // ID du site (optionnel et nullable)
    aEmporte: z.boolean().optional(), // Indique si la commande est à emporter (optionnel)
    rueDeLaLivraison: z.string().nullable().optional(), // Date d'emport (optionnel et nullable)
    dateEmport: z.string().nullable().optional(), // Date d'emport (optionnel et nullable)
    idPointLivraison: z.number().nullable().optional(), // ID du point de livraison (optionnel et nullable)
    prixPointLivraison: z.number().nullable().optional(), // Prix actuel de la livraison (optionnel et nullable)
    adressePointLivraison: z.string().nullable().optional(), // Prix actuel de la livraison (optionnel et nullable)
    zone: z.string().nullable().optional(), // Prix actuel de la livraison (optionnel et nullable)
});

// Schéma pour ICommandeSupplement
export const CommandeSupplementSchema = z.object({
    supplementId: z.number(),
    nomSupplement: z.string().min(1, "Le nom du supplément est obligatoire").max(50, "Le nom du supplément ne peut pas dépasser 50 caractères"),
    prixSupplement: z.number().min(0, "Le prix du supplément doit être un nombre positif"),
    prixSupplementActuel: z.number().min(0, "Le prix ancien du supplément doit être un nombre positif"),

});

// Schéma pour ICommandeBoisson
export const CommandeBoissonSchema = z.object({
    boissonId: z.number(),
    nomBoisson: z.string().min(1, "Le nom de la boisson est obligatoire").max(50, "Le nom de la boisson ne peut pas dépasser 50 caractères"),
    prixBoisson: z.number().min(0, "Le prix de la boisson doit être un nombre positif"),
    prixBoissonActuel: z.number().min(0, "Le prix ancien de la boisson doit être un nombre positif"),
});

// Schéma pour ICommandeDetail
export const CommandeDetailSchema = z.object({
    pizzaId: z.number(), // ID de la pizza
    pizzaFormatId: z.number(),
    pateId: z.number(),
    nomCondiment: z.string(),
    nomFormat: z.string(),
    nomViande: z.string(),
    nomAccompagnement: z.string(),
    accompagnementId: z.number(),
    nomPate: z.string(),
    viandeId: z.number().nullable(), // ID de la viande
    condimentId: z.number().nullable(), // ID du condiment (nullable)
    demandeSpeciale: z.number().nullable(), // Demande spéciale (nullable)
    quantiteCommande: z.number(), // Quantité commandée
    prixPizzaFormat: z.number(), // Prix actuel du format
    prixFormatActuel: z.number(), // Prix actuel du format
    commandeBoissons: z.array(CommandeBoissonSchema), // Liste des boissons
    commandeSupplements: z.array(CommandeSupplementSchema), // Liste des suppléments
    commandeCondiments: z.array(CondimentSchema), // Liste des condiments
    pizzaGratos: z.boolean().optional(),

}).merge(pizzaSchema);

export const CommandePlatDetailSchema = z.object({
    accompagnementId: z.number(),
    nomAccompagnement: z.string(),
    quantiteCommande: z.number(), // Quantité commandée
    prixPlat: z.number(), // Prix actuel du format
    prixPlatActuel: z.number(), // Prix actuel du format
    commandeBoissons: z.array(CommandeBoissonSchema), // Liste des boissons
}).merge(platSchema);

// Schéma pour ICart
export const CommandePayloadSchema = z.object({
    commande: CommandeSchema, // Schéma de la commande principale
    commandeDetails: z.array(CommandeDetailSchema), // Liste des détails de la commande
});

export const CommandePlatPayloadSchema = z.object({
    commande: CommandeSchema, // Schéma de la commande principale
    commandePlatDetails: z.array(CommandePlatDetailSchema), // Liste des détails de la commande
});


export const pointLivraisonSchcema = z.object({
    idPointLivraison: z.number(),
    adressePointLivraison: z.string(),
    prixPointLivraison: z.number(),
    zone: z.string()
})


export const loginSchema = z.object({
    emailOrnomUtilisateur: z
        .string()
        .nonempty("L'email ou le nom d'utilisateur est requis.")
    ,
    motDePasseClient: z
        .string()
        .nonempty("Le mot de passe est requis.")
});

export const modiferMotDePasseSchemaSchema = z.object({
    nouveauMotDePasse: z
        .string()
        .nonempty("Le mot de passe est requis."),
    confirmationMotDePasse: z
        .string()
        .nonempty("La confirmation du mot de passe est requise.")
});


export const signUpSchema = z.object({
    nomUtilisateurClient: z
        .string()
        .min(1, "Le nom d'utilisateur est requis.")
        .max(50, "Le nom d'utilisateur ne peut pas dépasser 50 caractères."),
    emailClient: z
        .string()
        .email("Veuillez entrer une adresse email valide.")
        .min(1, "L'email est requis."),
    telephoneClient: z
        .string()
        .min(8, "Le numéro de téléphone est requis.")
        .max(50, "Le numéro de téléphone ne peut pas dépasser 50 caractères."),
    motDePasseClient: z
        .string()
        .min(4, "Le mot de passe doit contenir au moins 4 caractères.")
});

export const emailClientSchema = z.object({
    emailClientMDPOublie: z
        .string()
        .email("Veuillez entrer une adresse email valide.")
        .min(1, "L'email est requis."),
});

export const addPizzaPayloadSchema = z.object({
    quantiteCommande: z
        .number()
        .min(1, "La quantité de la commande est requise."),
    pizzaFormatId: z
        .number()
        .min(1, "Le format de la pizza est requis."),
    pateId: z
        .number()
        .min(1, "La pâte de la pizza est requise."),
});























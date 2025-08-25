import nodemailer from 'nodemailer';

// Définition de l'interface pour les informations du formulaire de contact
export interface ContactInfo {
    name: string;
    email: string;
    message: string;
    subject: string;
    emailTo?: string
}



async function sendEmail(contactInfo: ContactInfo): Promise<boolean> {
    const { emailTo = process.env.EMAIL_USER } = contactInfo
    // Configuration du transporteur de l'email
    const transporter = nodemailer.createTransport({
        host: 'smtp.infomaniak.com', // Serveur SMTP d'Infomaniak
        port: 587, // Le port pour l'email
        secure: false, // false pour TLS
        auth: {
            user: process.env.EMAIL_USER, // Ton email (via variable d'environnement)
            pass: process.env.EMAIL_PASS, // Ton mot de passe (via variable d'environnement)
        },
    });

    // Configuration du message email
    const mailOptions = {
        from: `"La piazzola" <${process.env.EMAIL_USER}>`, // Expéditeur
        to: emailTo, // Destinataire
        subject: contactInfo.subject, // Sujet de l'email
        // text: contactInfo.message
        text: contactInfo.message, // Corps du message
    };

    try {
        const info = await transporter.sendMail(mailOptions);

        // Vérification si l'email est accepté
        if (info.accepted && info.accepted.length > 0) {
            console.log(`Email envoyé avec succès à : ${info.accepted.join(', ')}`);
            return true; // Succès
        } else {
            console.error('L\'email n\'a pas été accepté par le serveur.');
            return false; // Échec
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email :', error);
        return false; // Échec
    }
}

export { sendEmail };

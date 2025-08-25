import { Suspense } from "react";
import PageLoader from "./PageLoader";

const LegalMentions = () => {

    return (
        <Suspense fallback={<PageLoader />}>
            <div className="bg-gray-100 text-gray-800 p-6 md:p-12">
                <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-lg shadow-md">
                    {/* Titre */}
                    <h1 className="text-3xl font-bold text-red-600 mb-6">Mentions légales</h1>

                    {/* Section 1 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">1. Editeur du site</h2>
                        <p>
                            <span className="font-semibold">Propriétaire du site :</span>    La Piazzola
                        </p>
                        <p>
                            <span className="font-semibold">Adresse :</span> Villa 85 Rue MZ-165, Mermoz, Dakar, Sénégal
                        </p>
                        <p>
                            <span className="font-semibold">Téléphone :</span> 33 860 36 14 / +221 77 424 30 50
                        </p>
                        <p>
                            <span className="font-semibold">E-mail :</span>{" "}
                            <a href="mailto:contact@la-piazzola.com" className="text-blue-600 underline">
                                contact@la-piazzola.com
                            </a>
                        </p>
                        <p>
                            <span className="font-semibold">Responsable de l'entreprise :</span> Mr Michel cadet
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">2. Hébergement</h2>
                        <p>
                            Le site <span className="font-semibold">La Piazzola</span> est hébergé par :
                        </p>
                        <p>
                            <span className="font-semibold">Nom de l’hébergeur :</span> Infomaniak
                        </p>
                        <p>
                            <span className="font-semibold">Adresse :</span> Network SA Rue Eugène Marziano 25 1227 Les Acacias (GE)
                        </p>
                        <p>
                            <span className="font-semibold">Site web :</span>
                            <a href="https://www.infomaniak.com" className="text-blue-600 underline">
                                https://www.infomaniak.com
                            </a>
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">3. Propriété intellectuelle</h2>
                        <p>
                            Le site <span className="font-semibold">La Piazzola</span>  et l'ensemble de son contenu (textes, images, vidéos, graphismes, logos, icônes, etc.)
                            sont protégés par le droit d’auteur et la propriété intellectuelle. Toute reproduction, représentation, modification, publication ou adaptation de
                            tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable de <span className="font-semibold">La Piazzola</span>.
                        </p>

                    </section>

                    {/* Section 4 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">4. Responsabilité</h2>
                        <p>
                            <span className="font-semibold">La Piazzola</span> s'efforce de fournir des informations précises et mises à jour sur son site.
                            Cependant, des erreurs ou omissions peuvent survenir. La Piazzola décline toute
                            responsabilité pour tout dommage direct ou indirect causé par l'utilisation des
                            informations disponibles sur ce site.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">5. Données personnelles</h2>
                        <p>
                            Les informations recueillies sur le site sont utilisées exclusivement par La Piazzola pour répondre à vos demandes, traiter vos commandes, ou pour toute autre communication liée à notre activité.
                        </p>
                        <p className="mt-4">
                            Conformément à la loi sur la protection des données personnelles, vous disposez d’un droit d’accès, de rectification et de suppression des données vous concernant. Pour exercer ce droit, contactez-nous à l’adresse suivante :
                            <a href="mailto:contact@la-piazzola.com" className="text-blue-600 underline">
                                contact@la-piazzola.com
                            </a>
                            .
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">6. Cookies </h2>
                        <p>
                            Le site utilise des cookies pour améliorer l'expérience utilisateur et collecter des statistiques anonymes. Vous pouvez désactiver les cookies en modifiant les paramètres de votre navigateur.                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">7. Litiges </h2>
                        <p>
                            Tout litige en relation avec l’utilisation du site <span className="font-semibold">La Piazzola</span> est soumis au droit sénégalais                                              </p>
                    </section>

                    {/* Section 8 */}
                    <section >
                        <h2 className="text-xl font-semibold mb-4">8. Contact </h2>
                        <p>
                            Pour toute question ou demande concernant ces mentions légales, merci de nous contacter à :
                        </p>
                        <p>
                            <span className="font-semibold">E-mail :</span>{" "}
                            <a href="mailto:contact@la-piazzola.com" className="text-blue-600 underline">
                                contact@la-piazzola.com
                            </a>
                        </p>
                        <p>
                            <span className="font-semibold">Téléphone :</span> +221 77 424 30 50
                        </p>
                    </section>
                </div>
            </div>
        </Suspense>
    );
};

export default LegalMentions;

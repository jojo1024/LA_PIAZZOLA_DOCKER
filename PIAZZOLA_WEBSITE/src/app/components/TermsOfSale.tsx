
const TermsOfSale = () => {
    return (
        <div className="bg-gray-100 text-gray-800 p-6 md:p-12">
            <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-lg shadow-md">
                {/* Titre */}
                <h1 className="text-3xl font-bold text-red-600 mb-6">Conditions Générales de Vente</h1>

                {/* Section 1 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
                    <p>
                        Les présentes conditions générales de vente régissent les relations entre <span className="font-semibold"> La Piazzola </span>
                        et ses clients, dans le cadre de la commande, du paiement et de la livraison des produits proposés sur le site web ou au restaurant .                    </p>
                </section>

                {/* Section 2 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">2. Produits et services</h2>
                    <p>
                        <span className="font-semibold">La Piazzola</span> propose des pizzas et autres produits alimentaires préparés. Les photographies et descriptions des produits sur le site sont fournies à titre indicatif. Nous nous efforçons de garantir leur exactitude, mais des différences minimes peuvent exister.
                    </p>
                </section>

                {/* Section 3 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">3. Commandes</h2>
                    <div className="px-6 ">
                        <ul className="list-disc pl-6">
                            <li className="mb-4">
                                <span className="font-medium">Les commandes peuvent être effectuées :</span>
                                <ul className="list-none mt-2 space-y-1 pl-6">
                                    <li>○ En ligne sur notre site web.</li>
                                    <li>○ Par téléphone via le numéro affiché sur le site ou sur nos réseaux sociaux.</li>
                                    <li>○ Au restaurant directement.</li>
                                </ul>
                            </li>
                            <li className="mb-4">
                                Toute commande est considérée comme valide une fois confirmée par notre équipe.
                            </li>
                            <li>
                                <span className="font-medium">Modification ou annulation :</span>{" "}
                                Les commandes ne peuvent être modifiées ou annulées après validation, sauf accord
                                exceptionnel de <span className="font-bold">La Piazzola</span>.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 4 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">4. Prix et paiement</h2>
                    <div className="px-6">
                        <ul className="list-disc pl-6">
                            <li className="mb-4">
                                Les prix indiqués sur le site sont exprimés en <span className="font-bold">FCFA</span>, toutes taxes comprises (TTC).
                            </li>
                            <li className="mb-4">
                                <span className="font-medium">Les moyens de paiement acceptés :</span>
                                <ul className="list-none mt-2 space-y-1 pl-6">
                                    <li>○ Paiement en ligne sécurisé (via Mobile money).</li>
                                    <li>○ Paiement en espèces lors du retrait ou de la livraison.</li>
                                </ul>
                            </li>
                            <li>
                                <span className="font-bold">La Piazzola</span> se réserve le droit de modifier les prix à tout moment, mais les produits
                                sont facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 5 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">5. Zones de livraison</h2>
                    <p>
                        Les livraisons sont effectuées dans les zones précisées sur notre site.
                    </p>
                </section>

                {/* Section 6 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">6. Délais </h2>
                    <p>
                        Nous nous engageons à respecter les délais indiqués, mais des retards indépendants de notre volonté peuvent survenir (trafic, conditions climatiques, etc.).
                    </p>
                </section>

                {/* Section 7 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">7. Frais de livraison</h2>
                    <div className="px-6">
                        Les frais applicables sont indiqués lors de la commande.
                    </div>
                </section>

                {/* Section 8 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">8. Réclamations et retours</h2>
                    <div className="px-6">
                        <ul className="list-disc pl-6">
                            <li className="mb-4">
                                En cas de non-conformité du produit livré avec la commande, le client dispose de <span className="font-bold">24 heures</span>,
                                pour contacter <span className="font-medium">La Piazzola</span> et signaler le problème.

                            </li>
                            <li className="mb-4">
                                Aucun retour de produit alimentaire ne sera accepté, sauf en cas de défaut constaté et validé par notre équipe.
                            </li>

                        </ul>
                    </div>
                </section>

                {/* Section 9 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">9. Responsabilité</h2>
                    <div className="px-6">
                        <ul className="list-disc pl-6">
                            <li className="mb-4">
                                <span className="font-medium">La Piazzola</span>   ne saurait être tenue responsable des dommages résultant d'une mauvaise utilisation des produits commandés.                            </li>
                            <li className="mb-4">
                                En cas de force majeure (grève, intempéries, etc.), nous ne pourrons être tenus responsables du non-respect de nos engagements.
                            </li>
                        </ul>
                    </div>
                </section>

                {/* Section 10 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">10. Données personnelles</h2>
                    <p>
                        Les données collectées lors des commandes sont traitées conformément à notre politique de confidentialité. Elles ne seront utilisées que pour assurer le traitement des commandes et améliorer notre relation client.
                    </p>
                </section>

                {/* Section 11 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">11. Propriété intellectuelle</h2>
                    <p>
                        Tous les contenus du site de <span className="font-medium">La Piazzola</span>  (textes, images, logos, etc.) sont protégés par le droit d'auteur. Toute reproduction ou utilisation non autorisée est interdite.                    </p>
                </section>

                {/* Section 12 */}
                <section className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">12. Droit applicable et litiges</h2>
                    <p>
                        Les présentes CGV sont soumises au droit sénégalais.
                    </p>
                </section>

                {/* Section 12 */}
                <section >
                    <h2 className="text-xl font-semibold mb-4">13. Contact</h2>
                    <p>
                        Pour toute question ou réclamation, veuillez nous contacter :
                    </p>
                    <div className="px-6">
                        <ul className="list-disc pl-6">
                            <li className="mb-4">
                                Par e-mail :   <a href="mailto:contact@la-piazzola.com" className="text-blue-600 underline">
                                    contact@la-piazzola.com
                                </a>
                            </li>
                            <li className="mb-4">
                                Par téléphone : +221 77 424 30 50
                            </li>
                            <li className="mb-4">
                                Notre adresse  : Villa 85 Rue MZ-165, Mermoz, Dakar, Sénégal
                            </li>

                        </ul>
                    </div>
                </section>
            </div>

        </div>
    );
};

export default TermsOfSale;

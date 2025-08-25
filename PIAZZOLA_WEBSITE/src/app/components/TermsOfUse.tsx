
const TermsOfUse = () => {
  return (
    <div className="bg-gray-100 text-gray-800 p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-lg shadow-md">
        {/* Titre */}
        <h1 className="text-3xl font-bold text-red-600 mb-6">
          Conditions Générales d'Utilisation
        </h1>

        {/* Section 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Objet</h2>
          <p>
            Les présentes Conditions Générales d'Utilisation (CGU) ont pour
            objectif de définir les modalités d'accès et d'utilisation du site{" "}
            <span className="font-semibold">Piazzola</span>, accessible à
            l'adresse suivante :{" "}
            <a
              href="https://www.la-piazzola.com"
              className="text-blue-600 underline"
            >
              www.la-piazzola.com
            </a>
            . En naviguant sur ce site, l'utilisateur accepte ces conditions
            sans réserve.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Accès au site</h2>
          <p>
            L'accès au site Piazzola est gratuit. Toutefois, l'utilisateur doit
            disposer d'une connexion internet et d'un équipement compatible
            pour naviguer. Piazzola ne peut être tenu responsable de tout
            problème lié à l'accès au site, tels que des interruptions ou des
            erreurs techniques.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Utilisation des services</h2>
          <p>
            Les services offerts par Piazzola, tels que la commande en ligne,
            sont réservés aux utilisateurs majeurs ou aux mineurs disposant de
            l'accord de leur représentant légal. L'utilisateur s'engage à
            fournir des informations exactes lors de l'inscription ou de la
            commande.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Propriété intellectuelle</h2>
          <p>
            Tous les contenus présents sur le site Piazzola (textes, images,
            logos, etc.) sont protégés par le droit de la propriété
            intellectuelle. Toute reproduction ou utilisation non autorisée est
            strictement interdite.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Données personnelles</h2>
          <p>
            Piazzola collecte et traite les données personnelles de ses
            utilisateurs conformément à sa{" "}
            <a
              href="/politique-de-confidentialite"
              className="text-blue-600 underline"
            >
              Politique de Confidentialité
            </a>
            . L'utilisateur dispose d'un droit d'accès, de rectification et de
            suppression de ses données, conformément aux lois applicables.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Responsabilités</h2>
          <p>
            Piazzola s'efforce de garantir l'exactitude des informations
            présentes sur le site. Cependant, des erreurs ou omissions peuvent
            survenir. Piazzola décline toute responsabilité en cas de dommage
            résultant de l'utilisation du site ou des services.
          </p>
        </section>

        {/* Section 7 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Modifications</h2>
          <p>
            Piazzola se réserve le droit de modifier à tout moment les présentes
            CGU. Les utilisateurs sont invités à consulter régulièrement cette
            page pour prendre connaissance des éventuelles modifications.
          </p>
        </section>

        {/* Section 8 */}
        <section>
          <h2 className="text-xl font-semibold mb-4">8. Litiges</h2>
          <p>
            Les présentes CGU sont régies par la législation ivoirienne. En cas
            de litige, une solution amiable sera recherchée avant toute action
            judiciaire. Si aucune solution n'est trouvée, les tribunaux
            ivoiriens seront compétents.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfUse;

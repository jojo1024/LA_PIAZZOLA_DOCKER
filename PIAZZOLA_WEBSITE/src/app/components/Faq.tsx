
const Faq = () => {
    return (
        <div className="mx-4 px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">FAQ</h1>
            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-bold mb-2">MES POINTS EXPIRENT-ILS ?</h2>
                    <p className="text-gray-700">
                        Les points crédités expirent après 365 jours d’inactivité sur votre
                        compte. C’est-à-dire que, pendant cette période d’inactivité, vous
                        n’avez ni gagné de points, ni profité de pizza offerte. Également,
                        vous avez 365 jours pour profiter de votre pizza.
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">
                        QUI PEUT PROFITER DU PROGRAMME ?
                    </h2>
                    <p className="text-gray-700">
                        Le programme est ouvert à tous les clients de la piazzola qui
                        passent des commandes sur le site.
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">
                        COMMENT PUIS-JE M’INSCRIRE AU PROGRAMME DE FIDÉLITÉ ?
                    </h2>
                    <p className="text-gray-700">
                        Vous devez créer un compte-client sur le site la-piazzola.com, et
                        cliquer sur le bouton "JE M'INSCRIS" pour vous inscrire au programme de fidélité.
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">
                        COMMENT PUIS-JE ME DESINSCRIRE DU PROGRAMME FIDELITE ?
                    </h2>
                    <p className="text-gray-700">
                        Connectez-vous à votre compte et au niveau du bas de page cliquez sur <span className="text-black">"Je ne participe pas"</span> !
                    </p>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">
                        COMMENT VOIR MON SOLDE DES POINTS ?
                    </h2>
                    <p className="text-gray-700">
                        Votre compte contient toutes les informations concernant votre programme de fidélité. Vous y trouverez votre solde de points, vos pizzas.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Faq;

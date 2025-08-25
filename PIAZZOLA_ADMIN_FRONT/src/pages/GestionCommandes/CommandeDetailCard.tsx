import React from 'react'
import { ICommandeDetail } from '../../stores/commandeSlice';
import { BASE_URL, BASE_URL_PROD, choixViandeitem } from '../../utils/constants';
import { calculerPrixTotalDuneCommande, formatMontantFCFA } from '../../utils/functions';

interface CommandeDetailCardProps {
    elt: ICommandeDetail;
    index: number;
}
const CommandeDetailCard: React.FC<CommandeDetailCardProps> = ({ elt, index }) => {
    const { nomPizza, prixFormatActuel, libImagePizza, quantiteCommande } = elt;
    return (
        <div key={index} className="flex py-4 sm:py-7 last:pb-0 first:pt-0">
            <div className="h-24 w-16 sm:w-20 flex-shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img
                    src={`${BASE_URL_PROD}/pizza_image/${libImagePizza}`}
                    alt={`${nomPizza}`}
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="ml-4 flex flex-1 flex-col">
                <div>
                    <div className="flex flex-col sm:flex-row justify-between">
                        <div>
                            <div className="flex items-center">
                                <h3 className="text-base font-medium line-clamp-1 mr-2">{nomPizza}</h3>
                                <span className="text-sm text-slate-500">( {formatMontantFCFA(prixFormatActuel)} )</span>
                            </div>
                            {/* <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">{patePizza}</span> */}
                            {
                                elt?.estUnePizza
                                    ?
                                    <span className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {elt.nomFormat}{" - "}
                                        {elt.nomPate}
                                    </span>
                                    : null
                            }
                        </div>

                        <div className="text-sm mt-4 sm:mt-0">
                            Qté : <span className="text-black font-semibold">{quantiteCommande}</span>
                            <span className="mx-2">x</span>
                            <span className="text-black font-semibold">{formatMontantFCFA(prixFormatActuel * quantiteCommande)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-1  justify-between text-sm">
                    <div>
                        {elt.commandeBoissons.length > 0 ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-4">
                                    <span className="mt-1 mr-2">Boissons:</span>
                                    {elt.commandeBoissons.map((elt, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                        >
                                            {elt.nomBoisson} : {elt.prixBoissonActuel}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {elt.commandeSupplements.length > 0 ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-3">
                                    <span className="mt-1 mr-2">Supplements:</span>
                                    {elt.commandeSupplements.map((elt, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                        >
                                            {elt.nomSupplement} : {elt.prixSupplementActuel}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {elt.commandeCondiments.length > 0 ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-3">
                                    <span className="mt-1 mr-2">Condiments:</span>
                                    {elt.commandeCondiments.map((elt, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                        >
                                            {elt.nomCondiment}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {(elt?.nomAccompagnement && elt?.avecAccompagnement) ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-3">
                                    <span className="mt-1 mr-2">Accompagnement:</span>
                                    <div
                                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                    >
                                        {/* {recupPizzaInfo(Number(item.viandeId), viande, "viandeId", "nomViande")} */}
                                        {elt.nomAccompagnement}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {(elt?.nomViande && elt?.choixViande) ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-3">
                                    <span className="mt-1 mr-2">{choixViandeitem[elt?.choixViande]}:</span>
                                    <div
                                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                    >
                                        {elt.nomViande}
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* {elt.nomCondiment ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-4">
                                    <span className="mt-1 mr-2">Condiment:</span>
                                    <div
                                        className={`flex items-center py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                    >
                                        {elt.nomCondiment}
                                    </div>
                                </div>
                            </div>
                        ) : null} */}

                        {elt.demandeSpeciale ? (
                            <div className="flex items-center">
                                <div className="flex flex-wrap text-sm mt-4">
                                    <span className="mt-1 mr-2">Demande Spé.:</span>
                                    <div
                                        className={`flex max-w-40 overflow-hidden truncate  py-1 mr-2 mb-2 justify-center px-4 text-sm rounded-full border focus:outline-none select-none border-neutral-300 dark:border-neutral-700`}
                                    >
                                        {elt.demandeSpeciale}
                                    </div>
                                </div>
                            </div>

                        ) : null}

                    </div>

                    <div className="flex items-end justify-end text-md  mt-4 sm:mt-0">
                        total: <span className="text-red-500  font-semibold text-base ml-1">{formatMontantFCFA(calculerPrixTotalDuneCommande([elt]))}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CommandeDetailCard
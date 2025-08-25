import React, { useRef } from 'react'
import { IEtatCommande, IListeCommandeItem } from '../../stores/commandeSlice';
import { calculerPrixTotalDuneCommande, convertDateToLocaleStringDateTime, formatMontantFCFA } from '../../utils/functions';
import { useSelector } from 'react-redux';
import { IReduxState } from '../../stores/store';
import Button from '../../base-components/Button';
import CommandeDetailCard from './CommandeDetailCard';
import Chip from '../components/Chip';
import CustomButton from '../components/CustomButton';
import { useReactToPrint } from 'react-to-print';

interface CommandeCardProps {
    item: IListeCommandeItem;
    index: number;
    setOpenDialogAttribuerPizza: React.Dispatch<React.SetStateAction<boolean>>;
    setCommandeSelectionne: React.Dispatch<React.SetStateAction<IListeCommandeItem | undefined>>;
    setOpenAnnulerCommandeConfirmBox: React.Dispatch<React.SetStateAction<boolean>>;
    etat: {
        [key: string]: {
            label: string;
            etatCommande: IEtatCommande;
        };
    },
    loading?: boolean;
    gestionEtatCommande: (data: IListeCommandeItem) => Promise<void>;
    setIndexSelected: React.Dispatch<React.SetStateAction<number>>;
    indexSelected: number;
}
const CommandeCard: React.FC<CommandeCardProps> = ({ setIndexSelected, indexSelected, loading = false, item, index, setOpenDialogAttribuerPizza, setCommandeSelectionne, setOpenAnnulerCommandeConfirmBox, etat, gestionEtatCommande }) => {
    // Redux
    const connectionInfo = useSelector((state: IReduxState) => state.application.connectionInfo);

    const componentRef = useRef<HTMLDivElement | null>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    let montantTotal = calculerPrixTotalDuneCommande(item.commandeDetails)
    return (
        <>
        <div ref={componentRef} key={index} className="border border-slate-200 intro-y dark:border-slate-700 rounded-lg overflow-hidden z-0">
            <div className='flex justify-center text-xl print-only'>Reçu de La Piazzola</div>
            <div className='p-4 sm:p-8 bg-slate-50 dark:bg-slate-500/5'>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center  ">
                    <div>
                        <p className="text-lg font-semibold">#{item.commandeId}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 sm:mt-2">
                            Date de la commande: <span className="text-black">{convertDateToLocaleStringDateTime(item.dateCommande)}</span>
                        </p>
                        <div className="text-slate-500 text-sm">
                            {
                                item.aEmporte
                                    ?
                                    <span>Date de l'emport: <span className="text-black">{convertDateToLocaleStringDateTime(item.dateEmport)}</span></span>
                                    :
                                    <span>Lieu et prix de la livraison: <span className="text-black">{item?.zone}, {item?.rueDeLaLivraison}... {formatMontantFCFA(item.prixLivraisonActuel || 0)}</span></span>
                            }
                        </div>
                        <div className="text-slate-500 text-sm">
                            <span>Prix total: <span className="text-red-500 text-base font-semibold">{formatMontantFCFA(montantTotal + (item.prixLivraisonActuel || 0))}</span></span>
                        </div>
                        <div className="text-slate-500 text-sm">
                            <span>Client: <span className="text-black  ">{item?.nomUtilisateurClient}, {item?.telephoneClient}, {item?.telephoneClient2}</span></span>
                        </div>
                        <div className="text-slate-500 text-sm">
                            <span>Pizzeria: <span className="text-black  ">{item?.nomSite ? item?.nomSite : "En attente de validation..."}</span></span>
                        </div>
                        {
                            item?.nomUtilisateur &&
                            <div className="text-slate-500 text-sm">
                                <span>Pizzaiolo: <span className="text-black  ">{item?.nomUtilisateur}</span></span>
                            </div>
                        }
                        {
                            item.etatCommande === "traité" &&
                            <CustomButton
                                type="soft-primary"
                                onClick={handlePrint}
                                className="print-button mt-2 shadow-md"
                                libelle={"Imprimer"}
                            />
                        }
                    </div>
                    <div className="flex mt-3 sm:mt-0">
                        <Chip libelle={item.etatCommande} />
                    </div>
                </div>

                {/* Actions boutons */}
                <div className="flex flex-row-reverse">

                    {
                        connectionInfo?.nomRole === "Admin"
                            ?
                            <>
                                {["reçu"].includes(item.etatCommande) && item.siteId === null && (
                                    <>

                                        <CustomButton
                                            libelle='Attribuer'
                                            type='soft-primary'
                                            onClick={(event: React.MouseEvent) => {
                                                event.preventDefault();
                                                setOpenDialogAttribuerPizza(true);
                                                setCommandeSelectionne(item);
                                                setIndexSelected(index)
                                            }}
                                            loading={loading && index === indexSelected}
                                            className="ml-4 shadow-md"
                                        />

                                        <CustomButton
                                            libelle='Annuler'
                                            type='secondary'
                                            onClick={(event: React.MouseEvent) => {
                                                event.preventDefault();
                                                setOpenAnnulerCommandeConfirmBox(true);
                                                setCommandeSelectionne(item)
                                            }}
                                            loading={loading && index === indexSelected}
                                            className="ml-auto sm:ml-0"
                                        />

                                    </>
                                )}
                            </>
                            :
                            <>
                                {["reçu", "en cours"].includes(item.etatCommande) && (
                                    <CustomButton
                                        type="soft-primary"
                                        onClick={(event: React.MouseEvent) => {
                                            event.preventDefault();
                                            setIndexSelected(index)
                                            gestionEtatCommande({ ...item, etatCommande: etat[item.etatCommande].etatCommande });
                                        }}
                                        className="ml-4 shadow-md"
                                        loading={loading && index === indexSelected}
                                        libelle={etat[item.etatCommande].label}
                                    />
                                )}
                            </>
                    }
                    {/* {item.etatCommande === "traité" && (<div>Livrée...</div>)} */}

                </div>

            </div>
            <div className="border-t box border-slate-200 dark:border-slate-700 p-2 sm:p-8 divide-y divide-y-slate-200 dark:divide-slate-700">
                {item.commandeDetails.map((elt, index) => (
                    <CommandeDetailCard
                        elt={elt}
                        index={index}
                        key={index}
                    />
                ))}
            </div>
        </div>
        </>
    );
}

export default CommandeCard
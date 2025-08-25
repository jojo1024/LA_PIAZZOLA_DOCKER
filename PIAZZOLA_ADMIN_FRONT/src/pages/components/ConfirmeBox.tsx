import clsx from 'clsx';
import { useRef } from 'react';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import CustomButton from './CustomButton';

export type ConfirmBoxType = "danger" | "infos" | "warning" | "primary" | "secondary" | "third";
export interface IConfirmBox {
    openConfirmeBox: boolean;
    handleCloseConfirmeBox: () => void;
    handleConfirme: any;
    intitule: any;
    loading: boolean;
    type?: ConfirmBoxType;
    buttonSaveLabel?: string;
    buttonBackLabel?: string;
    disabled?: boolean;
}
export interface IConfirmeBoxProps {
    confirmBoxProps: IConfirmBox
}

export default function ConfirmeBox(props: IConfirmeBoxProps) {

    //Props
    const { confirmBoxProps } = props

    const {
        openConfirmeBox, handleCloseConfirmeBox, handleConfirme, intitule, loading, type = "danger",
        buttonSaveLabel = "Supprimer", disabled, buttonBackLabel = "Annuler"
    } = confirmBoxProps

    //Hooks
    const confirmeButtonRef = useRef(null);


    return (
        <Dialog
            open={openConfirmeBox}
            onClose={() => { }}
            initialFocus={confirmeButtonRef}
        >
            <Dialog.Panel>
                <div className="p-5 text-center">
                    <Lucide
                        icon={type === "danger" ? "XCircle" : type === "infos" ? "Info" : "AlertCircle"}
                        className={clsx([
                            "w-16 h-16 mx-auto mt-3",
                            type === "infos" ? "text-info" : type === "danger" ? "text-danger" : "text-warning"
                        ])}
                    />
                    <div className="mt-5 text-3xl">Etes-vous sûr?</div>
                    <div className="mt-2 text-slate-500">
                        {intitule}
                    </div>
                </div>
                <div className="px-5 pb-8 text-center">
                    <CustomButton
                        libelle={buttonBackLabel}
                        // loading={loading}
                        onClick={handleCloseConfirmeBox}
                        // @ts-ignore
                        type={"third"}
                        className="w-24 mr-5"
                    />
                    <CustomButton
                        libelle={buttonSaveLabel}
                        loading={loading}
                        onClick={handleConfirme}
                        // @ts-ignore
                        type={type}
                        disable={disabled}

                    />
                </div>
            </Dialog.Panel>
        </Dialog>

    )
}

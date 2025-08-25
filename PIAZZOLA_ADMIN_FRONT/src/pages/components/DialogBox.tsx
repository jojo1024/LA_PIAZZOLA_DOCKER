import React, { useRef } from 'react';
import { Dialog } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import Alert from "../../base-components/Alert";
import CustomButton from './CustomButton';

export interface IFilterBox {
    openDialog: boolean;
    handleCloseDialog: any;
    handleSearch: any;
    dialogBoxContent: JSX.Element;
    dialogBoxContentHeader?: string;
    disable: boolean;
    loading: boolean;
    dialogTitle: string;
    dialogFooterButtonTitle: string;
    dialogSubTitle: string;
    dialogIcon?: any;
    actionLabel?: string;
    size?: string;
    notDisplayLoadingButton?: boolean;
    onButtonAnnulerClick: () => void;
    onButtonSaveClick: (e: any) => void;
    iconSvg?: JSX.Element;
    isSVG?: boolean;
    height?: string;

}

export interface IDialogProps {
    dialogProps: IFilterBox
}

const DialogBox: React.FC<IDialogProps> = (props) => {

    //Props
    const { dialogProps } = props
    const { height,
        openDialog, dialogBoxContent, loading, disable,
        dialogTitle, handleCloseDialog, handleSearch,
        actionLabel, size, notDisplayLoadingButton, dialogSubTitle,
        dialogIcon, dialogFooterButtonTitle, dialogBoxContentHeader,
        onButtonAnnulerClick, onButtonSaveClick, iconSvg
    } = dialogProps

    //Hooks
    const sendButtonRef = useRef(null);

    return (
        <div>
            {/* BEGIN: Modal Content */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                initialFocus={sendButtonRef}
                // @ts-ignore
                size={size}
                staticBackdrop
            >
                <Dialog.Panel
                    className={`${height ? height : "h-2/4"}`}
                // className={`${height ? height : "h-2/3"} overflow-auto`}
                >
                    <Dialog.Title className={"mb-2"}>
                        <div className="mr-auto text-base font-medium">
                            <div className='flex'>
                                <div className='flex border w-12 h-12 justify-center items-center  rounded-md p-2 mr-2'>
                                    {
                                        iconSvg
                                            ?
                                            iconSvg
                                            :
                                            //  @ts-ignore 
                                            < Lucide icon={dialogIcon || 'X'} className="w-5 h-5" />
                                    }
                                </div>
                                <div className='flex-col'>
                                    <h2 >
                                        {dialogTitle}
                                    </h2>
                                    <div className="text-xs text-slate-600 dark:text-slate-500 w-[80%]  ">{dialogSubTitle}</div>
                                </div>
                            </div>
                        </div>
                        <span
                            className="flex items-center cursor-pointer justify-center w-7 h-7 box border rounded-sm dark:bg-[#28334e]"
                            onClick={handleCloseDialog}
                        >
                            <Lucide icon="X" className="w-3 h-3" />
                        </span>
                    </Dialog.Title>
                    <Dialog.Description  /* className="grid grid-cols-12 gap-4 gap-y-3" */>
                        <div className=" mt-[-25px]  overflow-y-auto">
                            {dialogBoxContentHeader &&
                                <Alert
                                    variant="outline-secondary"
                                    className="flex items-center m-2 "
                                >
                                    {({ dismiss }) => (
                                        <>
                                            <Lucide
                                                icon="AlertOctagon"
                                                className="w-6 h-6 mr-2 "
                                            />{" "}
                                            <span className='w-[85%]'>{dialogBoxContentHeader}</span>

                                            <Alert.DismissButton
                                                type="button"
                                                className="btn-close"
                                                onClick={dismiss}
                                                aria-label="Close"
                                            >
                                                <Lucide icon="X" className="w-4 h-4" />
                                            </Alert.DismissButton>
                                        </>
                                    )}
                                </Alert>
                            }
                            {dialogBoxContent}
                        </div>
                    </Dialog.Description>
                    <Dialog.Footer>
                        {
                            notDisplayLoadingButton
                                ?
                                <div ref={sendButtonRef} ></div>
                                :
                                <>
                                    {/* <Button type="button" variant="outline-secondary" onClick={() => {
                                        // setHeaderFooterModalPreview(false);
                                    }}
                                        className="w-20 mr-1"
                                    >
                                        Annuler
                                    </Button> */}
                                    <CustomButton
                                        libelle={'Annuler'}
                                        type="third"

                                        onClick={onButtonAnnulerClick}
                                        className="mr-3"
                                    />
                                    <CustomButton
                                        libelle={dialogFooterButtonTitle}
                                        type="primary"
                                        onClick={onButtonSaveClick}
                                        disable={disable}
                                        loading={loading}
                                    />
                                    {/* <Button variant="primary" type="button" className="w-20" ref={sendButtonRef}>
                                        {dialogFooterButtonTitle}
                                    </Button> */}
                                </>
                            // <LoadingButton
                            //     refs={sendButtonRef}
                            //     libelle={actionLabel ? actionLabel : "Enregistrer"}
                            //     loading={loading}
                            //     disable={disable}
                            //     onClick={handleSearch}
                            // />
                        }
                    </Dialog.Footer>
                </Dialog.Panel>
            </Dialog>
            {/* END: Modal Content */}
        </div>
    )
}

export default DialogBox




import React from 'react'
import NcModal from './NcModal'
import ButtonSecondary from './Button/ButtonSecondary';
import ButtonPrimary from './Button/ButtonPrimary';

interface ICustomModal {
    modalTitle: string;
    showModal: boolean;
    onCloseModal: () => void;
    content: JSX.Element;
    onButtonCancelClick: () => void;
    onButtonConfirmClick: (e?: any) => void;
    loading?: boolean;
    disabledConfirmButton?: boolean;
    libelleConfirmButton?: string;
    isPopup?: boolean;
}
const CustomModal: React.FC<ICustomModal> = (props) => {
    const { isPopup = false, libelleConfirmButton = "Confirmer", disabledConfirmButton = false, modalTitle, showModal, content, onButtonCancelClick, onButtonConfirmClick, onCloseModal, loading = false } = props
    return (
        <NcModal
            isOpenProp={showModal}
            onCloseModal={() => onCloseModal()}
            contentExtraClass="max-w-lg"
            renderContent={() =>
                <div >
                    {content}
                    {
                        isPopup
                            ?
                            null
                            :
                            <div className="mt-4 ">
                                <ButtonSecondary onClick={() => onButtonCancelClick()} type="button" >
                                    Annuler
                                </ButtonSecondary>
                                <ButtonPrimary disabled={disabledConfirmButton} loading={loading} onClick={() => onButtonConfirmClick()} className='ml-4' type="submit">{libelleConfirmButton}</ButtonPrimary>
                            </div>
                    }
                </div>
            }
            renderTrigger={() => null}
            modalTitle={modalTitle}
        />
    )
}

export default CustomModal
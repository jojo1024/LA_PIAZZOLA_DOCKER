import React from 'react'
import Lucide from '../../base-components/Lucide';
import { IPizzaFormat } from '../../stores/menuSlice';

interface CustomMenuCardProps {
    setDeleteConfirmationModal?: (value: boolean) => void;
    setEditConfirmationModal?: (value: boolean) => void;
    imageBanniere: string;
    onButtonEditClick?: () => void;
    onButtonDeleteClick?: () => void;
    // keys: number;
}


const CustomBanniereCard: React.FC<CustomMenuCardProps> = ({imageBanniere, onButtonDeleteClick, onButtonEditClick,  setDeleteConfirmationModal, setEditConfirmationModal }) => {
    return (
        <div
            // key={keys}
            className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
        >
            <div className="box">
                <div className="p-5">
                    <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 ">
                        <img
                            alt={"image bannière"}
                            className="rounded-md"
                            src={imageBanniere}
                        />

                    </div>
             
                </div>
                <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                    <div className="flex items-center mr-auto text-primary" >
                        {/* <Lucide icon="Eye" className="w-4 h-4 mr-1" /> Restaurer */}
                    </div>
                    <div
                        onClick={(event) => {
                            event.preventDefault();
                            onButtonEditClick && onButtonEditClick()
                        }} className="flex items-center mr-3 cursor-pointer" >
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" /> Modifier
                    </div>
                    <div
                        className="flex items-center text-danger cursor-pointer"
                        onClick={(event) => {
                            event.preventDefault();
                            onButtonDeleteClick && onButtonDeleteClick()
                        }}
                    >
                        <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CustomBanniereCard
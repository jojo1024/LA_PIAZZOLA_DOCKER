import React from 'react'
import Lucide from '../../base-components/Lucide';
import { IPizzaFormat } from '../../stores/menuSlice';
import { formatMontantFCFA } from '../../utils/functions';

interface CustomMenuCardProps {
    setDeleteConfirmationModal?: (value: boolean) => void;
    setEditConfirmationModal?: (value: boolean) => void;
    libPizza: string;
    descriptionPizza: string;
    imagePizza: string;
    estUnePizza: number;
    pizzaFormat: IPizzaFormat[];
    onButtonEditClick?: () => void;
    onButtonDeleteClick?: () => void;
    // keys: number;
}


const CustomMenuCard: React.FC<CustomMenuCardProps> = ({ onButtonDeleteClick, onButtonEditClick, pizzaFormat, libPizza, descriptionPizza, imagePizza, estUnePizza }) => {
    return (
        <div
            // key={keys}
            className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
        >
            <div className="box">
                <div className="p-5">
                    <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 ">
                        <img
                            alt={libPizza}
                            className="rounded-md"
                            src={imagePizza}
                        />


                        <div className="absolute w-full bottom-0 z-10 px-5 pb-2 text-white bg-black opacity-60">
                            <span className="block text-base font-medium">
                                {libPizza}
                            </span>
                            <span className="mt-3 text-xs text-white/90">
                                {descriptionPizza?.slice(0, 40)}...
                            </span>
                        </div>
                    </div>
                    <div className="mt-5 text-slate-600 dark:text-slate-500">
                        {
                            estUnePizza === 1 &&
                            pizzaFormat && pizzaFormat?.map((format, index) => (
                                <div key={index} className="flex items-center mt-2">
                                    <Lucide icon="User" className="w-4 h-4 mr-2" /> {format?.nomFormat}: {format?.prixPizzaFormat} F CFA
                                </div>
                            ))
                        }
                        {
                            estUnePizza === 0 && <div>Prix: {formatMontantFCFA(pizzaFormat[0]?.prixPizzaFormat || 0)}</div>
                        }

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

export default CustomMenuCard
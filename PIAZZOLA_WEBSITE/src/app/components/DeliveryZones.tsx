import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import { IPointLivraison } from '../../store/interfaces';
import { formatMontantFCFA } from '../../utils/functions';
import Label from './Label';




interface MultiSelectProps {
    data: IPointLivraison[];
    libelle: string;
    keys: string[];
    valueSelected: IPointLivraison;
    containerClassname?: string;
    selectContainerClassname?: string;
    labelClassname?: string;
    // setPointAdresseSelectionne: React.Dispatch<React.SetStateAction<IPointLivraison>>;
    // pointAdresseSelectionne: IPointLivraison;
    error?: string
    onChange: (IPointLivraison: any) => void;

}
const DeliveryZones: React.FC<MultiSelectProps> = ({labelClassname, selectContainerClassname = "rounded-md", onChange, valueSelected, error, data, libelle, keys, containerClassname }) => {

    // Retirer ou ajouter un item selon s'il existe pas ex: boisson ou supplement
    const handleChangeCategories = (value: string | number) => {
        const findItem = data?.find((item) => item.idPointLivraison === Number(value))
        onChange(findItem)
    };

    return (
        <div className={`flex flex-col  ${containerClassname}`}>
            <Label className={` text-left pb-1 ${labelClassname}`}>{libelle}</Label>

            <Popover className="relative">
                {({ open, close }) => (
                    <>
                        <Popover.Button className={`flex w-full  justify-between px-4 py-3.5 text-sm ${selectContainerClassname} border focus:outline-none select-none
               ${open
                                ? "!border-primary-500 "
                                : "border-neutral-300 dark:border-neutral-700"
                            }
                ${!!valueSelected?.idPointLivraison
                                ? "!border-primary-500 bg-primary-50 text-primary-900"
                                : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                            }
                `}
                        >
                            <div className=" ">{
                                valueSelected?.idPointLivraison === 0
                                    ? null :
                                    <span className='text-black'>

                                        {valueSelected?.zone}... {formatMontantFCFA(valueSelected?.prixPointLivraison)}
                                    </span>
                            }
                            </div>
                            <div className=''>
                                <ChevronDownIcon className="w-4 h-4 ml-3" />
                            </div>
                        </Popover.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel className="absolute z-40 w-80 sm:w-screen max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-96">
                                <div className="overflow-y-auto  h-96 rounded-md shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                                    <div className="relative flex flex-col px-5 py-6 space-y-5">

                                        {/* <div className="w-full border-b border-neutral-200 dark:border-neutral-700" /> */}
                                        {data.map((item: any) => (
                                            <div
                                                onClick={() => {
                                                    handleChangeCategories(item[keys[0]]);
                                                    close();
                                                }}
                                                key={item[keys[0]]} className="cursor-pointer border p-2 border-slate-500 rounded-2xl ">
                                                <div className="flex-1 py-1 ml-2 ">

                                                    <div className="flex  items-center">

                                                        <div className="pr-2 text-slate-500">
                                                            <input
                                                                checked={valueSelected?.idPointLivraison === item[keys[0]]}
                                                                className=''
                                                                id={item[keys[0]]}
                                                                type="radio"
                                                                value={item[keys[0]]}
                                                                onChange={(e: any) => {
                                                                    handleChangeCategories(e.target.value);
                                                                    close();
                                                                }}
                                                            // name={radioName}
                                                            // value={id}
                                                            // checked={isSelected}
                                                            // onChange={onClick}
                                                            />
                                                        </div>
                                                        <div className=" text-black text-base">
                                                            {`${item[keys[3]]} : ${formatMontantFCFA(item[keys[2]] || 0)}`}
                                                        </div>
                                                    </div>
                                                    <div className="mt-1  text-base text-slate-500">
                                                        {item[keys[1]]}                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
            {error && <Label className="text-red-500 text-sm mt-1">{error}</Label>}
        </div>
    )
}

export default DeliveryZones
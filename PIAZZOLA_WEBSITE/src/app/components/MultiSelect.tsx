import { Popover, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { Fragment } from 'react';
import Label from './Label';
import Checkbox from './Checkbox';
import { formatMontantFCFA } from '../../utils/functions';




interface MultiSelectProps {
    data: any;
    libelle: string;
    keys: string[];
    containerClassname?: string;
    setCategoriesState: React.Dispatch<React.SetStateAction<any[]>>;
    categoriesState: any[];
    disabled?: boolean;
}
const MultiSelect: React.FC<MultiSelectProps> = ({ disabled = false, categoriesState, setCategoriesState, data, libelle, keys, containerClassname }) => {

    // Retirer ou ajouter un item selon s'il existe pas ex: boisson ou supplement
    const handleChangeCategories = (checked: boolean, item: any) => {
        checked
            ? setCategoriesState([...categoriesState, item])
            : setCategoriesState(categoriesState.filter((i) => i[keys[0]] !== item[keys[0]]));
    };

    return (
        <div className={`flex flex-col lg:flex-col ${containerClassname}`}>
            <Label className={`text-sm text-left w-24`}>{libelle}</Label>

            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button className={`flex w-full  justify-between px-4 py-3.5 text-sm rounded-2xl border focus:outline-none select-none
               ${open
                                ? "!border-primary-500 "
                                : "border-neutral-300 dark:border-neutral-700"
                            }
                ${!!categoriesState.length
                                ? "!border-primary-500 bg-primary-50 text-primary-900"
                                : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
                            }
                `}
                        >
                            <div className=" ">{categoriesState.map(item => item[keys[1]]).join(", ")}</div>
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
                            <Popover.Panel className="absolute z-40 w-screen bottom-full max-w-sm px-4 mt-3 left-0 sm:px-0 lg:max-w-96">
                                <div className="overflow-y-auto  h-52 rounded-xl shadow-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
                                    <div className="relative flex flex-col px-5 py-6 space-y-5">

                                        {/* <div className="w-full border-b border-neutral-200 dark:border-neutral-700" /> */}
                                        {data.map((item: any) => (
                                            <div key={item[keys[0]]} className="">
                                                <Checkbox
                                                    disabled={disabled}
                                                    name={item[keys[0]]}
                                                    label={`${item[keys[1]]} ${item[keys[2]] ? `...${formatMontantFCFA(item[keys[2]])}` : ""}  `}
                                                    onChange={(checked) =>
                                                        disabled ? null
                                                            :
                                                            handleChangeCategories(checked, item)
                                                    }
                                                    defaultChecked={categoriesState.filter(elt => elt[keys[0]] === item[keys[0]]).length !== 0}
                                                />

                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    )
}

export default MultiSelect
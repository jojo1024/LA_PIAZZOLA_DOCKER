import React from 'react';

import { formatMontantFCFA } from '../../utils/functions';
import { FormLabel, FormSelect } from '../../base-components/Form';

interface CustomSelect1Props {
    id?: string;
    label: string;
    textClassname?: string;
    selectClassname?: string;
    containerClassname?: string;
    valuesSelected: number | string;
    initialiseValue:any;
    onChange: (event: any) => void;
    data: any[];
    keys: string[];
    error?: string;
    required?: boolean; // Indique si le champ est requis
    disabled?: boolean;
}

const CustomSelect1: React.FC<CustomSelect1Props> = ({initialiseValue, disabled = false, required = false, error, valuesSelected, onChange, data, keys, label, textClassname, selectClassname, containerClassname }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        console.log("🚀 ~ handleChange ~ selectedValue:", selectedValue)
        const selectedItem = data.find(item => item[keys[0]].toString() === selectedValue) || initialiseValue;
        console.log("🚀 ~ handleChange ~ selectedItem:", selectedItem)
        onChange({
            [keys[0]]: selectedItem[keys[0]],
            [keys[1]]: selectedItem[keys[1]],
            ...(keys[2] ? { [keys[2]]: selectedItem[keys[2]] } : {}), // Ajoute la clé seulement si elle existe
        });
    };

    return (
        <div className={`flex ${containerClassname} `}>
            {label && <FormLabel className=''>{label}{required && <span className='pl-1 text-red-600'>*</span>}</FormLabel>}
            <FormSelect
                onChange={handleChange}
                value={valuesSelected}
                className={`text-[15px]  font-medium ${selectClassname}`}
                disabled={disabled}
            >
                <option value={0} disabled={required}></option>
                {data.map(item => (
                    <option key={item[keys[0]]} value={item[keys[0]]}>
                        <span className='truncate w-7 h-1 text-red-700' >{item[keys[1]]}{item[keys[2]] && `...   ${formatMontantFCFA(item[keys[2]])}`}</span>
                    </option>
                ))}
            </FormSelect>
            {error && <FormLabel className="text-red-500 text-xs mt-1">{error}</FormLabel>}
        </div>
    );
};

export default CustomSelect1;

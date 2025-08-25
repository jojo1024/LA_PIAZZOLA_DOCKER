import React from 'react';
import Select from './Select';
import Label from './Label';
import { formatMontantFCFA } from '../../utils/functions';

interface CustomSelect1Props {
    id?: string;
    label: string;
    textClassname?: string;
    selectClassname?: string;
    containerClassname?: string;
    valuesSelected: number | string;
    onChange: (event: any) => void;
    data: any[];
    keys: string[];
    error?: string;
    required?: boolean; // Indique si le champ est requis
    disabled?: boolean;
}

const CustomSelect1: React.FC<CustomSelect1Props> = ({disabled = false, required = false, error, valuesSelected, onChange, data, keys, label, textClassname, selectClassname, containerClassname }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedItem = data.find(item => item[keys[0]].toString() === selectedValue);
        onChange({
            [keys[0]]: selectedItem[keys[0]],
            [keys[1]]: selectedItem[keys[1]],
            ...(keys[2] ? { [keys[2]]: selectedItem[keys[2]] } : {}), // Ajoute la clé seulement si elle existe
        });        
    };

    return (
        <div className={`flex ${containerClassname}`}>
            <Label className={`text-sm text-left ${textClassname}`}>
                {label} {required && <span className="text-red-600">*</span>}
            </Label>
            <Select
                onChange={handleChange}
                value={valuesSelected}
                className={`mt-1.5 w-5 ${selectClassname}`}
                disabled={disabled}
            >
                <option value="" disabled={required}></option>
                {data.map(item => (
                    <option   key={item[keys[0]]} value={item[keys[0]]}>
                       <span className='truncate w-7 h-1 text-red-700' >{item[keys[1]]}{item[keys[2]] && `...   ${formatMontantFCFA(item[keys[2]])}`}</span> 
                    </option>
                ))}
            </Select>
            {error && <Label className="text-red-500 text-xs mt-1">{error}</Label>}
        </div>
    );
};

export default CustomSelect1;

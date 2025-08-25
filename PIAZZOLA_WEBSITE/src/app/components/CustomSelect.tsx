import React from 'react'
import Select from './Select';
import Label from './Label';
import { formatMontantFCFA } from '../../utils/functions';

interface CustomSelectProps {
    id: string;
    label: string;
    textClassname?: string;
    selectClassname?: string;
    containerClassname?: string;
    valuesSelected: number | string;
    onChange: any;
    data: any[];
    keys: string[];
    error?: string;
    required?: boolean; // Indique si le champ est requis
}

const CustomSelect: React.FC<CustomSelectProps> = ({required = false, id, error, valuesSelected, onChange, data, keys, label, textClassname, selectClassname, containerClassname }) => {
    return (
        <div className={`flex   ${containerClassname}`}>
            <Label className={`text-sm text-left ${textClassname}`}>{label} {required && <span className="text-red-600">*</span>}</Label>
            <Select onChange={(e: any) => onChange({ target: { name: id, value: e.target.value } })} value={valuesSelected} className={`mt-1.5 ${selectClassname}`} >
                <option value="" disabled={required}></option>
                {data.map(item => (
                    <option key={item[keys[0]]} value={item[keys[0]]}>
                        {item[keys[1]]}{item[keys[2]] && `...   ${formatMontantFCFA(item[keys[2]])}`}
                    </option>
                ))}
            </Select>
            {error && <Label className='text-red-500 text-xs mt-1'>{error}</Label>}
        </div>
    )
}

export default CustomSelect
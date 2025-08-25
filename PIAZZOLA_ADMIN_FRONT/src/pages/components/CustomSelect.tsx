import clsx from 'clsx';
import React from 'react';
import { FormLabel, FormSelect } from '../../base-components/Form';



interface CustomMultipleSelectProps {
    id: string;
    label?: string;
    valuesSelected: number | string;
    onChange: any;
    // onChange: (e: React.ChangeEvent<HTMLInputElement> | string[]) => void;
    data: any[];
    keys: string[];
    selectClassName?: string;
    className?: string;
    error?: string;
    required?: boolean;
}

const CustomSelect: React.FC<CustomMultipleSelectProps> = ({required = false, error, id, label, valuesSelected, onChange, data, keys, className, selectClassName }) => {
    return (
        <div className={className}>
            {label && <FormLabel htmlFor={id} className='text-slate-500 text-xs'>{label}</FormLabel>}
            <FormSelect
                id={id}
                value={valuesSelected}
                onChange={(e: any) => onChange({ target: { name: id, value: e.target.value }})}
                className={clsx([selectClassName,"text-[15px] font-medium", ])}
                // className={`text-[15px] font-medium ${selectClassName}`}
            >
                <option value="" disabled={required}></option>
                {data.map(item => (
                    <option key={item[keys[0]]} value={item[keys[0]]}>
                        {item[keys[1]]}
                    </option>
                ))}
            </FormSelect>
            {error && <FormLabel className='text-red-500 text-[12px] mt-1'>{error}</FormLabel>}
        </div >
    );
};

export default CustomSelect;

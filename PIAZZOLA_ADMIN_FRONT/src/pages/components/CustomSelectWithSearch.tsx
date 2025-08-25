import React from 'react';
import TomSelect from '../../base-components/TomSelect';
import { FormLabel } from '../../base-components/Form';
import clsx from 'clsx';



interface CustomMultipleSelectProps {
    id: string;
    label?: string;
    valuesSelected?: string[] | string ;
    onChange: any;
    // onChange: (e: React.ChangeEvent<HTMLInputElement> | string[]) => void;
    data: any[];
    keys: string[];
    selectClassName?: string;
    className?: string;
    isMultipleSelect?: boolean;
    error?: string;
}

const CustomSelectWithSearch: React.FC<CustomMultipleSelectProps> = ({ error, id, label, valuesSelected, onChange, data, keys, className, isMultipleSelect = true, selectClassName }) => {
    return (
        // <div className={className}>
            <div className={clsx('mb-4', className)}> 
            {label && <FormLabel htmlFor={id} className='text-slate-500 text-xs'>{label}</FormLabel>}
            <TomSelect
                id={id}
                value={valuesSelected || (isMultipleSelect ? [] : "")} // Par défaut vide
                onChange={
                    !isMultipleSelect
                        ? (e: React.ChangeEvent<HTMLInputElement>) =>
                            onChange({ target: { name: id, value: e } })
                        : onChange
                }
                className={clsx([
                    selectClassName,
                    "text-[15px] font-medium -mt-1",
                ])}
                multiple={isMultipleSelect}
                options={{
                    render: {
                        no_results: function () {
                            return '<div class="no-results">Aucun résultat trouvé</div>';
                        },
                    }
                }}
            >
                <option value=""></option>
                {(data || []).map((item) => (
                    <option key={item[keys[0]]} value={item[keys[0]]}>
                        {item[keys[1]]}
                    </option>
                ))}
            </TomSelect>

            {error && <FormLabel className='text-red-500 text-[12px] mt-1'>{error}</FormLabel>}
        </div >
    );
};

export default CustomSelectWithSearch;

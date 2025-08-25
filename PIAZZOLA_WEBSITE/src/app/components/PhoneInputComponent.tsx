import React from 'react';
import PhoneInput, { Value } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import Label from './Label';

type PhoneInputComponentProps = {
    label: string; // Label affiché au-dessus du champ
    value: string; // Valeur actuelle du champ
    onChange: (e: Value) => void; // Gestion du changement
    placeholder?: string; // Placeholder optionnel
    type?: string; // Type d'input (ex: text, email, etc.)
    required?: boolean; // Indique si le champ est requis
    error?: string; // Message d'erreur à afficher
    className?: string; // Classes supplémentaires
};

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({ label, required, value, onChange, error }) => {

    return (
        <div className="flex flex-col gap-2">
            <Label className="text-gray-700">
                {label} {required && <span className="text-red-600">*</span>}
            </Label>
            <PhoneInput
                id="phone"
                international
                defaultCountry="SN"
                value={value}
                onChange={onChange}
                placeholder="Entrez votre numéro"
                className="w-full rounded-xl border border-gray-300 bg-white pl-4  text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

        </div>
    );
};

export default PhoneInputComponent;

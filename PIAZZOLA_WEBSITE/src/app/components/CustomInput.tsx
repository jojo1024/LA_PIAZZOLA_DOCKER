import React from "react";
import Label from "./Label";
import Input from "./Input";

type CustomInputProps = {
  label: string; // Label affiché au-dessus du champ
  name: string; // Nom de l'input (pour les formulaires)
  value: string; // Valeur actuelle du champ
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Gestion du changement
  placeholder?: string; // Placeholder optionnel
  type?: string; // Type d'input (ex: text, email, etc.)
  required?: boolean; // Indique si le champ est requis
  error?: string; // Message d'erreur à afficher
  className?: string; // Classes supplémentaires
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  error = "",
  className = "",
}) => {
  // Calculer la valeur minimale si le type est "datetime-local"
  const minValue =
    type === "datetime-local"
      ? new Date().toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:mm
      : undefined;

  return (
    <label className="block">
      <Label className="text-sm text-gray-700">
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        className={`mt-1 ${error ? "border-red-500" : ""} ${className}`}
        min={minValue} // Ajout dynamique de l'attribut min
      />
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </label>
  );
};

export default CustomInput;

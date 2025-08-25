import React, { useState, useEffect } from "react";
import Select from "./Select";

interface PickupTimeSelectProps {
    onChange: any;
    valuesSelected: string;
    error?: string;
    required?: boolean; // Indique si le champ est requis
}
const PickupTimeSelect: React.FC<PickupTimeSelectProps> = ({required = false, onChange, valuesSelected, error }) => {
    const openingHour = 11; // Heure d'ouverture
    const closingHour = 22; // Heure de fermeture
    const preparationTime = 20; // Temps de préparation en minutes
    const closingBuffer = 10; // Temps avant fermeture en minutes

    const [availableTimes, setAvailableTimes] = useState<string[]>([]);
    // const [selectedTime, setSelectedTime] = useState("");

    // Fonction pour générer les créneaux horaires disponibles
    const generateAvailableTimes = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        // Initialisation de l'heure minimale
        let minHour = openingHour;
        let minMinutes = 20; // Si avant 11h, commence à 11h20

        if (currentHour >= openingHour) {
            // Si l'heure actuelle est passée, commence à l'heure actuelle + 20 minutes
            minHour = currentHour;
            minMinutes = currentMinutes + preparationTime;

            if (minMinutes >= 60) {
                minHour += 1;
                minMinutes -= 60;
            }
        }

        const times: string[] = [];

        // Générer les créneaux horaires disponibles
        for (let hour = Math.max(openingHour, minHour); hour <= closingHour; hour++) {
            for (let minute = hour === minHour ? Math.ceil(minMinutes / 10) * 10 : 0; minute < 60; minute += 20) {
                if (hour === closingHour && minute > 60 - closingBuffer) break; // Respect du buffer avant la fermeture
                times.push(`${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`);
            }
        }

        return times;
    };

    // Mettre à jour les créneaux horaires disponibles au chargement
    useEffect(() => {
        const times = generateAvailableTimes();
        setAvailableTimes(times);
    }, []);

    return (
        <div>

            <label htmlFor="dateEmport" className="block text-sm font-medium text-gray-700 mt-4">
                Sélectionnez une heure pour l'emport {required && <span className="text-red-600">*</span>} :
            </label>

            <Select
                id="dateEmport"
                name="dateEmport"
                value={valuesSelected}
                onChange={(e: any) => onChange(e)}
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
                <option value="" >
                    Choisissez une heure
                </option>
                {availableTimes.map((time) => (
                    <option key={time} value={time}>
                        {time}
                    </option>
                ))}
            </Select>
            {error && (
                <p className="mt-2 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
};

export default PickupTimeSelect;

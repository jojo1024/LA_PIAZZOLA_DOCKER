interface CommandStatusProps {
    isOpen: boolean;
    timeRemaining: string; // Affichage du temps restant
}

const CommandStatus = ({ isOpen, timeRemaining }: CommandStatusProps) => {
    return (
        <div className="flex items-center gap-3">
            {/* Voyant animé */}
            <div className="relative">
                <span className={`w-3 h-3 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"} block`}></span>
                <span
                    className={`absolute top-0 left-0 w-3 h-3 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"} 
                    opacity-50 animate-ping`}
                ></span>
            </div>
            {/* Combinaison du texte de la commande avec l'alerte */}
            <div className="relative">
                <span
                    className={`text-sm transition-opacity duration-500 text-slate-600`}
                >
                    {isOpen ? (
                        timeRemaining ? (
                            <>
                                Commande ouverte — ⚠️ La commande va fermer dans {timeRemaining}
                            </>
                        ) : (
                            "Commande ouverte"
                        )
                    ) : (
                        "Commande fermée. Revenez à 11h30."
                    )}
                </span>
            </div>


        </div>
    );
};

export default CommandStatus;

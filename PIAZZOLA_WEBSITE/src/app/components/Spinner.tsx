import React from "react";

type SpinnerProps = {
  size?: string; // Taille du spinner, ex: "w-10 h-10"
  color?: string; // Couleur principale, ex: "text-blue-500"
  classname?: string
};

const Spinner: React.FC<SpinnerProps> = ({
  size = "w-5 h-5",
  color = "text-blue-500",
  classname
}) => {
  return (
    <div className={`flex items-center justify-center ${classname}`}>
      <div
        className={`relative ${size} ${color}`}
        role="status"
      >
        {/* Couches animées */}
        <div
          className={`absolute inset-0 border-2 border-solid border-t-transparent rounded-full ${color} animate-spin`}
        />
        <div
          className={`absolute inset-0 border-2 border-dotted border-t-transparent rounded-full ${color} animate-[spin_1.5s_linear_infinite_reverse]`}
        />
      </div>
      <span className="sr-only">Chargement...</span>
    </div>
  );
};

export default Spinner;

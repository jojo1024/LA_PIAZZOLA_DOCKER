import { FC } from "react";
import { IEtatCommande } from "../../stores/commandeSlice";

export interface ChipProps {
  className?: string;
  libelle: IEtatCommande;
  contentClass?: string;
}

const Chip: FC<ChipProps> = ({
  className = "",
  libelle = "reçu",
  contentClass = "py-1 px-2 md:py-1.5 md:px-2.5 text-sm font-medium",
}) => {
  
  const textColor: { [key: string]: {
    border: string;
    text: string;
} } = {
    "reçu": { border: "border-blue-500", text: "text-blue-500" },
    "en cours": { border: "border-yellow-500", text: "text-yellow-500" },
    "traité": { border: "border-green-500", text: "text-green-500" },
  }
  return (
    <div className={`${className}`}>
      <div
        className={`flex items-center border-2 ${textColor[libelle]?.border} rounded-lg ${contentClass}`}
      >
        <span className={`${textColor[libelle]?.text} !leading-none`}>
          {libelle}
        </span>
      </div>
    </div>
  );
};

export default Chip;

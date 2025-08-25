import React from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { twFocusClass } from "../../../utils/functions";

export interface ButtonCloseProps {
  className?: string;
  IconclassName?: string;
  onClick?: () => void;
  color?: string
}

const ButtonClose: React.FC<ButtonCloseProps> = ({
  className = "",
  IconclassName = "w-5 h-5",
  onClick = () => {},
  color = "black"
}) => {
  return (
    <button
      className={
        `w-8 h-8 flex items-center justify-center rounded-full text-neutral-700  ${className} ` +
        twFocusClass()
      }
      onClick={onClick}
    >
      <span className="sr-only">Fermer</span>
      <XMarkIcon color={color} className={IconclassName} />
    </button>
  );
};

export default ButtonClose;

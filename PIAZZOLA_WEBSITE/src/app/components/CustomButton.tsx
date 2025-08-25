import React from 'react';
import Spinner from './Spinner';
import Button from './Button/Button';

interface CustomButtonProps {
    title?: string;
    iconSvg?: any;
    bgColor?: string;
    width?: string;
    classname?: string;
    onClick?: any;
    loading?: boolean;
}
const CustomButton: React.FC<CustomButtonProps> = ({ onClick, title = "", iconSvg, bgColor = "bg-black", width = "w-30", classname, loading }) => {
    return (
        <Button
            onClick={onClick}
            className={`ttnc-ButtonPrimary ${width} rounded-lg disabled:bg-opacity-90 shadow-xl ${bgColor} ${classname}`}
            aria-label={title || "Action"}  // Ajout d'une description accessible pour le bouton
        >
            {iconSvg && iconSvg}
            {title && (
                <span
                    style={{ fontFamily: "Pacifico" }}
                    className="ml-1 text-base text-white md:ml-2 2xl:text-xl"
                >
                    {title}
                </span>
            )}
            {loading && <Spinner classname="ml-4" color="" />}
        </Button>

    )
}

export default CustomButton
import logo_piazzola from "/logo_piazzola.png";
import React from "react";
import { Link } from "react-router-dom";

export interface LogoProps {
  img?: string;
  imgLight?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  img = logo_piazzola,
  className = "flex-shrink-0",
}) => {
  return (
<Link to="/" className={`ttnc-logo inline-block text-slate-600 ${className}`}>
  {/* THIS USE FOR MY CLIENT */}
  {/* PLEASE UN COMMENT BELLOW CODE AND USE IT */}

    <img
      className={`block  rounded-full `}
      src={img}
      alt="Logo piazzola"
      width={70}  // Dimensions explicites
      height={70}  // Dimensions explicites
      loading="lazy"  // Lazy loading pour la performance
    />

</Link>

  );
};

export default Logo;

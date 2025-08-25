import { FC } from "react";
import { reseauxSociauxImageData } from "../../utils/constant";

export interface SocialsListProps {
  className?: string;
  itemClass?: string;
  socials?: SocialType[];
}

export interface SocialType {
  id: number;
  img: string;
  lien: string;
  alt: string;
  ariaLabel: string;
}[]



const SocialsList: FC<SocialsListProps> = ({
  className = "",
  itemClass = "block w-12 h-12",
  socials = reseauxSociauxImageData,
}) => {
  return (
    <nav
      className={`nc-SocialsList mt-[-8px] flex space-x-2.5 text-2xl text-neutral-6000 dark:text-neutral-300 ${className}`}
      data-nc-id="SocialsList"
    >
      {socials.map((item, i) => (
        <a
          key={i}
          className={`${itemClass} `}
          href={item.lien}
          target="_blank"
          rel="noopener noreferrer"
        // title={item.name}
        >
          <img
            src={item.img}
            className="h-10 w-10"
            alt={item.alt}
            aria-label={item.ariaLabel} />
        </a>
      ))}
    </nav>
  );
};

export default SocialsList;

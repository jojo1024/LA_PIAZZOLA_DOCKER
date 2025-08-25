import React from "react";
import { Link } from "react-router-dom";
import { liensImportantPiedDePage, reseauxSociauxImageData } from "../../utils/constant";
import NcImage from "./NcImage/NcImage";
import Heading from "./Heading";
import { CustomLink } from "../../routers/types";

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const heuresOuveruturesPizzeria = [
  {
    id: 1,
    jour: "Lundi : ",
    heur: "11h30 - 23h45"
  },
  {
    id: 2,
    jour: "Mardi : ",
    heur: "11h30 - 23h45"
  },
  {
    id: 3,
    jour: "Mercredi : ",
    heur: "11h30 - 23h45"
  },
  {
    id: 4,
    jour: "Jeudi : ",
    heur: "11h30 - 23h45"
  },
  {
    id: 5,
    jour: "Vendredi : ",
    heur: "11h30 - 23h45"
  },
  {
    id: 6,
    jour: "Samedi : ",
    heur: "11h30 - 23h45"
  },
  {
    id: 7,
    jour: "Dimanche : ",
    heur: "11h30 - 23h45"
  },
]

const Footer: React.FC = () => {
  return (
    <div className="nc-Footer  bg-black relative py-10 mt-40 sm:mt-52">
      <div className="grid grid-cols-12  gap-4">
        <div className="col-span-12 lg:col-span-9 text-white">
          <div className="grid grid-cols-12  gap-4">
            <div className="col-span-12 sm:col-span-4">
              <span className="font-bold text-xl flex justify-center">Liens important</span>
              <ul className=" text-center">
                {liensImportantPiedDePage.map((item, index) => (
                  <li key={index} className="mt-4">
                    <Link to={item.lien}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 sm:col-span-4 px-8  2xl:px-16">
              <span className="font-bold text-xl flex justify-center mb-2">Commande en ligne</span>

              <ul>
                {heuresOuveruturesPizzeria.map((item, index) => (
                  <li key={index} className="flex justify-between pt-2">
                    <span className="text-left">{item.jour}</span>
                    <span className="text-right">{item.heur}</span>
                  </li>
                ))}
              </ul>

            </div>
            <div className="col-span-12 sm:col-span-4 flex items-center justify-center">
              <div className="flex flex-col">
                <Link to={"/mentions-legales"} className="font-bold text-xl mb-2">Mentions legales</Link>
                <Link to={"/conditions-generales-de-vente"} className="font-bold text-xl">Conditions generales de vente</Link>
              </div>
            </div>

          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 text-white overflow-hidden pt-12">
          <Heading
            className="flex justify-center items-center"
            fontClass="text-3xl text-white  font-semibold"
            isCenter
            desc=""
            style={{ fontFamily: "Pacifico" }}
          >
            Suivez nous sur les Réseaux
          </Heading>

          <div className="flex justify-center mt-8">
            <div
              className={`nc-SectionSocial`}
              data-nc-id="SectionSocial"
            >
              <div className="flex flex-row">

                {reseauxSociauxImageData.map((item) => (
                  <a
                    key={item.id}
                    href={ item?.lien}
                    target="_blank"
                  >
                    <NcImage
                      containerClassName="mb-4 sm:mb-10 w-14 h-14 sm:w-16 sm:h-16 2xl:w-14 2xl:h-14 mx-1 md:mx-2 md:w-10 md:h-10 xl:mx-4"
                      className=""
                      src={item.img}
                      aria-label={item.ariaLabel}
                      alt={item.alt}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
      <div className="flex justify-center text-white mt-8">@brenidigital & @joel_ndjabo_dev. tous droits reservés</div>
    </div>
  );
};

export default Footer;

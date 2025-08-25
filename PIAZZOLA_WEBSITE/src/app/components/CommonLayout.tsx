import React, { useEffect } from "react";
import { FC } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { IReduxState } from "../../store/store";
import { recupClientPointFidelite } from "../../utils/functions";

export interface CommonLayoutProps {
  children?: React.ReactNode;
}

const CommonLayout: FC<CommonLayoutProps> = ({ children }) => {

  // Redux
  const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);
  const clientPointFidelite = useSelector((state: IReduxState) => state.application.clientPointFidelite);
  console.log("🚀 ~ clientPointFidelite:", clientPointFidelite)

  useEffect(() => {
    recupClientPointFidelite()
  }, [])

  return (
    <div className="nc-CommonLayoutProps container">
      <div className="mt-14 sm:mt-20">
        <div className="max-w-4xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-3xl xl:text-4xl font-semibold">Compte</h2>
            <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
              <span className="text-slate-900 dark:text-slate-200 font-semibold">
                {userConnectedInfo?.nomUtilisateurClient},
              </span>{" "}
              {userConnectedInfo?.emailClient} · {userConnectedInfo?.telephoneClient}
            </span>
            {/* Nombre de points */}
            {
              clientPointFidelite && clientPointFidelite.clientId !== 0 &&
              <span className="block mt-4 text-neutral-500 dark:text-neutral-400 text-base sm:text-lg">
                nombre de points fidélités
                {" : "}
                <span className="text-slate-900 ">{clientPointFidelite ? clientPointFidelite?.point : 0} point{(clientPointFidelite?.point || 0) > 1 ? "s" : ""}</span>
              </span>
            }
          </div>
          <hr className="mt-10 border-slate-200 dark:border-slate-700"></hr>

          <div className="flex space-x-8 md:space-x-14 overflow-x-auto hiddenScrollbar">
            {[
              {
                name: "Info compte",
                link: "/compte",
              },
              {
                name: " Mes commandes",
                link: "/mes-commandes",
              },
              {
                name: "Changer mot de passe",
                link: "/changer-mot-de-passe",
              },

            ].map((item, index) => (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) =>
                  `block py-5 md:py-8 border-b-2 border-transparent flex-shrink-0  text-sm sm:text-base ${isActive
                    ? "border-primary-500 font-medium text-slate-900 dark:text-slate-200"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
          <hr className="border-slate-200 dark:border-slate-700"></hr>
        </div>
      </div>
      <div className="max-w-4xl mx-auto pt-14 sm:pt-26 pb-24 lg:pb-32">
        {children}
      </div>
    </div>
  );
};

export default CommonLayout;

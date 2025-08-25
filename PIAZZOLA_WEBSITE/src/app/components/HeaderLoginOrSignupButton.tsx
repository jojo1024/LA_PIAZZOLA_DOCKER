import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { initialiseConnectionInfo, initialisePointFidelite, setClientPointFidelite, setPizzaGratosAlreadyUsed, setUserConnectedInfo, setUserLogged } from "../../store/appSlice";
import { initialiseCommandePayload, setListeCommandes } from "../../store/menuSlice";
import { LogoutSvg, OrderSvg, UserAccountSvg, UserIconSvg } from "../../utils/svg";
import { IReduxState } from "../../store/store";
import DisplayNotification from "./DisplayNotification";
import { setCart } from "../../store/cartSlice";
import NcImage from "./NcImage/NcImage";

export default function HeaderLoginOrSignupButton() {

  // Redux
  const dispatch = useDispatch()
  const userLogged = useSelector((state: IReduxState) => state.application.userLogged);
  console.log("🚀 ~ HeaderLoginOrSignupButton ~ userLogged:", userLogged)
  const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);

  // Hooks
  const navigate = useNavigate()
  return (
    <div className="HeaderLoginOrSignupButton ">
      <Popover className="relative">
        {({ close }) => (
          <>
            <Popover.Button
              aria-label="Bouton connexion"
              onClick={() => (userLogged && userConnectedInfo && userConnectedInfo?.nomUtilisateurClient) ? null : navigate("/authentification")}
              className={`w-20 h-10 sm:w-40 sm:h-12 hover:text-black rounded-full text-white dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none flex items-center justify-center`}
            >
              <UserIconSvg />
              <span className="ml-1 hidden sm:block truncate">{(userLogged && userConnectedInfo && userConnectedInfo?.nomUtilisateurClient) ? userConnectedInfo?.nomUtilisateurClient : "Connexion"}</span>
            </Popover.Button>
            {
              (userConnectedInfo && userConnectedInfo?.nomUtilisateurClient) && (
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <Popover.Panel className="absolute z-10 w-screen max-w-[260px] px-4 mt-3.5 -right-10 sm:right-0 sm:px-0">
                    <div className="overflow-hidden rounded-3xl shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid grid-cols-1 gap-6 bg-white dark:bg-neutral-800 py-7 px-6">
                        <div className="flex items-center space-x-3">
                          <NcImage src="" className="w-12 h-12 rounded-full" />

                          <div className="flex-grow">
                            <h4 className="font-semibold">{userConnectedInfo?.nomUtilisateurClient}</h4>
                            <p className="text-xs mt-0.5">{userConnectedInfo?.telephoneClient}</p>
                          </div>
                        </div>
                        {/* ------------------ 1 --------------------- */}
                        <Link
                          to={"/compte"}
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={() => close()}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <UserAccountSvg />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{"Mon compte"}</p>
                          </div>
                        </Link>

                        {/* ------------------ 2 --------------------- */}
                        <Link
                          to={"/mes-commandes"}
                          className="flex items-center p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={() => close()}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <OrderSvg />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{"Mes commandes"}</p>
                          </div>
                        </Link>

                        <div
                          className="flex items-center cursor-pointer p-2 -m-3 transition duration-150 ease-in-out rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
                          onClick={() => {
                            dispatch(setUserConnectedInfo(initialiseConnectionInfo));
                            dispatch(setCart(initialiseCommandePayload));
                            dispatch(setListeCommandes([]));
                            dispatch(setUserLogged(false));
                            dispatch(setClientPointFidelite(initialisePointFidelite))
                            dispatch(setPizzaGratosAlreadyUsed(false))
                            DisplayNotification({ libelle: "Vous êtes désormais déconnecté", type: "success", time: 1000 });
                            close()
                            navigate("/")
                          }}
                        >
                          <div className="flex items-center justify-center flex-shrink-0 text-neutral-500 dark:text-neutral-300">
                            <LogoutSvg />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium ">{"Deconnexion"}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition>
              )
            }

          </>
        )}
      </Popover>
    </div>
  );
}

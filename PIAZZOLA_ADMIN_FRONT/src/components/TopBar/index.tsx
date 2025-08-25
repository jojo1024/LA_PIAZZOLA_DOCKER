import clsx from "clsx";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logoUrl from "../../assets/images/logo.svg";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import { initialiseConnectionInfo, setConnectionInfo, setUserLogged } from "../../stores/appSlice";
import { IReduxState } from "../../stores/store";
import avatar_profil from "/avatar_profil.png"

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {

  //Redux
  const dispatch = useDispatch();
  const connectionInfo = useSelector((state: IReduxState) => state.application.connectionInfo);
  console.log("🚀 ~ Main ~ connectionInfo:", connectionInfo)

  // Hooks
  const navigate = useNavigate()

  const [searchDropdown, setSearchDropdown] = useState(false);
  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };

  const handleLogout = async () => {
    try {
      navigate('/')
      // dispatch(setCurrentSideMenu(initialSideMenu))
      dispatch(setUserLogged(false))
      dispatch(setConnectionInfo(initialiseConnectionInfo))
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:58 ~ handleLogout ~ error:", error)
    }
  }
  return (
    <>
      <div
        className={clsx([
          "h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700",
          props.layout == "top-menu" && "dark:md:from-darkmode-800",
          "before:content-[''] before:absolute before:h-[65px] before:inset-0 before:top-0 before:mx-7 before:bg-primary/30 before:mt-3 before:rounded-xl before:hidden before:md:block before:dark:bg-darkmode-600/30",
          "after:content-[''] after:absolute after:inset-0 after:h-[65px] after:mx-3 after:bg-primary after:mt-5 after:rounded-xl after:shadow-md after:hidden after:md:block after:dark:bg-darkmode-600",
        ])}
      >
        <div className="flex items-center h-full">
          {/* BEGIN: Logo */}
          <Link
            to="/"
            className={clsx([
              "-intro-x hidden md:flex",
              props.layout == "side-menu" && "xl:w-[180px]",
              props.layout == "simple-menu" && "xl:w-auto",
              props.layout == "top-menu" && "w-auto",
            ])}
          >
            <img
              alt="Enigma Tailwind HTML Admin Template"
              className="w-6"
              src={logoUrl}
            />
            <span
              className={clsx([
                "ml-3 text-lg text-white",
                props.layout == "side-menu" && "hidden xl:block",
                props.layout == "simple-menu" && "hidden",
              ])}
            >
              {" "}
              Piazzola{" "}
            </span>
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Breadcrumb */}
          <Breadcrumb
            light
            className={clsx([
              "h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
              props.layout != "top-menu" && "md:pl-6",
              props.layout == "top-menu" && "md:pl-10",
            ])}
          >
            <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
            <Breadcrumb.Link to="/" active={true}>
              Tableau de bord
            </Breadcrumb.Link>
          </Breadcrumb>
          {/* END: Breadcrumb */}
          <div className="flex flex-col mr-3 text-white intro-x sm:mr-6">
            <span className="relative hidden sm:block">
              {connectionInfo?.nomUtilisateur}
            </span>
            <span className="relative text-slate-400 hidden sm:block">
              {connectionInfo?.nomRole}
            </span>
          </div>
          {/* BEGIN: Account Menu */}
          <Menu >
            <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
              <img
                alt="Avatr logo"
                src={avatar_profil}
                className=""
              />
            </Menu.Button>
            <Menu.Items
              className="
              w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black
              before:inset-0 before:rounded-md before:z-[-1] text-white
             "
            >
              <Menu.Header className="font-normal">
                <div className="font-medium">{connectionInfo?.nomUtilisateur}</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  {connectionInfo?.nomRole}
                </div>
              </Menu.Header>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item
                className="hover:bg-white/5"
                onClick={handleLogout}
              >
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Déconnexion
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  );
}

export default Main;

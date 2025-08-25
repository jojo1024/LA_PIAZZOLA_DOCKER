import clsx from "clsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Transition } from "react-transition-group";
import Lucide from "../../base-components/Lucide";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import MobileMenu from "../../components/MobileMenu";
import SideMenuTooltip from "../../components/SideMenuTooltip";
import TopBar from "../../components/TopBar";
import { useAppSelector } from "../../stores/hooks";
import { selectSideMenu, setCurrentSideMenu } from "../../stores/sideMenuSlice";
import { base } from "../../utils/constants";
import { userHasRight } from "../../utils/functions";
import { enter, FormattedMenu, leave, linkTo, nestedMenu } from "./side-menu";
import "./SideMenu.css";
// import * as RegExp from 'regexp';

// const initialSideMenu = {
//   icon: "LayoutDashboard",
//   title: "Tableau de bord",
//   subMenu: [
//     {
//       icon: "Activity",
//       pathname: `${base}/`,
//       title: "Registre d'appel",
//     }
//   ]
// }


function Main() {
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
  Array<FormattedMenu | "divider">
  >([]);
  console.log("🚀 ~ Main ~ formattedMenu:", formattedMenu)

  // console.log("🚀 ~ file: index.tsx:41 ~ Main ~ formattedMenu:", formattedMenu)
  // console.log("🚀 ~ file: index.tsx:41 ~ Main ~ formattedMenu:", formattedMenu[0])
  //Redux
  const dispatch = useDispatch();

  const sideMenuStore = useAppSelector(selectSideMenu);
  console.log("🚀 ~ Main ~ sideMenuStore:>>>>>>", sideMenuStore)
  // console.log("🚀 ~ file: index.tsx:49 ~ Main ~ sideMenuStore:", sideMenuStore)
  const sideMenu = () => nestedMenu(sideMenuStore, location);
  console.log("🚀 ~ Main ~ sideMenu:", sideMenu)
  // console.log("🚀 ~ file: index.tsx:51 ~ Main ~ sideMenu:", sideMenu)

  //Hooks
  const [cookies, setCookie, removeCookie] = useCookies(["serverUrl", "connect.sid", "authId"]);
  const navigate = useNavigate()

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);



  return (
    <div className="py-5 md:py-0 ">
      {/* <DarkModeSwitcher /> */}
      <MainColorSwitcher />
      <MobileMenu />
      <TopBar layout="side-menu" />
      <div
        className="flex overflow-y-auto scrollbar-none"
      // style={{ display: "flex" }}
      >
        {/* <div className="flex overflow-hidden"> */}
        {/* BEGIN: Side Menu */}
        <nav
          className="
        w-[105px] xl:w-[260px] px-5 pb-16 h-[100vh] overflow-y-auto overflow-x-hidden z-50 pt-32 -mt-4 hidden md:block
        "
        >
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>

              menu == "divider" ? (
                <Divider
                  type="li"
                  className={clsx([
                    "my-6",
                    // Animation
                    `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${(menuKey + 1) * 10}
                    `,
                  ])}
                  key={menuKey}
                ></Divider>
              ) : (
                // userHasRight(menu.right) &&
                <li key={menuKey}>
                  <Menu
                    className={clsx(
                      `${menu.active
                        ? `font-roboto text-sm bg-slate-100 dark:bg-slate-900  text-slate-600 dark:text-slate-900 opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay - ${(menuKey + 1) * 10}`
                        : `font-roboto text-sm hover:bg-slate-100 hover:dark:bg-slate-900 text-slate-600 dark:text-slate-900 opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay - ${(menuKey + 1) * 10}`
                      }`
                    )}
                    menu={menu}
                    formattedMenuState={[formattedMenu, setFormattedMenu]}
                    level="first"
                    sideMenuItem={{ ...menu }}
                    isDisabled={!userHasRight(menu.right)}
                  ></Menu>
                  {/* BEGIN: Second Child */}
                  {
                    menu.subMenu && (
                      <Transition
                        in={menu.activeDropdown}
                        onEnter={enter}
                        onExit={leave}
                        timeout={300}
                      >
                        <ul
                          className={clsx([
                            "rounded-xl relative dark:bg-transparent",
                            "before:content-[''] before:block before:inset-0 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30 w-50 ml-5",
                            { block: menu.activeDropdown },
                            { hidden: !menu.activeDropdown },
                          ])}
                        >

                          {menu.subMenu.map((subMenu, subMenuKey) => (
                            // userHasRight(subMenu.right) &&
                            <li key={subMenuKey}>
                              <Menu
                                className={clsx(
                                  `${subMenu.active
                                    ? `font-roboto text-sm bg-slate-100 dark:bg-slate-900  text-slate-600 dark:text-slate-900 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay - ${(subMenuKey + 1) * 10}`
                                    : `font-roboto text-sm hover:bg-slate-100 hover:dark:bg-slate-900 text-slate-600 dark:text-slate-900 opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay - ${(subMenuKey + 1) * 10}`
                                  }`)}
                                menu={subMenu}
                                formattedMenuState={[
                                  formattedMenu,
                                  setFormattedMenu,
                                ]}
                                level="second"
                                sideMenuItem={{ ...menu, subMenu: [menu.subMenu![subMenuKey]] }}
                                isDisabled={!userHasRight(subMenu.right)}
                              ></Menu>
                              {/* BEGIN: Third Child */}
                              {subMenu.subMenu && (
                                <Transition
                                  in={subMenu.activeDropdown}
                                  onEnter={enter}
                                  onExit={leave}
                                  timeout={300}
                                >
                                  <ul
                                    className={clsx([
                                      "bg-white/[0.04] rounded-none relative dark:bg-transparent",
                                      "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
                                      { block: subMenu.activeDropdown },
                                      { hidden: !subMenu.activeDropdown },
                                    ])}
                                  >
                                    {subMenu.subMenu.map(
                                      (lastSubMenu, lastSubMenuKey) => (
                                        <li key={lastSubMenuKey}>
                                          <Menu
                                            className={clsx(
                                              `${lastSubMenu.active
                                                ? `font-roboto text-sm bg-slate-100 dark:bg-slate-900  text-slate-600 dark:text-slate-900 opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay - ${(lastSubMenuKey + 1) * 10}`
                                                : `font-roboto text-sm hover:bg-slate-100 hover:dark:bg-slate-900 text-slate-600 dark:text-slate-900 opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay - ${(lastSubMenuKey + 1) * 10}`
                                              }`)}
                                            menu={lastSubMenu}
                                            formattedMenuState={[
                                              formattedMenu,
                                              setFormattedMenu,
                                            ]}
                                            level="third"
                                            isDisabled={!userHasRight(lastSubMenu.right)}
                                          ></Menu>
                                        </li>
                                      )
                                    )}
                                  </ul>
                                </Transition>
                              )}
                              {/* END: Third Child */}
                            </li>
                          ))}
                        </ul>
                      </Transition>
                    )
                  }
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div
          className={clsx([
            "overflow-auto max-w-full md:max-w-none rounded-[30px] md:rounded-none px-4 md:px-[22px] ",
            "min-w-0 min-h-screen bg-slate-100 flex-1 md:pt-20 pb-10 mt-5 md:mt-1 dark:bg-darkmode-700",
            "before:content-[''] before:w-full before:h-px before:block h-[40vh] overflow-y-auto ",
            "rr"
          ])}
        >
          <Outlet />
        </div>
        {/* END: Content */}
      </div>
    </div >
  );
}

function Menu(props: {
  className?: string;
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ];
  level: "first" | "second" | "third";
  sideMenuItem?: any;
  isDisabled?: any
}) {
  // console.log("🚀 ~ file: index.tsx:251 ~ menu:", props.menu)

  //Redux
  const dispatch = useDispatch();

  //Hooks
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;
  // console.log("🚀 ~ file: index.tsx:266 ~ formattedMenu:", formattedMenu)

  return (
    <SideMenuTooltip
      as="a"
      content={props.menu.title}
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[50px] flex items-center pl-5 text-slate-600 mb-1 relative rounded-xl dark:text-slate-300 text-base",
        {
          "text-slate-600 dark:text-slate-400":
            !props.menu.active && props.level != "first",
          " dark:bg-transparent":
            props.menu.active && props.level == "first",
          "before:content-[''] before:block before:inset-0 before:rounded-xl before:absolute before:dark:bg-darkmode-700":
            props.menu.active && props.level == "first",
          "after:content-[''] after:w-[20px] after:h-[80px] after:mr-[-27px] after:bg-menu-active after:bg-no-repeat after:bg-cover after:absolute after:top-0 after:bottom-0 after:right-0 after:my-auto after:dark:bg-menu-active-dark":
            props.menu.active && props.level == "first",
          "hover:bg-slate-100 hover:dark:bg-transparent hover:before:content-[''] hover:before:block hover:before:inset-0 hover:before:rounded-xl hover:before:absolute hover:before:z-[-1] hover:before:border-b-[3px] hover:before:border-solid hover:before:border-black/[0.08] hover:before:dark:bg-darkmode-700":
            !props.menu.active &&
            !props.menu.activeDropdown &&
            props.level == "first",


          // Animation
          "after:-mr-[47px] after:opacity-0 after:animate-[0.4s_ease-in-out_0.1s_active-side-menu-chevron] after:animate-fill-mode-forwards":
            props.menu.active && props.level == "first",
        },
        props.className,
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        if (props.isDisabled) return
        // console.log("🚀 ~ file: index.tsx:222 ~ props.sideMenuItem.subMenu", props.sideMenuItem)
        if (!props.sideMenuItem.subMenu || props.sideMenuItem.subMenu.length === 1) {
          dispatch(setCurrentSideMenu(props.sideMenuItem))
        }
        linkTo(props.menu, navigate);
        setFormattedMenu([...formattedMenu]);
      }}
      style={{
        cursor: props.isDisabled ? "not-allowed" : "",
        // background: props.isDisabled ? "#F8FAFC" : ""
      }}
    >
      <div
        className={clsx({
          "text-primary  z-10 dark:text-slate-300":
            props.menu.active && props.level == "first",
          "text-slate-700 dark:text-slate-300":
            props.menu.active && props.level != "first",
          "dark:text-slate-400": !props.menu.active,
        })}
      >
        <Lucide className="w-4 h-4" icon={props.menu.icon} />
      </div>
      <div
        className={clsx([
          "w-full ml-3 hidden xl:flex items-center",
          {
            "text-primary font-medium z-10 dark:text-slate-300":
              props.menu.active && props.level == "first",
            "text-slate-700 font-medium dark:text-slate-300":
              props.menu.active && props.level != "first",
            "dark:text-slate-400": !props.menu.active,
          },
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto mr-5 hidden xl:block",
              { "transform rotate-180": props.menu.activeDropdown },
            ])}
          >
            <Lucide className="w-4 h-4" icon="ChevronDown" />
          </div>
        )}
      </div>
    </SideMenuTooltip>
  );
}

function Divider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props;
  const Component = props.as || "div";

  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        "w-full h-px bg-black/[0.06] z-10 relative dark:bg-white/[0.07]",
      ])}
    ></Component>
  );
}

export default Main;

import HeaderCart from './HeaderCart';
import HeaderLoginOrSignupButton from './HeaderLoginOrSignupButton';
import Logo from './Logo';
import MenuBar from './MenuBar';
import Navigation from './Navigation/Navigation';

const Header = () => {

    return (
        <div className="nc-HeaderLogged sticky top-0 w-full z-40 ">
            <div className="nc-MainNav2Logged relative z-10 bg-black dark:bg-neutral-900 border-b border-slate-100 dark:border-slate-700">
                <div className="containerx ">
                    <div className="h-20 flex justify-between">
                        {/* MENU BUTTON MOBILE MODE */}
                        <div className="flex items-center lg:hidden flex-1">
                            <MenuBar />
                        </div>
                        {/* LOGO ENTREPRISE */}
                        <div className="lg:flex-1 rounded-full flex items-center">
                            <Logo className="flex-shrink-0" />
                        </div>
                        {/* NAVIGATION */}
                        <div className="flex-[2] hidden lg:flex justify-center mx-4">
                            <Navigation />
                        </div>

                        <div className="flex-1 flex items-center justify-end text-slate-700 dark:text-slate-100">
                            {/* USER CONNECTION */}
                            <HeaderLoginOrSignupButton />
                            {/* PANIER */}
                            <HeaderCart />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header
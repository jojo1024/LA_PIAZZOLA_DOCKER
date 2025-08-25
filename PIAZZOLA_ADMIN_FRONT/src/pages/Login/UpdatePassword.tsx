import React, { useRef, useState } from 'react'
import { CustomNotification, INotification } from '../components/Notification'
import clsx from 'clsx'
import { FormInput } from '../../base-components/Form'
import { NotificationElement } from '../../base-components/Notification'
import Lucide from '../../base-components/Lucide'
import Button from '../../base-components/Button'
import LoadingIcon from '../../base-components/LoadingIcon'
import { apiClient } from '../../utils/apiClient'
import { useDispatch } from 'react-redux'
import { IUtilisateur, setConnectionInfo, setUserLogged } from '../../stores/appSlice'
import logo_piazzola from "/logo_piazzola.webp"
import { useNavigate } from 'react-router-dom'

const UpdatePassword: React.FC<{ setDoitChangerDeMotdepasse: React.Dispatch<React.SetStateAction<boolean>>, utilisateurId: number }> = ({ setDoitChangerDeMotdepasse, utilisateurId }) => {
    console.log("🚀 ~ utilisateurId:>>>>>>>>>>>>>>>>>>>>>", utilisateurId)

    // Redux 
    const dispatch = useDispatch()
    //Hooks
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({ password: "", confirmPassword: "" })
    const [message, setMessage] = useState("null")
    const [showPassword, setShowPassword] = useState(false);
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();
    const navigate = useNavigate()
    /**
     * Affiche la notification, le setTimeout est necessaire (les notifications ne s'affichent pas sans)
     * @param notification 
     */
    const displayNotification = (notification: INotification) => {
        setNotification(notification)
        setTimeout(() => {
            showNotification();
        }, 30);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const togglePasswordVisibility = () => setShowPassword((prevState) => !prevState);

    const handleChangePassword = async (e: any) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                setMessage("Le mot de passe et la confirmation ne correspondent pas !")
                return
            }
            setLoading(true);
            const payload = { utilisateurId, motDePasse: formData.password };
            const res = await apiClient.post("/modifier_motdepasse", payload);
            if (!res.status) throw res.error;
            const data = res.data as IUtilisateur
            dispatch(setConnectionInfo(data));
            dispatch(setUserLogged(true));
            (data?.nomRole === "Admin" || data?.nomRole === "Caissier(ière)") ? navigate("/") : navigate("/gestion-commandes")
            setMessage("null")
            setDoitChangerDeMotdepasse(false)
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
            console.error("Error during login:", error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <>
            <div
                className={clsx([
                    "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
                    "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
                    "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
                ])}
            >
                <div className="container relative z-10 sm:px-10 ">
                    <div className="block grid-cols-2 gap-4 xl:grid">
                        {/* BEGIN: UpdatePassword Info */}
                        <div className="flex-col hidden min-h-screen xl:flex">
                            <a href="" className="flex items-center pt-5 -intro-x">
                                <img
                                    alt="La piazzola Logo"
                                    className="w-12 rounded-full"
                                    src={logo_piazzola}
                                />
                                <span className="ml-3 text-lg text-white"> La piazzola </span>
                            </a>
                            <div className="my-auto">
                                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                                    Système de gestion du site piazzola
                                </div>
                            </div>
                        </div>
                        {/* END: UpdatePassword Info */}
                        {/* BEGIN: UpdatePassword Form */}
                        {/* <div > */}

                        <a href="" className="flex items-center pt-5 xl:hidden">
                            <img
                                alt="Midone Tailwind HTML Admin Template"
                                className="w-12 rounded-full"
                                src={logo_piazzola}
                            />
                            <span className="ml-3 text-lg text-white"> La piazzola </span>
                        </a>

                        <form className="flex h-screen py-5 my-0 xl:h-auto xl:py-0 xl:my-0">
                            <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                                    Modification de mot de passe
                                </h2>
                                <div onClick={() => setDoitChangerDeMotdepasse(false)} className='flex flex-row-reverse my-2 text-primary cursor-pointer'>retour</div>
                                <div>Pour votre première connexion, veuillez modifier votre mot de passe.</div>
                                {/* <div className="mt-2 text-center intro-x text-slate-400 w-96">
                                    Encore quelques clics pour vous connecter à votre compte.
                                    Système de gestion des données du site web de La Piazzola
                                </div> */}
                                <div className="mt-8 intro-x">
                                   { message !== "null" && <label className='text-red-600'>{message}</label>}
                                    <div className="relative mb-4">
                                        <FormInput
                                            type={showPassword ? 'text' : "password"}
                                            name='password'
                                            className="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                                            placeholder="Mot de passe"
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1/2 transform -translate-y-1/2 right-3  z-[50]"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />

                                            ) : (
                                                <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <FormInput
                                            type={showPassword ? 'text' : "password"}
                                            name='confirmPassword'
                                            className="block px-4 py-3 mt-4 intro-x login__input min-w-full xl:min-w-[350px]"
                                            placeholder="Confirmation de mot de passe"
                                            onChange={handleInputChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute top-1/2 transform -translate-y-1/2 right-3  z-[50]"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? (
                                                <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />

                                            ) : (
                                                <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
                                            )}
                                        </button>
                                    </div>

                                </div>
                                <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">

                                </div>
                                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left flex justify-end">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-full px-4 py-3 align-top"
                                        onClick={handleChangePassword}
                                        disabled={!formData.password || !formData.password}
                                    >
                                        Modifier
                                        {loading && <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />}
                                    </Button>

                                </div>

                            </div>
                        </form>
                        {/* </div> */}
                        {/* END: UpdatePassword Form */}
                    </div>
                </div>
            </div>

            {/* Affichage la notification */}
            <CustomNotification
                message={notification?.content}
                notificationRef={notificationRef}
                title={"Info"}
                type={notification?.type}
            />

        </>)
}

export default UpdatePassword
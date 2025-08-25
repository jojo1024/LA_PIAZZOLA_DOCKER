import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { ISite, setListeSites } from '../../stores/gestionSiteWebSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';
import CustomButton from '../components/CustomButton';

interface IContactData {
    cle: string;
    data: Datum[];
}

interface Datum {
    title: string;
    bgColor: string;
    subTitle: string;
    iconColor: string
}

const initialiseSite = { siteId: 0, nomSite: "" }
const Contact = () => {

    // Redux
    const dispatch = useDispatch()
    const listeSites = useSelector((state: IReduxState) => state.gestionSiteWeb.listeSites);
    console.log("🚀 ~ Contact ~ listeSites:", listeSites)

    // Hooks
    const [recherchePizza, setRecherchePizza] = useState("")
    const [loading, setLoading] = useState(false)
    const [siteFormData, setSiteFormData] = useState<ISite>(initialiseSite)
    const [openAddOrEditSiteDialog, setOpenAddOrEditSiteDialog] = useState(false)
    const [message, setMessage] = useState("null")
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();

    const [contactData, setContactData] = useState<IContactData>(
        {
            cle: "contact", data: [
                {
                    bgColor: "bg-red-600",
                    title: "Emplacement",
                    subTitle: "Villa 85 rue MZ-165 , mermoz Dakar sénégal",
                    iconColor: "white"
                },
                {
                    bgColor: "bg-black",
                    title: "Téléphone",
                    subTitle: "+221 77 424 30 50",
                    iconColor: "white"
                },
                {
                    bgColor: "bg-white",
                    title: "E-mail",
                    subTitle: "contact@la-piazzola.com",
                    iconColor: "black"
                },

            ]
        })



    // Fonction pour mettre à jour un sous-titre spécifique
    const handleSubtitleChange = (index: number, newSubtitle: string) => {
        const updatedData = contactData.data.map((item, i) =>
            i === index ? { ...item, subTitle: newSubtitle } : item
        );
        setContactData({ ...contactData, data: updatedData });
    };

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

    const recupContact = async () => {
        try {
            const res = await apiClient.get(`/recup_infosup/contact`);
            if (!res?.status) throw res?.error
            const data = res?.data as IContactData
            console.log("🚀 ~ recupContact ~ data:", data)
            setContactData(data)
        } catch (error: any) {
            console.log("🚀 ~ recupClientPointFidelite ~ error:", error)
        }

    }



    const modifierContact = async () => {
        try {
            if (!contactData.data[0].subTitle || !contactData.data[1].subTitle || !contactData.data[2].subTitle) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/modifierinfosup", contactData)
            if (!res.status) throw res.error
            displayNotification({ type: "success", content: "Contact modifié avec succès !" }
            );
            setMessage("null")
        } catch (error: any) {
            console.log("🚀 ~ modifierSite ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }



    useEffect(() => {
        recupContact()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center  sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Contact</h2>

            </div>

            <div className={`grid grid-cols-12 mt-4 `}>
                <div className='col-span-6 box px-8 '>
                    <div className='my-4'>
                        {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}

                        {contactData.data.map((item, index) => (

                            <GenericFormInput
                                label={item.title}
                                id="subTitle"
                                // placeholder="Emplacement"
                                value={item.subTitle}
                                onChange={(e) => handleSubtitleChange(index, e.target.value)}
                                className='mb-4'
                                required
                            />
                        ))}
                        <CustomButton
                            libelle='Enregistrer'
                            loading={loading}
                            onClick={() => modifierContact()}
                        />
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
        </>
    )
}

export default Contact
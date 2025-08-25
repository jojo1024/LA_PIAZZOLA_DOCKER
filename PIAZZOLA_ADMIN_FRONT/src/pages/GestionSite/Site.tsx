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
import LoadingCard from '../components/LoadingCard';

const initialiseSite = { siteId: 0, nomSite: "" }
const Site = () => {

    // Redux
    const dispatch = useDispatch()
    const listeSites = useSelector((state: IReduxState) => state.gestionSiteWeb.listeSites);
    console.log("🚀 ~ Site ~ listeSites:", listeSites)

    // Hooks
    const [recherchePizza, setRecherchePizza] = useState("")
    const [loading, setLoading] = useState(false)
    const [loadingList, setLoadingList] = useState(false)
    const [siteFormData, setSiteFormData] = useState<ISite>(initialiseSite)
    const [openAddOrEditSiteDialog, setOpenAddOrEditSiteDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [message, setMessage] = useState("null")
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();


    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 5
    const pageCount = listeSites.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'Nom du site', accessor: 'nomSite', visible: true, className: '' },
        {
            header: 'Actions',
            renderCell: (value: any, row: any) => (
                <Menu className="">
                    <Menu.Button as="button" className="rounded-md p w-5 h-5" >
                        <Lucide
                            icon="MoreVertical"
                            className="w-5 h-5 text-slate-500"
                        />
                    </Menu.Button>
                    <Menu.Items className="w-40">
                        <Menu.Item onClick={() => {
                            setOpenAddOrEditSiteDialog(true)
                            setdialogOpenKey("edit")
                            setSiteFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setSiteFormData(row)
                        }}>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2 " /> Supprimer
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            ),
            visible: true,

        },
    ];

    const onButtonAnnulerClick = () => {
        setOpenAddOrEditSiteDialog(false);
        setSiteFormData(initialiseSite);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setSiteFormData(prev => ({
            ...prev,
            [name]: value, // Met à jour dynamiquement le champ modifié
        }));
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

    const recupListeSites = async () => {
        try {
            setLoadingList(true)
            const res = await apiClient.get("/recup_site")
            if (!res.status) throw res.error
            const data = res.data as ISite[]
            dispatch(setListeSites(data))
        } catch (error) {
            console.log("🚀 ~ recupListeSites ~ error:", error)
        }
        finally {
            setLoadingList(false)
        }
    }


    const ajouterSite = async () => {
        try {
            if (!siteFormData.nomSite) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            console.log("🚀 ~ ajouterSite ~ siteFormData:", siteFormData)
            setLoading(true)
            const res = await apiClient.post("/ajouter_site", siteFormData)
            if (!res.status) throw res.error
            // const data = res.data as ISite
            // dispatch(addSite(data))
            setSiteFormData(initialiseSite)
            displayNotification({ type: "success", content: "Site ajouté avec succès !" },);
            setOpenAddOrEditSiteDialog(false)
            setMessage("null")
        } catch (error: any) {
            console.log("🚀 ~ ajouterSite ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierSite = async () => {
        try {
            if (!siteFormData.nomSite || !siteFormData.siteId) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            console.log("🚀 ~ modifierSite ~ siteFormData:", siteFormData)
            const res = await apiClient.post("/modifier_site", siteFormData)
            if (!res.status) throw res.error
            // const data = res.data as ISite
            // dispatch(updateSite(data))
            setSiteFormData(initialiseSite)
            displayNotification({ type: "success", content: "Site modifié avec succès !" }
            );
            setMessage("null")
            setOpenAddOrEditSiteDialog(false)
        } catch (error: any) {
            console.log("🚀 ~ modifierSite ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    const supprimerSite = async (siteId: number) => {
        try {
            setLoading(true)
            const res = await apiClient.post("/supprimer_site", { siteId })
            if (!res.status) throw res.error
            // dispatch(deleteSite({ siteId, status: 0 }))
            displayNotification({ type: "success", content: "Site supprimé avec succès !" },);
            setSiteFormData(initialiseSite)
            setOpenDeleteConfirmBox(false)
        } catch (error: any) {
            console.log("🚀 ~ supprimerSite ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        recupListeSites()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8  sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Site</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAddOrEditSiteDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter site
                    </Button>
                </div>
            </div>

            {
                loadingList
                    ?
                    <LoadingCard />
                    :
                    <div className={`w-full overflow-x-auto intro-y hide-scrollbar mt-4  box`}>
                        <CustomDataTable
                            data={listeSites}
                            columns={colums}
                            dataInitial={[]}
                            rowKey={(row) => row?.siteId}
                            selectedRows={[]}
                            onSelectRow={() => null}
                            onSelectAllRows={() => null}
                            onRowDoubleClick={() => null}
                            onDeleteSelectRows={() => null}
                            endIndex={endIndex}
                            startIndex={startIndex}
                            pageIndex={pageIndex}
                            setPageIndex={setPageIndex}
                            pageCount={Math.ceil(pageCount)}
                        />
                    </div>
            }

            {/* BEGIN: Delete Confirmation Modal */}
            <ConfirmeBox
                confirmBoxProps={{
                    intitule: `Voulez-vous vraiment supprimer ${siteFormData.nomSite} ?`,
                    handleConfirme: () => supprimerSite(siteFormData.siteId),
                    loading: loading,
                    buttonSaveLabel: "Supprimer",
                    type: "danger",
                    openConfirmeBox: openDeleteConfirmBox,
                    handleCloseConfirmeBox: () => {
                        setOpenDeleteConfirmBox(false);
                        setLoading(false)
                    },
                }}
            />

            {/* Ajout et modification du site */}
            <DialogBox
                dialogProps={{
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier le site" : "Ajouter un site",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations du site" : "Saisissez les informations du site",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditSiteDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierSite() : ajouterSite(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[100px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Nom du site"
                                    id="nomSite"
                                    placeholder="Nom du site"
                                    value={siteFormData.nomSite}
                                    onChange={(e) => handleInputChange(e)}
                                />
                            </div>
                        </div>,
                    handleSearch: () => null,
                    size: "lg",
                    height: "1/2"
                }}
            />

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

export default Site
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { addVideo, deleteVideo, ISite, IVideo, setListeVideos, updateVideo } from '../../stores/gestionSiteWebSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';

const initialiseVideo = { videoId: 0, titre: "", lienVideo: "", status: 1 }
const Video = () => {

    // Redux
    const dispatch = useDispatch()
    const listeVideos = useSelector((state: IReduxState) => state.gestionSiteWeb.listeVideos);
    console.log("🚀 ~ Video ~ listeVideos:", listeVideos)

    // Hooks
    const [recherchePizza, setRecherchePizza] = useState("")
    const [loading, setLoading] = useState(false)
    const [videoFormData, setVideoFormData] = useState<IVideo>(initialiseVideo)
    const [openAddOrEditVideoDialog, setOpenAdVideodOrEditDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [message, setMessage] = useState("null")
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();

    const onButtonAnnulerClick = () => {
        setOpenAdVideodOrEditDialog(false);
        setVideoFormData(initialiseVideo);
    }

    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 5
    const pageCount = listeVideos.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'Titre', accessor: 'titre', visible: true, className: '' },
        { header: 'Lien', accessor: 'lienVideo', visible: true, className: '' },
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
                            setOpenAdVideodOrEditDialog(true)
                            setdialogOpenKey("edit")
                            setVideoFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setVideoFormData(row)
                        }}>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2 " /> Supprimer
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            ),
            visible: true,

        },
    ];

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setVideoFormData(prev => ({
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

    const recupListeVideos = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get("/recup_video")
            if (!res.status) throw res.error
            const data = res.data as IVideo[]
            dispatch(setListeVideos(data))
        } catch (error) {
            console.log("🚀 ~ recupListeVideos ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }


    const ajouterSite = async () => {
        try {
            if (!videoFormData.titre || !videoFormData.lienVideo) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            console.log("🚀 ~ ajouterSite ~ videoFormData:", videoFormData)
            setLoading(true)
            const res = await apiClient.post("/ajouter_video", videoFormData)
            if (!res.status) throw res.error
            const data = res.data as IVideo
            dispatch(addVideo(data))
            setVideoFormData(initialiseVideo)
            displayNotification({ type: "success", content: "Video ajoutée avec succès !" },);
            setOpenAdVideodOrEditDialog(false)
            setMessage("null")
        } catch (error: any) {
            console.log("🚀 ~ ajouterSite ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierOuSupprimerVideo = async (status: number) => {
        try {
            if (!videoFormData.titre || !videoFormData.lienVideo) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            console.log("🚀 ~ modifierOuSupprimerVideo ~ videoFormData:", videoFormData)
            const res = await apiClient.post("/modifier_video", { ...videoFormData, status })
            if (!res.status) throw res.error
            const data = res.data as IVideo
            status === 1 ? dispatch(updateVideo(data)) : dispatch(deleteVideo({ videoId: videoFormData?.videoId, status: 0 }))
            setVideoFormData(initialiseVideo)
            displayNotification({ type: "success", content: `Video ${status === 1 ? "modifiée" : "supprimée"} avec succès !` }
            );
            setMessage("null")
            setOpenAdVideodOrEditDialog(false)
            setOpenDeleteConfirmBox(false)
        } catch (error: any) {
            console.log("🚀 ~ modifierOuSupprimerVideo ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        recupListeVideos()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8  sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Vidéo</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAdVideodOrEditDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter une vidéo
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto intro-y hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listeVideos}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row?.videoId}
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

            {/* BEGIN: Delete Confirmation Modal */}
            <ConfirmeBox
                confirmBoxProps={{
                    intitule: `Voulez-vous vraiment supprimer ${videoFormData.titre} ?`,
                    handleConfirme: () => modifierOuSupprimerVideo(0),
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
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier la vidéo" : "Ajouter une vidéo",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations de la vidéo" : "Saisissez les informations de la vidéo",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditVideoDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierOuSupprimerVideo(1) : ajouterSite(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[200px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Titre de la bidéo"
                                    id="titre"
                                    placeholder="Titre de la bidéo"
                                    value={videoFormData.titre}
                                    onChange={(e) => handleInputChange(e)}
                                    className='mb-4'
                                />
                                <GenericFormInput
                                    label="Lien de la vidéo"
                                    id="lienVideo"
                                    placeholder="Lien de la vidéo"
                                    value={videoFormData.lienVideo}
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

export default Video
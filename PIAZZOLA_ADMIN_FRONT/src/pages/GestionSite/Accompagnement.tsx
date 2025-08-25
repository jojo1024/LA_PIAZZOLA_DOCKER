import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { addAccompagnement, deleteAccompagnement, IAccompagnement, setListeAccompagnements, updateAccompagnement } from '../../stores/gestionSiteWebSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';

const initialiseAccompagnement = { accompagnementId: 0, nomAccompagnement: "",  status: 1 }
const Accompagnement = () => {

    // Redux
    const dispatch = useDispatch()
    const listeAccompagnements = useSelector((state: IReduxState) => state.gestionSiteWeb.listeAccompagnements);
    console.log("🚀 ~ Video ~ listeVideos:", listeAccompagnements)

    // Hooks
    const [loading, setLoading] = useState(false)
    const [accompagnementFormData, setAccompagnementFormData] = useState<IAccompagnement>(initialiseAccompagnement)
    const [openAddOrEditAccompagnementDialog, setOpenAddOrEditAccompagnementDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [message, setMessage] = useState("null")
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();

    const onButtonAnnulerClick = () => {
        setOpenAddOrEditAccompagnementDialog(false);
        setAccompagnementFormData(initialiseAccompagnement);
    }

    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 5
    const pageCount = listeAccompagnements.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'Nom accompagnement', accessor: 'nomAccompagnement', visible: true, className: '' },
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
                            setOpenAddOrEditAccompagnementDialog(true)
                            setdialogOpenKey("edit")
                            setAccompagnementFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setAccompagnementFormData(row)
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
        setAccompagnementFormData(prev => ({
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

    const recupListeAccompagnements = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get("/recup_accompagnement")
            if (!res.status) throw res.error
            const data = res.data as IAccompagnement[]
            dispatch(setListeAccompagnements(data))
        } catch (error) {
            console.log("🚀 ~ recupListeAccompagnements ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }


    const ajouterAccompagnement = async () => {
        try {
            if (!accompagnementFormData.nomAccompagnement ) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/ajouter_accompagnement", accompagnementFormData)
            if (!res.status) throw res.error
            const data = res.data as IAccompagnement
            dispatch(addAccompagnement(data))
            setAccompagnementFormData(initialiseAccompagnement)
            displayNotification({ type: "success", content: "Accompagnement ajouté avec succès !" },);
            setOpenAddOrEditAccompagnementDialog(false)
            setMessage("null")
        } catch (error: any) {
            console.log("🚀 ~ ajouterAccompagnement ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierOuSupprimerAccompagnement = async (status: number) => {
        try {
            if (!accompagnementFormData.nomAccompagnement ) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            console.log("🚀 ~ modifierOuSupprimerAccompagnement ~ accompagnementFormData:", accompagnementFormData)
            const res = await apiClient.post("/modifier_accompagnement", { ...accompagnementFormData, status })
            if (!res.status) throw res.error
            const data = res.data as IAccompagnement
            status === 1 ? dispatch(updateAccompagnement(data)) : dispatch(deleteAccompagnement({ accompagnementId: accompagnementFormData?.accompagnementId, status: 0 }))
            setAccompagnementFormData(initialiseAccompagnement)
            displayNotification({ type: "success", content: `Accompagnement ${status === 1 ? "modifié" : "supprimé"} avec succès !` }
            );
            setMessage("null")
            setOpenAddOrEditAccompagnementDialog(false)
            setOpenDeleteConfirmBox(false)
        } catch (error: any) {
            console.log("🚀 ~ modifierOuSupprimerAccompagnement ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    useEffect(() => {
        recupListeAccompagnements()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8  sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Accompagnement</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAddOrEditAccompagnementDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter un accompagnement
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto intro-y hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listeAccompagnements}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row?.accompagnementId}
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
                    intitule: `Voulez-vous vraiment supprimer ${accompagnementFormData.nomAccompagnement} ?`,
                    handleConfirme: () => modifierOuSupprimerAccompagnement(0),
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
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier l'accompagnement" : "Ajouter un accompagnement",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations de l'accompagnement" : "Saisissez les informations de l'accompagnement",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditAccompagnementDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierOuSupprimerAccompagnement(1) : ajouterAccompagnement(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[200px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Nom de l'accompagnement"
                                    id="nomAccompagnement"
                                    placeholder="Nom de l'accompagnement"
                                    value={accompagnementFormData.nomAccompagnement}
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

export default Accompagnement
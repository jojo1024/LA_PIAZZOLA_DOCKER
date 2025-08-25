import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { addCondiment, deleteCondiment, Iboisson, ICondiment, setListeCondiments, updateCondiment } from '../../stores/menuSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';

const initialiseCondiment = { condimentId: 0, nomCondiment: "" }
const Condiment = () => {

    // Redux
    const dispatch = useDispatch()
    const listeCondiments = useSelector((state: IReduxState) => state.menu.listeCondiments);

    // Hooks
    const [loading, setLoading] = useState(false)
    const [recupBoissonLoading, setRecupBoissonLoading] = useState(false)
    const [message, setMessage] = useState("null")
    const [condimentFormData, setCondimentFormData] = useState<ICondiment>(initialiseCondiment)
    const [openAddOrEditCondimentDialog, setOpenAddOrEditCondimentDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();



    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 5
    const pageCount = listeCondiments.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'Nom', accessor: 'nomCondiment', visible: true, className: '' },
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
                            setOpenAddOrEditCondimentDialog(true)
                            setdialogOpenKey("edit")
                            setCondimentFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setCondimentFormData(row)
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
        setOpenAddOrEditCondimentDialog(false);
        setCondimentFormData(initialiseCondiment);
      }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setCondimentFormData(prev => ({
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

    const recupListeCondiments = async () => {
        try {
            setRecupBoissonLoading(true)
            const res = await apiClient.get("/recup_condiment")
            if (!res.status) throw res.error
            const data = res.data as ICondiment[]
            dispatch(setListeCondiments(data))
        } catch (error) {
            console.log("🚀 ~ recupListeCondiments ~ error:", error)
        }
        finally {
            setRecupBoissonLoading(false)
        }
    }


    const ajouterCondiment = async () => {
        try {
            if (!condimentFormData.nomCondiment) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/ajouter_condiment", condimentFormData)
            if (!res.status) throw res.error
            const data = res.data as ICondiment
            dispatch(addCondiment(data))
            setCondimentFormData(initialiseCondiment)
            displayNotification({ type: "success", content: "Condiment ajoutée avec succès !" },);
            setOpenAddOrEditCondimentDialog(false)
            setMessage("null")
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierCondiment = async () => {
        try {
            if (!condimentFormData.nomCondiment || !condimentFormData.condimentId) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/modifier_condiment", condimentFormData)
            if (!res.status) throw res.error
            const data = res.data as Iboisson
            dispatch(updateCondiment(data))
            setCondimentFormData(initialiseCondiment)
            displayNotification({ type: "success", content: "Condiment modifiée avec succès !" }
            );
            setOpenAddOrEditCondimentDialog(false)
            setMessage("null")
        } catch (error: any) {
            console.log("🚀 ~ modifierCondiment ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    const supprimerCondiment = async (condimentId: number) => {
        try {
            setLoading(true)
            const res = await apiClient.post("/supprimer_condiment", { condimentId })
            if (!res.status) throw res.error
            // const data = res.data as number
            dispatch(deleteCondiment({ condimentId, status: 0 }))
            displayNotification({ type: "success", content: "Condiment supprimée avec succès !" },);
            setCondimentFormData(initialiseCondiment)
        } catch (error: any) {
            console.log("🚀 ~ supprimerCondiment ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
            setOpenDeleteConfirmBox(false)
        }
    }

    useEffect(() => {
        recupListeCondiments()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Condiment</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAddOrEditCondimentDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter condiment
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listeCondiments}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row.condimentId}
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
                    intitule: `Voulez-vous vraiment supprimer ${condimentFormData.nomCondiment} ?`,
                    handleConfirme: () => supprimerCondiment(condimentFormData.condimentId),
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

            {/* Ajout et modification de pizza */}
            <DialogBox
                dialogProps={{
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier le condiment" : "Ajouter un condiment",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations du condiment" : "Saisissez les informations du condiment",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditCondimentDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierCondiment() : ajouterCondiment(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[120px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Nom du condiment"
                                    id="nomCondiment"
                                    placeholder="Nom du condiment"
                                    value={condimentFormData.nomCondiment}
                                    onChange={(e) => handleInputChange(e)}
                                    required
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

export default Condiment
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { addBoisson, deleteBoisson, Iboisson, setListeBoissons, updateBoisson } from '../../stores/menuSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';

const initialiseBoisson = { boissonId: 0, descriptionBoisson: "", nomBoisson: "", prixBoisson: null }
const Boisson = () => {

    // Redux
    const dispatch = useDispatch()
    const listeBoissons = useSelector((state: IReduxState) => state.menu.listeBoissons);
    console.log("🚀 ~ Boisson ~ listeBoissons:", listeBoissons)

    // Hooks
    const [recherchePizza, setRecherchePizza] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("null")
    const [boissonFormData, setBoissonFormData] = useState<Iboisson>(initialiseBoisson)
    const [openAddOrEditBoissonDialog, setOpenAddOrEditBoissonDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();


    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 5
    const pageCount = listeBoissons!.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'Nom', accessor: 'nomBoisson', visible: true, className: '' },
        { header: 'Description', accessor: 'descriptionBoisson', visible: true, className: 'hidden lg:table-cell' },
        { header: 'Prix', accessor: 'prixBoisson', visible: true, className: 'hidden md:table-cell' },
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
                            setOpenAddOrEditBoissonDialog(true)
                            setdialogOpenKey("edit")
                            setBoissonFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setBoissonFormData(row)
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
        setOpenAddOrEditBoissonDialog(false);
        setBoissonFormData(initialiseBoisson);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setBoissonFormData(prev => ({
            ...prev,
            [name]: name === "prixBoisson" ? Number(value) : value, // Met à jour dynamiquement le champ modifié
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

    const recupListeBoissons = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get("/recup_boisson")
            if (!res.status) throw res.error
            const data = res.data as Iboisson[]
            dispatch(setListeBoissons(data))
        } catch (error) {
            console.log("🚀 ~ ajouterCommande ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }


    const ajouterBoisson = async () => {
        try {
            const payload = { ...boissonFormData, prixBoisson: Number(boissonFormData.prixBoisson) }
            if (!payload.prixBoisson || !payload.nomBoisson) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/ajouter_boisson", payload)
            if (!res.status) throw res.error
            const data = res.data as Iboisson
            dispatch(addBoisson(data))
            setBoissonFormData(initialiseBoisson)
            displayNotification({ type: "success", content: "Boisson ajoutée avec succès !" },);
            setOpenAddOrEditBoissonDialog(false)
            setMessage("null")
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierBoisson = async () => {
        try {
            const payload = { ...boissonFormData, prixBoisson: Number(boissonFormData.prixBoisson) }
            if (!payload.prixBoisson || !payload.nomBoisson || !payload.boissonId) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/modifier_boisson", payload)
            if (!res.status) throw res.error
            const data = res.data as Iboisson
            dispatch(updateBoisson(data))
            setBoissonFormData(initialiseBoisson)
            displayNotification({ type: "success", content: "Boisson modifiée avec succès !" }
            );
            setOpenAddOrEditBoissonDialog(false);
            setMessage("null")
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
            console.log("🚀 ~ ajouterCommande ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }

    const supprimerBoisson = async (status: 0 | 1, boissonId: number) => {
        try {
            setLoading(true)
            const res = await apiClient.post("/supprimer_boisson", { boissonId })
            if (!res.status) throw res.error
            // const data = res.data as number
            dispatch(deleteBoisson({ boissonId, status: 0 }))
            displayNotification({ type: "success", content: "Boisson supprimée avec succès !" });
            setBoissonFormData(initialiseBoisson)
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
            console.log("🚀 ~ ajouterCommande ~ error:", error)
        }
        finally {
            setLoading(false)
            setOpenDeleteConfirmBox(false)
        }
    }

    useEffect(() => {
        recupListeBoissons()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Boissons</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAddOrEditBoissonDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter boisson
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listeBoissons}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row.boissonId}
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
                    intitule: `Voulez-vous vraiment supprimer ${boissonFormData.nomBoisson} ?`,
                    handleConfirme: () => supprimerBoisson(0, boissonFormData.boissonId),
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
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier la boisson" : "Ajouter une boisson",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations de la boisson" : "Saisissez les informations de la boisson",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditBoissonDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierBoisson() : ajouterBoisson(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[320px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}

                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Nom de la boisson"
                                    id="nomBoisson"
                                    placeholder="Nom de la boisson"
                                    value={boissonFormData.nomBoisson}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                    className='mb-4'
                                />

                                {/* Champ pour la description de la pizza */}
                                <GenericFormInput
                                    label="Description de la boisson"
                                    id="descriptionBoisson"
                                    type="text"
                                    placeholder="Entrez la description de la boisson"
                                    value={boissonFormData.descriptionBoisson}
                                    onChange={(e) => handleInputChange(e)}
                                    className='mb-4'
                                />

                                {/* Champ pour la description de la pizza */}
                                <GenericFormInput
                                    label="Prix de la boisson"
                                    id="prixBoisson"
                                    type="number"
                                    placeholder="Entrez le prix de la boisson"
                                    value={boissonFormData.prixBoisson || ""}
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

export default Boisson
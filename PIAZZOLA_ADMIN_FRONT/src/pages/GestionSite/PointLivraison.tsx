import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { FormLabel, FormTextarea } from '../../base-components/Form';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { IPointLivraison, setListePointLivraison } from '../../stores/gestionSiteWebSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';

const initialisePointLivraison = { idPointLivraison: 0, zone: "", adressePointLivraison: "", prixPointLivraison: null }

const PointLivraison = () => {

    // Redux
    const dispatch = useDispatch()
    const listePointLivraison = useSelector((state: IReduxState) => state.gestionSiteWeb.listePointLivraison);

    // Hooks
    const [recherchePizza, setRecherchePizza] = useState("")
    const [loading, setLoading] = useState(false)
    const [pointLivraisonFormData, setPointLivraisonFormData] = useState<IPointLivraison>(initialisePointLivraison)
    console.log("🚀 ~ PointLivraison ~ pointLivraisonFormData:", pointLivraisonFormData)
    const [openAddOrEditPointLivraisonDialog, setOpenAddOrEditPointLivraisonDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [message, setMessage] = useState("null")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();


    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 7
    const pageCount = listePointLivraison!.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'zone', accessor: 'zone', visible: true, className: '' },
        {
            header: 'adresse du site',
            renderCell: (value: any, row: any) => (<div>{row?.adressePointLivraison?.slice(0, 70)}...</div>),
            visible: true, className: 'hidden md:table-cell'
        },
        { header: 'prix livraison', accessor: 'prixPointLivraison', visible: true, className: '' },
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
                            setOpenAddOrEditPointLivraisonDialog(true)
                            setdialogOpenKey("edit")
                            setPointLivraisonFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setPointLivraisonFormData(row)
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
        setPointLivraisonFormData(prev => ({
            ...prev,
            [name]: value, // Met à jour dynamiquement le champ modifié
        }));
    };

    const onButtonAnnulerClick = () => {
        setOpenAddOrEditPointLivraisonDialog(false);
        setPointLivraisonFormData(initialisePointLivraison);
    }

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

    const recupListePointLivraison = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get("/recup_point_livraison")
            if (!res.status) throw res.error
            const data = res.data as IPointLivraison[]
            dispatch(setListePointLivraison(data))
        } catch (error) {
            console.log("🚀 ~ recupListePointLivraison ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }


    const ajouterPointLivraison = async () => {
        try {
            const payload = { ...pointLivraisonFormData, prixPointLivraison: Number(pointLivraisonFormData.prixPointLivraison) }
            if (!payload.zone || !payload.adressePointLivraison || !payload.prixPointLivraison) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/ajouter_point_livraison", payload)
            if (!res.status) throw res.error
            // const data = res.data as IPointLivraison
            // dispatch(addPointLivraison(data))
            setPointLivraisonFormData(initialisePointLivraison)
            displayNotification({ type: "success", content: "Point de livraison ajouté avec succès !" },);
            setMessage("null")
            setOpenAddOrEditPointLivraisonDialog(false)
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierPointLivraison = async () => {
        try {
            const payload = { ...pointLivraisonFormData, prixPointLivraison: Number(pointLivraisonFormData.prixPointLivraison) }
            if (!payload.zone || !payload.adressePointLivraison || !payload.prixPointLivraison) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/modifier_point_livraison", payload)
            if (!res.status) throw res.error
            // const data = res.data as IPointLivraison
            // dispatch(updatePointLivraison(data))
            setPointLivraisonFormData(initialisePointLivraison)
            displayNotification({ type: "success", content: "Point de livraison modifié avec succès !" }
            );
            setOpenAddOrEditPointLivraisonDialog(false)
        } catch (error: any) {
            console.log("🚀 ~ modifierPointLivraison ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    const supprimerPointLivraison = async (idPointLivraison: number) => {
        try {
            setLoading(true)
            const res = await apiClient.post("/supprimer_point_livraison", { idPointLivraison })
            if (!res.status) throw res.error
            // const data = res.data as number
            // dispatch(deletePointLivraison({ idPointLivraison, status: 0 }))
            displayNotification({ type: "success", content: "Point de livraison supprimé avec succès !" },);
            setPointLivraisonFormData(initialisePointLivraison)
            setOpenDeleteConfirmBox(false)
        } catch (error: any) {
            console.log("🚀 ~ supprimerPointLivraison ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        recupListePointLivraison()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8  sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Point livraison</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAddOrEditPointLivraisonDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter point livraison
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto intro-y hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listePointLivraison}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row.idPointLivraison}
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
                    intitule: `Voulez-vous vraiment supprimer ${pointLivraisonFormData.adressePointLivraison} ?`,
                    handleConfirme: () => supprimerPointLivraison(pointLivraisonFormData.idPointLivraison),
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

            {/* Ajout et modification du supplement */}
            <DialogBox
                dialogProps={{
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier le point de livraison" : "Ajouter un point de livraison",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations du point de livraison" : "Saisissez les informations du point de livraison",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditPointLivraisonDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierPointLivraison() : ajouterPointLivraison(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[315px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Zone"
                                    id="zone"
                                    placeholder="Zone"
                                    value={pointLivraisonFormData.zone}
                                    onChange={(e) => handleInputChange(e)}
                                    className='mb-2'
                                    required
                                />

                                <div className='flex flex-col'>
                                    <FormLabel className="xl:w-40 xl:!mr-4">
                                        <div className="text-left">
                                            <div className="flex items-center">
                                                <div className="">Adresse du site{<span className='pl-1 text-red-600'>*</span>}</div>
                                            </div>
                                        </div>
                                    </FormLabel>
                                    <FormTextarea
                                        name='adressePointLivraison'
                                        onChange={(e) => handleInputChange(e)}
                                        rows={4}
                                        className='mb-4 font-medium'
                                        value={pointLivraisonFormData.adressePointLivraison}
                                    />

                                </div>

                                {/* Champ pour la description de la pizza */}
                                <GenericFormInput
                                    label="Prix du point"
                                    id="prixPointLivraison"
                                    type="number"
                                    placeholder="Entrez le prix du point de la livraison"
                                    value={pointLivraisonFormData.prixPointLivraison || ""}
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

export default PointLivraison



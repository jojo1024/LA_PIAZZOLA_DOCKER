import _ from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../base-components/Button';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { NotificationElement } from '../../base-components/Notification';
import { addSupplement, deleteSupplement, ISupplement, setListeSupplements, updateSupplement } from '../../stores/menuSlice';
import { IReduxState } from '../../stores/store';
import { apiClient } from '../../utils/apiClient';
import ConfirmeBox from '../components/ConfirmeBox';
import CustomDataTable from '../components/CustomDataTable';
import CustomSelect1 from '../components/CustomSelect1';
import DialogBox from '../components/DialogBox';
import GenericFormInput from '../components/GenericFormInput';
import { CustomNotification, INotification } from '../components/Notification';

const initialiseSupplement = { supplementId: 0, nomSupplement: "", prixSupplement: null, categorieSupplementId: 0, nomCategorieSupplement: "" }
const Supplement = () => {

    // Redux
    const dispatch = useDispatch()
    const listeSupplements = useSelector((state: IReduxState) => state.menu.listeSupplements);

    // Hooks
    const [recherchePizza, setRecherchePizza] = useState("")
    const [loading, setLoading] = useState(false)
    const [supplementFormData, setSupplementFormData] = useState<ISupplement>(initialiseSupplement)
    const [openAddOrEditSupplementDialog, setOpenAddOrEditSupplementDialog] = useState(false)
    const [dialogOpenKey, setdialogOpenKey] = useState<"edit" | "add">("add")
    const [message, setMessage] = useState("null")
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);
    const [notification, setNotification] = useState<INotification | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();


    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 5
    const pageCount = listeSupplements!.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Represente les colonnes de la liste des classes
    const colums: any = [
        { header: 'Nom', accessor: 'nomSupplement', visible: true, className: '' },
        { header: 'Prix', accessor: 'prixSupplement', visible: true, className: 'hidden md:table-cell' },
        { header: 'Categorie', accessor: 'nomCategorieSupplement', visible: true, className: 'hidden lg:table-cell' },
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
                            setOpenAddOrEditSupplementDialog(true)
                            setdialogOpenKey("edit")
                            setSupplementFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setSupplementFormData(row)
                        }}>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2 " /> Supprimer
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            ),
            visible: true,

        },
    ];

    const categorieSupplementData = useMemo(() => {
        // Étape 1: Filtrer les objets uniques par 'name'
        const uniqById = _.uniqBy(listeSupplements, 'categorieSupplementId');
        // Étape 2: Extraire uniquement les propriétés nécessaires
        return _.map(uniqById, ({ categorieSupplementId, nomCategorieSupplement }) => ({ categorieSupplementId, nomCategorieSupplement }));
    }, [listeSupplements]); // Recalcule uniquement si `data` change


    const onButtonAnnulerClick = () => {
        setOpenAddOrEditSupplementDialog(false);
        setSupplementFormData(initialiseSupplement);
    }

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setSupplementFormData(prev => ({
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

    const recupListeSupplements = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get("/recup_supplement")
            if (!res.status) throw res.error
            const data = res.data as ISupplement[]
            dispatch(setListeSupplements(data))
        } catch (error) {
            console.log("🚀 ~ recupListeSupplements ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }


    const ajouterSupplement = async () => {
        try {
            const payload = { ...supplementFormData, prixSupplement: Number(supplementFormData.prixSupplement), categorieSupplementId: Number(supplementFormData.categorieSupplementId) }
            if (!payload.nomSupplement || !payload.prixSupplement || !payload.categorieSupplementId) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/ajouter_supplement", payload)
            if (!res.status) throw res.error
            const data = res.data as ISupplement
            dispatch(addSupplement(data))
            setSupplementFormData(initialiseSupplement)
            displayNotification({ type: "success", content: "Supplement ajoutée avec succès !" },);
            setOpenAddOrEditSupplementDialog(false)
            setMessage("")
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }


    const modifierSupplement = async () => {
        try {
            const payload = { ...supplementFormData, prixSupplement: Number(supplementFormData.prixSupplement), categorieSupplementId: Number(supplementFormData.categorieSupplementId) }
            if (!payload.nomSupplement || !payload.supplementId || !payload.prixSupplement || !payload.categorieSupplementId) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/modifier_supplement", supplementFormData)
            if (!res.status) throw res.error
            const data = res.data as ISupplement
            dispatch(updateSupplement(data))
            setSupplementFormData(initialiseSupplement)
            displayNotification({ type: "success", content: "Supplement modifiée avec succès !" }
            );
            setOpenAddOrEditSupplementDialog(false)
            setMessage("null")
        } catch (error: any) {
            console.log("🚀 ~ modifierSupplement ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    const supprimerSupplement = async (supplementId: number) => {
        try {
            setLoading(true)
            const res = await apiClient.post("/supprimer_supplement", { supplementId })
            if (!res.status) throw res.error
            // const data = res.data as number
            dispatch(deleteSupplement({ supplementId, status: 0 }))
            displayNotification({ type: "success", content: "Supplement supprimée avec succès !" },);
            setSupplementFormData(initialiseSupplement)
        } catch (error: any) {
            console.log("🚀 ~ supprimerSupplement ~ error:", error)
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
            setOpenDeleteConfirmBox(false)
        }
    }

    useEffect(() => {
        recupListeSupplements()
    }, [])

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Supplement</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button
                        as="a"
                        href="#"
                        variant="primary"
                        onClick={(event: React.MouseEvent) => {
                            event.preventDefault();
                            setOpenAddOrEditSupplementDialog(true);
                            setdialogOpenKey('add')
                        }}
                        className="mr-2 shadow-md"
                    >
                        Ajouter supplement
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listeSupplements}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row.supplementId}
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
                    intitule: `Voulez-vous vraiment supprimer ${supplementFormData.nomSupplement} ?`,
                    handleConfirme: () => supprimerSupplement(supplementFormData.supplementId),
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
                    dialogTitle: dialogOpenKey === "edit" ? "Modifier le supplement" : "Ajouter un supplement",
                    dialogSubTitle: dialogOpenKey === "edit" ? "Modifier les informations du supplement" : "Saisissez les informations du supplement",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditSupplementDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenKey === "edit" ? modifierSupplement() : ajouterSupplement(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[300px] rounded-lg rounded-t-lg overflow-y-auto">
                            {message !== "null" && <div className='text-red-600 mt-2'>{message}</div>}
                            <div className='my-4'>
                                {/* Champ pour le nom de la pizza */}
                                <GenericFormInput
                                    label="Nom du supplemnt"
                                    id="nomSupplement"
                                    placeholder="Nom du supplemnt"
                                    value={supplementFormData.nomSupplement}
                                    onChange={(e) => handleInputChange(e)}
                                    className='mb-4'
                                    required
                                />


                                {/* Champ pour la description de la pizza */}
                                <GenericFormInput
                                    label="Prix du supplemnt"
                                    id="prixSupplement"
                                    type="number"
                                    placeholder="Entrez le prix du supplemnt"
                                    value={supplementFormData.prixSupplement || ""}
                                    onChange={(e) => handleInputChange(e)}
                                    required
                                />

                                <div className="flex flex-col  items-start pt-5 my-4 first:mt-0 first:pt-0">
                                    {/* <div className="xl:w-40 xl:!mr-4">
                                        <div className="text-left">
                                            <div className="flex items-center">
                                                <div className="">Catégorie du supplement</div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <CustomSelect1
                                        // className='w-full'
                                        label='Catégorie du supplement'
                                        data={categorieSupplementData}
                                        keys={["categorieSupplementId", "nomCategorieSupplement"]}
                                        onChange={(e: any) => setSupplementFormData(prev => ({ ...prev, ...e }))}
                                        id="categorieSupplementId"
                                        valuesSelected={supplementFormData.categorieSupplementId}
                                        containerClassname='flex flex-col w-full'
                                        required
                                        initialiseValue={initialiseSupplement}
                                    />
                                </div>
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

export default Supplement



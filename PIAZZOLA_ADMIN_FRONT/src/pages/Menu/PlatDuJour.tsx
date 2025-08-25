import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu } from '../../base-components/Headless';
import Lucide from '../../base-components/Lucide';
import { deletePlatDuJour, IListePizzaItemFormated, setListePlatsDuJour } from '../../stores/menuSlice';
import { IReduxState } from '../../stores/store';
import CustomDataTable from '../components/CustomDataTable';
import { convertDateToLocaleStringDate, filterByDate, getTodayDate } from '../../utils/functions';
import Litepicker from '../../base-components/Litepicker';
import Button from '../../base-components/Button';
import { CustomNotification, INotification } from '../components/Notification';
import CustomSelect from '../components/CustomSelect';
import DialogBox from '../components/DialogBox';
import { NotificationElement } from '../../base-components/Notification';
import { INotificationProps } from '../GestionSite/Banniere';
import ConfirmeBox from '../components/ConfirmeBox';
import { apiClient } from '../../utils/apiClient';
import CustomSelectWithSearch from '../components/CustomSelectWithSearch';

const initialisePlat = { dateHeurPlatDuJour: getTodayDate(), pizzaId: 0, platDuJourId: 0 }

const PlatDuJour = () => {
    // Props
    // const { setOpenAddOrEditPizzaDialog, setOpenDeleteConfirmBox, setPizzaFormData, setdialogOpenKey, setpizzaOuPlat } = props
    // Redux
    const dispatch = useDispatch()
    const listePlatsDuJour = useSelector((state: IReduxState) => state.menu.listePlatsDuJour);
    const listePizzas = useSelector((state: IReduxState) => state.menu.listePizzas);
    console.log("🚀 ~ PlatDuJour ~ listePizzas:", listePlatsDuJour)

    // Hooks
    const [date, setDate] = useState(getTodayDate())
    const [platSelected, setPlatSelected] = useState<string[]>([])
    console.log("🚀 ~ lllllllllllllllllted:", platSelected)
    const [openAddOrEditPlatDialog, setOpenAddOrEditPlatDialog] = useState(false)
    const [dialogOpenPlatKey, setdialogOpenPlatKey] = useState<"edit" | "add">("add")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("null")
    const [notification, setNotification] = useState<INotificationProps | undefined>()
    const notificationRef = useRef<NotificationElement>();
    const showNotification = () => notificationRef.current?.showToast();
    const [platFormData, setPlatFormData] = useState(initialisePlat)
    const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

    console.log("🚀 ~ platFormData:", platFormData)
    // Plat du jour
    const listePlats = useMemo(() => { return listePizzas?.filter(item => item.categoriePizzaId === 6 && item.estUnePizza === 0) }, [listePizzas])
    console.log("🚀 ~ PlatDuJour ~ listePlats:", listePlats)
    const listePlatsDuJourByDate = useMemo(() => { return filterByDate(listePlatsDuJour, date) }, [listePlatsDuJour, date])
    console.log("🚀 ~ listePlatsDuJourByDate:", listePlatsDuJourByDate)

    // Table hooks
    const [pageIndex, setPageIndex] = useState(0);
    const itemsPerPage = 6
    const pageCount = listePlatsDuJourByDate!.length / itemsPerPage
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Represente les colonnes de la liste
    const colums: any = [
        { header: 'Nom', accessor: 'nomPizza', visible: true, className: '' },
        // { header: 'Prix', renderCell: (value: any, row: any) => (<span>{row["pizzaFormat"][0]["prixPizzaFormat"]}</span>), visible: true, className: 'hidden sm:table-cell' },
        { header: 'Date', renderCell: (value: any, row: any) => (<span>{convertDateToLocaleStringDate(row["dateHeurPlatDuJour"])}</span>), accessor: 'datePlatDuJour', visible: true, className: 'hidden sm:table-cell' },
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
                            setOpenAddOrEditPlatDialog(true)
                            setdialogOpenPlatKey("edit")
                            setPlatFormData(row)
                        }}>
                            <Lucide icon="Pencil" className="w-4 h-4 mr-2" /> Modifier
                        </Menu.Item>
                        <Menu.Item className={"text-red-600"} onClick={() => {
                            setOpenDeleteConfirmBox(true)
                            setPlatFormData(row)
                        }}>
                            <Lucide icon="Trash" className="w-4 h-4 mr-2 " /> Supprimer
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            ),
            visible: true,

        },
    ];

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

    const onButtonAnnulerClick = () => {
        setOpenAddOrEditPlatDialog(false);
        setPlatFormData(initialisePlat);
    }

    const handlePlatSelected = (pizzaId: string) => {
        console.log("🚀 ~ handlePlatSelected ~ pizzaId:", pizzaId)
        setPlatSelected(prev =>
            ([...prev, pizzaId])
        );
    };


    const recupListePlats = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get("/recup_plat_du_jour")
            if (!res.status) throw res.error
            const data = res.data
            console.log("🚀 ~ recupListePlats ~ data:", data)
            dispatch(setListePlatsDuJour(data))
        } catch (error) {
            console.log("🚀 ~ ajouterCommande ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }

    const ajouterPlat = async () => {
        try {
            if (!platSelected.length) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            console.log("🚀 ~ ajouterPlat ~  { ...platFormData, pizzaIds: platSelected.map(Number) }:", { ...platFormData, pizzaIds: platSelected.map(Number) })
            setLoading(true)
            const res = await apiClient.post("/ajouter_plat_du_jour", { ...platFormData, pizzaIds: platSelected.map(Number) })
            if (!res.status) throw res.error
            const data = res.data
            setPlatFormData(initialisePlat)
            displayNotification({ type: "success", content: "Plat ajouté avec succès !" },);
            setOpenAddOrEditPlatDialog(false)
            setMessage("null")
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
        }
        finally {
            setLoading(false)
        }
    }

    const modifierPlat = async () => {
        try {
            if (!platFormData.pizzaId) {
                setMessage("Tous les champs sont obligatoires !")
                return
            }
            setLoading(true)
            const res = await apiClient.post("/modifier_plat_du_jour", platFormData)
            if (!res.status) throw res.error
            const data = res.data
            setPlatFormData(initialisePlat)
            displayNotification({ type: "success", content: "Plat modifié avec succès !" }
            );
            setOpenAddOrEditPlatDialog(false);
            setMessage("null")
        } catch (error: any) {
            displayNotification({ content: error?.message, type: "error" })
            console.log("🚀 ~ ajouterCommande ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }

        const supprimerPlatDuJour = async (status: 0 | 1, platDuJourId: number) => {
            try {
                setLoading(true)
                const res = await apiClient.post("/supprimer_plat_du_jour", { platDuJourId })
                if (!res.status) throw res.error
                // const data = res.data as number
                dispatch(deletePlatDuJour({ platDuJourId, status: 0 }))
                displayNotification({ type: "success", content: "Plat du jour supprimé avec succès !" });
                setPlatFormData(initialisePlat)
            } catch (error: any) {
                console.log("🚀 ~ supprimerPlatDuJour ~ error:", error)
                displayNotification({ content: error?.message, type: "error" })
            }
            finally {
                setLoading(false)
                setOpenDeleteConfirmBox(false)
            }
        }

    useEffect(() => {
        recupListePlats()
    }, [])


    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Programmation de plat du jour</h2>
                <div className="flex flex-row mt-4 sm:mt-0">
                    <Litepicker value={date} onChange={(e: any) => setDate(e)} options={{
                        autoApply: true,
                        showWeekNumbers: true,
                        lang: "fr",
                        dropdowns: {
                            minYear: 2025,
                            maxYear: null,
                            months: true,
                            years: true,
                        },
                    }} className="" />
                    <Button onClick={() => {
                        setOpenAddOrEditPlatDialog(true)
                        setdialogOpenPlatKey("add")
                    }}
                        variant="primary" className="ml-4 shadow-md">
                        Nouveau
                    </Button>
                </div>
            </div>

            <div className={`w-full overflow-x-auto hide-scrollbar mt-4  box`}>
                <CustomDataTable
                    data={listePlatsDuJourByDate}
                    columns={colums}
                    dataInitial={[]}
                    rowKey={(row) => row?.platDuJourId}
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
                    intitule: `Voulez-vous vraiment supprimer ce plat ?`,
                    handleConfirme: () => supprimerPlatDuJour(0, platFormData.platDuJourId),
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

            <DialogBox
                dialogProps={{
                    dialogTitle: dialogOpenPlatKey === "edit" ? "Modifier le plat" : "Ajouter un plat",
                    dialogSubTitle: dialogOpenPlatKey === "edit" ? "Modifier les informations du plat" : "Saisissez les informations du plat",
                    iconSvg: <></>,
                    dialogFooterButtonTitle: dialogOpenPlatKey === "edit" ? "Modifier" : "Ajouter",
                    handleCloseDialog: onButtonAnnulerClick,
                    disable: false,
                    loading: loading,
                    openDialog: openAddOrEditPlatDialog,
                    onButtonAnnulerClick: onButtonAnnulerClick,
                    onButtonSaveClick: () => dialogOpenPlatKey === "edit" ? modifierPlat() : ajouterPlat(),
                    dialogBoxContentHeader: "",
                    dialogBoxContent:
                        <div className="w-full  h-[240px] rounded-lg rounded-t-lg overflow-y-auto  pt-8">
                            {message !== "null" && <div className='text-red-600 my-2'>{message}</div>}

                            <div className="flex flex-col items-start   mb-6 first:mt-0 first:pt-0">
                                <div className="xl:w-40 xl:!mr-4">
                                    <div className="text-left">
                                        <div className="flex items-center">
                                            <div className="">Date du plat du jour</div>
                                        </div>
                                    </div>
                                </div>
                                <Litepicker value={platFormData.dateHeurPlatDuJour} onChange={(e: any) => setPlatFormData(prev => ({ ...prev, dateHeurPlatDuJour: e }))} options={{
                                    autoApply: true,
                                    showWeekNumbers: true,
                                    lang: "fr",
                                    dropdowns: {
                                        minYear: 2025,
                                        maxYear: null,
                                        months: true,
                                        years: true,
                                    },
                                }} />
                            </div>
                            {
                                dialogOpenPlatKey === "edit"
                                    ?
                                    <div className="flex flex-col items-start mt-2 px-1 first:mt-0 first:pt-0">
                                        <div className="xl:w-40 xl:!mr-4">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="">Plat </div>
                                                </div>
                                            </div>
                                        </div>
                                        <CustomSelect
                                            className="w-full mb-6"
                                            data={listePlats}
                                            keys={["pizzaId", "nomPizza"]}
                                            onChange={(e: any) => setPlatFormData(prev => ({ ...prev, pizzaId: Number(e.target.value) }))}
                                            id="pizzaId"
                                            valuesSelected={platFormData.pizzaId || ""}
                                            required
                                        />

                                    </div>
                                    :
                                    <CustomSelectWithSearch
                                        id="pizzaId"
                                        label="Plat"
                                        valuesSelected={platSelected}
                                        onChange={setPlatSelected}
                                        data={listePlats}
                                        keys={["pizzaId", "nomPizza"]}
                                        className='w-full'
                                        isMultipleSelect={true}
                                    />
                            }

                        </div >,
                    handleSearch: () => null,
                    size: "lg",
                    height: "1/2"
                }}
            />

            <CustomNotification
                message={notification?.content}
                notificationRef={notificationRef}
                title={"Info"}
                type={notification?.type}
            />
        </>
    )
}

export default PlatDuJour
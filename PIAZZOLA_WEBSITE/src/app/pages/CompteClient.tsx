import React, { FC, Suspense, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUserConnectedInfo } from "../../store/appSlice";
import { IReduxState } from "../../store/store";
import { apiClient } from "../../utils/apiClient";
import DisplayNotification from "../components/DisplayNotification";
import PageLoader from "./PageLoader";
import { clientSchemaPayload } from "../../store/schemas";
import { extractZodErrors } from "../../utils/functions";
import PhoneInputComponent from "../components/PhoneInputComponent";
import { IPointLivraison } from "../../store/interfaces";
import { setCart } from "../../store/cartSlice";
import { initialisePointAdresseSelectionne } from "../../store/pointLivraisonSlice";

// Lazy-loaded components
const DeliveryZones = React.lazy(() => import('../components/DeliveryZones'));
const CustomHelmet = React.lazy(() => import("../components/CustomHelmet"));
const CommonLayout = React.lazy(() => import("../components/CommonLayout"));
const Label = React.lazy(() => import("../components/Label"));
const Input = React.lazy(() => import("../components/Input"));
const CustomButton = React.lazy(() => import("../components/CustomButton"));

export interface CompteClientProps {
  className?: string;
}

const CompteClient: FC<CompteClientProps> = ({ className = "" }) => {

  // Redux
  const dispatch = useDispatch()
  const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);
  const cart = useSelector((state: IReduxState) => state.cart.cart);
  console.log("🚀 ~ userConnectedInfo:", userConnectedInfo)
  const pointLivraison = useSelector((state: IReduxState) => state.pointLivraison.pointLivraison);

  // hooks
  const [formData, setFormData] = useState(userConnectedInfo)
  const [formErrors, setFormErrors] = useState<any>({})
  console.log("🚀 ~ formData:>>>>>>>>>>>>>>>", formData)
  const [loadingUpdateClient, setLoadingUpdateClient] = useState(false)
  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    dispatch(setCart({ ...cart, commande: { ...cart.commande, rueDeLaLivraison: value  } }))
    dispatch(setUserConnectedInfo({ ...userConnectedInfo, rueDeLaLivraison: value }))

  }

  const pointLivraisonClient = useMemo(() => {
    if (!userConnectedInfo?.idPointLivraison) {
      return initialisePointAdresseSelectionne
    }
    const point = pointLivraison.find(item => item?.idPointLivraison === userConnectedInfo?.idPointLivraison)
    console.log("🚀 ~ pointLivraisonClient ~ point:", point)
    dispatch(setCart({ ...cart, commande: { ...cart.commande, ...point } }))
    dispatch(setUserConnectedInfo({ ...userConnectedInfo, ...point }))
    return point
  }, [pointLivraison, userConnectedInfo?.idPointLivraison])
  console.log("🚀 ~ pointLivraisonClient ~ pointLivraisonClient:", pointLivraisonClient)

  const updateClient = async () => {
    try {
      console.log("🚀 ~ updateClient ~ formData:", formData)
      clientSchemaPayload.parse(formData)
      setFormErrors({})
      setLoadingUpdateClient(true);
      // return
      const res = await apiClient.post(`/update_client`, formData);
      if (!res?.status) throw res?.error
      dispatch(setUserConnectedInfo(formData))
      DisplayNotification({ libelle: "Information modifiée avec succès !", type: "success" })
    } catch (error: any) {
      console.log("🚀 ~ insertClient ~ error:", error)
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      !error?.errors && DisplayNotification({ libelle: error?.message, type: "error" })
    } finally {
      setLoadingUpdateClient(false);
    }
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <div className={`nc-CompteClient ${className}`} data-nc-id="CompteClient">
        <CustomHelmet content="Compte client || Piazzola" />
        <CommonLayout>
          <div className="space-y-10 sm:space-y-12">
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Information de compte
            </h2>
            <div className="flex flex-col md:flex-row">

              <div className="flex-grow mt-10 md:mt-0  max-w-3xl space-y-6">

                <div >
                  <Label>Nom utilisateur</Label>
                  <div className="mt-1.5 flex flex-col">
                    {/* <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-user"></i>
                    </span> */}
                    <Input
                      onChange={handleInputChange}
                      name="nomUtilisateurClient"
                      value={formData?.nomUtilisateurClient}
                    // className=""
                    />
                    {formErrors["nomUtilisateurClient"] && <label className="text-red-600 text-xs mt-1">{formErrors["nomUtilisateurClient"]}</label>}
                  </div>
                </div>

                <div>
                  <Label>Email</Label>
                  <div className="mt-1.5 flex flex-col">
                    {/* <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-envelope"></i>
                    </span> */}
                    <Input
                      disabled
                      onChange={handleInputChange}
                      name="emailClient"
                      value={formData?.emailClient || ""}
                    // className="!rounded-l-none"
                    // placeholder="example@email.com"
                    />
                  </div>
                </div>
                {/* ---- */}
                <div>
                  <PhoneInputComponent
                    label="Téléphone 1"
                    required={true}
                    value={formData.telephoneClient}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephoneClient: e }))}
                    error={formErrors["telephoneClient"]}
                  />
                </div>
                {/* ---- */}
                <div>
                  {/* <Label>Téléphone 2</Label>
                  <div className="mt-1.5 flex flex-col">
 
                    <Input
                      onChange={handleInputChange}
                      name="telephoneClient2"
                      value={formData?.telephoneClient2 || ""}
                    // className="!rounded-l-none"
                    />
                    {formErrors["telephoneClient2"] && <label className="text-red-600 text-xs mt-1">{formErrors["telephoneClient2"]}</label>}

                  </div> */}
                  <PhoneInputComponent
                    label="Téléphone 2"
                    // required={true}
                    value={formData.telephoneClient2}
                    onChange={(e) => setFormData(prev => ({ ...prev, telephoneClient2: e }))}
                    error={formErrors["telephoneClient2"]}
                  />
                </div>

                <div className="flex flex-col">
                  <DeliveryZones
                    data={pointLivraison}
                    libelle="Selectionnez le lieu de la livraison"
                    // Pour afficher le nom et le prix de la boisson puisque c'est un composant générique
                    keys={["idPointLivraison", "adressePointLivraison", "prixPointLivraison", "zone"]}
                    containerClassname=""
                    error={""}
                    onChange={(e: IPointLivraison) => {
                      console.log("🚀 ~ e<<<<<<<<<<<<<<<<<<<:", e)
                      dispatch(setCart({ ...cart, commande: { ...cart.commande, ...e } }))
                      dispatch(setUserConnectedInfo({ ...userConnectedInfo, ...e }))
                      // setErrorMessage(e.idPointLivraison === 0 ? "Veuillez séléctionner le lieu de la livraison." : "")
                    }}
                    selectContainerClassname="rounded-2xl"
                    valueSelected={pointLivraisonClient || initialisePointAdresseSelectionne}
                  />
                  {formErrors["idPointLivraison"] && <label className="text-red-500 text-sm">{formErrors["idPointLivraison"]}</label>}
                </div>

                <div >
                  <Label>Plus de précision sur le lieu de la livraison (zone et rue)</Label>
                  <div className="mt-1.5 flex flex-col">
                    {/* <span className="inline-flex items-center px-2.5 rounded-l-2xl border border-r-0 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
                      <i className="text-2xl las la-user"></i>
                    </span> */}
                    <Input
                      onChange={handleInputChange}
                      name="rueDeLaLivraison"
                      value={formData?.rueDeLaLivraison}
                    // className=""
                    />
                    {formErrors["rueDeLaLivraison"] && <label className="text-red-600 text-xs mt-1">{formErrors["rueDeLaLivraison"]}</label>}
                  </div>
                </div>

                <div className="pt-2">
                  <CustomButton onClick={() => updateClient()} loading={loadingUpdateClient} title="Enregistrer" />
                </div>
              </div>
            </div>
          </div>
        </CommonLayout>
      </div>
    </Suspense>

  );
};

export default CompteClient;

import React, { Suspense, useState } from "react";
import { useSelector } from "react-redux";
import { IReduxState } from "../../store/store";
import { apiClient } from "../../utils/apiClient";
import DisplayNotification from "../components/DisplayNotification";
import PageLoader from "./PageLoader";
// Chargement dynamique des composants
const CommonLayout = React.lazy(() => import("../components/CommonLayout"));
const Input = React.lazy(() => import("../components/Input"));
const Label = React.lazy(() => import("../components/Label"));
const CustomButton = React.lazy(() => import("../components/CustomButton"));

const ChangePassword = () => {

  // Redux
  const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);

  // Hooks
  const initialiseFormData = { oldPassword: "", newPassword: "", confirmPassword: "" }
  const [formData, setFormData] = useState(initialiseFormData)
  const [loadingUpdatePassword, setLoadingUpdatePassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>("");


  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const updatePassword = async () => {
    try {
      // signUpSchema.parse(formData)
      // setFormErrors({})
      setErrorMessage("");
      // modiferMotDePasseSchemaSchema.parse
      if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
        setErrorMessage("Tous les champs sont obligatoires.");
        return;
    }
      if (formData.newPassword !== formData.confirmPassword) {
        setErrorMessage("Le mots de passe et la confirmation ne correspondent pas.");
        return;
      }
      setLoadingUpdatePassword(true);
      const res = await apiClient.post(`/update_password`, { ...formData, clientId: userConnectedInfo?.clientId, emailOrnomUtilisateur: userConnectedInfo?.nomUtilisateurClient });
      if (!res?.status) throw res?.error
      setFormData(initialiseFormData)
      DisplayNotification({ libelle: "Mot de passe modifié avec succès !", type: "success" })
    } catch (error: any) {
      console.log("🚀 ~ updatePassword ~ error:", error)
      if (error?.name === "USER_NOT_EXIST") return DisplayNotification({ libelle: "L'ancien mot de passe n'est pas correcte !", type: "error" })
      DisplayNotification({ libelle: error?.message, type: "error" })
    } finally {
      setLoadingUpdatePassword(false);
    }
  }


  return (
    <Suspense fallback={<PageLoader />}>
      <div>
        <CommonLayout>
          <div className="space-y-10 sm:space-y-12">
            {/* HEADING */}
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Modifie ton mot de passe
            </h2>
            <div className=" max-w-xl space-y-6">
              <div>
                <Label>Ancien mot de passe</Label>
                <Input type="password" onChange={handleInputChange} name="oldPassword" value={formData.oldPassword} className="mt-1.5" />
              </div>
              <div>
                <Label>Nouveau mot de passe</Label>
                <Input type="password" onChange={handleInputChange} name="newPassword" value={formData.newPassword} className="mt-1.5" />
              </div>
              <div>
                <Label>Confirmation de mot de passe</Label>
                <Input type="password" onChange={handleInputChange} name="confirmPassword" value={formData.confirmPassword} className="mt-1.5" />
              </div>
              {errorMessage && (
                <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 mb-4">
                  {errorMessage}
                </div>
              )}
              <div className="pt-2">
                <CustomButton onClick={() => updatePassword()} loading={loadingUpdatePassword} title="Modifier" />
              </div>
            </div>
          </div>
        </CommonLayout>
      </div>
    </Suspense>

  );
};

export default ChangePassword;

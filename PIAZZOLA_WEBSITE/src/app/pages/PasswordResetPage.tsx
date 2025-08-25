import React, { Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../../utils/apiClient";
import PageLoader from "./PageLoader";
import DisplayNotification from "../components/DisplayNotification";
// Chargement dynamique des composants
const CustomButton = React.lazy(() => import("../components/CustomButton"));
const Input = React.lazy(() => import("../components/Input"));

const PasswordResetPage: React.FC = () => {
    const navigate = useNavigate();

    // const [newPassword, setNewPassword] = useState<string>("");
    // const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [formData, setFormData] = useState({ nouveauMotDePasse: "", confirmationMotDePasse: "" })
    // const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    // const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)
    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const modifierMotDePasse = async (e: any) => {
        e.preventDefault();
        setErrorMessage("");
        // modiferMotDePasseSchemaSchema.parse
        if (!formData.nouveauMotDePasse || !formData.confirmationMotDePasse) {
            setErrorMessage("Veuillez remplir tous les champs.");
            return;
        }
        if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
            setErrorMessage("Le mots de passe et la confirmation ne correspondent pas.");
            return;
        }

        try {
            setLoading(true)
            // Supposons que tu as un token dans l'URL ou dans un autre état
            const token = new URLSearchParams(window.location.search).get("token");
            if (!token) return setErrorMessage("Token invalide ou manquant.");
            const res = await apiClient.post(`/reinitialisermotdepasse`, { token, newPassword: formData.nouveauMotDePasse });
            if (!res?.status) throw res?.error
            navigate("/authentification"); // Rediriger vers la page de connexion
            DisplayNotification({ libelle: "Mot de passe modifié avec succès !", type: "error" })

        } catch (error) {
            setErrorMessage("Une erreur est survenue. Veuillez réessayer.");
            console.error(error);
            DisplayNotification({ libelle: "Erreur lors de la modification du mot de passe !", type: "error" })
        } finally {
            setLoading(false)
        }
    };

    return (
        <Suspense fallback={<PageLoader />}>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                    <h2 className="text-2xl font-bold mb-6 text-center">Modifier votre mot de passe</h2>

                    {errorMessage && (
                        <div className="bg-red-100 text-red-700 border-l-4 border-red-500 p-4 mb-4">
                            {errorMessage}
                        </div>
                    )}

                    <form className="grid grid-cols-1 gap-6" onSubmit={modifierMotDePasse}>
                        <label className="block">
                            <span className="text-neutral-800 dark:text-neutral-200">
                                Nouveau mot de passe
                            </span>
                            <Input
                                type="password"
                                name="nouveauMotDePasse"
                                className="mt-1"
                                onChange={handleChangeInput}
                                required
                            />
                        </label>
                        <label className="block">
                            <span className="flex justify-between items-center text-neutral-800 dark:text-neutral-200">
                                Ancien mot depasse
                            </span>
                            <Input
                                name="confirmationMotDePasse"
                                type="password"
                                className="mt-1"
                                onChange={handleChangeInput}
                                required
                            />
                        </label>
                        <CustomButton
                            title="Modifiez"
                            onClick={modifierMotDePasse}
                            loading={loading}
                            classname="rounded-full"

                        />
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-600">
                            <Link to="/authentification" >
                                Retour à la connexion
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default PasswordResetPage;

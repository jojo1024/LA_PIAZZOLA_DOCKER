import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React, { FC, Suspense, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUserConnectedInfo, setUserLogged } from "../../store/appSlice";
import { IClient } from "../../store/interfaces";
import { signUpSchema } from "../../store/schemas";
import { IReduxState } from "../../store/store";
import { apiClient } from "../../utils/apiClient";
import { extractZodErrors } from "../../utils/functions";
import aboutUs from "/user_pizza2.webp";
import { setSInscritAuProgrammeDeFidelite } from "../../store/menuSlice";
import DisplayNotification from "../components/DisplayNotification";
import PageLoader from "./PageLoader";
// Chargement dynamique des composants
const CustomButton = React.lazy(() => import("../components/CustomButton"));
const CustomHeading = React.lazy(() => import("../components/CustomHeading"));
const CustomHelmet = React.lazy(() => import("../components/CustomHelmet"));
const CustomInput = React.lazy(() => import("../components/CustomInput"));
const CustomModal = React.lazy(() => import("../components/CustomModal"));
const NcImage = React.lazy(() => import("../components/NcImage/NcImage"));
const PhoneInputComponent = React.lazy(() => import("../components/PhoneInputComponent"));

export interface SignUpProps {
  className?: string;
}

interface IFormData {
  nomUtilisateurClient: string;
  emailClient: string;
  telephoneClient: string;
  motDePasseClient: string;
}

const SignUp: FC<SignUpProps> = ({ className = "" }) => {

  // Redux
  const dispatch = useDispatch();
  const cart = useSelector((state: IReduxState) => state.cart.cart);
  const sInscritAuProgrammeDeFidelite = useSelector((state: IReduxState) => state.menu.sInscritAuProgrammeDeFidelite);

  // Hooks
  const [formData, setFormData] = useState<IFormData>({ nomUtilisateurClient: "", emailClient: "", telephoneClient: "", motDePasseClient: "" })
  const [loadingCreateClient, setLoadingCreateClient] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  console.log("🚀 ~ formErrors:", formErrors)
  const [showModalCreateClient, setShowModalCreateClient] = useState(false)
  const [codeConfirmation, setCodeConfirmation] = useState("")
  console.log("🚀 ~ codeConfirmation:", codeConfirmation)
  const [openModalConfirmation, setOpenModalConfirmation] = useState(false)
  const navigate = useNavigate()
  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }


  const insertClient = async (/* e: React.FormEvent<HTMLFormElement> */) => {
    // e.preventDefault();
    try {
      signUpSchema.parse(formData)
      setFormErrors({})
      setLoadingCreateClient(true);
      const res = await apiClient.post(`/insert_client`, { data: formData, sInscritAuProgrammeDeFidelite });
      if (!res?.status) throw res?.error
      const data = res.data as IClient
      dispatch(setUserConnectedInfo(data))
      dispatch(setUserLogged(true))
      setFormData({ nomUtilisateurClient: "", emailClient: "", telephoneClient: "", motDePasseClient: "" })
      // Rédiriger vers la page panier si si le panier contient quelque chose sinon menu
      cart.commandeDetails.length ? navigate("/panier", { replace: true }) : navigate("/menu", { replace: true })
      DisplayNotification({ libelle: `Utilisateur enregistré avec succès !, ${sInscritAuProgrammeDeFidelite ? "vous êtes desormais inscris au programme de fidélité" : ""}`, type: "success", time:3000 })
      dispatch(setSInscritAuProgrammeDeFidelite(false))
    } catch (error: any) {
      console.log("🚀 ~ insertClient ~ error:", error)
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      // On affiche pas les erreurs de zod dans la notification
      !error?.errors && DisplayNotification({ libelle: error?.message, type: "error" })
    } finally {
      setLoadingCreateClient(false);
    }
  }

  const verificationCodeConfirmationEtInsertionClient = async () => {
    try {
      signUpSchema.parse(formData)
      setFormErrors({})
      setLoadingCreateClient(true);

      const res = await apiClient.post(`/verifiercodeajoutclient`, { data: formData, codeConfirmation, sInscritAuProgrammeDeFidelite });
      if (!res?.status) throw res?.error
      const data = res.data as IClient
      console.log("🚀 ~ verificationCodeConfirmationEtInsertionClient ~ data:", data)
      dispatch(setUserConnectedInfo(data))
      dispatch(setUserLogged(true))
      setFormData({ nomUtilisateurClient: "", emailClient: "", telephoneClient: "", motDePasseClient: "" })
      // Rédiriger vers la page panier si si le panier contient quelque chose sinon menu
      cart.commandeDetails.length ? navigate("/panier", { replace: true }) : navigate("/menu", { replace: true })
      DisplayNotification({ libelle: `Utilisateur enregistré avec succès !, ${sInscritAuProgrammeDeFidelite ? "vous êtes desormais inscris au programme de fidélité" : ""}`, type: "success" })
    } catch (error: any) {
      console.log("🚀 ~ insertClient ~ error:", error)
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      // On affiche pas les erreurs de zod dans la notification
      !error?.errors && DisplayNotification({ libelle: error?.message, type: "error" })
    } finally {
      setLoadingCreateClient(false);
    }
  }

  const envoyerCodeConfirmationParMail = async () => {
    try {
      setLoadingCreateClient(true)
      const res = await apiClient.post(`/envoyercodeconfirmation`, formData);
      if (!res?.status) throw res?.error
      setOpenModalConfirmation(true)
      setCodeConfirmation("")
      DisplayNotification({ libelle: "Un code de vérification vous a été envoyé par mail", type: "info" })
    } catch (error) {
      console.log("🚀 ~ envoyerCodeConfirmationParMail ~ error:", error)
    } finally {
      setLoadingCreateClient(false)
    }
  }

  const checkInputFullFilled = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      signUpSchema.parse(formData)
      setFormErrors({})
      envoyerCodeConfirmationParMail()
    } catch (error) {
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs

    }
  }
  /**
 * Lorsque client s'authentifie avec avec google, on récupère son email puis on va vérifier s'il existe
 * dans la bd pour l'authentifer ou l'amener à créer un compte
 * @param name 
 * @param email 
 * @returns 
 */
  const authenfierClientParEmail = async (name: string, email: string) => {
    try {
      const res = await apiClient.post(`/authentificate_client_by_email`, {email, sInscritAuProgrammeDeFidelite});
      if (!res?.status) throw res?.error
      const data = res.data as IClient | null
      if (data) {
        dispatch(setUserConnectedInfo(data))
        dispatch(setUserLogged(true))
        // Rédiriger vers la page panier si si le panier contient quelque chose sinon menu
        cart.commandeDetails.length ? navigate("/panier", { replace: true }) : navigate("/", { replace: true })
        DisplayNotification({ libelle: `Utilisateur authentifié avec succès !, ${sInscritAuProgrammeDeFidelite ? "vous êtes desormais inscris au programme de fidélité" : ""}`, type: "success" })
        return
      }
      setShowModalCreateClient(true)
      setFormData({ nomUtilisateurClient: name, emailClient: email, motDePasseClient: "", telephoneClient: "" })
    } catch (error) {
      console.log("🚀 ~ authenfierClientParEmail ~ error:", error)
    }
  }

  /**
   * Lorsque le client est authentifié, google ramène les informations de l'utiliseur
   * crypté, on doit le decrypter et aller vérfier dans la base si l'email existe
   * @param response
   */
  const handleSuccess = (response: CredentialResponse) => {
    // Récupérer le token JWT
    const token = response.credential || "";
    // Décoder le JWT pour obtenir les données utilisateur
    const decodedData: any = jwtDecode(token);
    const { name, email } = decodedData
    authenfierClientParEmail(name, email)
  };

  // En cas d'erreur lors
  const handleError = () => {
    console.error('Erreur lors de la connexion.');
    DisplayNotification({ libelle: "Erreur lors de la connexion.", type: "error" })
  };


  return (
    <Suspense fallback={<PageLoader />}>
      <div className={`nc-SignUp z-10 relative overflow-hidden ${className}`} data-nc-id="SignUp">
        <CustomHelmet title="S'inscrire || La vraie pizza authentique" />
        <div className="container my-20">
          <CustomHeading title={"S'inscrire"} classname='mb-6 text-left' />
          <div className="border-[0.2px] border-slate-300 mb-12"></div>
          <div className="grid grid-cols-12 gap-4">

            <div className="col-span-12 md:col-span-8">
              <form onSubmit={checkInputFullFilled}>
                <div className="grid grid-cols-12 gap-6" >
                  <div className="col-span-12 md:col-span-6">
                    {/* NOM UTILISATEUR */}
                    <CustomInput
                      label="Nom utilisateur"
                      name="nomUtilisateurClient"
                      value={formData.nomUtilisateurClient}
                      onChange={handleInputChange}
                      required={true}
                      error={formErrors["nomUtilisateurClient"]}
                      placeholder="Ousmane"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    {/* EMAIL */}
                    <CustomInput
                      label="Email"
                      name="emailClient"
                      value={formData.emailClient}
                      onChange={handleInputChange}
                      required={true}
                      error={formErrors["emailClient"]}
                      placeholder="exemple@gmail.com"
                    />
                  </div>
                  <div className="col-span-12 md:col-span-6">
                    {/* MOT DE PASSE */}
                    <CustomInput
                      label="Mot de passe"
                      name="motDePasseClient"
                      value={formData.motDePasseClient}
                      onChange={handleInputChange}
                      required={true}
                      error={formErrors["motDePasseClient"]}
                      type="password"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-6">
                    {/* NUMERO DE TELEPHONE */}
                    <PhoneInputComponent
                      label="Numero de tél"
                      required={true}
                      value={formData.telephoneClient}
                      onChange={(e) => setFormData(prev => ({ ...prev, telephoneClient: e }))}
                      error={formErrors["telephoneClient"]}
                    />
                  </div>
                  {/* BOUTON D ENREGISTREMENT */}
                  <div className="col-span-12 flex justify-center mt-4">
                    <CustomButton onClick={checkInputFullFilled} loading={loadingCreateClient} title="S'inscrire" width="w-full" />
                  </div>
                </div>
              </form>
              {/* Section vous avez deja un compte */}
              <div className="flex flex-col sm:flex-row mt-4  text-[15px]">
                <Link to={""} className="text-red-600 mr-auto cursor-pointer">.</Link>
                <div className="sm:ml-auto">Vous avez déjà un compte ? <Link to={"/authentification"} className="text-red-600 cursor-pointer">Connectez-vous ici</Link></div>
              </div>
              <div className="text-center my-4">Ou</div>
              {/* BOUTON GOOGLE POUR S AUTHENTIFIER */}
              <div className="flex  justify-center ">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </div>
            </div>
            {/* Image décoratif */}
            <div className="col-span-12 md:col-span-4 z-10 left-44">
              <NcImage
                className="flex-shrink-0"
                src={aboutUs}
                alt={"image d'une persoone souriante"}
              />
            </div>
            <div className="absolute  z-0 left-[1250px] top-44 h-[600px] w-[600px] rounded-full bg-red-600 "></div>

          </div>
        </div>

        {/* Modal confirmation de compte */}
        <CustomModal
          modalTitle="Confirmez qu'il s'agit bien de votre compte"
          onButtonCancelClick={() => {
            setOpenModalConfirmation(false);
            setCodeConfirmation("")
          }}
          onButtonConfirmClick={() => verificationCodeConfirmationEtInsertionClient()}
          onCloseModal={() => {
            setOpenModalConfirmation(false);
            setCodeConfirmation("")
          }}
          showModal={openModalConfirmation}
          loading={loadingCreateClient}
          disabledConfirmButton={codeConfirmation.length === 0}
          content={
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12 text-sm text-slate-400'>{`Un code de vérification vous a été envoyé sur votre compte mail: ${formData?.emailClient}`}</div>
              <div className="col-span-12 ">
                <CustomInput
                  label="Saisissez le code de vérification"
                  name="codeConfirmation"
                  value={codeConfirmation}
                  onChange={(e: any) => setCodeConfirmation(e.target.value)}
                  required={true}
                  error={formErrors["codeConfirmation"]}
                  type="password"
                />
              </div>
            </div>
          }
        />

        {/* Modal création utilisateur */}
        <CustomModal
          modalTitle="Création compte utilisateur"
          onButtonCancelClick={() => setShowModalCreateClient(false)}
          onButtonConfirmClick={() => insertClient()}
          onCloseModal={() => setShowModalCreateClient(false)}
          showModal={showModalCreateClient}
          loading={loadingCreateClient}
          content={
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12 text-sm text-slate-400'>Veuillez completer ces données pour terminer la création de votre compte</div>
              <div className="col-span-12 ">
                <PhoneInputComponent
                  label="Numero de tél"
                  required={true}
                  value={formData.telephoneClient}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephoneClient: e }))}
                  error={formErrors["telephoneClient"]}

                // onChange={(e) => setFormData(prev => ({ ...prev, telephoneClient: e }))
                />
              </div>
              <div className="col-span-12 ">
                <CustomInput
                  label="Mot de passe"
                  name="motDePasseClient"
                  value={formData.motDePasseClient}
                  onChange={handleInputChange}
                  required={true}
                  error={formErrors["motDePasseClient"]}
                  type="password"
                />
              </div>
            </div>
          }
        />
      </div>
    </Suspense>
  );
};

export default SignUp;

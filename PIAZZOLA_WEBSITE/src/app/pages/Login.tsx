import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { FC, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setUserConnectedInfo, setUserLogged } from "../../store/appSlice";
import { IClient } from "../../store/interfaces";
import { emailClientSchema, loginSchema, signUpSchema } from "../../store/schemas";
import { IReduxState } from "../../store/store";
import { apiClient } from "../../utils/apiClient";
import { setSInscritAuProgrammeDeFidelite } from '../../store/menuSlice';
import { extractZodErrors } from "../../utils/functions";
import aboutUs from "/user_pizza.webp";
import React, { Suspense } from 'react';
import DisplayNotification from '../components/DisplayNotification';
import PageLoader from './PageLoader';
import { InfoBulle } from '../../utils/svg';

// Chargement dynamique des composants
const CustomButton = React.lazy(() => import('../components/CustomButton'));
const CustomHeading = React.lazy(() => import('../components/CustomHeading'));
const CustomHelmet = React.lazy(() => import('../components/CustomHelmet'));
const CustomInput = React.lazy(() => import('../components/CustomInput'));
const CustomModal = React.lazy(() => import('../components/CustomModal'));
const NcImage = React.lazy(() => import('../components/NcImage/NcImage'));
const PhoneInputComponent = React.lazy(() => import('../components/PhoneInputComponent'));


export interface LoginProps {
  className?: string;
}



const Login: FC<LoginProps> = ({ className = "" }) => {

  // Redux
  const dispatch = useDispatch();
  const cart = useSelector((state: IReduxState) => state.cart.cart);
  const sInscritAuProgrammeDeFidelite = useSelector((state: IReduxState) => state.menu.sInscritAuProgrammeDeFidelite);

  // Hooks
  const [formData, setFormData] = useState({ nomUtilisateurClient: "", emailOrnomUtilisateur: "", motDePasseClient: "", telephoneClient: "" })
  const [loadingAuthentificate, setLoadingAuthentificate] = useState(false)
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<any>({})
  const [showModalCreateClient, setShowModalCreateClient] = useState(false)
  const [loadingCreateClient, setLoadingCreateClient] = useState(false)
  const [openModalMDPOublie, setOpenModalMDPOublie] = useState(false)
  const [emailClientMDPOublie, setEmailClientMDPOublie] = useState("")

  const handleInputChange = (e: any) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  /**
   * Authentifier le client par email ou mot de passe 
   */
  const authentificateClient = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault()
      loginSchema.parse({ emailOrnomUtilisateur: formData.emailOrnomUtilisateur, motDePasseClient: formData.motDePasseClient })
      setFormErrors({})
      setLoadingAuthentificate(true);
      const res = await apiClient.post(`/authentificate_client`, { ...formData, sInscritAuProgrammeDeFidelite });
      console.log("🚀 ~ authentificateClient ~ res:", res)
      if (!res?.status) throw res?.error
      const data = res.data as IClient
      dispatch(setUserConnectedInfo(data))
      dispatch(setUserLogged(true))
      setFormData({ nomUtilisateurClient: "", emailOrnomUtilisateur: "", motDePasseClient: "", telephoneClient: "" })
      cart.commandeDetails.length ? navigate("/panier", { replace: true }) : navigate("/", { replace: true })
      DisplayNotification({ libelle: `Utilisateur authentifié avec succès !, ${sInscritAuProgrammeDeFidelite ? "vous êtes desormais inscris au programme de fidélité" : ""}`, type: "success", time: 3000 })
      dispatch(setSInscritAuProgrammeDeFidelite(false))
    } catch (error: any) {
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      // On affiche pas les erreurs de zod dans la notification
      !error?.errors && DisplayNotification({ libelle: error?.message, type: "error" })
      console.log("🚀 ~ insertClient ~ error:", error)
    } finally {
      setLoadingAuthentificate(false);

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
      const res = await apiClient.post(`/authentificate_client_by_email`, { email, sInscritAuProgrammeDeFidelite });
      if (!res?.status) throw res?.error
      const data = res.data as IClient | null
      // Si l'utilisateur existe déja, on se connecte
      if (data) {
        dispatch(setUserConnectedInfo(data))
        dispatch(setUserLogged(true))
        // Rédiriger vers la page panier si si le panier contient quelque chose sinon menu
        cart.commandeDetails.length ? navigate("/panier", { replace: true }) : navigate("/menu", { replace: true })
        DisplayNotification({ libelle: `Utilisateur authentifié avec succès !, ${sInscritAuProgrammeDeFidelite ? "vous êtes desormais inscris au programme de fidélité" : ""}`, type: "success", time: 3000 })
        return
      }
      //Sinon on ouvre le modal ou on demande son numéro et son mot de passe
      setShowModalCreateClient(true)
      setFormData({ nomUtilisateurClient: name, emailOrnomUtilisateur: email, motDePasseClient: "", telephoneClient: "" })
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

  /**
   * Lorsque l'utiliateur s'authenfie par google et que le compte n'existe pas dans la base,
   * on lui demande de créer un compte
   */
  const insertClient = async () => {
    // e.preventDefault();
    try {
      const payload = { emailClient: formData.emailOrnomUtilisateur, nomUtilisateurClient: formData.nomUtilisateurClient, motDePasseClient: formData.motDePasseClient, telephoneClient: formData.telephoneClient }
      signUpSchema.parse(payload)
      setFormErrors({})
      console.log("🚀 ~ insertClient ~ setFormErrors:",)
      setLoadingCreateClient(true);
      const res = await apiClient.post(`/insert_client`, { data: payload, sInscritAuProgrammeDeFidelite });
      if (!res?.status) throw res?.error
      const data = res.data as IClient
      dispatch(setUserConnectedInfo(data))
      dispatch(setUserLogged(true))
      setFormData({ nomUtilisateurClient: "", emailOrnomUtilisateur: "", telephoneClient: "", motDePasseClient: "" })
      cart.commandeDetails.length ? navigate("/panier", { replace: true }) : navigate("/menu", { replace: true })
      DisplayNotification({ libelle: `Utilisateur enregistré avec succès !, ${sInscritAuProgrammeDeFidelite ? "vous êtes desormais inscris au programme de fidélité" : ""}`, type: "success", time: 2000 })
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

  const envoyerMotDePasseOublie = async () => {
    try {
      const payload = { emailClientMDPOublie }
      emailClientSchema.parse(payload)
      setFormErrors({})
      setLoadingCreateClient(true);
      const res = await apiClient.post(`/envoyeremailauclient`, payload);
      if (!res?.status) throw res?.error
      setEmailClientMDPOublie("")
      DisplayNotification({ libelle: "Un email contenant votre code a été envoyé à votre adresse mail !", type: "success" })
    } catch (error: any) {
      console.log("🚀 ~ envoyerMotDePasseOublie ~ error:", error)
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      !error?.errors && DisplayNotification({ libelle: error?.message, type: "error" })
    } finally {
      setLoadingCreateClient(false);
      setOpenModalMDPOublie(false)
    }
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <div className={`nc-Login ${className}`} data-nc-id="Login">
        <CustomHelmet title="Se connecter || La vraie pizza authentique" />
        <div className="container my-20">
          <CustomHeading title={"Connectez vous"} classname='mb-6 text-left' />
          <div className="border-[0.2px] border-slate-300 mb-12"></div>
          <div className="grid grid-cols-12 gap-4">

            <div className="col-span-12 md:col-span-8">
              <form onSubmit={authentificateClient}>
                <div className="grid grid-cols-12 gap-4" >
                  <div className="col-span-12 md:col-span-6">
                    {/* EMAIL OU NOM UTILISATEUR */}
                    <CustomInput
                      label="Nom utilisateur ou email"
                      name="emailOrnomUtilisateur"
                      value={formData.emailOrnomUtilisateur}
                      onChange={handleInputChange}
                      required={true}
                      error={formErrors["emailOrnomUtilisateur"]}
                      placeholder="Ousmane ou @gmail.com"

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
                  {/* <div className="col-span-12 text-red-600 text-xs">{errorMessage}</div> */}
                  <div className="col-span-12 flex justify-center mt-6">
                    <CustomButton loading={loadingAuthentificate} onClick={authentificateClient} title="Connexion" width="w-full" />
                  </div>
                </div>
              </form>
              {/* Section mot de passe oublié et pas de compte */}
              <div className="flex flex-col sm:flex-row my-4  text-[15px]">
                <div onClick={() => setOpenModalMDPOublie(true)} className="text-red-600 mr-auto cursor-pointer">Mot de passe oublié ?</div>
                <div className="sm:ml-auto">Vous n'avez pas de compte ? <Link to={"/enregistrement"} className="text-red-600 cursor-pointer">Inscrivez vous ici</Link></div>
              </div>
              <div className="text-center my-4">Ou</div>
              {/* BOUTON GOOGLE POUR S AUTHENTIFIER */}
              <div className="flex  justify-center ">
                <GoogleLogin
                  onSuccess={handleSuccess}
                  onError={handleError}
                  size='large'
                />
              </div>
            </div>
            {/* Image décoratif */}
            <div className="col-span-12 md:col-span-4">
              <NcImage
                className="flex-shrink-0"
                src={aboutUs}
                alt={"image d'une persoone souriante"}
              />
            </div>
          </div>
        </div>

        {/* Modal confirmation de compte */}
        <CustomModal
          modalTitle="Entrez votre email"
          libelleConfirmButton='Envoyez'
          onButtonCancelClick={() => {
            setOpenModalMDPOublie(false);
            setEmailClientMDPOublie("")
          }}
          onButtonConfirmClick={() => envoyerMotDePasseOublie()}
          onCloseModal={() => {
            setShowModalCreateClient(false);
            setEmailClientMDPOublie("")
          }}
          showModal={openModalMDPOublie}
          loading={loadingCreateClient}
          disabledConfirmButton={emailClientMDPOublie.length === 0}
          content={
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-12 text-sm text-slate-400'>{`Saisissez l'email avec lequel vous avez crée le compte`}</div>
              <div className="col-span-12 ">
                <CustomInput
                  label="Saisissez votre email"
                  name="emailClientMDPOublie"
                  value={emailClientMDPOublie}
                  onChange={(e: any) => setEmailClientMDPOublie(e.target.value)}
                  required={true}
                  error={formErrors["emailClientMDPOublie"]}
                  type="email"
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
              <div className='col-span-12 text-slate-500 '>Ce compte n'existe pas, veuillez renseigner votre numero et un mot de passe pour vous enregistrer.</div>
              <div className="col-span-12 ">
                <PhoneInputComponent
                  label="Numero de tél"
                  required={true}
                  value={formData.telephoneClient}
                  onChange={(e) => setFormData(prev => ({ ...prev, telephoneClient: e }))}
                  error={formErrors["telephoneClient"]}
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
                <label className=' text-sm relative text-slate-400 pl-3'><InfoBulle />Necessaire si vous voulez vous connecter manuellement la prochaine fois.</label>
              </div>
            </div>
          }
        />

      </div>
    </Suspense>

  );
};

export default Login;

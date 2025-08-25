import React, { Suspense, useEffect, useState } from "react";
import { apiClient } from "../../utils/apiClient";
import { extractZodErrors } from "../../utils/functions";
import { z } from "zod";
import DisplayNotification from "../components/DisplayNotification"
import PageLoader from "./PageLoader";

// Lazy-loaded components
const Input = React.lazy(() => import("../components/Input"));
const Label = React.lazy(() => import("../components/Label"));
const SectionSocial = React.lazy(() => import("../components/SectionSocial"));
const SocialsList = React.lazy(() => import("../components/SocialsList"));
const Textarea = React.lazy(() => import("../components/Textarea"));
const CustomButton = React.lazy(() => import("../components/CustomButton"));
const CustomHelmet = React.lazy(() => import("../components/CustomHelmet"));


export interface ContactInfo {
  name: string;
  email: string;
  message: string;
  subject: string;
}

const contactInfoSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Le nom est requis et ne peut pas être vide." }),
  email: z
    .string()
    .email({ message: "Veuillez entrer une adresse email valide." }),
  message: z
    .string()
    .min(1, { message: "Le message est requis et ne peut pas être vide." }),
  subject: z
    .string()
    .min(1, { message: "Le sujet est requis et ne peut pas être vide." }),
});

const initialiseContactFormData = { name: "", email: "", message: "", subject: "" }



interface IContactData {
  cle: string;
  data: Datum[];
}

interface Datum {
  title: string;
  bgColor: string;
  subTitle: string;
  iconColor: string
}

const Contact = () => {

  // Hooks
  const [contactFormData, setContactFormData] = useState<ContactInfo>(initialiseContactFormData);
  const [loading, setLoading] = useState(false)
  const [formErrors, setFormErrors] = useState<any>({})
  const [contactData, setContactData] = useState<IContactData>(
    {
      cle: "contact", data: [
        {
          bgColor: "bg-red-600",
          title: "Emplacement",
          subTitle: "Villa 85 rue MZ-165 , mermoz Dakar sénégal",
          iconColor: "white"
        },
        {
          bgColor: "bg-black",
          title: "Téléphone",
          subTitle: "+221 77 424 30 50",
          iconColor: "white"
        },
        {
          bgColor: "bg-white",
          title: "E-mail",
          subTitle: "contact@la-piazzola.com",
          iconColor: "black"
        },

      ]
    })

  const recupContact = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get(`/recup_infosup/contact`);
      if (!res?.status) throw res?.error
      const data = res?.data as IContactData
      console.log("🚀 ~ recupContact ~ data:", data)
      setContactData(data)
    } catch (error:any) {
      console.log("🚀 ~ recupClientPointFidelite ~ error:", error)
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      // On affiche pas les erreurs de zod dans la notification
      !error?.errors && DisplayNotification({ libelle: error?.message, type: "error" })

    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    recupContact();
    window.scrollTo(0, 0); // Fait défiler la page vers le haut
  }, [])

  const handleChangeInput = (e: any) => {
    const { name, value } = e.target
    setContactFormData(prev => ({ ...prev, [name]: value }));
  }
  
  const envoyerMail = async () => {
    try {
      contactInfoSchema.parse(contactFormData)
      setFormErrors({})
      setLoading(true)
      await apiClient.post("/envoyer_mail", contactFormData)
      DisplayNotification({ libelle: "Email envoyé avec succès !", type: "success" })
      setContactFormData(initialiseContactFormData)
    } catch (error:any) {
      const zodErrors = extractZodErrors(error);
      setFormErrors(zodErrors); // Met à jour l'état avec les erreurs
      !error?.errors && DisplayNotification({ libelle: "L'e-mail n'a pas pu être envoyé !", type: "error" })
      console.log("🚀 ~ addPizzaToCart ~ error:", error)
    }
    finally {
      setLoading(false)
    }
  }



  return (
    <Suspense fallback={<PageLoader />}>
      <div
        className={`nc-PageContact overflow-hidden`}
        data-nc-id="PageContact"
      >

        <CustomHelmet title='Contact || Piazzola la vraie pizza authentique' />
        <div className="">
          <div className="container max-w-7xl mx-auto">
            <div className="mt-20 mb-10">

              <h2 style={{ fontFamily: "Pacifico" }} className="flex  text-3xl leading-[115%] md:text-5xl md:leading-[115%]  ">
                Entrez en contact
              </h2>
              <div>
                <span className="block mt-2 text-neutral-400 text-base dark:text-neutral-400">
                  Comment pouvons nous vous aider ?
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 gap-4 ">
              <div className="max-w-sm space-y-8">
                {contactData.data.map((item, index) => (
                  <div key={index} className="flex">
                    <div className={`flex h-[65px] w-[65px] shadow-xl mr-2 rounded-md items-center justify-center  ${item.bgColor}`}>
                      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M21.0122 6.23061C21.4501 6.23067 21.8728 6.39146 22.2001 6.68249C22.5274 6.97352 22.7365 7.37454 22.7877 7.8095L22.8002 8.0187V20.8751L35.2096 17.492C35.667 17.3677 36.155 17.4302 36.5664 17.6655C36.9778 17.9009 37.279 18.29 37.4036 18.7473C38.3385 22.1745 38.1753 25.8085 36.9371 29.1382C35.699 32.4678 33.4481 35.3255 30.5011 37.3092C27.5542 39.2929 24.0594 40.3028 20.5086 40.1968C16.9578 40.0908 13.5295 38.8743 10.7061 36.7183C7.88273 34.5624 5.80631 31.5755 4.76895 28.1779C3.7316 24.7803 3.78552 21.143 4.92314 17.7777C6.06075 14.4123 8.22481 11.4883 11.1109 9.41701C13.9969 7.34569 17.4597 6.2313 21.0122 6.23061ZM22.8002 25.8996C21.6147 25.8996 20.4776 26.3706 19.6393 27.2089C18.801 28.0473 18.33 29.1843 18.33 30.3699C18.33 31.5555 18.801 32.6925 19.6393 33.5308C20.4776 34.3691 21.6147 34.8401 22.8002 34.8401C23.9858 34.8401 25.1228 34.3691 25.9612 33.5308C26.7995 32.6925 27.2705 31.5555 27.2705 30.3699C27.2705 29.1843 26.7995 28.0473 25.9612 27.2089C25.1228 26.3706 23.9858 25.8996 22.8002 25.8996ZM22.8002 29.4758C23.0374 29.4758 23.2648 29.57 23.4324 29.7377C23.6001 29.9054 23.6943 30.1328 23.6943 30.3699C23.6943 30.607 23.6001 30.8344 23.4324 31.0021C23.2648 31.1697 23.0374 31.2639 22.8002 31.2639C22.5631 31.2639 22.3357 31.1697 22.1681 31.0021C22.0004 30.8344 21.9062 30.607 21.9062 30.3699C21.9062 30.1328 22.0004 29.9054 22.1681 29.7377C22.3357 29.57 22.5631 29.4758 22.8002 29.4758ZM30.8467 24.1116C30.4087 24.1116 29.986 24.2724 29.6587 24.5634C29.3314 24.8545 29.1223 25.2555 29.0711 25.6904L29.0586 25.9175C29.0591 26.3733 29.2336 26.8116 29.5465 27.143C29.8593 27.4744 30.2869 27.6739 30.7419 27.7006C31.1968 27.7273 31.6448 27.5792 31.9943 27.2867C32.3438 26.9942 32.5684 26.5793 32.6222 26.1267L32.6348 25.8996C32.6348 25.4254 32.4464 24.9706 32.111 24.6353C31.7757 24.2999 31.3209 24.1116 30.8467 24.1116ZM13.8598 22.3235C13.1484 22.3235 12.4662 22.606 11.9632 23.109C11.4602 23.612 11.1776 24.2942 11.1776 25.0056C11.1776 25.7169 11.4602 26.3992 11.9632 26.9022C12.4662 27.4052 13.1484 27.6877 13.8598 27.6877C14.5711 27.6877 15.2533 27.4052 15.7563 26.9022C16.2593 26.3992 16.5419 25.7169 16.5419 25.0056C16.5419 24.2942 16.2593 23.612 15.7563 23.109C15.2533 22.606 14.5711 22.3235 13.8598 22.3235ZM27.7962 4.52119C31.5757 5.68754 34.8311 8.13366 37.0031 11.4393C37.2574 11.8267 37.3515 12.2976 37.2654 12.7529C37.1793 13.2082 36.9199 13.6123 36.5417 13.8801L36.3612 13.9927L26.3335 19.425C26.0576 19.5744 25.7472 19.6487 25.4335 19.6402C25.1198 19.6317 24.8138 19.5409 24.5463 19.3767C24.2789 19.2125 24.0593 18.9808 23.9098 18.7049C23.7602 18.4291 23.6859 18.1187 23.6943 17.8049L23.7158 17.5814L25.5038 5.95882C25.5428 5.70507 25.636 5.4627 25.7771 5.24819C25.9181 5.03367 26.1037 4.85204 26.3212 4.71564C26.5387 4.57924 26.783 4.49127 27.0375 4.45772C27.292 4.42417 27.5508 4.44582 27.7962 4.52119ZM14.7538 15.1711C14.3159 15.1711 13.8931 15.3319 13.5659 15.623C13.2386 15.914 13.0295 16.315 12.9782 16.75L12.9657 16.9771C12.9662 17.4328 13.1407 17.8712 13.4536 18.2026C13.7665 18.534 14.1941 18.7334 14.649 18.7601C15.104 18.7868 15.552 18.6388 15.9015 18.3463C16.251 18.0537 16.4756 17.6388 16.5294 17.1863L16.5419 16.9592C16.5419 16.4849 16.3535 16.0301 16.0182 15.6948C15.6829 15.3595 15.2281 15.1711 14.7538 15.1711ZM28.6974 8.71248L27.798 14.5649L32.8171 11.8452C31.6603 10.5434 30.261 9.47932 28.6974 8.71248Z" fill={item.iconColor} />
                      </svg>
                    </div>
                    <div className="flex-col w-96">
                      <h3 style={{ fontFamily: "Pacifico" }} className=" text-2xl  dark:text-neutral-200 tracking-wider">
                        {item?.title}
                      </h3>
                      <span className="block mt-2 text-neutral-500 dark:text-neutral-400">
                        {item?.subTitle}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="flex">
                  <h3 className=" mr-4 font-semibold text-base dark:text-neutral-200 tracking-wider">
                    Réseaux sociaux
                  </h3>
                  <SocialsList />
                </div>
              </div>
              <div>
                <div className="grid grid-cols-12 gap-6" >
                  <div className="col-span-6">
                    <label className="block">
                      <Label>Nom</Label>
                      <Input
                        placeholder="Example Doe"
                        name="name"
                        value={contactFormData.name}
                        type="text"
                        className="mt-1"
                        onChange={handleChangeInput}
                      />
                    </label>
                    {formErrors["name"] && <p className="text-sm text-red-500 mt-1">{formErrors["name"]}</p>}
                  </div>
                  <div className="col-span-6">
                    <label className="block">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        name="email"
                        value={contactFormData.email}
                        placeholder="example@example.com"
                        className="mt-1"
                        onChange={handleChangeInput}
                      />
                    </label>
                    {formErrors["email"] && <p className="text-sm text-red-500 mt-1">{formErrors["email"]}</p>}
                  </div>
                  <div className="col-span-12">
                    <label className="block">
                      <Label>Sujet</Label>
                      <Input
                        type="text"
                        name="subject"
                        value={contactFormData?.subject}
                        placeholder="Assistance technique, Informations"
                        className="mt-1"
                        onChange={handleChangeInput}
                      />
                    </label>
                    {formErrors["subject"] && <p className="text-sm text-red-500 mt-1">{formErrors["subject"]}</p>}
                  </div>
                  <div className="col-span-12">
                    <label className="block">
                      <Label>Message</Label>
                      <Textarea name="message" value={contactFormData?.message} onChange={handleChangeInput} className="mt-1" rows={6} />
                    </label>
                    {formErrors["message"] && <p className="text-sm text-red-500 mt-1">{formErrors["message"]}</p>}
                  </div>
                  <div className="col-span-12 flex justify-center">
                    {/* <ButtonPrimary  type="submit">Envoyer</ButtonPrimary> */}
                    <CustomButton
                      loading={loading}
                      onClick={() => envoyerMail()}
                      title="Envoyer"
                      classname="w-52"
                    // className={`ttnc-ButtonPrimary w-52 rounded-lg disabled:bg-opacity-90 bg-black dark:bg-slate-100 hover:bg-slate-800 text-slate-50 dark:text-slate-800 shadow-xl`}

                    />
                  </div>
                </div>
              </div>
            </div>
          </div>


          <div className=" w-full  my-60 bg-neutral-100/70">
            <SectionSocial />
          </div>

        </div>

      </div>
    </Suspense>

  )
}

export default Contact
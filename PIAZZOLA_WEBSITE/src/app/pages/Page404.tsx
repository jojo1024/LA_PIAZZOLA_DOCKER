import React, { Suspense } from "react";
import I404Png from "/404.webp";
import PageLoader from "./PageLoader";
// Chargement dynamique des composants
const ButtonPrimary = React.lazy(() => import("../components/Button/ButtonPrimary"));
const CustomHelmet = React.lazy(() => import("../components/CustomHelmet"));
const NcImage = React.lazy(() => import("../components/NcImage/NcImage"));

const Page404: React.FC = () => (
  <Suspense fallback={<PageLoader />}>
    <div className="nc-Page404">
      <CustomHelmet title="404 || Piazzola, la vraie pizza authentique" />
      <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
        {/* HEADER */}
        <header className="text-center max-w-2xl mx-auto space-y-2">
          <NcImage src={I404Png} />
          <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
            LA PAGE QUE VOUS RECHERCHEZ N'EXISTE PAS.{" "}
          </span>
          <div className="pt-8">
            <ButtonPrimary href="/">Retourner à l'accueil</ButtonPrimary>
          </div>
        </header>
      </div>
    </div>
  </Suspense>
);

export default Page404;

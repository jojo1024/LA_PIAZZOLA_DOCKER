import React, { Suspense } from 'react';
import PageLoader from './PageLoader';
// Charger les composants dynamiquement
const SectionSocial = React.lazy(() => import("../components/SectionSocial"));
const SectionVideoContent = React.lazy(() =>
  import("../components/SectionVideoContent")
);
const ContenuVideo = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <div className="">
        <SectionVideoContent  title="Ceci est pour vous" />
        <div className=" w-full  my-60 bg-neutral-100/70">
          <SectionSocial />
        </div>
      </div>
    </Suspense>

  )
}

export default ContenuVideo
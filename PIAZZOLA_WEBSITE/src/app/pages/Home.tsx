import React, { Suspense, useEffect } from "react";
import { useSelector } from "react-redux";
import { IReduxState } from "../../store/store";
import { recupAllDataAboutPizza, recupClientPointFidelite } from "../../utils/functions";
import PageLoader from "./PageLoader";
// Import des composants de manière dynamique
const SectionBannerAndCategoriePizza = React.lazy(() =>
  import("../components/SectionBannerAndCategoriePizza")
);
const SectionBestChoice = React.lazy(() =>
  import("../components/SectionBestChoice")
);
const SectionLoyalty = React.lazy(() =>
  import("../components/SectionLoyalty")
);
const SectionOrderDelivery = React.lazy(() =>
  import("../components/SectionOrderDelivery")
);

const Home = () => {

  // Redux
  const userConnectedInfo = useSelector((state: IReduxState) => state.application.userConnectedInfo);
  console.log("🚀 ~ Home ~ userConnectedInfo:", userConnectedInfo)


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    recupAllDataAboutPizza();
    if (userConnectedInfo?.clientId) recupClientPointFidelite()
  }, [])

  return (
    <Suspense fallback={<PageLoader />}>
      <div className="nc-PageHome relative overflow-hidden">
        <SectionOrderDelivery />
        <SectionBannerAndCategoriePizza />
        <SectionBestChoice />
        <SectionLoyalty />
      </div>
    </Suspense>
  );
}

export default Home;

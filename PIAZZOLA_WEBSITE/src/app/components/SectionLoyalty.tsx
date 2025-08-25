import { useNavigate } from "react-router-dom"
import CustomButton from "./CustomButton"
import CustomHeading from "./CustomHeading"
import NcImage from "./NcImage/NcImage"
import fidelite_banniere from "/fidelite_banniere.webp"
const SectionLoyalty = () => {
  //hooks
  const navigate = useNavigate()
  return (
    <div className=" w-full  py-5 bg-neutral-100/70">
      <CustomHeading title='Créer un compte et profiter de' classname='mb-3' />
      <CustomHeading title='notre programme de fidelité' classname='mb-6 lg:mb-14' />
      {/* <LoyaltyCard /> */}
      <NcImage
        containerClassName=" w-full h-full "
        src={fidelite_banniere}
      />
      <div className="flex justify-center items-center w-full mt-6">
        <CustomButton onClick={() => navigate("/fidelite")} title="En savoir plus" />
      </div>
    </div>
  )
}

export default SectionLoyalty
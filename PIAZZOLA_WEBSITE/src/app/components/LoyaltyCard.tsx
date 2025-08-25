import carteFidelite from "/carte_fidelite.webp";
import { FC } from "react";
import NcImage from "./NcImage/NcImage";

export interface SectionPromo2Props {
  className?: string;
}

const LoyaltyCard: FC<SectionPromo2Props> = ({ className = "lg:pt-0" }) => {
  return (
    <div className={`nc-LoyaltyCard ${className}`}>
      <div className="relative flex flex-col lg:flex-row lg:justify-end bg-[#7A0808]  dark:bg-slate-800 rounded-2xl sm:rounded-[40px] p-4 pb-0 sm:p-5 sm:pb-0 lg:p-20">


        <div className="w-[100%] lg:w-2/3  text-center relative flex justify-center lg:justify-end">
          <h2 style={{ fontFamily: "Pacifico" }} className="font-semibold lg:pr-20 text-white text-3xl sm:text-4xl lg:text-[5rem] xl:text-[6rem] 2xl:text-[8rem] !leading-[1.13] tracking-tight">
            <span className="  text-[4rem]  lg:text-[8rem]  2xl:text-[9rem]">60</span>  <br />
            Points
          </h2>

        </div>
        <div className="w-[100%] lg:w-1/3 relative  ">
          <h2 style={{ fontFamily: "Pacifico" }} className="flex  justify-center font-semibold text-white text-3xl sm:text-4xl xl:text-5xl 2xl:text-7xl mt-6 sm:mt-10 !leading-[1.13] tracking-wider">
            Piazolla <br />
            Fidelité
          </h2>
          <div style={{ fontFamily: "Roboto" }} className="flex justify-center tracking-wider  items-center flex-col  mt-6 text-white  2xl:text-2xl">
            <span >
              votre programme de fidélité
            </span>
            <span>pour avoir des pizza !</span>
          </div>
        </div>

        <NcImage
          containerClassName="relative block lg:absolute lg:-left-20 lg:-bottom-4 mt-10 lg:mt-0 max-w-[calc(45%-40px)]  lg:max-w-[calc(32%-40px)] xl:max-w-[calc(35%-40px)] 2xl:max-w-[calc(65%-40px)]"
          src={carteFidelite}
        />
      </div>
    </div>
  );
};

export default LoyaltyCard;

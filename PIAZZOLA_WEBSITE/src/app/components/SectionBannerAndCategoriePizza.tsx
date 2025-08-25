import SectionBanner from "./SectionBanner";
// import { PizzaIconSvg } from "../../utils/svg";
import { useNavigate } from "react-router-dom";
import nos_bases_cremes from "/nos_bases_cremes.webp";
import nos_bases_tomates from "/nos_bases_tomates.webp";
import { useDispatch } from "react-redux";
import NcImage from "./NcImage/NcImage";
// import CustomButton from "./CustomButton";
import { setCategoriePizzaActive } from "../../store/menuSlice";

const SectionBannerAndCategoriePizza = () => {

    // Redux
    const dispatch = useDispatch()
    //Hooks
    const navigate = useNavigate()


    return (
        <div className="containerx relative mt-4">
            <div className="grid grid-cols-12 ">
                {/* Première div : col-span-8 */}
                <div
                    className="col-span-12 md:col-span-7 row-span-2 relative  overflow-hidden cursor-pointer mb-3  md:mr-3 2xl:mr-6"
                >
                    <SectionBanner />
                </div>

                {/* Deuxième div : col-span-4 */}
                <div className="col-span-12 md:col-span-5 grid grid-cols-1 md:grid-cols-1 ">
                    {[{ image: nos_bases_cremes, id: 1 }, { image: nos_bases_tomates, id: 2 }].map((item, index) => (
                        <div
                            onClick={() => {
                                navigate("/menu");
                                dispatch(setCategoriePizzaActive(item.id))
                            }}
                            key={index}
                            className="cursor-pointer rounded-md sm:rounded-3xl overflow-hidden shadow-xl mb-4 lg:mb-6 2xl:mb-5"
                        >
                            <NcImage
                                containerClassName=""
                                className="object-cover w-full h-full rounded-md sm:rounded-xl "
                                src={item.image || ""}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SectionBannerAndCategoriePizza
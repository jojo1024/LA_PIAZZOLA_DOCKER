import { reseauxSociauxImageData } from "../../utils/constant"
import Heading from "./Heading"
import NcImage from "./NcImage/NcImage"



const SectionSocial = () => {
    return (
        <div className=" w-full py-5 bg-neutral-100/70 mt-24">
            <Heading
                className="mb-2 text-neutral-900 dark:text-neutral-50"
                fontClass="text-4xl md:text-4xl 2xl:text-5xl font-semibold"
                isCenter
                desc=""
                style={{ fontFamily: "Pacifico" }}
            >
                Suivez nous sur les Réseaux
            </Heading>

            <div className="flex justify-center mt-8">
                <div
                    className={`nc-SectionSocial`}
                    data-nc-id="SectionSocial"
                >
                    <div className="flex flex-row">

                        {reseauxSociauxImageData.map((item) => (
                            <a
                                key={item.id}
                                className=" mx-5"
                                href={item.lien}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <NcImage
                                    containerClassName="mb-4 sm:mb-10 w-14 h-14 sm:w-16 sm:h-16 2xl:w-20 2xl:h-20 2xl:mx-5"
                                    className=""
                                    src={item.img}
                                    alt={item.alt}
                                    aria-label={item.ariaLabel}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionSocial
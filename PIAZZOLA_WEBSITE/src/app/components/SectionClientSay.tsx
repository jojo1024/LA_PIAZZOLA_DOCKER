import { Link } from 'react-router-dom';
import Slider from 'react-slick';
// import { OpinionIconSvg } from '../../utils/svg';
import CustomHeading from "./CustomHeading";
import NcImage from "./NcImage/NcImage";

const data = [
    {
        name: "John Doe",
        desc: "20+ categories",
        img: "",
        color: "bg-indigo-100",
    },
    {
        name: "Joelitho Ndjabo",
        desc: "10+ categories",
        img: "",
        color: "bg-slate-100",
    },
    {
        name: "Francis Wodie",
        desc: "34+ categories",
        img: "",
        color: "bg-sky-100",
    },
    {
        name: "Pets Food",
        desc: "12+ categories",
        img: "",
        color: "bg-orange-100",
    },
];

const SectionClientSay = () => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            }
        ]


    };
    return (
        <div className="container relative mt-14">
            <div className="relative py-4 mb-8">
                <div className={`nc-SectionClientSay `}>
                    <div className="slider-container ">
                        <CustomHeading title='Avis clients' classname='mb-12 lg:mb-14' />
                        <Slider {...settings}>
                            {data.map((item, index) => (
                                <li key={index} className={` px-4`}>
                                    <div
                                        className={`nc-CardCategory4  h-96  shadow relative w-full   rounded-3xl overflow-hidden`}
                                        data-nc-id="CardCategory4"
                                        key={index}
                                    >
                                        <div>
                                            {/* <div className="absolute bottom-0 right-10 top-10 max-w-[180px] opacity-80">
                                                <OpinionIconSvg />
                                            </div> */}

                                            <div className="absolute inset-8 ">
                                                <div className="flex justify-center items-center">
                                                    <NcImage
                                                        src={""}
                                                        containerClassName={`w-28 h-28 rounded-full overflow-hidden z-0 `}
                                                    />
                                                </div>

                                                <div className="flex justify-center text-justify my-5">
                                                    <span className="text-neutral-500 dark:text-neutral-400 text-base line-clamp-4">
                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                        Consectetur, culpa?
                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                        Consectetur, culpa?
                                                    </span>
                                                </div>
                                                <div className="flex justify-center">

                                                    <span className="block mt-2 text-2xl font-semibold">
                                                        {item.name}
                                                    </span>
                                                </div>

                                            </div>
                                        </div>

                                        <Link to={"/page-collection"}></Link>
                                    </div>
                                </li>
                            ))}
                        </Slider>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SectionClientSay
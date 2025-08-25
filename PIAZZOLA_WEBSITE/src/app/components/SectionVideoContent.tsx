import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube'
import CustomHeading from './CustomHeading';
import { apiClient } from '../../utils/apiClient';


interface SectionProps {
    title: string
}

interface IVideoContent { videoId: number, titre: string, lienVideo: string }

const SectionVideoContent: React.FC<SectionProps> = ({ title }) => {
    const [videoContent, setvideoContent] = useState<IVideoContent[]>([])
    const [loading, setLoading] = useState(false)

    const recupVideoContent = async () => {
        try {
            setLoading(true)
            const res = await apiClient.get(`/recup_video`);
            if (!res?.status) throw res?.error
            const data = res?.data as IVideoContent[]
            setvideoContent(data)
        } catch (error) {
            console.log("🚀 ~ recupClientPointFidelite ~ error:", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        recupVideoContent()
    }, [])

    return (
        <div className="container relative mt-14">
            {
                loading
                    ?
                    <div className='flex justify-center'>Chargement des données en cours...</div>
                    :
                    <div className="relative py-4 mb-8 ">
                        <div
                            className={`nc-SectionContent relative `}
                            data-nc-id="SectionContent"
                        >
                            <CustomHeading title={title} classname='mb-14' />

                            <div className="grid grid-cols-12 gap-2 md:gap-8 xl:gap-20  2xl:gap-28">
                                {videoContent.map((item, index) => (
                                    <div key={index} className="col-span-12 sm:col-span-6 md:col-span-4 mb-4 sm:mb-0 ">
                                        <div
                                            className="overflow-hidden rounded-lg border-2 border-black max-w-xl mx-auto shadow-lg"
                                        >
                                            <YouTube
                                                videoId={item.lienVideo}
                                                opts={{
                                                    height: "540",
                                                    width: "350",
                                                    playerVars: {
                                                        autoplay: 0, // 0 ou 1 : 1 pour autoplay

                                                    },
                                                }} />
                                        </div>
                                        <div className="flex items-center justify-center my-3">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-xl">{item.titre}</span>
                                            </div>

                                        </div>
                                        {/* <div className="mx-10">
                                    <CustomButton title='Voir la vidéo' width='w-full' />
                                </div> */}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </div>
            }
        </div>


    )
}

export default SectionVideoContent
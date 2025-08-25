import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setAEmporter } from '../../store/appSlice'
import { getCommandStatus } from '../../utils/functions'
import { DeliveryIconSvg, TakeAwayIconSvg } from '../../utils/svg'
import CommandStatus from './CommandStatus'
import CustomButton from './CustomButton'
import DisplayNotification from './DisplayNotification'

const SectionOrderDelivery = () => {
    //Redux
    const dispatch = useDispatch()

    const navigate = useNavigate()
    // Hooks
    const currentDate = new Date();
    const { isOpen, timeRemaining } = getCommandStatus(currentDate);
    return (
        <div>
            <div className='container my-2'>

            <CommandStatus isOpen={isOpen} timeRemaining={timeRemaining || ""}/>
            </div>

            <div className="flex justify-center items-center w-full h-24 bg-gray-200 ">
                <div style={{ fontFamily: "Pacifico" }} className="flex items-center justify-center font-bold text-xs sm:text-2xl  2xl:text-3xl">
                    <span className="hidden sm:flex mr-2 sm:mr-20">Commandez en ligne</span>
                    <CustomButton
                        classname='text-xs sm:text-base'
                        onClick={() => {
                            dispatch(setAEmporter(false));
                            navigate("/menu");
                            DisplayNotification({ libelle: "Vous indiquerez le lieu de livraison au moment de la commande.", type: "info", time: 4000 })
                        }}
                        title='Livraison'
                        iconSvg={<DeliveryIconSvg />}
                        bgColor='bg-red-600' />
                    <span className=" mx-2 sm:mx-3 md:mx-7">ou</span>
                    <CustomButton
                        onClick={() => {
                            dispatch(setAEmporter(true));
                            navigate("/menu");
                            DisplayNotification({ libelle: "Vous indiquerez l'heure de l'emport au moment de la commande.", type: "info", time: 4000 })
                        }}
                        title='A emporter' iconSvg={<TakeAwayIconSvg />}
                        bgColor='bg-orange-400'
                    />
                </div>
            </div>
        </div>
    )
}

export default SectionOrderDelivery
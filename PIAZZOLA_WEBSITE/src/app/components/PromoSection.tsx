import { useNavigate } from "react-router-dom";
import CustomButton from "./CustomButton";
import { useDispatch } from "react-redux";
import { setSInscritAuProgrammeDeFidelite } from "../../store/menuSlice";

const PromoSection = () => {
    // Redux
    const dispatch = useDispatch()
    //hooks
    const navigate = useNavigate()
    return (
        <div className="text-center space-y-4">
            <p className="text-sm text-gray-600">
                Une pizza au format régular. Hors suppléments pâtes, ingrédients et modifications de recettes.
            </p>
            <p className="text-sm text-gray-600">
                Offre soumise au minimum de commande en livraison Fidélité ci-dessous.
            </p>
            <div className="flex justify-center space-x-4">
                <CustomButton onClick={() => {
                    navigate("/enregistrement");
                    dispatch(setSInscritAuProgrammeDeFidelite(true))
                }} title="JE CRÉE MON COMPTE" />
                <CustomButton onClick={() => {
                    navigate("/authentification");
                    dispatch(setSInscritAuProgrammeDeFidelite(true))
                }} title="JE M'INSCRIS" />
            </div>
        </div>
    );
};

export default PromoSection;

import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IReduxState } from "../../store/store";
import { CartIconSvg } from "../../utils/svg";

export default function HeaderCart() {

  const cart = useSelector((state: IReduxState) => state.cart.cart);
  console.log("🚀 ~ HeaderCart ~ cart:", cart)

  const quantitePanier = useMemo(() => cart.commandeDetails.reduce((total, elt) => total + Number(elt.quantiteCommande), 0), [cart.commandeDetails])

  return (
    <Link to={"/panier"}>
      <div
        className={`group w-10 text-white hover:text-black h-10 sm:w-12 sm:h-12 hover:bg-white rounded-full inline-flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 text-b relative`}
      >
        <div className="w-3.5 h-3.5 flex items-center justify-center bg-white absolute top-1.5 right-1.5 rounded-full text-[10px] leading-none text-black font-medium">
          <span className="mt-[1px]">{quantitePanier}</span>
        </div>
        <CartIconSvg />
      </div>
    </Link>

  );
}

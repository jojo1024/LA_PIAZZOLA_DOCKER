import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";


const DisplayNotification = ({ libelle, type, time = 3000 }: {time?:number, libelle: string, type: "success" | "error" | "warning" | "info" }) => {
 const bgColor = {
  success: "bg-green-500",
  error: "bg-red-500",
  warning: "bg-yellow-500",
  info: "bg-blue-500",
 }
  toast.custom(
    (t) => (
      <Transition
        as={"div"}
        appear
        show={t.visible}
        className={`p-4 max-w-md w-full ${bgColor[type]} dark:bg-slate-800 shadow-lg rounded-2xl pointer-events-auto ring-1 ring-black/5 dark:ring-white/10 text-slate-900 dark:text-slate-200`}
        enter="transition-all duration-150"
        enterFrom="opacity-0 translate-x-20"
        enterTo="opacity-100 translate-x-0"
        leave="transition-all duration-150"
        leaveFrom="opacity-100 translate-x-0"
        leaveTo="opacity-0 translate-x-20"
      >
        <p className="block text-base text-white  leading-none">
          {libelle}
        </p>
      </Transition>
    ),
    {
      position: "top-right",
      id: String("id") || "product-detail",
      duration: time,
    }
  );
};

export default DisplayNotification
"use client";
import { useGlobalContext } from "@/context/store";
import Icon from "./Icon";

export default function ToggleSidebar() {
   const { toggleSidebar } = useGlobalContext();
   return (
      <button
         onClick={() => toggleSidebar()}
         className="w-10 h-10 inline-flex items-center justify-center rounded-[40px] bg-primary-50 text-primary-500 hover:bg-primary-100 duration-200"
      >
         <Icon icon="mingcute:menu-fill" className="text-2xl" />
      </button>
   );
}

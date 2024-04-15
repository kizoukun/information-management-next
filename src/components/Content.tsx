"use client";

import { useGlobalContext } from "@/context/store";
import Navbar from "./Navbar";

export default function Content({ children }: { children: React.ReactNode }) {
   const { sidebar } = useGlobalContext();
   return (
      <section
         className={`${
            sidebar ? "lg:ml-[250px] lg:w-[calc(100%-250px)]" : "ml-0 w-full"
         } min-h-screen duration-500`}
      >
         <Navbar />
         <div className="min-h-screen w-full">{children}</div>
         <footer className="bottom-0 left-0 z-50 w-full bg-white px-2 py-2 shadow-xl sm:px-8">
            &copy;{" "}
            <a
               href="https://yuelhost.com"
               className="text-primary hover:underline"
               target="_blank"
            >
               YuelHost
            </a>
            , All Right Reserved. Copyright © 2021 - {new Date().getFullYear()}
         </footer>
      </section>
   );
}

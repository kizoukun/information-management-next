"use client";

import { useGlobalContext } from "@/context/store";
import Link from "next/link";
import Icon from "./Icon";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

function SidebarLink({
   icon,
   children,
   href,
}: {
   href: string;
   icon: string;
   children: React.ReactNode;
}) {
   const pathName = usePathname();
   const active =
      pathName.includes(href) &&
      (pathName == "/dashboard" || href !== "/dashboard");
   return (
      <Link
         href={href}
         className={`rounded-r-3xl p-4 ${active ? "" : ""}  flex space-x-4`}
      >
         <Icon icon={icon} className={`text-2xl`} />
         <p>{children}</p>
      </Link>
   );
}

export default function Sidebar() {
   const { sidebar } = useGlobalContext();
   const navigations = [
      {
         href: "/dashboard",
         icon: "clarity:dashboard-solid",
         title: "Dashboard",
      },
   ];
   return (
      <aside
         className={`fixed bottom-0 left-0 top-0 min-w-[250px] overflow-y-auto duration-500 ${
            sidebar ? "ml-0" : "-ml-[250px]"
         } z-10 h-screen bg-white shadow-2xl`}
      >
         <nav className={`items-center justify-between py-2 pr-4`}>
            <div className="mb-4">
               <Link href="/dashboard" className="mb-3">
                  <h3 className="mx-4 mb-4 flex items-center text-2xl font-semibold text-primary-500">
                     InfMng
                  </h3>
               </Link>
            </div>
            <div className="mb-0 flex list-none flex-col pl-0">
               {navigations.map((navigation) => (
                  <SidebarLink
                     href={navigation.href}
                     icon={navigation.icon}
                     key={navigation.href}
                  >
                     {navigation.title}
                  </SidebarLink>
               ))}

               <button onClick={() => signOut()} className="flex space-x-4 p-4">
                  <Icon icon="clarity:logout-solid" className="text-2xl" />
                  <p>Logout</p>
               </button>

               <div className="pl-4 pr-2">
                  <hr className="border-t-2 border-gray-200 my-2" />
               </div>

               <div className="p-4">
                  <p className="text-gray-500 font-bold">YOUR SAVINGS</p>
               </div>
               <div className="pl-4 pr-2">
                  <hr className="border-t-2 border-gray-200 my-2" />
               </div>

               <div className="p-4">
                  <p className="text-gray-500 font-bold">GROUP SAVINGS</p>
               </div>
            </div>
         </nav>
      </aside>
   );
}

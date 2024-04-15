"use client";

import { useGlobalContext } from "@/context/store";
import Link from "next/link";
import Icon from "./Icon";
import { usePathname } from "next/navigation";
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
   const active = pathName === href;
   return (
      <Link
         href={href}
         className={`rounded-r-3xl ${
            active ? "underline" : "hover:underline"
         }  flex space-x-4`}
      >
         <Icon icon={icon} className={`text-2xl`} />
         <p>{children}</p>
      </Link>
   );
}

type SidebarProps = {
   ownedSavings?: { id: string; title: string }[];
   invitedSavings?: { id: string; title: string }[];
};

export default function Sidebar({
   ownedSavings = [],
   invitedSavings = [],
}: SidebarProps) {
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
         className={`fixed bottom-0 left-0 top-0 w-full max-w-[250px] overflow-y-auto duration-500 ${
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
               <div className="p-4">
                  {navigations.map((navigation) => (
                     <SidebarLink
                        href={navigation.href}
                        icon={navigation.icon}
                        key={navigation.href}
                     >
                        {navigation.title}
                     </SidebarLink>
                  ))}
               </div>

               <button onClick={() => signOut()} className="flex space-x-4 p-4">
                  <Icon icon="clarity:logout-solid" className="text-2xl" />
                  <p>Logout</p>
               </button>

               <div className="pl-4 pr-2">
                  <hr className="border-t-2 border-gray-200 my-2" />
               </div>

               <div className="p-4">
                  <p className="text-gray-500 font-bold mb-4">YOUR SAVINGS</p>
                  <div className="space-y-2">
                     {ownedSavings.length > 0 ? (
                        ownedSavings.map((saving) => (
                           <SidebarLink
                              key={saving.id}
                              icon="clarity:savings-solid"
                              href={`/dashboard/savings/${saving.id}`}
                           >
                              {saving.title}
                           </SidebarLink>
                        ))
                     ) : (
                        <p className="text-center">None</p>
                     )}
                  </div>
               </div>
               <div className="pl-4 pr-2">
                  <hr className="border-t-2 border-gray-200 my-2" />
               </div>

               <div className="p-4">
                  <p className="text-gray-500 font-bold mb-4">GROUP SAVINGS</p>
                  <div className="space-y-2">
                     {invitedSavings.length > 0 ? (
                        invitedSavings.map((saving) => (
                           <SidebarLink
                              key={saving.id}
                              icon="clarity:savings-solid"
                              href={`/dashboard/savings/${saving.id}`}
                           >
                              {saving.title}
                           </SidebarLink>
                        ))
                     ) : (
                        <p className="text-sm">
                           You dont have any invited savings
                        </p>
                     )}
                  </div>
               </div>
            </div>
         </nav>
      </aside>
   );
}

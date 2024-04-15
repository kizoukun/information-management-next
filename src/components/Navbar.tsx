import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import ToggleSidebar from "./ToggleSidebar";

export default function Navbar() {
   const { data: session } = useSession();
   return (
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-white px-4 py-2">
         <div className="flex items-center">
            <ToggleSidebar />
         </div>
         <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
               {session?.user ? (
                  <p>
                     {session?.user.firstName} {session?.user.lastName}
                  </p>
               ) : (
                  "Fetching..."
               )}
            </div>
         </div>
      </nav>
   );
}

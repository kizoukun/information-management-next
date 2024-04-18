import { useSession } from "next-auth/react";
import ToggleSidebar from "./ToggleSidebar";
import EditUserProfileDialog from "./EditUserProfileDialog";
import { useEffect, useState } from "react";

export default function Navbar() {
   const [firstName, setFirstName] = useState("");
   const [lastName, setLastName] = useState("");
   const { data: session } = useSession();

   useEffect(() => {
      if (session?.user) {
         setFirstName(session.user.firstName);
         setLastName(session.user.lastName);
      }
   }, [session]);
   return (
      <nav className="sticky top-0 z-50 flex w-full items-center justify-between bg-white px-4 py-2">
         <div className="flex items-center">
            <ToggleSidebar />
         </div>
         <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
               {session?.user ? (
                  <p className="flex items-center gap-2">
                     {firstName} {lastName}{" "}
                     <span className="cursor-pointer">
                        <EditUserProfileDialog
                           firstName={firstName}
                           lastName={lastName}
                           setFirstName={setFirstName}
                           setLastName={setLastName}
                        />
                     </span>
                  </p>
               ) : (
                  "Fetching..."
               )}
            </div>
         </div>
      </nav>
   );
}

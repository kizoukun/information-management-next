import AuthProvider from "@/components/AuthProvider";
import Content from "@/components/Content";
import Sidebar from "@/components/Sidebar";
import { GlobalContextProvider } from "@/context/store";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return redirect("/auth/login");
   }

   const user = session.user;
   const savings = await db.savingsUser.findMany({
      where: {
         userId: user.id,
      },
      include: {
         savings: true,
      },
   });

   const ownedSavings = savings.filter(
      (saving) => saving.savings.creatorId === user.id
   );

   const mappedOwnedSavings = ownedSavings.map((saving) => {
      return {
         id: saving.savings.id,
         title: saving.savings.title,
      };
   });

   const invitedSavings = savings.filter(
      (saving) => saving.savings.creatorId !== user.id
   );

   const mappedInvitedSavings = invitedSavings.map((saving) => {
      return {
         id: saving.savings.id,
         title: saving.savings.title,
      };
   });

   return (
      <main className="relative m-auto box-border flex w-full flex-col p-0">
         <AuthProvider>
            <GlobalContextProvider>
               <Sidebar
                  ownedSavings={mappedOwnedSavings}
                  invitedSavings={mappedInvitedSavings}
               />

               <Content>
                  <div>{children}</div>
               </Content>
            </GlobalContextProvider>
         </AuthProvider>
      </main>
   );
}

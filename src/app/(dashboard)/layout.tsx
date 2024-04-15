import AuthProvider from "@/components/AuthProvider";
import Content from "@/components/Content";
import Sidebar from "@/components/Sidebar";
import { GlobalContextProvider } from "@/context/store";
import { authOptions } from "@/lib/authOptions";
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
   return (
      <main className="relative m-auto box-border flex w-full flex-col p-0">
         <AuthProvider>
            <GlobalContextProvider>
               <Sidebar />

               <Content>
                  <div>{children}</div>
               </Content>
            </GlobalContextProvider>
         </AuthProvider>
      </main>
   );
}

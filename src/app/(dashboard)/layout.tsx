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
   return children;
}

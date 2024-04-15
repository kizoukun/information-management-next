import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CreateSavingDialog from "./_components/CreateSavingDialog";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
   const session = await getServerSession(authOptions);
   if (!session) {
      return <p>You need to be logged in</p>;
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

   return (
      <div className="bg-gray-100 min-h-screen">
         <p>Dashboard Page</p>
         <CreateSavingDialog />
      </div>
   );
}

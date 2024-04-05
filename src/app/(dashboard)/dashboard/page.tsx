import { db } from "@/lib/db";
import TestLogout from "./TestLogout";
import FormCreateSavings from "./_components/FormCreateSavings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import FormInviteSavings from "./_components/FormInviteSavings";

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
         <div>
            <TestLogout />
         </div>
         <div>
            <p className="font-bold text-lg">Your Owned Saving Account</p>
            <ul>
               {ownedSavings.map((saving, index) => (
                  <li key={saving.id} className="font-semibold">
                     {index + 1}. {saving.savings.title}
                  </li>
               ))}
            </ul>
            <p className="font-bold text-lg">Your Invited Saving Account</p>
            <ul>
               {invitedSavings.length > 0
                  ? invitedSavings.map((saving, index) => (
                       <li key={saving.id} className="font-semibold">
                          {index + 1}. {saving.savings.title}
                       </li>
                    ))
                  : "You have no invited saving account"}
            </ul>
         </div>
         <div className="max-w-xl mx-auto space-y-8">
            <FormCreateSavings />
            <FormInviteSavings savings={mappedOwnedSavings} />
         </div>
      </div>
   );
}

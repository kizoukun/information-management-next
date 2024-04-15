import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import InviteUserDialog from "./_components/InviteUserDialog";
import ListUsersDialog from "./_components/ListUsersDialog";

export const dynamic = "force-dynamic";

type SavingsDetailProps = {
   params: {
      id: string;
   };
};

export default async function SavingsDetail(props: SavingsDetailProps) {
   const session = await getServerSession(authOptions);
   if (!session) {
      return redirect("/auth/login");
   }

   const saving = await db.savingsUser.findFirst({
      where: {
         userId: session.user.id,
         savingsId: props.params.id,
      },
      include: {
         savings: true,
      },
   });

   if (!saving) {
      return redirect("/dashboard");
   }

   const isOwner = saving.savings.creatorId === session.user.id;

   return (
      <main className="p-5">
         <div className="flex justify-between items-center">
            <p className="text-xl font-bold">Saving: {saving.savings.title}</p>
            <div className="gap-4 flex items-center">
               {isOwner && <InviteUserDialog savingsId={saving.savings.id} />}
               <ListUsersDialog
                  savingsId={saving.savings.id}
                  isOwner={isOwner}
               />
            </div>
         </div>

         <div
            id="chart"
            className="min-h-[500px] bg-gray-300 mt-4 rounded-lg"
         ></div>
      </main>
   );
}
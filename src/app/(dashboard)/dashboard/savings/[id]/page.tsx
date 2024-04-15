import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import InviteUserDialog from "./_components/InviteUserDialog";
import ListUsersDialog from "./_components/ListUsersDialog";
import AddSavingsActivityDialog from "./_components/AddSavingsActivityDialog";

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

   const savingsLog = await db.savingsLog.findMany({
      where: {
         savingsId: props.params.id,
      },
      include: {
         user: true,
      },
      orderBy: {
         createdAt: "desc",
      },
   });

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
            className="min-h-[500px] bg-gray-300 my-4 rounded-lg"
         ></div>

         <div className="flex justify-between items-center my-4">
            <p className="text-xl font-bold">Activity</p>
            <div>
               <AddSavingsActivityDialog savingsId={saving.savings.id} />
            </div>
         </div>

         <div className="lg:max-h-[720px] max-h-[540px] overflow-y-auto space-y-4">
            <div className="flex flex-row gap-5 overflow-x-auto ">
               {savingsLog.map((log) => (
                  <div
                     key={log.id}
                     className="border border-primary shadow-lg p-2 rounded-lg min-w-[250px]"
                  >
                     <p>
                        {log.type ? "+" : "-"}
                        {log.amount}
                     </p>
                     <p>{log.description}</p>
                     <p>{log.savingTime.toLocaleDateString()}</p>
                     <p>
                        {log.user.firstName} {log.user.lastName}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </main>
   );
}

import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import InviteUserDialog from "./_components/InviteUserDialog";
import ListUsersDialog from "./_components/ListUsersDialog";
import AddSavingsActivityDialog from "./_components/AddSavingsActivityDialog";
import DeleteSavings from "./_components/DeleteSavings";
import DeleteSavingsActivityDialog from "./_components/DeleteSavingsActivityDialog";
import EditSavingsActivityDialog from "./_components/EditSavingsActivityDialog";
import EditSavingDialog from "./_components/EditSavingDialog";

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
         savingTime: "desc",
      },
   });

   type accumulator = {
      [key: string]: typeof savingsLog;
   };
   const logs = savingsLog.reduce((acc: accumulator, log) => {
      const wibTimezone = setTimezoneToWib(log.savingTime);
      const date = wibTimezone.toISOString().split("T")[0];
      if (!acc[date]) {
         acc[date] = [];
      }
      acc[date].push(log);
      return acc;
   }, {});

   function setTimezoneToWib(date: Date) {
      return new Date(date.setHours(7));
   }

   const accumulatedAssets = savingsLog.reduce((acc, log) => {
      if (log.type) {
         return acc + log.amount;
      }
      return acc - log.amount;
   }, 0);

   function getAssetsPriceToday(logs: typeof savingsLog) {
      if (!logs.length) return 0;
      return logs.reduce((acc, log) => {
         if (log.type) {
            return acc + log.amount;
         }
         return acc - log.amount;
      }, 0);
   }

   const isOwner = saving.savings.creatorId === session.user.id;

   return (
      <main className="p-5">
         <div className="flex justify-between items-center">
            <p className="text-xl font-bold flex items-center gap-2">
               Saving: {saving.savings.title}{" "}
               {isOwner && (
                  <span className="cursor-pointer">
                     <EditSavingDialog
                        title={saving.savings.title}
                        savingsId={saving.savings.id}
                     />
                  </span>
               )}
            </p>
            <div className="gap-4 flex items-center">
               {isOwner && <DeleteSavings savingsId={saving.savings.id} />}
               {isOwner && <InviteUserDialog savingsId={saving.savings.id} />}
               <ListUsersDialog
                  savingsId={saving.savings.id}
                  isOwner={isOwner}
               />
            </div>
         </div>
         <p>Assets {accumulatedAssets.toLocaleString("ID-id")}</p>
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
            {Object.keys(logs).map((date) => (
               <div key={date}>
                  <p className="font-bold my-2">
                     {date} Rp
                     {getAssetsPriceToday(logs[date]).toLocaleString("ID-id")}
                  </p>
                  <div className="flex flex-row gap-5 overflow-x-auto ">
                     {logs[date].map((log) => (
                        <div
                           key={log.id}
                           className="border border-primary shadow-lg p-2 rounded-lg min-w-[250px]"
                        >
                           <p>
                              {log.type ? "+" : "-"}
                              {log.amount.toLocaleString("ID-id")}
                           </p>
                           <p>{log.description}</p>
                           <p>{log.savingTime.toDateString()}</p>
                           <p>
                              {log.user.firstName} {log.user.lastName}
                           </p>
                           <div>
                              <DeleteSavingsActivityDialog
                                 savingsLogId={log.id}
                              />
                           </div>
                           <div>
                              <EditSavingsActivityDialog
                                 savingsLogId={log.id}
                                 amount={log.amount}
                                 description={log.description}
                                 type={log.type}
                                 date={setTimezoneToWib(log.savingTime)}
                              />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </main>
   );
}

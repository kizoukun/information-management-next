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
      <main className="bg-slate-200">
         <div className="flex justify-between items-center  p-3">
            <p className="font-bold text-xl uppercase ">Dashboard</p>

         </div>

         <div className=" bg-slate-200 w-full">
            <div className=" h-[50vh] bg-slate-400 shadow m-3">
               <h1>ini chart total peneluran dan pemasukan di savings apa saja
               </h1>
            </div>
            <div className=" w-full h-[500] grid px-3 py-3 mx-auto">
               <div className="flex justify-between py-3">
                  <h1 className="font-semibold mb-3">SAVINGS LIST</h1>
                  <CreateSavingDialog />
               </div>
               <div className="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg hover:translate-y-1 hover:shadow-sm cursor-pointer duration-300">
                  <div className="flex-auto p-4">
                     <div className="flex flex-wrap">
                        <div className="relative  w-full pr-4 max-w-full flex-grow flex-1">
                           <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                              Savings name
                           </h5>
                           <span className="font-semibold text-xl text-blueGray-700">
                              $5000
                           </span>
                        </div>
                        {/* icon */}
                     </div>
                     <p className="text-sm text-blueGray-400 mt-4">
                        <span className="text-emerald-500 mr-2">
                           <i className="fas fa-arrow-up"></i> 3.48%
                        </span>
                        <span className="whitespace-nowrap">
                           Since yesterday
                        </span>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </main>
   );
}

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CreateSavingDialog from "./_components/CreateSavingDialog";
import type { SavingsLog } from "@prisma/client";
import HeaderCard from "@/components/HeaderCard";
import Link from "next/link";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function getTodayDate() {
   const currDate = new Date();
   const month = currDate.getMonth() + 1;
   const year = currDate.getFullYear();
   const maxDate = new Date(year, month, 0).getDate();
   const currDay = currDate.getDate();
   return {
      month: month,
      year: year,
      maxDate: maxDate,
      currDay: currDay,
      monthWithAdd: month < 10 ? `0${month}` : month,
      currDayWithAdd: currDay < 10 ? `0${currDay}` : currDay,
   };
}

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
         savings: {
            include: {
               SavingsLog: true,
            },
         },
      },
   });

   function totalSavingsAmount(savingLogs: SavingsLog[]) {
      return savingLogs.reduce((acc, log) => {
         if (log.type) {
            return acc + log.amount;
         } else {
            return acc - log.amount;
         }
      }, 0);
   }

   let lastMonthAllAssets = 0;

   async function percentageLastMonthIncrease(savingsId: string) {
      async function lastMonthIncreaseFunc() {
         const lastMonth = await db.savingsLog.findMany({
            where: {
               savingsId: savingsId,
               savingTime: {
                  lte: new Date(currDate.year, currDate.month - 1, 1),
                  gte: new Date(currDate.year, currDate.month - 2, 1),
               },
            },
         });

         const total = lastMonth.reduce((acc, log) => {
            if (log.type) {
               return acc + log.amount;
            } else {
               return acc - log.amount;
            }
         }, 0);

         return total;
      }

      async function thisMonthIncreaseFunc() {
         const thisMonth = await db.savingsLog.findMany({
            where: {
               savingsId: savingsId,
               savingTime: {
                  lte: new Date(currDate.year, currDate.month, 1),
                  gte: new Date(currDate.year, currDate.month - 1, 1),
               },
            },
         });

         const total = thisMonth.reduce((acc, log) => {
            if (log.type) {
               return acc + log.amount;
            } else {
               return acc - log.amount;
            }
         }, 0);

         return total;
      }

      const lastMonthIncrease = await lastMonthIncreaseFunc();

      const thisMonthIncrease = await thisMonthIncreaseFunc();

      if (lastMonthIncrease > 1) {
         lastMonthAllAssets += lastMonthIncrease;
      }

      const totalThisMonthIncreaseAmount =
         lastMonthIncrease + thisMonthIncrease;

      if (lastMonthIncrease == 0 && thisMonthIncrease == 0) return 0;

      const percentage =
         ((totalThisMonthIncreaseAmount - lastMonthIncrease) /
            lastMonthIncrease) *
         100;

      return Math.ceil(percentage);
   }

   const ownedSavings = savings.filter(
      (saving) => saving.savings.creatorId === user.id
   );

   const invitedSavings = savings.filter(
      (saving) => saving.savings.creatorId !== user.id
   );

   const currDate = getTodayDate();

   const mappedPercentage: { [key: string]: number } = {};

   let totalAssetsSaving = 0;
   for (const saving of ownedSavings) {
      totalAssetsSaving += totalSavingsAmount(saving.savings.SavingsLog);
      const percentage = await percentageLastMonthIncrease(saving.savings.id);
      mappedPercentage[saving.savings.id] = percentage;
   }

   for (const saving of invitedSavings) {
      totalAssetsSaving += totalSavingsAmount(saving.savings.SavingsLog);
      const percentage = await percentageLastMonthIncrease(saving.savings.id);
      mappedPercentage[saving.savings.id] = percentage;
   }

   const percentageAllTotal = Math.round(
      ((totalAssetsSaving - lastMonthAllAssets) / totalAssetsSaving) * 100
   );

   return (
      <main className="bg-slate-200 min-h-screen p-5">
         <div className="flex justify-between items-center">
            <p className="font-bold text-xl uppercase ">Dashboard</p>
         </div>

         <div className=" bg-slate-200 w-full">
            <div className="mt-8 w-full grid md:grid-cols-4 gap-6">
               <HeaderCard
                  title="Total Savings"
                  value={`${ownedSavings.length + invitedSavings.length} `}
                  desc="Increase from last month"
               ></HeaderCard>
               <HeaderCard
                  title="Total Assets Savings"
                  value={`Rp${totalAssetsSaving.toLocaleString("ID-id")}`}
                  desc={`${
                     percentageAllTotal >= 0 ? "Increase" : "Decrease"
                  } from last month`}
                  percentage={percentageAllTotal}
               ></HeaderCard>
            </div>
            <div className=" w-full h-[500] grid mx-auto">
               <div className="flex justify-between items-center py-3">
                  <h1 className="font-semibold mb-3">SAVINGS LIST</h1>
                  <CreateSavingDialog />
               </div>
               <div className="relative flex flex-col min-w-0 space-y-4 break-words  rounded mb-6 xl:mb-0 shadow-lg duration-300">
                  {ownedSavings.map((owned) => (
                     <Link
                        key={owned.id}
                        className="flex-auto p-4 bg-white block hover:translate-y-1 hover:shadow-sm cursor-pointer"
                        href={`/dashboard/savings/${owned.savings.id}`}
                     >
                        <div className="flex flex-wrap">
                           <div className="relative  w-full pr-4 max-w-full flex-grow flex-1">
                              <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                                 {owned.savings.title}
                              </h5>

                              <span className="font-semibold text-xl text-blueGray-700">
                                 Rp
                                 {totalSavingsAmount(
                                    owned.savings.SavingsLog
                                 ).toLocaleString("ID-id")}
                              </span>
                           </div>
                           {/* icon */}
                        </div>
                        <p className="text-sm text-blueGray-400 mt-4">
                           <span
                              className={`${
                                 mappedPercentage[owned.savings.id] >= 0
                                    ? "text-emerald-500"
                                    : "text-red-500"
                              } mr-2`}
                           >
                              <i className="fas fa-arrow-up"></i>{" "}
                              {mappedPercentage[owned.savings.id]}%
                           </span>
                           <span className="whitespace-nowrap">
                              Since last month
                           </span>
                        </p>
                     </Link>
                  ))}
                  {invitedSavings.map((owned) => (
                     <Link
                        key={owned.id}
                        className="flex-auto p-4 bg-white block hover:translate-y-1 hover:shadow-sm cursor-pointer"
                        href={`/dashboard/savings/${owned.savings.id}`}
                     >
                        <div className="flex flex-wrap">
                           <div className="relative  w-full pr-4 max-w-full flex-grow flex-1">
                              <h5 className="text-blueGray-400 uppercase font-bold text-xs">
                                 {owned.savings.title}
                              </h5>
                              <span className="font-semibold text-xl text-blueGray-700">
                                 Rp
                                 {totalSavingsAmount(
                                    owned.savings.SavingsLog
                                 ).toLocaleString("ID-id")}
                              </span>
                           </div>
                           {/* icon */}
                        </div>
                        <p className="text-sm text-blueGray-400 mt-4">
                           <span
                              className={`${
                                 mappedPercentage[owned.savings.id] >= 0
                                    ? "text-emerald-500"
                                    : "text-red-500"
                              } mr-2`}
                           >
                              <i className="fas fa-arrow-up"></i>{" "}
                              {mappedPercentage[owned.savings.id]}%
                           </span>
                           <span className="whitespace-nowrap">
                              Since last month
                           </span>
                        </p>
                     </Link>
                  ))}
               </div>
            </div>
         </div>
      </main>
   );
}

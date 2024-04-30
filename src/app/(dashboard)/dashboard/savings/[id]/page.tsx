import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import regression from "regression";
import InviteUserDialog from "./_components/InviteUserDialog";
import ListUsersDialog from "./_components/ListUsersDialog";
import AddSavingsActivityDialog from "./_components/AddSavingsActivityDialog";
import DeleteSavings from "./_components/DeleteSavings";
import DeleteSavingsActivityDialog from "./_components/DeleteSavingsActivityDialog";
import EditSavingsActivityDialog from "./_components/EditSavingsActivityDialog";
import EditSavingDialog from "./_components/EditSavingDialog";
import LineChartHero from "./_components/Chart";
import CustomCard from "./_components/CustomCard";
import HeaderCard from "./_components/HeaderCard";

export const dynamic = "force-dynamic";

type SavingsDetailProps = {
   params: {
      id: string;
   };
};

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

function setTimezoneToWib(date: Date) {
   return new Date(date.setHours(7));
}

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
         savings: {
            include: {
               SavingsLog: {
                  include: {
                     user: true,
                  },
                  orderBy: {
                     savingTime: "desc",
                  },
               },
            },
         },
      },
   });

   const currDate = getTodayDate();

   const lastMonthIncrease = await db.savingsLog.groupBy({
      by: ["savingsId"],
      where: {
         savingsId: props.params.id,
         savingTime: {
            lte: new Date(currDate.year, currDate.month - 1, 1),
            gte: new Date(currDate.year, currDate.month - 2, 1),
         },
      },
      _sum: {
         amount: true,
      },
   });

   const lastMonthAllAssets = await db.savingsLog.groupBy({
      by: ["savingsId"],
      where: {
         savingsId: props.params.id,
         savingTime: {
            lte: new Date(currDate.year, currDate.month - 1, 1),
         },
      },
      _sum: {
         amount: true,
      },
   });

   if (!saving) {
      return redirect("/dashboard");
   }

   const savingsLog = saving.savings.SavingsLog;

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

   function compareAssetsPriceTodayAndYesterday(date: string) {
      const log = logs[date];
      if (!log) return 0;
      const todayPrice = getAssetsPriceToday(log);
      const before = new Date(date);

      function getYesterday(currentDate: Date) {
         const newDate = new Date(currentDate);
         newDate.setDate(newDate.getDate() - 1);
         const newDateSr = newDate.toISOString().split("T")[0];
         const logsYesterday = logs[newDateSr];
         if (!logsYesterday) {
            if (newDate.getDate() <= 1) return [];
            return getYesterday(newDate);
         }
         return logsYesterday;
      }

      const yesterday = getYesterday(before);

      const yesterdayPrice = getAssetsPriceToday(yesterday);
      const result = todayPrice - yesterdayPrice;
      if (yesterdayPrice === 0) return 0;
      if (result === 0) return 0;
      const percentage = (result / yesterdayPrice) * 100;
      return Math.round(percentage);
   }

   const isOwner = saving.savings.creatorId === session.user.id;

   type ChartDataType = {
      date: string;
      "Your Saving"?: number;
      Prediction?: number;
   };

   const chartData: ChartDataType[] = [];

   type DailyData = [number, number];

   const dailyData: DailyData[] = [];

   let totalAssetsWithPrediction = lastMonthAllAssets[0]?._sum.amount ?? 0;
   let totalIncreaseThisMonth = 0;

   for (let i: number = 1; i <= currDate.maxDate; i++) {
      const date = `${currDate.year}-${currDate.monthWithAdd}-${i < 10 ? `0${i}` : i
         }`;
      const log = logs[date];
      const amount = log ? getAssetsPriceToday(log) : 0;

      let data: ChartDataType = {
         date: date,
      };

      if (currDate.currDay >= i) {
         totalAssetsWithPrediction += amount;
         totalIncreaseThisMonth += amount;
         if (currDate.currDay == i) {
            data["Prediction"] = totalAssetsWithPrediction;
         }
         data["Your Saving"] = totalAssetsWithPrediction;
         dailyData.push([i, totalAssetsWithPrediction]);
      } else {
         const result = regression.polynomial(dailyData, { precision: 2 });
         if (i >= currDate.maxDate) {
            totalAssetsWithPrediction = result.predict(i)[1];
         }
         data["Prediction"] = result.predict(i)[1] ?? 0;
      }

      chartData.push(data);
   }

   const percentageLastMonthIncrease = Math.round(
      (totalIncreaseThisMonth / (lastMonthIncrease[0]?._sum.amount ?? 1)) * 100
   );

   return (
      <main className="p-5 bg-slate-200">
         <div className="flex justify-between items-center ">
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
         <p>
            Assets {accumulatedAssets.toLocaleString("ID-id")}{" "}
            {percentageLastMonthIncrease}% Increase from last month
         </p>
         <div className="mt-8 w-full grid md:grid-cols-4 gap-6">
            <HeaderCard
               title="Total Assets"
               value="Rp 561526"
               desc="Increase from last month"
               percentage="56">
            </HeaderCard>
            <HeaderCard
               title="Total Prediction"
               value="Rp 348.983"
               desc=""
               percentage="56">
            </HeaderCard>
            <HeaderCard
               title="Users"
               value="5"
               desc=""
               percentage="56">
            </HeaderCard>
         </div>
         <div
            id="chart"
            className="min-h-[500px] my-4 rounded-lg bg-slate-50 p-5 shadow-lg"
         >
            <LineChartHero chartData={chartData} />
            <p>
               Total Prediction{" "}
               {Math.round(totalAssetsWithPrediction).toLocaleString("ID-id")}
            </p>
         </div>

         <div className="flex justify-between items-center my-4 ">
            <p className="text-xl font-bold">Activity</p>
            <div>
               <AddSavingsActivityDialog savingsId={saving.savings.id} />
            </div>
         </div>

         <div className="lg:max-h-[720px]  max-h-[540px] overflow-y-auto space-y-4 ">
            {Object.keys(logs).map((date) => (
               <div key={date}>
                  <div className="font-bold mt-5 space-y-2 ">
                     <p>
                        {date} Rp
                        {getAssetsPriceToday(logs[date]).toLocaleString(
                           "ID-id"
                        )}
                     </p>
                     {compareAssetsPriceTodayAndYesterday(date) != 0 && (
                        <p>
                           {Math.round(
                              compareAssetsPriceTodayAndYesterday(date)
                           )}
                           % from Last Activity Date
                        </p>
                     )}
                  </div>
                  <div className="flex flex-row gap-5 overflow-x-auto bg-slate-200 h-auto pt-4 pb-8 px-2 element">
                     {logs[date].map((log) => (
                        <CustomCard
                           title="Wardana wardana wardana warnda"
                           value="2000"
                           desc="loremkfdskfd skdfjkdsjf"
                           date="wend 14 feb"
                        />
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </main>
   );
}

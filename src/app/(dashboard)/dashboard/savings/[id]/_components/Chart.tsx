"use client";
import { LineChart } from "@tremor/react";

const dataFormatter = (number: number) =>
   `$${Intl.NumberFormat("id").format(number).toString()}`;

type LineChartHeroProps = {
   chartData: {
      date: string;
      "Your Saving"?: number;
      Prediction?: number;
   }[];
};

export default function LineChartHero({ chartData }: LineChartHeroProps) {
   return (
      <LineChart
         className="h-80"
         data={chartData}
         index="date"
         categories={["Prediction", "Your Saving"]}
         colors={["rose", "indigo"]}
         valueFormatter={dataFormatter}
      />
   );
}

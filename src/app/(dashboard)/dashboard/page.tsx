import TestLogout from "./TestLogout";
import FormCreateSavings from "./_components/FormCreateSavings";

export default async function DashboardPage() {
   return (
      <div className="bg-gray-100 min-h-screen">
         <p>Dashboard Page</p>
         <div>
            <TestLogout />
         </div>
         <div className="max-w-xl mx-auto">
            <FormCreateSavings />
         </div>
      </div>
   );
}

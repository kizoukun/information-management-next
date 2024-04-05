"use client";
import { useToast } from "@/components/ui/use-toast";
import { CreateSavings, InviteUserSavings } from "@/server/savings";
import { useState } from "react";

type FormInviteSavingsProps = {
   savings: {
      id: string;
      title: string;
   }[];
};

export default function FormInviteSavings({ savings }: FormInviteSavingsProps) {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();

   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setLoading(true);
      try {
         const form = new FormData(event.currentTarget);
         const data = {
            savingsId: form.get("savingsId") as string,
            email: form.get("email") as string,
         };

         console.log(data);
         const response = await InviteUserSavings(data);
         if (response.success) {
            toast({
               title: "Savings created successfully",
            });
         } else {
            toast({
               title: "An error occurred",
               description: response.message,
            });
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   return (
      <form
         className="max-w-xl bg-white p-3 rounded-lg shadow-lg"
         onSubmit={handleSubmit}
      >
         <div className="space-y-2">
            <label className="block" htmlFor="email">
               User Email
            </label>
            <input
               type="email"
               id="email"
               name="email"
               className="w-full border border-gray-300 rounded-md p-2 "
            />
         </div>

         <div className="space-y-2">
            <label className="block" htmlFor="savingsId">
               Savings Account
            </label>
            <select
               id="savingsId"
               name="savingsId"
               className="w-full border border-gray-300 rounded-md p-2"
            >
               {savings.map((saving) => (
                  <option key={saving.id} value={saving.id}>
                     {saving.title}
                  </option>
               ))}
            </select>
         </div>

         <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 duration-200 text-white rounded-md p-2 mt-3"
            disabled={loading}
         >
            Invite User
         </button>
      </form>
   );
}

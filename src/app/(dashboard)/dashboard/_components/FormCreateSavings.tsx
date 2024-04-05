"use client";
import { useToast } from "@/components/ui/use-toast";
import { CreateSavings } from "@/server/savings";
import { useState } from "react";

export default function FormCreateSavings() {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();

   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setLoading(true);
      try {
         const form = new FormData(event.currentTarget);
         const data = {
            title: form.get("title") as string,
         };
         const response = await CreateSavings(data);
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
            <label className="block" htmlFor="title">
               Title
            </label>
            <input
               type="text"
               id="title"
               name="title"
               className="w-full border border-gray-300 rounded-md p-2 "
            />
         </div>
         <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400 duration-200 text-white rounded-md p-2 mt-3"
            disabled={loading}
         >
            Create Savings
         </button>
      </form>
   );
}

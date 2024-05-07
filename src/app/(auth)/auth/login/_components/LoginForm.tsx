"use client";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm() {
   const [loading, setLoading] = useState(false);
   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setLoading(true);
      const form = new FormData(event.currentTarget);
      const email = form.get("email") as string;
      const password = form.get("password") as string;

      const response = await signIn("credentials", {
         email,
         password,
         redirect: false,
      });

      setLoading(false);

      if (!response) {
         alert("Login failed");
         return;
      }

      if (response.error) {
         alert(response.error);
         return;
      }
      window.location.href = "/dashboard";
   }

   return (
      <form className="space-y-4" onSubmit={handleSubmit}>
         <div className="space-y-2">
            <label htmlFor="email" className="font-bold text-base">
               EMAIL
            </label>
            <input
               type="text"
               id="email"
               name="email"
               className="w-full border border-gray-300 rounded-lg p-2"
               placeholder="Email"
            />
         </div>
         <div className="space-y-2">
            <label htmlFor="password" className="font-bold text-base">
               PASSWORD
            </label>
            <input
               type="password"
               id="password"
               name="password"
               className="w-full border border-gray-300 rounded-lg p-2"
               placeholder="Password"
            />
         </div>
         <div>
            <Button type="submit" className="w-full" disabled={loading}>
               LOGIN
            </Button>
         </div>
      </form>
   );
}

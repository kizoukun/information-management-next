"use client";

import { Register } from "@/server/auth";
import { useState } from "react";

export default function RegisterForm() {
   const [loading, setLoading] = useState(false);
   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
      setLoading(true);
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const data = {
         firstName: form.get("firstName") as string,
         lastName: form.get("lastName") as string,
         email: form.get("email") as string,
         password: form.get("password") as string,
         confirmPassword: form.get("confirmPassword") as string,
      };

      if (data.password !== data.confirmPassword) {
         alert("Password dan Confirm Password tidak sama");
         setLoading(false);
         return;
      }

      try {
         const response = await Register(data);
         setLoading(false);
         if (!response.success) {
            alert(response.message);
            return;
         }

         alert(response.message);
      } catch (err) {
         setLoading(false);
         alert("Terjadi kesalahan");
      }
   }

   return (
      <form className="space-y-4" onSubmit={handleSubmit}>
         <div className="space-y-2">
            <label htmlFor="firstName" className="font-bold text-base">
               FIRST NAME
            </label>
            <input
               type="text"
               id="firstName"
               name="firstName"
               className="w-full border border-gray-300 rounded-lg p-2"
               placeholder="First Name"
            />
         </div>
         <div className="space-y-2">
            <label htmlFor="lastName" className="font-bold text-base">
               LAST NAME
            </label>
            <input
               type="text"
               id="lastName"
               name="lastName"
               className="w-full border border-gray-300 rounded-lg p-2"
               placeholder="Last Name"
            />
         </div>
         <div className="space-y-2">
            <label htmlFor="email" className="font-bold text-base">
               EMAIL
            </label>
            <input
               type="email"
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
         <div className="space-y-2">
            <label htmlFor="confirmPassword" className="font-bold text-base">
               CONFIRM PASSWORD
            </label>
            <input
               type="password"
               id="confirmPassword"
               name="confirmPassword"
               className="w-full border border-gray-300 rounded-lg p-2"
               placeholder="Confirm Password"
            />
         </div>
         <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 disabled:bg-blue-400 text-white font-bold p-2 rounded-lg"
         >
            REGISTER
         </button>
      </form>
   );
}

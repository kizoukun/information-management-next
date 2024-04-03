"use client";
import { signOut } from "next-auth/react";

export default function TestLogout() {
   return (
      <button
         type="submit"
         onClick={() => signOut()}
         className="bg-blue-500 text-white rounded-lg p-2"
      >
         Logout
      </button>
   );
}

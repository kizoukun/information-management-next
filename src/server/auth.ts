"use server";
import { db } from "@/lib/db";
import "server-only";
import { z } from "zod";
const bcrypt = require("bcrypt");

const RegisterSchema = z.object({
   firstName: z.string(),
   lastName: z.string(),
   email: z.string().email(),
   password: z.string().min(8),
   confirmPassword: z.string(),
});

export async function Register(formData: unknown) {
   const parse = RegisterSchema.safeParse(formData);

   if (!parse.success) {
      let errorMessage = "";
      for (const error of parse.error.errors) {
         errorMessage += error.message + "\n";
      }
      return { success: false, message: errorMessage };
   }

   const data = parse.data;

   if (data.password !== data.confirmPassword) {
      return {
         success: false,
         message: "Password dan Confirm Password tidak sama",
      };
   }

   const user = await db.user.findFirst({
      where: {
         email: data.email,
      },
   });

   if (user) {
      return { success: false, message: "Email sudah terdaftar" };
   }

   const password = await bcrypt.hash(data.password, 10);
   await db.user.create({
      data: {
         firstName: data.firstName,
         lastName: data.lastName,
         email: data.email,
         password: password,
      },
   });

   return { success: true, message: "Registrasi berhasil" };
}

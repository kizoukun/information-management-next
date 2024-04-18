"use server";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import { EditUserFormValidation } from "@/lib/validation/user";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import "server-only";

export async function EditUserProfile(form: unknown) {
   const validate = EditUserFormValidation.safeParse(form);
   if (!validate.success) {
      let message = "";
      for (const error of validate.error.errors) {
         message += error.message + "\n";
      }
      return { success: false, message };
   }

   const data = validate.data;

   const user = await getServerSession(authOptions);

   if (!user) {
      return { success: false, message: "You need to be logged in" };
   }

   try {
      const userUpdate = await db.user.update({
         where: {
            id: user.user.id,
         },
         data: {
            firstName: data.firstName,
            lastName: data.lastName,
         },
      });
      revalidatePath("/dashboard");
      return {
         success: true,
         message: "Successfully updated user profile",
      };
   } catch (err) {
      return {
         success: false,
         message: "Failed to update user profile",
      };
   }
}

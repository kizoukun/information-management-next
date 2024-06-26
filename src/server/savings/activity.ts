"use server";
import "server-only";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/db";
import {
   AddSavingsActivityFormValidation,
   DeleteSavingsActivityFormValidation,
   EditSavingsActivityFormValidation,
} from "@/lib/validation/savings";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function AddSavingsLog(form: unknown) {
   const validation = AddSavingsActivityFormValidation.safeParse(form);
   if (!validation.success) {
      let message = "";
      for (const error of validation.error.errors) {
         message += error.message + "\n";
      }
      return { success: false, message };
   }

   const data = validation.data;
   const user = await getServerSession(authOptions);
   if (!user) {
      return { success: false, message: "You need to be logged in" };
   }

   const saving = await db.savings.findFirst({
      where: {
         id: data.savingsId,
      },
      include: {
         SavingsUser: {
            include: {
               user: true,
            },
         },
      },
   });

   if (!saving) {
      return { success: false, message: "Savings not found" };
   }

   const isUserInSavings = saving.SavingsUser.some(
      (user) => user.userId === user.user.id
   );

   if (!isUserInSavings) {
      return { success: false, message: "You are not in this savings" };
   }

   const activityType = data.type === "income" ? true : false;

   const log = await db.savingsLog.create({
      data: {
         amount: data.amount,
         description: data.description,
         savingsId: data.savingsId,
         type: activityType,
         savingTime: data.date,
         userId: user.user.id,
      },
   });

   revalidatePath("/dashboard/savings/" + data.savingsId);
   return {
      success: true,
      message: "Activity successfully logged",
   };
}

export async function DeleteSavingsActivityAction(form: unknown) {
   const validate = DeleteSavingsActivityFormValidation.safeParse(form);
   if (!validate.success) {
      let message = "";
      for (const error of validate.error.errors) {
         message += error.message + "\n";
      }
      return { success: false, message };
   }

   const data = validate.data;

   const authUser = await getServerSession(authOptions);
   if (!authUser) {
      return { success: false, message: "You need to be logged in" };
   }

   const log = await db.savingsLog.findFirst({
      where: {
         id: data.savingsLogId,
      },
      include: {
         savings: {
            include: {
               SavingsUser: true,
            },
         },
      },
   });

   if (!log) {
      return { success: false, message: "Log not found" };
   }

   if (!log.savings) {
      return { success: false, message: "Savings not found" };
   }

   const isInUserGroup = log.savings.SavingsUser.some(
      (user) => user.userId === authUser.user.id
   );

   if (!isInUserGroup) {
      return { success: false, message: "You are not in this savings" };
   }

   await db.savingsLog.delete({
      where: {
         id: data.savingsLogId,
      },
   });

   revalidatePath("/dashboard/savings/" + log.savingsId);
   return {
      success: true,
      message: "Log successfully deleted",
   };
}

export async function EditSavingsActivityAction(form: unknown) {
   const validate = EditSavingsActivityFormValidation.safeParse(form);
   if (!validate.success) {
      let message = "";
      for (const error of validate.error.errors) {
         message += error.message + "\n";
      }
      return { success: false, message };
   }

   const data = validate.data;

   const authUser = await getServerSession(authOptions);
   if (!authUser) {
      return { success: false, message: "You need to be logged in" };
   }

   const log = await db.savingsLog.findFirst({
      where: {
         id: data.savingsLogId,
      },
      include: {
         savings: {
            include: {
               SavingsUser: true,
            },
         },
      },
   });

   if (!log) {
      return { success: false, message: "Log not found" };
   }

   if (!log.savings) {
      return { success: false, message: "Savings not found" };
   }

   const isInUserGroup = log.savings.SavingsUser.some(
      (user) => user.userId === authUser.user.id
   );

   if (!isInUserGroup) {
      return { success: false, message: "You are not in this savings" };
   }

   const activityType = data.type === "income" ? true : false;

   await db.savingsLog.update({
      where: {
         id: data.savingsLogId,
      },
      data: {
         amount: data.amount,
         description: data.description,
         type: activityType,
         savingTime: data.date,
      },
   });

   revalidatePath("/dashboard/savings/" + log.savingsId);
   return {
      success: true,
      message: "Log successfully updated",
   };
}

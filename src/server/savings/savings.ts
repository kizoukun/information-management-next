"use server";
import "server-only";
import {
   CreateSavingsFormValidation,
   DeleteSavingsFormValidation,
   DeleteUserSavingsFormValidation,
   EditSavingsFormValidation,
   InviteUserSavingsFormValidation,
} from "@/lib/validation/savings";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";

export async function CreateSavings(form: unknown) {
   const validate = CreateSavingsFormValidation.safeParse(form);
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
      const create = await db.savings.create({
         data: {
            title: data.title,
            creatorId: user.user.id,
         },
      });

      const savingUser = await db.savingsUser.create({
         data: {
            userId: user.user.id,
            savingsId: create.id,
         },
      });
      revalidatePath("/dashboard");
      return {
         success: true,
         message: "Successfully created a savings account",
      };
   } catch (err) {
      return {
         success: false,
         message: "Failed to create, error in the database",
      };
   }
}

export async function InviteUserSavings(form: unknown) {
   const validate = InviteUserSavingsFormValidation.safeParse(form);
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

   const userInvite = await db.user.findFirst({
      where: {
         email: data.email,
      },
   });

   if (!userInvite) {
      return { success: false, message: "User not found" };
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

   if (saving.creatorId !== user.user.id) {
      return {
         success: false,
         message: "You are not the creator of this savings",
      };
   }

   const isUserAlreadyInvited = saving.SavingsUser.some(
      (user) => user.userId === userInvite.id
   );

   if (isUserAlreadyInvited) {
      return { success: false, message: "User already invited" };
   }

   const savingUser = await db.savingsUser.create({
      data: {
         userId: userInvite.id,
         savingsId: data.savingsId,
      },
   });

   revalidatePath("/dashboard");

   return {
      success: true,
      message: "User successfully invited to the savings account",
   };
}

export async function DeleteUserSavings(form: unknown) {
   const validate = DeleteUserSavingsFormValidation.safeParse(form);
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

   if (saving.creatorId !== user.user.id) {
      return {
         success: false,
         message: "You are not the creator of this savings",
      };
   }

   const userToDelete = saving.SavingsUser.find(
      (user) => user.userId === data.userId
   );

   if (!userToDelete) {
      return { success: false, message: "User not found in savings" };
   }

   await db.savingsUser.delete({
      where: {
         id: userToDelete.id,
      },
   });

   revalidatePath("/dashboard/savings/" + data.savingsId);
   revalidatePath("/dashboard");

   return {
      success: true,
      message: "User successfully deleted from the savings account",
   };
}

export async function DeleteSavingsAction(form: unknown) {
   const validate = DeleteSavingsFormValidation.safeParse(form);
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

   const isOwner = saving.creatorId === user.user.id;

   if (!isOwner) {
      return {
         success: false,
         message: "You are not the owner of this savings",
      };
   }

   if (saving.SavingsUser.length > 1) {
      return {
         success: false,
         message: "You can't delete a savings with users",
      };
   }

   await db.savings.delete({
      where: {
         id: data.savingsId,
      },
   });

   revalidatePath("/dashboard");
   return {
      success: true,
      message: "Savings successfully deleted",
   };
}

export async function EditSavingsAction(form: unknown) {
   const validate = EditSavingsFormValidation.safeParse(form);
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

   const saving = await db.savings.findFirst({
      where: {
         id: data.savingsId,
      },
      include: {
         SavingsUser: true,
      },
   });

   if (!saving) {
      return { success: false, message: "Log not found" };
   }

   const isOwner = saving.creatorId === user.user.id;

   if (!isOwner) {
      return {
         success: false,
         message: "You are not the owner of this savings",
      };
   }

   await db.savings.update({
      where: {
         id: data.savingsId,
      },
      data: {
         title: data.title,
      },
   });

   revalidatePath("/dashboard/savings/" + data.savingsId);
   return {
      success: true,
      message: "Savings successfully edited",
   };
}

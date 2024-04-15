import { z } from "zod";

export const CreateSavingsFormValidation = z.object({
   title: z
      .string({ required_error: "Please input the title " })
      .min(3, "Title must be at least 3 characters"),
});

export const InviteUserSavingsFormValidation = z.object({
   email: z
      .string({ required_error: "Please input user email" })
      .email({ message: "Please input a valid email" }),
   savingsId: z.string({ required_error: "Please input the savings id" }),
});

export const DeleteUserSavingsFormValidation = z.object({
   userId: z.string({ required_error: "Please input the user id" }),
   savingsId: z.string({ required_error: "Please input the savings id" }),
});

export const AddSavingsActivityFormValidation = z.object({
   amount: z
      .number({ required_error: "Please input the amount" })
      .min(1, "Amount must be greater than 1"),
   description: z
      .string({ required_error: "Please input the description" })
      .min(10, {
         message: "Description must be at least 10 characters",
      }),
   savingsId: z.string({ required_error: "Please input the savings id" }),
   type: z.enum(["income", "expense"], {
      required_error: "Please select the type",
   }),
   date: z.date({ required_error: "Please input the date" }),
});

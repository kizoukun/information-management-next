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

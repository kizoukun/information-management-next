import { z } from "zod";

export const EditUserFormValidation = z.object({
   firstName: z.string().min(2).max(255),
   lastName: z.string().min(2).max(255),
});

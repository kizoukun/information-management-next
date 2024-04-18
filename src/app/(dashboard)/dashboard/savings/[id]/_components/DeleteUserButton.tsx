"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DeleteUserSavings } from "@/server/savings/savings";
import { useState } from "react";

export default function DeleteUserButton(props: {
   isOwner: boolean;
   savingsId: string;
   userId: string;
}) {
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();

   async function handleDeleteUser() {
      // Implement delete user logic here
      const form = {
         savingsId: props.savingsId,
         userId: props.userId,
      };

      setLoading(true);

      try {
         const response = await DeleteUserSavings(form);
         if (response.success) {
            toast({
               title: "User removed successfully",
            });
         } else {
            toast({
               title: "An error occurred",
               description: response.message,
            });
         }
      } catch (err) {
         toast({
            title: "An error occurred",
            description:
               "Unexpected error occurred while deleting user. Please try again later.",
         });
      } finally {
         setLoading(false);
      }
   }

   return (
      <Button
         className="mt-4 w-full"
         variant={"destructive"}
         disabled={!props.isOwner || loading}
         onClick={handleDeleteUser}
      >
         {props.isOwner ? "Remove" : "No Access"}
      </Button>
   );
}

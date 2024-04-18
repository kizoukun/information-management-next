"use client";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { DeleteSavingsActivityAction } from "@/server/savings";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteSavingsActivityProps = {
   savingsLogId: string;
};

export default function DeleteSavingsActivityDialog(props: DeleteSavingsActivityProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();

   async function handleDelete() {
      try {
         setLoading(true);
         const form = {
            savingsLogId: props.savingsLogId,
         };

         const response = await DeleteSavingsActivityAction(form);
         if (response.success) {
            toast({
               title: "Savings Deleted successfully",
            });
         } else {
            toast({
               title: "Error",
               description: response.message,
            });
         }
      } catch (error) {
         console.error(error);
         toast({
            title: "Error",
            description: "An error occurred while deleting savings",
         });
      } finally {
         setLoading(false);
      }
   }

   return (
      <Dialog>
         <DialogTrigger asChild>
            <Button variant={"destructive"}>Delete</Button>
         </DialogTrigger>
         <DialogContent className="md:max-w-[540px]">
            <DialogHeader>
               <DialogTitle>Delete Savings Activity</DialogTitle>
               <DialogDescription>
                  ARE YOU SURE TO DELETE THIS SAVINGS ACTIVITY?
               </DialogDescription>
            </DialogHeader>
            <DialogFooter>
               <Button
                  onClick={handleDelete}
                  disabled={loading}
                  variant={"destructive"}
               >
                  Delete
               </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   );
}

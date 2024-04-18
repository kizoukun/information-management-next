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
import { DeleteSavingsAction } from "@/server/savings/savings";
import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteSavingsProps = {
   savingsId: string;
};

export default function DeleteSavings(props: DeleteSavingsProps) {
   const router = useRouter();
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();

   async function handleDelete() {
      try {
         setLoading(true);
         const form = {
            savingsId: props.savingsId,
         };

         const response = await DeleteSavingsAction(form);
         if (response.success) {
            toast({
               title: "Savings Deleted successfully",
            });
            router.push("/dashboard");
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
            <Button variant={"destructive"}>Delete Savings</Button>
         </DialogTrigger>
         <DialogContent className="md:max-w-[540px]">
            <DialogHeader>
               <DialogTitle>Delete Savings</DialogTitle>
               <DialogDescription>
                  ARE YOU SURE TO DELETE THIS SAVINGS?
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

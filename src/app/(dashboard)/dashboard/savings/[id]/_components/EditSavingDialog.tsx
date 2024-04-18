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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import Icon from "@/components/Icon";
import { EditSavingsAction } from "@/server/savings/savings";

export default function EditSavingDialog(props: {
   title: string;
   savingsId: string;
}) {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const { toast } = useToast();

   async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault();
      // Implement form submission here
      setLoading(true);
      try {
         const form = new FormData(evt.currentTarget);
         const data = {
            title: form.get("title") as string,
            savingsId: props.savingsId,
         };
         const response = await EditSavingsAction(data);
         if (response.success) {
            setOpen(false);
            toast({
               title: "Savings created successfully",
            });
         } else {
            toast({
               title: "An error occurred",
               description: response.message,
            });
         }
      } catch (err) {
         console.error(err);
      } finally {
         setLoading(false);
      }
   }

   return (
      <Dialog open={open} onOpenChange={(d) => setOpen(!open)}>
         <DialogTrigger asChild>
            <Icon
               icon={"bxs:edit"}
               className="w-6 h-6"
               onClick={() => setOpen(!open)}
            />
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Edit Saving</DialogTitle>
                  <DialogDescription>
                     Edit your saving to start documenting your expenses
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="title" className="text-right">
                        Title
                     </Label>
                     <Input
                        id="title"
                        name="title"
                        className="col-span-3"
                        defaultValue={props.title}
                     />
                  </div>
               </div>
               <DialogFooter>
                  <Button type="submit" disabled={loading}>
                     Save changes
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

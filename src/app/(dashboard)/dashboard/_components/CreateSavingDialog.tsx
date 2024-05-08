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
import { CreateSavings } from "@/server/savings/savings";
import { useState } from "react";

export default function CreateSavingDialog() {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const { toast } = useToast();

   async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault();
      // Implement form submission here
      setLoading(true);
      try {
         const form = new FormData(evt.currentTarget);
         let target = Number(form.get("target"));
         if (isNaN(target)) {
            target = 0;
         }
         const data = {
            title: form.get("title") as string,
            target: target,
         };
         const response = await CreateSavings(data);
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
            <Button onClick={() => setOpen(!open)}>Add Savings</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Create Saving</DialogTitle>
                  <DialogDescription>
                     Create your own saving to start documenting your expenses
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="title" className="text-right">
                        Title
                     </Label>
                     <Input id="title" name="title" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="target" className="text-right">
                        Target
                     </Label>
                     <Input id="target" name="target" className="col-span-3" />
                  </div>
               </div>
               <DialogFooter>
                  <Button type="submit">Save changes</Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   );
}

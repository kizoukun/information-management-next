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
import { InviteUserSavings } from "@/server/savings";
import { useState } from "react";

export default function InviteUserDialog(props: { savingsId: string }) {
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
            email: form.get("email") as string,
            savingsId: props.savingsId,
         };
         const response = await InviteUserSavings(data);
         if (response.success) {
            setOpen(false);
            toast({
               title: "Users Invited successfully",
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
            <Button onClick={() => setOpen(!open)}>Invite User</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Invite User</DialogTitle>
                  <DialogDescription>
                     Invite user to your savings account
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="email" className="text-right">
                        Email
                     </Label>
                     <Input id="email" name="email" className="col-span-3" />
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

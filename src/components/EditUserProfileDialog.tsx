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
import { EditUserProfile } from "@/server/user";
import { useRouter } from "next/navigation";

export default function EditUserProfileDialog(props: {
   firstName: string;
   lastName: string;
   setFirstName: (firstName: string) => void;
   setLastName: (lastName: string) => void;
}) {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const { toast } = useToast();

   async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault();
      setLoading(true);
      try {
         const form = new FormData(evt.currentTarget);
         const data = {
            firstName: form.get("firstName") as string,
            lastName: form.get("lastName") as string,
         };
         const response = await EditUserProfile(data);
         if (response.success) {
            setOpen(false);
            toast({
               title: "User updated successfully",
            });
            // window.location.reload();
            props.setFirstName(data.firstName);
            props.setLastName(data.lastName);
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
                  <DialogTitle>Edit User Profile</DialogTitle>
                  <DialogDescription>
                     Change your profile information
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="firstName" className="text-right">
                        First Name
                     </Label>
                     <Input
                        id="firstName"
                        name="firstName"
                        className="col-span-3"
                        defaultValue={props.firstName}
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="lastName" className="text-right">
                        Last Name
                     </Label>
                     <Input
                        id="lastName"
                        name="lastName"
                        className="col-span-3"
                        defaultValue={props.lastName}
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

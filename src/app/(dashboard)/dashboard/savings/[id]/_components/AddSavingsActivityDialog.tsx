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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import DatePicker from "./DatePicker";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { AddSavingsLog } from "@/server/savings/activity";

export default function AddSavingsActivityDialog(props: { savingsId: string }) {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const [date, setDate] = useState<Date>(new Date());
   const { toast } = useToast();

   async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
      evt.preventDefault();
      // Implement form submission here
      setLoading(true);
      try {
         const form = new FormData(evt.currentTarget);
         const amount = Number(form.get("amount"));
         const data = {
            amount: isNaN(amount) ? -1 : amount,
            description: form.get("description") as string,
            type: form.get("type") as string,
            date: date,
            savingsId: props.savingsId,
         };
         const response = await AddSavingsLog(data);
         if (response.success) {
            setOpen(false);
            toast({
               title: "Activity added successfully",
            });
            setDate(new Date(new Date()));
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
            <Button onClick={() => setOpen(!open)}>Add Saving Activity</Button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Add Savings Activity</DialogTitle>
                  <DialogDescription>
                     Add a new activity to your savings
                  </DialogDescription>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="amount" className="text-right">
                        Amount
                     </Label>
                     <Input
                        id="amount"
                        name="amount"
                        type="number"
                        className="col-span-3"
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="description" className="text-right">
                        Description
                     </Label>
                     <Textarea
                        id="description"
                        name="description"
                        className="col-span-3"
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="type" className="text-right">
                        Type
                     </Label>
                     <Select defaultValue="income" name="type">
                        <SelectTrigger className="col-span-3">
                           <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="income">Income</SelectItem>
                           <SelectItem value="expense">Expense</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="date" className="text-right">
                        Date
                     </Label>
                     <DatePicker date={date} setDate={setDate} />
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

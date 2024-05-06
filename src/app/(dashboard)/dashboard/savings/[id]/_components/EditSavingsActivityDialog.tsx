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
import { EditSavingsActivityAction } from "@/server/savings/activity";
import DeleteSavingsActivityDialog from "./DeleteSavingsActivityDialog";

type AddSavingsActivityProps = {
   savingsLogId: string;
   amount?: number;
   description?: string;
   type?: boolean;
   date?: Date;
};

export default function EditSavingsActivityDialog(
   props: AddSavingsActivityProps
) {
   const [loading, setLoading] = useState(false);
   const [open, setOpen] = useState(false);
   const [date, setDate] = useState<Date>(props.date || new Date());
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
            savingsLogId: props.savingsLogId,
         };
         const response = await EditSavingsActivityAction(data);
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
            <button
               className="absolute  top-1 right-1 text-sm font-semibold p-1 rounded-xl brightness-95 hover:brightness-100"
               onClick={() => setOpen(!open)}
            >
               <svg
                  className="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24px"
                  viewBox="0 0 24 24"
               >
                  <rect width="24" height="24" fill="none" />
                  <g
                     fill="none"
                     stroke="#000"
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth="2"
                  >
                     <path d="M7 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-1" />
                     <path d="M20.385 6.585a2.1 2.1 0 0 0-2.97-2.97L9 12v3h3zM16 5l3 3" />
                  </g>
               </svg>
            </button>
         </DialogTrigger>
         <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit}>
               <DialogHeader>
                  <DialogTitle>Edit Savings Activity</DialogTitle>
                  <DialogDescription>
                     Edit a new activity to your savings
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
                        defaultValue={props.amount}
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
                        defaultValue={props.description}
                     />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                     <Label htmlFor="type" className="text-right">
                        Type
                     </Label>
                     <Select
                        defaultValue={props.type ? "income" : "expense"}
                        name="type"
                     >
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
            <DeleteSavingsActivityDialog savingsLogId={props.savingsLogId} />
         </DialogContent>
      </Dialog>
   );
}

"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

export default function DatePicker({
   date,
   setDate,
}: {
   date: Date;
   setDate: (date: Date) => void;
}) {
   const [open, setOpen] = useState(false);
   return (
      <Popover open={open} onOpenChange={(t) => setOpen(t)}>
         <PopoverTrigger asChild>
            <Button
               variant={"outline"}
               onClick={() => setOpen(true)}
               className={cn(
                  "col-span-3 justify-start text-left font-normal",
                  !date && "text-muted-foreground"
               )}
            >
               <CalendarIcon className="mr-2 h-4 w-4" />
               {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0">
            <Calendar
               mode="single"
               selected={date}
               onSelect={(date) => {
                  setDate(date || new Date());
                  setOpen(false);
               }}
               initialFocus
            />
         </PopoverContent>
      </Popover>
   );
}

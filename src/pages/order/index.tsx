import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from '@/utils/cn';
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon, FileDown } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import OrderTabs from "./components/StatusTab";

function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 1),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[250px] justify-start text-left font-normal h-[42px]",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function Order() {
  return (
    <>
      <div className="bg-[#f6f7f7] pt-2 border-b">
        <div className="flex gap-3 mt-5 mx-8">
          <div className="mb-4 w-full col-span-2">
            <input
              type="text"
              className="border p-2 w-full rounded-md"
              placeholder="Search by tracking code or order code"
            />
          </div>
          <div className="items-center mb-4 flex gap-3">
            <DatePickerWithRange />
            <Button className="h-[40px]">
              <FileDown /> Import excel
            </Button>
          </div>
        </div>
      </div>
      <OrderTabs />
    </>
  );
}

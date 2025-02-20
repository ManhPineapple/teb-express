import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/utils/cn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { useSearchParams } from "react-router-dom";

export function BillDatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: searchParams.get("start_date")
      ? new Date(String(searchParams.get("start_date")))
      : undefined,
    to: searchParams.get("end_date")
      ? new Date(String(searchParams.get("end_date")))
      : undefined,
  });

  const handleCancel = () => {
    searchParams.delete("start_date");
    searchParams.delete("end_date");
    searchParams.delete("by_date");
    setDate({ from: undefined, to: undefined });
    setSearchParams(searchParams);
  };

  const handleCreateDate = () => {
    if (date?.from && date?.to) {
      setSearchParams({
        ...Object.fromEntries(searchParams),
        page: "1",
        start_date: format(date.from, "yyyy-MM-dd"),
        end_date: format(date.to, "yyyy-MM-dd"),
      });
    } else {
      searchParams.delete("start_date");
      searchParams.delete("end_date");
      setSearchParams(searchParams);
    }
    window.location.reload();
  };

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
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
          <div className="flex justify-end gap-2 my-2 r-0">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button className="bg-green-400" onClick={handleCreateDate}>
              Apply
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

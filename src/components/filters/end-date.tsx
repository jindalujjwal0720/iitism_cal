import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFilters } from "@/providers/filters";
import { cn } from "@/utils/tw";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";

export const EndDateFilter = () => {
  const { startDate, setEndDate, endDate } = useFilters();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !endDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={endDate ? new Date(endDate) : undefined}
          onSelect={(date) => setEndDate(date?.toISOString() ?? "")}
          initialFocus
          disabled={
            startDate ? (date) => date < new Date(startDate) : undefined
          }
        />
      </PopoverContent>
    </Popover>
  );
};

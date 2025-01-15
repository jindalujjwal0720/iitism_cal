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

export const StartDateFilter = () => {
  const { startDate, setStartDate, endDate } = useFilters();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={startDate ? new Date(startDate) : undefined}
          onSelect={(date) => setStartDate(date?.toISOString() ?? "")}
          initialFocus
          disabled={endDate ? (date) => date > new Date(endDate) : undefined}
        />
      </PopoverContent>
    </Popover>
  );
};

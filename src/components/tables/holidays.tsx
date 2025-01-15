import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useHolidays } from "@/hooks/use-holidays";
import { ShiftType } from "@/types";
import { format } from "date-fns";

export const HolidaysTable = () => {
  const [holidays, { isLoading, isError }] = useHolidays();
  return (
    <Table className="w-full">
      <TableCaption>
        {holidays.length === 0
          ? isLoading
            ? "Loading holidays..."
            : isError
              ? "Failed to load holidays."
              : "No holidays found."
          : "Holidays"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Start date</TableHead>
          <TableHead>End date</TableHead>
          <TableHead>Desscription</TableHead>
          <TableHead>Remark</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays.map((holiday) => (
          <TableRow key={holiday.description}>
            <TableCell>{format(holiday.startDate, "d MMM yyyy")}</TableCell>
            <TableCell>{format(holiday.endDate, "d MMM yyyy")}</TableCell>
            <TableCell>{holiday.description}</TableCell>
            <TableCell>
              {holiday.shift === ShiftType.MORNING
                ? "Morning off"
                : holiday.shift === ShiftType.AFTERNOON
                  ? "Afternoon off"
                  : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

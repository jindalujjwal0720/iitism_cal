import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useExtraWorkingDays } from "@/hooks/use-extra-working-days";
import { ShiftType } from "@/types";
import { format } from "date-fns";

export const ExtraWorkingDaysTable = () => {
  const [workingDays, { isLoading, isError }] = useExtraWorkingDays();

  return (
    <Table className="w-full">
      <TableCaption>
        {workingDays.length === 0
          ? isLoading
            ? "Loading extra working days..."
            : isError
              ? "Failed to load extra working days."
              : "No extra working days found."
          : "Extra working days"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Replaced by</TableHead>
          <TableHead>Shift</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workingDays.map((wd) => (
          <TableRow key={wd.date}>
            <TableCell>{format(wd.date, "d MMM yyyy")}</TableCell>
            <TableCell>{wd.replacedDay}</TableCell>
            <TableCell>
              {wd.shift === ShiftType.MORNING
                ? "Morning"
                : wd.shift === ShiftType.AFTERNOON
                  ? "Afternoon"
                  : "-"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

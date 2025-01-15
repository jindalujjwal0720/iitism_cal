import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCalendarEvents } from "@/providers/calendar-events";
import { format } from "date-fns";

export const ClassScheduleTable = () => {
  const { events } = useCalendarEvents();
  return (
    <Table className="w-full">
      <TableCaption>
        {events.length === 0 ? "No events found." : "Calendar events"}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Desscription</TableHead>
          <TableHead>Location</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => {
          return (
            <TableRow key={event["Start Date"]}>
              <TableCell>
                {format(new Date(event["Start Date"]), "d MMM yyyy")} (
                {format(new Date(event["Start Date"]), "EEEE")})
              </TableCell>
              <TableCell>
                {format(new Date(event["Start Date"]), "h:mm")} -{" "}
                {format(new Date(event["End Date"]), "p")}
              </TableCell>
              <TableCell>{event.Description}</TableCell>
              <TableCell>{event.Location}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

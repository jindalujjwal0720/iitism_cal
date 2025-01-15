import { useCalendarEvents } from "@/providers/calendar-events";
import { Button } from "../ui/button";
import { generateICS } from "@/utils/ics";

const DownloadICSAction = () => {
  const { events } = useCalendarEvents();

  if (events.length === 0) return null;

  const handleDownloadICS = () => {
    const isc = generateICS(events);
    const blob = new Blob([isc], { type: "text/calendar" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "calendar.ics";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Button className="w-full" onClick={handleDownloadICS}>
      Download ICS
    </Button>
  );
};

export default DownloadICSAction;

import { CalendarEvent } from "@/types";

export function generateICS(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "CALSCALE:GREGORIAN",
    "PRODID:-//IIT(ISM) Dhanbad//Ujjwal Jindal(2025) Calendar//EN",
  ];

  for (const event of events) {
    const uid = generateUID(event.Subject);
    const dtStamp = new Date().toISOString();

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${formatToICSDateTime(dtStamp)}`);
    lines.push(`SUMMARY:${event.Subject}`);
    lines.push(`DTSTART:${formatToICSDateTime(event["Start Date"])}`);
    lines.push(`DTEND:${formatToICSDateTime(event["End Date"])}`);
    lines.push(`LOCATION:${event.Location}`);
    lines.push(`DESCRIPTION:${event.Description}`);
    // for (const attendee of event.Attendees) {
    //     lines.push(`ATTENDEE;RSVP=TRUE:mailto:${attendee}`);
    // }
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

// Helper function to format date-time for ICS (e.g., "20250114T093000Z")
function formatToICSDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

// Helper function to generate a unique UID for each event
function generateUID(subject: string): string {
  const random = `${Math.random()
    .toString(36)
    .substring(2, 15)}${Date.now().toString(36)}`;
  return `${subject.replace(/\s+/g, "_")}-${random}@iitism.ac.in`;
}

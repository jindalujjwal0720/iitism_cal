import { CalendarConverter } from "./utils/calendar-converter";
import { writeFile } from "fs/promises";
import { generateICS } from "./utils/ics";
import { JsonDataSource } from "./utils/json-data-source";

const HOLIDAYS_FILE = "src/assets/holidays.csv";
const WORKING_DAYS_FILE = "src/assets/working_days.csv";
const SCHEDULE_FILE = "src/assets/cse-clean.csv";
const OUTPUT_FILE = "calendar_events.csv";

const START_DATE = "2025-01-14";
const END_DATE = "2025-01-20";

async function generateFromCsv() {
  const dataSource = new JsonDataSource();

  // Load data from CSV files
  const [holidays, workingDays, courses] = await Promise.all([
    dataSource.loadHolidays(HOLIDAYS_FILE),
    dataSource.loadWorkingDays(WORKING_DAYS_FILE),
    dataSource.loadSchedule(SCHEDULE_FILE),
  ]);

  // Create converter with loaded data
  const converter = new CalendarConverter(holidays, workingDays);

  // Generate events
  const events = converter.generateCalendarEvents(
    courses[0],
    START_DATE,
    END_DATE,
  );

  // Save events
  await writeFile(
    OUTPUT_FILE,
    [
      Object.keys(events[0]).join(","),
      ...events.map((event) => Object.values(event).join(",")),
    ].join("\n"),
  );

  // create iCal file
  const ics = generateICS(events);
  await writeFile("calendar_events.ics", ics);

  console.log("Calendar events generated successfully!");
}

generateFromCsv();

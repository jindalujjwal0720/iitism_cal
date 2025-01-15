import { createReadStream } from "fs";
import { parse as csvParse } from "csv-parse";
import { parse } from "date-fns";
import {
  Holiday,
  WorkingDayAdjustment,
  ClassSchedule,
  ShiftType,
  Course,
} from "../types";

export class CsvDataSource {
  async loadHolidays(filename: string): Promise<Holiday[]> {
    const holidays: Holiday[] = [];
    const parser = createReadStream(filename).pipe(
      csvParse({ columns: true, skip_empty_lines: true }),
    );

    for await (const record of parser) {
      holidays.push({
        startDate: parse(record.StartDate.trim(), "yyyy-MM-dd", new Date()),
        endDate: parse(record.EndDate.trim(), "yyyy-MM-dd", new Date()),
        description: record.Description.trim(),
        shift: record.Shift.trim() as ShiftType,
      });
    }

    return holidays;
  }

  async loadWorkingDays(filename: string): Promise<WorkingDayAdjustment[]> {
    const adjustments: WorkingDayAdjustment[] = [];
    const parser = createReadStream(filename).pipe(
      csvParse({ columns: true, skip_empty_lines: true }),
    );

    for await (const record of parser) {
      adjustments.push({
        date: record.Date.trim(),
        replacedDay: record.ReplacedDay.trim(),
        shift: record.Shift.trim() as ShiftType,
      });
    }

    return adjustments;
  }

  async loadSchedule(filename: string): Promise<Course[]> {
    const courses: Course[] = [];

    const rows: { [key: string]: string }[] = [];
    const parser = createReadStream(filename).pipe(
      csvParse({ columns: true, skip_empty_lines: true }),
    );

    for await (const record of parser) {
      rows.push(record);
    }

    const codes = Array.from(new Set(rows.map((row) => row.Course)));

    for (const code of codes) {
      const courseRows = rows.filter((row) => row.Course === code);
      const schedule: ClassSchedule[] = courseRows.map((row) => ({
        day: row.Day.trim(),
        time: row.Time.trim(),
        venue: row.Venue.trim(),
      }));

      courses.push({
        code: code,
        name: courseRows[0]["Course Name"].trim(),
        instructor: courseRows[0]["Instructor name"].trim(),
        schedule: schedule,
      });
    }

    return courses;
  }
}

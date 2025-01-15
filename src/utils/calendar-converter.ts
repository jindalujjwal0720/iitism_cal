import { parse, format, isWithinInterval, addDays, add } from "date-fns";
import {
  ShiftType,
  Holiday,
  WorkingDayAdjustment,
  CalendarEvent,
  Course,
} from "../types";

export class CalendarConverter {
  private readonly SHIFT_CUTOFF = "13:00";
  private holidays: Holiday[] = [];
  private workingDayAdjustments: WorkingDayAdjustment[] = [];

  constructor(
    holidays: Holiday[],
    workingDayAdjustments: WorkingDayAdjustment[],
  ) {
    this.holidays = holidays;
    this.workingDayAdjustments = workingDayAdjustments;
  }

  private isWithinHoliday(checkDate: Date, timeStr: string): [boolean, string] {
    const [startTimeStr, _] = timeStr.split("-").map((t) => t.trim());
    const classStartTime = parse(startTimeStr, "HH:mm", new Date());
    const cutoff = parse(this.SHIFT_CUTOFF, "HH:mm", new Date());

    for (const holiday of this.holidays) {
      if (
        isWithinInterval(checkDate, {
          start: holiday.startDate,
          end: holiday.endDate,
        })
      ) {
        if (!holiday.shift || holiday.shift === ShiftType.FULL_DAY) {
          return [true, holiday.description];
        }

        if (
          (holiday.shift === ShiftType.MORNING && classStartTime < cutoff) ||
          (holiday.shift === ShiftType.AFTERNOON && classStartTime >= cutoff)
        ) {
          return [true, holiday.description];
        }
      }
    }
    return [false, ""];
  }

  private isTimeInShift(timeStr: string, shift: ShiftType): boolean {
    if (shift === ShiftType.FULL_DAY) {
      return true;
    }

    const classTime = parse(timeStr, "HH:mm", new Date());
    const cutoff = parse(this.SHIFT_CUTOFF, "HH:mm", new Date());

    return shift === ShiftType.MORNING
      ? classTime < cutoff
      : classTime >= cutoff;
  }

  private getDateTimeRange(dateStr: string, timeStr: string): [string, string] {
    const [startTime, endTime] = timeStr.split("-").map((t) => t.trim());

    const startDt = add(parse(dateStr, "yyyy-MM-dd", new Date()), {
      hours: parseInt(startTime.split(":")[0]),
      minutes: parseInt(startTime.split(":")[1]),
    });
    const endDt = add(parse(dateStr, "yyyy-MM-dd", new Date()), {
      hours: parseInt(endTime.split(":")[0]),
      minutes: parseInt(endTime.split(":")[1]),
    });
    return [startDt.toISOString(), endDt.toISOString()];
  }

  private isWorkingTime(
    date: Date,
    timeStr: string,
  ): [boolean, string, string] {
    const dateStr = format(date, "yyyy-MM-dd");

    // Check holidays
    const [inHoliday, holidayDesc] = this.isWithinHoliday(date, timeStr);
    if (inHoliday) {
      return [false, "", holidayDesc];
    }

    // Check working day adjustments
    const adjustment = this.workingDayAdjustments.find(
      (adj) => adj.date === dateStr,
    );
    if (adjustment) {
      if (this.isTimeInShift(timeStr, adjustment.shift)) {
        return [true, adjustment.replacedDay, ""];
      }
      return [false, "", `Not in ${adjustment.shift} shift`];
    }

    // Regular weekday (Monday-Friday)
    if (date.getDay() > 0 && date.getDay() < 6) {
      return [true, format(date, "EEEE"), ""];
    }

    return [false, "", "Weekend"];
  }

  generateCalendarEvents(
    course: Course,
    semesterStart: Date,
    semesterEnd: Date,
  ): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    // convert dates to string
    const semesterStartStr = format(semesterStart, "yyyy-MM-dd");
    const semesterEndStr = format(semesterEnd, "yyyy-MM-dd");
    let currentDate = parse(semesterStartStr, "yyyy-MM-dd", new Date());
    const endDate = parse(semesterEndStr, "yyyy-MM-dd", new Date());

    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");

      for (const classEvent of course.schedule) {
        const [isWorking, replacedDay, _] = this.isWorkingTime(
          currentDate,
          classEvent.time,
        );

        if (isWorking && classEvent.day === replacedDay) {
          const [startDt, endDt] = this.getDateTimeRange(
            dateStr,
            classEvent.time,
          );
          events.push({
            Subject: getShortName(course.name),
            "Start Date": startDt,
            "End Date": endDt,
            Location: classEvent.venue,
            Description: `Class for ${course.code} - ${course.name} by ${course.instructor}`,
          });
        }
      }

      currentDate = addDays(currentDate, 1);
    }

    return events;
  }
}

const getShortName = (name: string) => {
  const short = name
    .split(" ")
    .map((word) => word[0])
    .join("");

  if (short.length < 2) {
    return name;
  }

  return short;
};

import {
  Holiday,
  WorkingDayAdjustment,
  ClassSchedule,
  ShiftType,
  Course,
} from "../types";

export class JsonDataSource {
  async loadHolidays(url: string): Promise<Holiday[]> {
    const response = await fetch(url);
    const data = await response.json();
    return data.map(
      (holiday: {
        StartDate: string;
        EndDate: string;
        Description: string;
        Shift: string;
      }) => ({
        startDate: new Date(holiday.StartDate.trim()),
        endDate: new Date(holiday.EndDate.trim()),
        description: holiday.Description.trim(),
        shift: holiday.Shift.trim() as ShiftType,
      }),
    );
  }

  async loadWorkingDays(url: string): Promise<WorkingDayAdjustment[]> {
    const response = await fetch(url);
    const data = await response.json();
    return data.map(
      (adjustment: { Date: string; ReplacedDay: string; Shift: string }) => ({
        date: adjustment.Date.trim(),
        replacedDay: adjustment.ReplacedDay.trim(),
        shift: adjustment.Shift.trim() as ShiftType,
      }),
    );
  }

  async loadSchedule(url: string): Promise<Course[]> {
    const response = await fetch(url);
    const data = await response.json();

    const courses: Course[] = [];
    const codes = Array.from(
      new Set(data.map((course: Course) => course.code)),
    );

    for (const code of codes) {
      if (typeof code !== "string") {
        continue;
      }

      const courseRows = data.filter(
        (course: { code: string }) => course.code === code,
      );
      const schedule: ClassSchedule[] = courseRows.map(
        (course: { day: string; time: string; venue: string }) => ({
          day: course.day.trim(),
          time: course.time.trim(),
          venue: course.venue.trim(),
        }),
      );

      courses.push({
        code,
        name: courseRows[0].name.trim(),
        instructor: courseRows[0].instructor.trim(),
        schedule: schedule,
      });
    }

    return courses;
  }
}

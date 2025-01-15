export enum ShiftType {
  FULL_DAY = "FULL",
  MORNING = "MORNING", // Until 2 PM
  AFTERNOON = "AFTERNOON", // After 2 PM
}

export interface Holiday {
  startDate: Date;
  endDate: Date;
  description: string;
  shift: ShiftType;
}

export interface WorkingDayAdjustment {
  date: string;
  replacedDay: string;
  shift: ShiftType;
}

export interface ClassSchedule {
  day: string;
  time: string;
  venue: string;
}

export interface CalendarEvent {
  Subject: string;
  "Start Date": string;
  "End Date": string;
  Location: string;
  Description: string;
}

export interface ConverterConfig {
  holidays: Holiday[];
  workingDayAdjustments: WorkingDayAdjustment[];
  schedule: ClassSchedule[];
  semesterStart: string;
  semesterEnd: string;
  subject: string;
}

export interface Course {
  code: string;
  name: string;
  instructor: string;
  schedule: ClassSchedule[];
}

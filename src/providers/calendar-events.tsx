import { useExtraWorkingDays } from "@/hooks/use-extra-working-days";
import { useHolidays } from "@/hooks/use-holidays";
import { CalendarEvent } from "@/types";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useFilters } from "./filters";
import { CalendarConverter } from "@/utils/calendar-converter";
import { useCourses } from "@/hooks/use-courses";

interface CalendarEventsContextData {
  events: CalendarEvent[];
}

const CalendarEventsContext = createContext<CalendarEventsContextData>(
  {} as CalendarEventsContextData,
);

export const CalendarEventsProvider = ({ children }: PropsWithChildren) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [holidays] = useHolidays();
  const [extraWorkingDays] = useExtraWorkingDays();
  const { startDate, endDate, course: courseCode } = useFilters();
  const [courses] = useCourses();
  const calendarConverter = useMemo(
    () => new CalendarConverter(holidays, extraWorkingDays),
    [holidays, extraWorkingDays],
  );

  useEffect(() => {
    if (!startDate || !endDate || !holidays || !extraWorkingDays) return;

    const course = courses.find((c) => c.code === courseCode);
    if (!course) return;

    console.log(course);
    console.log(startDate);
    console.log(endDate);
    console.log(holidays);
    console.log(extraWorkingDays);

    const $events = calendarConverter.generateCalendarEvents(
      course,
      new Date(startDate),
      new Date(endDate),
    );

    console.log($events);
    setEvents($events);
  }, [
    startDate,
    endDate,
    holidays,
    extraWorkingDays,
    courseCode,
    courses,
    calendarConverter,
  ]);

  const value = useMemo(() => ({ events }), [events]);

  return (
    <CalendarEventsContext.Provider value={value}>
      {children}
    </CalendarEventsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCalendarEvents = () => {
  const context = useContext(CalendarEventsContext);

  if (!context) {
    throw new Error(
      "useCalendarEvents must be used within a CalendarEventsProvider",
    );
  }

  return context;
};

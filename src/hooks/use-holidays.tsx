import { useFilters } from "@/providers/filters";
import { Holiday, ShiftType } from "@/types";
import { parse } from "date-fns";
import { useEffect, useState } from "react";

const parseHoliday = (holiday: {
  startDate: string;
  endDate: string;
  description: string;
  shift: string;
}): Holiday | null => {
  return {
    startDate: parse(holiday.startDate.trim(), "yyyy-MM-dd", new Date()),
    endDate: parse(holiday.endDate.trim(), "yyyy-MM-dd", new Date()),
    description: holiday.description.trim(),
    shift: holiday.shift.trim() as ShiftType,
  };
};

export const useHolidays = () => {
  const { session } = useFilters();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session) return;
    setIsLoading(true);

    const file = `${session}-holidays.json`;
    const abortController = new AbortController();

    // check cache
    const cached = sessionStorage.getItem(file);
    if (cached) {
      setHolidays(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    fetch(`/data/${file}`, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        const $holidays = data.map(parseHoliday);
        setHolidays($holidays);

        // cache
        sessionStorage.setItem(file, JSON.stringify($holidays));
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setIsLoading(false));

    return () => {
      abortController.abort();
    };
  }, [session]);

  return [holidays, { isLoading, error, isError: error !== null }] as const;
};

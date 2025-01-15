import assets from "@/config/assets";
import { useFilters } from "@/providers/filters";
import { ShiftType, WorkingDayAdjustment } from "@/types";
import { useEffect, useState } from "react";

const parseWorkingDay = (adjustment: {
  date: string;
  replacedDay: string;
  shift: string;
}): WorkingDayAdjustment | null => {
  return {
    date: adjustment.date.trim(),
    replacedDay: adjustment.replacedDay.trim(),
    shift: adjustment.shift.trim() as ShiftType,
  };
};

export const useExtraWorkingDays = () => {
  const { session, semester } = useFilters();
  const [workingDays, setWorkingDays] = useState<WorkingDayAdjustment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session || !semester) return;
    setIsLoading(true);

    const file = `${session}/${semester}/extra-working-days.json`;
    const abortController = new AbortController();

    // check cache
    const cached = sessionStorage.getItem(file);
    if (cached) {
      setWorkingDays(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    fetch(`${assets.baseUrl}/${file}`, {
      signal: abortController.signal,
    })
      .then((response) => response.json())
      .then((data) => {
        const $workingDays = data.map(parseWorkingDay);
        setWorkingDays($workingDays);

        // cache
        sessionStorage.setItem(file, JSON.stringify($workingDays));
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setIsLoading(false));

    return () => {
      abortController.abort();
    };
  }, [session, semester]);

  return [workingDays, { isLoading, error, isError: error !== null }] as const;
};

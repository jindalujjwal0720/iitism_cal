import { useFilters } from "@/providers/filters";
import { useEffect, useState } from "react";
import { Course } from "@/types";

const getAppropriateTime = (time: string) => {
  // if time is < 8, it is in the evening
  // if time is >= 8, it is in the morning
  // add 12 to the time if it is in the morning, as we are using 24-hour format
  const [start, end] = time.split("-").map((t) => t.trim());
  const [startHour, startMinute] = start.split(":").map((t) => parseInt(t));
  const [endHour, endMinute] = end.split(":").map((t) => parseInt(t));

  const startTime = startHour < 8 ? startHour + 12 : startHour;
  const endTime = endHour < 8 ? endHour + 12 : endHour;

  return `${startTime.toString().padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}-${endTime.toString().padStart(2, "0")}:${endMinute.toString().padStart(2, "0")}`;
};

const parseCourse = (course: {
  Course: string;
  "Instructor name": string;
  "Time Table": { day: string; time: string; venue: string }[];
}): Course | null => {
  // format: "code (name)"
  const match = course.Course.match(/(.*)\((.*)\)/);

  if (!match) return null;

  return {
    code: match[1].trim(),
    name: match[2].trim(),
    instructor: course["Instructor name"],
    schedule: course["Time Table"].map((slot) => ({
      day: slot.day,
      time: getAppropriateTime(slot.time),
      venue: slot.venue,
    })),
  };
};

export const useCourses = () => {
  const { session, semester, department } = useFilters();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!session || !semester || !department) return;

    setIsLoading(true);

    const file = `${session}-${semester}-${department}-courses.json`;
    const abortController = new AbortController();

    // check cache
    const cached = sessionStorage.getItem(file);
    if (cached) {
      setCourses(JSON.parse(cached));
      setIsLoading(false);
      return;
    }

    fetch(`/data/${file}`, { signal: abortController.signal })
      .then((response) => response.json())
      .then((data) => {
        const $courses = data.map(parseCourse);
        setCourses($courses);

        // cache
        sessionStorage.setItem(file, JSON.stringify($courses));
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        setError(error);
      })
      .finally(() => setIsLoading(false));

    return () => {
      abortController.abort();
    };
  }, [session, semester, department]);

  return [courses, { isLoading, error, isError: error !== null }] as const;
};

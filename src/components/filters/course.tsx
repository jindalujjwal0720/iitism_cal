import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCourses } from "@/hooks/use-courses";
import { useFilters } from "@/providers/filters";

export const CourseFilter = () => {
  const [courses, { isLoading, isError }] = useCourses();
  const { course, setCourse } = useFilters();

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full capitalize">
          <SelectValue placeholder="Loading courses..." />
        </SelectTrigger>
      </Select>
    );
  }

  if (isError) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full capitalize text-destructive">
          <SelectValue placeholder="Failed to load courses" />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={course ?? ""} onValueChange={setCourse}>
      <SelectTrigger
        className="w-full capitalize"
        disabled={!courses || courses.length === 0}
      >
        {courses ? (
          <SelectValue placeholder="Course" />
        ) : (
          <SelectValue placeholder="No courses found" />
        )}
      </SelectTrigger>
      <SelectContent className="capitalize">
        {courses.map((course) => (
          <SelectItem key={course.code} value={course.code}>
            {course.code} - {course.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

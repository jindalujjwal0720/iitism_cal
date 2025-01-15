import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilters } from "@/providers/filters";

const SEMESTERS = ["winter"] as const;

export const SemesterFilter = () => {
  const { semester, setSemester } = useFilters();

  return (
    <Select value={semester ?? ""} onValueChange={setSemester}>
      <SelectTrigger className="w-full capitalize">
        <SelectValue placeholder="Semester" />
      </SelectTrigger>
      <SelectContent className="capitalize">
        {SEMESTERS.map((sem) => (
          <SelectItem key={sem} value={sem}>
            {sem}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

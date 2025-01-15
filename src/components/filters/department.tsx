import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilters } from "@/providers/filters";
import { cn } from "@/utils/tw";

const DEPARTMENTS = ["cse"] as const;

export const DepartmentFilter = () => {
  const { department, setDepartment } = useFilters();

  return (
    <Select value={department ?? ""} onValueChange={setDepartment}>
      <SelectTrigger
        className={cn("w-full", department ? "uppercase" : "capitalize")}
      >
        <SelectValue placeholder="Department" />
      </SelectTrigger>
      <SelectContent className="uppercase">
        {DEPARTMENTS.map((dept) => (
          <SelectItem key={dept} value={dept}>
            {dept}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

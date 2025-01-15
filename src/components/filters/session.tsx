import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilters } from "@/providers/filters";

const SESSIONS = ["2024-25"] as const;

export const SessionFilter = () => {
  const { session, setSession } = useFilters();

  return (
    <Select value={session ?? ""} onValueChange={setSession}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Session" />
      </SelectTrigger>
      <SelectContent>
        {SESSIONS.map((session) => (
          <SelectItem key={session} value={session}>
            {session}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

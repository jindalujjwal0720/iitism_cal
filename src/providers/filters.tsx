import { createContext, PropsWithChildren, useContext, useState } from "react";

interface FiltersContextData {
  session: string | null;
  semester: string | null;
  department: string | null;
  course: string | null;
  startDate: string | null;
  endDate: string | null;

  setSession: (session: string) => void;
  setSemester: (semester: string) => void;
  setDepartment: (department: string) => void;
  setCourse: (course: string) => void;
  setStartDate: (startDate: string) => void;
  setEndDate: (endDate: string) => void;
}

const FiltersContext = createContext<FiltersContextData>(
  {} as FiltersContextData,
);

export const FiltersProvider = ({ children }: PropsWithChildren) => {
  const [session, setSession] = useState<string | null>(null);
  const [semester, setSemester] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [course, setCourse] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);

  return (
    <FiltersContext.Provider
      value={{
        session,
        semester,
        department,
        course,
        startDate,
        endDate,

        setSession,
        setSemester,
        setDepartment,
        setCourse,
        setStartDate,
        setEndDate,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useFilters = () => {
  const context = useContext(FiltersContext);

  if (!context) {
    throw new Error("useFilters must be used within a FiltersProvider");
  }

  return context;
};

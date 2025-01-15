import { Label } from "../ui/label";
import { CourseFilter } from "./course";
import { DepartmentFilter } from "./department";
import { EndDateFilter } from "./end-date";
import { SemesterFilter } from "./semester";
import { SessionFilter } from "./session";
import { StartDateFilter } from "./start-date";

export const Filters = () => {
  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>Session</Label>
        <SessionFilter />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Semester</Label>
        <SemesterFilter />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Department</Label>
        <DepartmentFilter />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Course</Label>
        <CourseFilter />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Start date</Label>
        <StartDateFilter />
      </div>
      <div className="flex flex-col gap-2">
        <Label>End date</Label>
        <EndDateFilter />
      </div>
    </>
  );
};

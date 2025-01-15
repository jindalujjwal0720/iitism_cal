import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HolidaysTable } from "./holidays";
import { ExtraWorkingDaysTable } from "./extra-working-days";
import { ClassScheduleTable } from "./class-schedule";
import { useCalendarEvents } from "@/providers/calendar-events";

export const Tables = () => {
  const { events } = useCalendarEvents();

  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList>
        <TabsTrigger value="schedule">
          Class schedule
          {events.length > 0 && (
            <span className="ml-2 text-sm text-muted-foreground">
              ({events.length})
            </span>
          )}
        </TabsTrigger>
        <TabsTrigger value="extra-working-days">Extra working days</TabsTrigger>
        <TabsTrigger value="holidays">Holidays</TabsTrigger>
      </TabsList>
      <TabsContent value="schedule">
        <ClassScheduleTable />
      </TabsContent>
      <TabsContent value="extra-working-days">
        <ExtraWorkingDaysTable />
      </TabsContent>
      <TabsContent value="holidays">
        <HolidaysTable />
      </TabsContent>
    </Tabs>
  );
};

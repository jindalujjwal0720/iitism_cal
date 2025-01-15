import { Actions } from "./components/actions";
import { Filters } from "./components/filters";
import { Tables } from "./components/tables";
import { Card, CardContent } from "./components/ui/card";
import { CalendarEventsProvider } from "./providers/calendar-events";
import { FiltersProvider } from "./providers/filters";

const App = () => {
  return (
    <FiltersProvider>
      <CalendarEventsProvider>
        <div className="min-h-dvh flex flex-col gap-4 p-4 bg-muted">
          <Card>
            <CardContent>
              <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 items-end">
                <Filters />
                <Actions />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Tables />
            </CardContent>
          </Card>
        </div>
      </CalendarEventsProvider>
    </FiltersProvider>
  );
};

export default App;

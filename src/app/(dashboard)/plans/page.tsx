import { CalendarWorkspace } from "@/components/calendar/calendar-workspace";

export const metadata = {
  title: "Plans · Notely",
};

/** Time-based planning (events & schedule). Distinct from Tasks kanban. */
export default function PlansPage() {
  return <CalendarWorkspace />;
}

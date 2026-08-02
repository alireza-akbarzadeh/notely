import { redirect } from "next/navigation";

/** Legacy calendar URL — Plans is the product name for time-based planning. */
export default function CalendarPage() {
  redirect("/plans");
}

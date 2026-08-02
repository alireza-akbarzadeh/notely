export type CalendarEvent = {
  id: string;
  title: string;
  startTime: string;
  endTime: string | null;
  link: string | null;
  noteId: string | null;
};

export type CalendarView = "week" | "day";

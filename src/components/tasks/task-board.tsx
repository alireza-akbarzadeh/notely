"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  Circle,
  Clock3,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";

import { NotesEmptyState } from "@/components/notes/notes-empty-state";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Input } from "@/components/ui/input";
import { readJson } from "@/lib/api/read-json";
import { playReminderSound } from "@/lib/notifications/sound-player";
import { cn } from "@/lib/utils";

type TaskStatus = "todo" | "in_progress" | "done";

type Task = {
  id: string;
  noteId: string | null;
  text: string;
  status: TaskStatus;
  isCompleted: boolean;
  dueAt: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function endOfTodayLocal() {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d;
}

function formatDueLabel(dueAt: string) {
  const due = new Date(dueAt);
  const today = new Date();
  if (isSameLocalDay(due, today)) return "Due today";
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameLocalDay(due, tomorrow)) return "Due tomorrow";
  return due.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const columns: Array<{
  status: TaskStatus;
  title: string;
  description: string;
  icon: typeof Circle;
  color: string;
  panel: string;
  badge: string;
}> = [
  {
    status: "todo",
    title: "To do",
    description: "Ready to start",
    icon: Circle,
    color: "text-sky-500",
    panel: "border-sky-500/25 bg-sky-500/[0.05]",
    badge: "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  },
  {
    status: "in_progress",
    title: "In progress",
    description: "Currently moving",
    icon: Clock3,
    color: "text-amber-500",
    panel: "border-amber-500/25 bg-amber-500/[0.05]",
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  {
    status: "done",
    title: "Done",
    description: "Finished work",
    icon: CheckCircle2,
    color: "text-emerald-500",
    panel: "border-emerald-500/25 bg-emerald-500/[0.05]",
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
];

function notify(message: string) {
  if (typeof Notification !== "undefined" && Notification.permission === "granted") {
    new Notification("Notely Tasks", { body: message, icon: "/icons/icon-192.png" });
  }
}

export function TaskBoard() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [draftDueAt, setDraftDueAt] = useState("");
  const [dueTodayOnly, setDueTodayOnly] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<
    NotificationPermission | "unsupported"
  >(() =>
    typeof Notification !== "undefined" ? Notification.permission : "unsupported",
  );

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(null), 2400);
    return () => window.clearTimeout(timeout);
  }, [message]);

  const tasksQuery = useQuery({
    queryKey: ["tasks"],
    queryFn: async (): Promise<{ tasks: Task[] }> =>
      readJson<{ tasks: Task[] }>(await fetch("/api/tasks"), "Failed to load tasks"),
  });

  const createMutation = useMutation({
    mutationFn: async (input: { text: string; dueAt: string | null }) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input.text,
          status: "todo",
          dueAt: input.dueAt,
        }),
      });
      const data = await readJson<{ task: Task }>(response, "Failed to create task");
      return data.task;
    },
    onSuccess: (task) => {
      setDraft("");
      setDraftDueAt("");
      // A refetch that lands between the POST and here already holds the new
      // row, so replace by id rather than appending a second copy.
      queryClient.setQueryData<{ tasks: Task[] }>(["tasks"], (current) => ({
        tasks: [
          ...(current?.tasks ?? []).filter((item) => item.id !== task.id),
          task,
        ],
      }));
      setMessage("Task added to To do");
      void playReminderSound("soft");
    },
    onError: (error) => setMessage(error.message),
  });

  const dueMutation = useMutation({
    mutationFn: async ({ id, dueAt }: { id: string; dueAt: string | null }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueAt }),
      });
      const data = await readJson<{ task: Task }>(response, "Failed to update due date");
      return data.task;
    },
    onSuccess: (task) => {
      queryClient.setQueryData<{ tasks: Task[] }>(["tasks"], (current) => ({
        tasks:
          current?.tasks.map((item) => (item.id === task.id ? task : item)) ?? [],
      }));
      setMessage(task.dueAt ? `Due ${formatDueLabel(task.dueAt)}` : "Due date cleared");
    },
    onError: (error) => setMessage(error.message),
  });

  const moveMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: TaskStatus }) => {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await readJson<{ task: Task }>(response, "Failed to move task");
      return data.task;
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previous = queryClient.getQueryData<{ tasks: Task[] }>(["tasks"]);
      queryClient.setQueryData<{ tasks: Task[] }>(["tasks"], (current) => ({
        tasks:
          current?.tasks.map((task) =>
            task.id === id
              ? { ...task, status, isCompleted: status === "done" }
              : task,
          ) ?? [],
      }));
      return { previous };
    },
    onSuccess: (task) => {
      const column = columns.find((item) => item.status === task.status);
      setMessage(`Moved to ${column?.title ?? task.status}`);
      if (task.status === "done") {
        void playReminderSound("chime");
        notify(`Completed: ${task.text}`);
      } else {
        void playReminderSound("soft");
      }
    },
    onError: (error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(["tasks"], context.previous);
      setMessage(error.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      await readJson(response, "Failed to delete task");
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData<{ tasks: Task[] }>(["tasks"], (current) => ({
        tasks: current?.tasks.filter((task) => task.id !== id) ?? [],
      }));
      setDeleteTarget(null);
      setMessage("Task deleted");
    },
    onError: (error) => setMessage(error.message),
  });

  const tasks = tasksQuery.data?.tasks ?? [];
  const today = useMemo(() => new Date(), []);
  const dueTodayCount = useMemo(
    () =>
      tasks.filter(
        (task) =>
          task.dueAt &&
          !task.isCompleted &&
          isSameLocalDay(new Date(task.dueAt), today),
      ).length,
    [tasks, today],
  );
  const grouped = useMemo(() => {
    const result: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      done: [],
    };
    const seen = new Set<string>();
    for (const task of tasks) {
      if (seen.has(task.id)) continue;
      seen.add(task.id);
      if (
        dueTodayOnly &&
        !(
          task.dueAt &&
          !task.isCompleted &&
          isSameLocalDay(new Date(task.dueAt), today)
        )
      ) {
        continue;
      }
      const status: TaskStatus =
        task.status === "in_progress" || task.status === "done" || task.status === "todo"
          ? task.status
          : task.isCompleted
            ? "done"
            : "todo";
      result[status].push({ ...task, status });
    }
    return result;
  }, [dueTodayOnly, tasks, today]);
  const boardEmpty = !tasksQuery.isLoading && !tasksQuery.isError && tasks.length === 0;

  const createTask = () => {
    const text = draft.trim();
    if (!text || createMutation.isPending) return;
    const dueAt = draftDueAt
      ? new Date(`${draftDueAt}T17:00:00`).toISOString()
      : null;
    createMutation.mutate({ text, dueAt });
  };

  const moveTask = (id: string, status: TaskStatus) => {
    const task = tasksQuery.data?.tasks.find((item) => item.id === id);
    if (!task || task.status === status || moveMutation.isPending) return;
    moveMutation.mutate({ id, status });
  };

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    setMessage(
      permission === "granted"
        ? "Task completion alerts enabled"
        : "Notifications were not enabled",
    );
    if (permission === "granted") void playReminderSound("bell");
  };

  return (
    <main className="min-h-0 flex-1 overflow-y-auto bg-background px-4 pb-24 pt-5 md:px-7 md:pb-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-primary">
              <CheckCircle2 className="size-4" />
              Workflow
            </div>
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Tasks</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create work, drag it through each stage, and celebrate the finish.
            </p>
          </div>
          {notificationPermission !== "unsupported" && (
            <Button
              variant="outline"
              onClick={enableNotifications}
              disabled={notificationPermission === "granted"}
            >
              {notificationPermission === "granted" ? (
                <BellRing data-icon="inline-start" />
              ) : (
                <Bell data-icon="inline-start" />
              )}
              {notificationPermission === "granted" ? "Alerts on" : "Enable alerts"}
            </Button>
          )}
        </header>

        <section className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") createTask();
              }}
              placeholder="What needs to be done?"
              aria-label="New task"
              className="h-10 flex-1 border-0 bg-muted/60 px-3 shadow-none"
            />
            <Input
              type="date"
              value={draftDueAt}
              onChange={(event) => setDraftDueAt(event.target.value)}
              aria-label="Due date"
              className="h-10 w-full border-0 bg-muted/60 px-3 shadow-none sm:w-44"
            />
            <Button
              className="h-10 px-4"
              onClick={createTask}
              disabled={!draft.trim() || createMutation.isPending}
            >
              <Plus data-icon="inline-start" />
              {createMutation.isPending ? "Adding…" : "Add task"}
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={dueTodayOnly ? "default" : "outline"}
              className="h-7"
              onClick={() => setDueTodayOnly((value) => !value)}
            >
              Due today{dueTodayCount > 0 ? ` (${dueTodayCount})` : ""}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7"
              onClick={() =>
                setDraftDueAt(new Date().toISOString().slice(0, 10))
              }
            >
              Set due today
            </Button>
          </div>
        </section>

        {message && (
          <div
            role="status"
            className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary"
          >
            <Check className="size-4" />
            {message}
          </div>
        )}

        {tasksQuery.isError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {tasksQuery.error.message}
          </div>
        ) : boardEmpty ? (
          <NotesEmptyState variant="task" className="min-h-80 rounded-2xl border border-border bg-card" />
        ) : (
          <div className="grid min-h-112 gap-4 lg:grid-cols-3">
            {columns.map((column) => {
              const Icon = column.icon;
              const items = grouped[column.status];
              return (
                <section
                  key={column.status}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    const id = event.dataTransfer.getData("text/task-id") || draggedId;
                    if (id) moveTask(id, column.status);
                    setDraggedId(null);
                  }}
                  className={cn(
                    "flex min-h-72 flex-col rounded-2xl border p-3 transition-colors",
                    column.panel,
                  )}
                >
                  <div className="mb-3 flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <Icon className={cn("size-4", column.color)} />
                      <div>
                        <h2 className="text-sm font-semibold">{column.title}</h2>
                        <p className="text-xs text-muted-foreground">{column.description}</p>
                      </div>
                    </div>
                    <span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", column.badge)}>
                      {items.length}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2">
                    {items.map((task) => (
                      <article
                        key={task.id}
                        draggable
                        onDragStart={(event) => {
                          setDraggedId(task.id);
                          event.dataTransfer.effectAllowed = "move";
                          event.dataTransfer.setData("text/task-id", task.id);
                        }}
                        onDragEnd={() => setDraggedId(null)}
                        className={cn(
                          "group rounded-xl border border-border/80 bg-card p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md",
                          draggedId === task.id && "opacity-50",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical className="mt-0.5 size-4 shrink-0 cursor-grab text-muted-foreground/60" />
                          <p className={cn("min-w-0 flex-1 text-sm leading-5", task.status === "done" && "text-muted-foreground line-through")}>
                            {task.text || "Untitled task"}
                          </p>
                          <Button
                            size="icon-xs"
                            variant="ghost"
                            aria-label={`Delete ${task.text}`}
                            onClick={() => setDeleteTarget(task)}
                            className="opacity-60 hover:text-destructive md:opacity-0 md:group-hover:opacity-100"
                          >
                            <Trash2 />
                          </Button>
                        </div>
                        <div className="mt-2 flex items-center gap-2 pl-6">
                          <input
                            type="date"
                            aria-label={`Due date for ${task.text || "task"}`}
                            value={
                              task.dueAt
                                ? new Date(task.dueAt).toISOString().slice(0, 10)
                                : ""
                            }
                            disabled={dueMutation.isPending}
                            onChange={(event) => {
                              const value = event.target.value;
                              dueMutation.mutate({
                                id: task.id,
                                dueAt: value
                                  ? new Date(`${value}T17:00:00`).toISOString()
                                  : null,
                              });
                            }}
                            className="h-7 rounded-md border border-border/70 bg-background px-2 text-[11px] text-muted-foreground"
                          />
                          {task.dueAt ? (
                            <span
                              className={cn(
                                "rounded-md px-1.5 py-0.5 text-[10px] font-medium",
                                !task.isCompleted &&
                                  isSameLocalDay(new Date(task.dueAt), today)
                                  ? "bg-primary/15 text-primary"
                                  : !task.isCompleted &&
                                      new Date(task.dueAt) < endOfTodayLocal() &&
                                      !isSameLocalDay(new Date(task.dueAt), today)
                                    ? "bg-destructive/15 text-destructive"
                                    : "bg-muted text-muted-foreground",
                              )}
                            >
                              {formatDueLabel(task.dueAt)}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 flex gap-1 pl-6">
                          {columns.map((target) => (
                            <button
                              key={target.status}
                              type="button"
                              onClick={() => moveTask(task.id, target.status)}
                              aria-label={`Move to ${target.title}`}
                              aria-pressed={task.status === target.status}
                              className={cn(
                                "h-1.5 flex-1 rounded-full transition hover:opacity-100",
                                target.status === "todo" && "bg-sky-500",
                                target.status === "in_progress" && "bg-amber-500",
                                target.status === "done" && "bg-emerald-500",
                                task.status === target.status ? "opacity-100" : "opacity-25",
                              )}
                            />
                          ))}
                        </div>
                      </article>
                    ))}
                    {!tasksQuery.isLoading && items.length === 0 && (
                      <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-border/70 p-6 text-center text-xs text-muted-foreground">
                        Drop a task here
                      </div>
                    )}
                    {tasksQuery.isLoading &&
                      Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-20 animate-pulse rounded-xl bg-muted/60" />
                      ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete task?"
        description={`“${deleteTarget?.text ?? "This task"}” will be permanently removed.`}
        confirmLabel="Delete task"
        pending={deleteMutation.isPending}
        destructive
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
      />
    </main>
  );
}

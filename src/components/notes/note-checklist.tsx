"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NoteTask } from "@/types/notes";

type NoteChecklistProps = {
  noteId: string;
  canEdit?: boolean;
};

export function NoteChecklist({ noteId, canEdit = true }: NoteChecklistProps) {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

  const tasksQuery = useQuery({
    queryKey: ["tasks", noteId],
    queryFn: async (): Promise<{ tasks: NoteTask[] }> => {
      const response = await fetch(`/api/tasks?noteId=${encodeURIComponent(noteId)}`);
      if (!response.ok) throw new Error("Failed to load tasks");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (text: string) => {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId, text }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to add task");
      return data.task as NoteTask;
    },
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: ["tasks", noteId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (input: {
      id: string;
      text?: string;
      isCompleted?: boolean;
    }) => {
      const response = await fetch(`/api/tasks/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input.text,
          isCompleted: input.isCompleted,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to update task");
      return data.task as NoteTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", noteId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Failed to delete task");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", noteId] });
    },
  });

  const tasks: NoteTask[] = tasksQuery.data?.tasks ?? [];
  const doneCount = tasks.filter((task: NoteTask) => task.isCompleted).length;

  function submitDraft() {
    const text = draft.trim();
    if (!text || createMutation.isPending) return;
    createMutation.mutate(text);
  }

  return (
    <section className="mb-8 rounded-2xl border border-border/80 bg-card/40 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold">Checklist</h2>
          <p className="text-xs text-muted-foreground">
            {tasksQuery.isLoading
              ? "Loading…"
              : tasks.length === 0
                ? "No tasks yet"
                : `${doneCount}/${tasks.length} done`}
          </p>
        </div>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="group flex items-center gap-2">
            <button
              type="button"
              disabled={!canEdit}
              onClick={() =>
                updateMutation.mutate({
                  id: task.id,
                  isCompleted: !task.isCompleted,
                })
              }
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors",
                task.isCompleted
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-transparent hover:border-primary/60",
                !canEdit && "cursor-default opacity-80",
              )}
              aria-label={task.isCompleted ? "Mark incomplete" : "Mark complete"}
            >
              <Check className="size-4" />
            </button>
            <Input
              defaultValue={task.text}
              readOnly={!canEdit}
              onBlur={(event) => {
                if (!canEdit) return;
                const next = event.target.value.trim();
                if (next !== task.text) {
                  updateMutation.mutate({ id: task.id, text: next });
                }
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.currentTarget.blur();
                }
              }}
              className={cn(
                "h-10 flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0",
                task.isCompleted && "text-muted-foreground line-through",
              )}
              placeholder="Task"
            />
            {canEdit ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-8 opacity-60 group-hover:opacity-100"
                onClick={() => deleteMutation.mutate(task.id)}
                aria-label="Delete task"
              >
                <Trash2 className="size-4" />
              </Button>
            ) : null}
          </li>
        ))}
      </ul>

      {canEdit ? (
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            submitDraft();
          }}
        >
          <Input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add a task"
            className="h-10"
          />
          <Button
            type="submit"
            size="icon"
            className="size-10 shrink-0"
            disabled={!draft.trim() || createMutation.isPending}
            aria-label="Add task"
          >
            <Plus className="size-4" />
          </Button>
        </form>
      ) : null}
    </section>
  );
}

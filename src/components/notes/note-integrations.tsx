"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarDays,
  ExternalLink,
  LoaderCircle,
  Mail,
  Search,
  Unplug,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type IntegrationStatus = {
  configured: boolean;
  connected: boolean;
  email: string | null;
};

type IntegrationItem = {
  id: string;
  kind: "gmail" | "calendar";
  title: string;
  subtitle: string;
  date: string | null;
  content: string;
  url: string | null;
};

type NoteIntegrationsProps = {
  canEdit: boolean;
  onImport: (content: string) => void;
};

async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data;
}

function formatItemDate(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function NoteIntegrations({
  canEdit,
  onImport,
}: NoteIntegrationsProps) {
  const queryClient = useQueryClient();
  const [source, setSource] = useState<"gmail" | "calendar">("gmail");
  const [searchDraft, setSearchDraft] = useState("");
  const [query, setQuery] = useState("");
  const [importedId, setImportedId] = useState<string | null>(null);
  const [callbackError] = useState(() =>
    typeof window === "undefined"
      ? null
      : new URLSearchParams(window.location.search).get("integrationError"),
  );

  const statusQuery = useQuery({
    queryKey: ["google-integration"],
    queryFn: async () =>
      readJson<IntegrationStatus>(
        await fetch("/api/integrations/google", { cache: "no-store" }),
      ),
  });
  const connected = statusQuery.data?.connected === true;

  const itemsQuery = useQuery({
    queryKey: ["google-integration-items", source, query],
    enabled: connected,
    queryFn: async () => {
      const params = new URLSearchParams({ source });
      if (query) params.set("q", query);
      return readJson<{ items: IntegrationItem[] }>(
        await fetch(`/api/integrations/google/items?${params}`, {
          cache: "no-store",
        }),
      );
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () =>
      readJson<{ success: boolean }>(
        await fetch("/api/integrations/google", { method: "DELETE" }),
      ),
    onSuccess: () => {
      queryClient.setQueryData<IntegrationStatus>(["google-integration"], {
        configured: statusQuery.data?.configured ?? true,
        connected: false,
        email: null,
      });
      queryClient.removeQueries({ queryKey: ["google-integration-items"] });
    },
  });

  function connectGoogle() {
    const returnTo = `${window.location.pathname}?integration=google`;
    window.location.assign(
      `/api/integrations/google/connect?returnTo=${encodeURIComponent(returnTo)}`,
    );
  }

  function importItem(item: IntegrationItem) {
    onImport(item.content);
    setImportedId(item.id);
    window.setTimeout(() => setImportedId(null), 1800);
  }

  if (statusQuery.isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center text-muted-foreground">
        <LoaderCircle className="mr-2 size-4 animate-spin" />
        Loading integrations…
      </div>
    );
  }

  if (statusQuery.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Could not load integrations</AlertTitle>
        <AlertDescription>{statusQuery.error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!statusQuery.data?.configured) {
    return (
      <Alert>
        <AlertTitle>Google Workspace is not configured</AlertTitle>
        <AlertDescription>
          Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, enable Gmail and
          Calendar APIs, then use this panel again.
        </AlertDescription>
      </Alert>
    );
  }

  if (!connected) {
    return (
      <div className="space-y-3">
        {callbackError ? (
          <Alert variant="destructive">
            <AlertTitle>Google was not connected</AlertTitle>
            <AlertDescription>{callbackError}</AlertDescription>
          </Alert>
        ) : null}
        <section className="rounded-2xl border border-border/80 bg-card/40 p-5">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Mail className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">Google Workspace</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Connect Gmail and Google Calendar, browse recent items, and
                import selected content into this note.
              </p>
              <Button className="mt-4" onClick={connectGoogle}>
                Connect Google Workspace
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const items = itemsQuery.data?.items ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/80 bg-card/40 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">Google Workspace connected</p>
          <p className="truncate text-xs text-muted-foreground">
            {statusQuery.data.email}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={disconnectMutation.isPending}
          onClick={() => disconnectMutation.mutate()}
        >
          {disconnectMutation.isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Unplug />
          )}
          Disconnect
        </Button>
      </div>

      {disconnectMutation.isError ? (
        <Alert variant="destructive">
          <AlertDescription>
            {disconnectMutation.error.message}
          </AlertDescription>
        </Alert>
      ) : null}

      <Tabs
        value={source}
        onValueChange={(value) => {
          setSource(value as "gmail" | "calendar");
          setSearchDraft("");
          setQuery("");
        }}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gmail">
            <Mail />
            Gmail
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays />
            Calendar
          </TabsTrigger>
        </TabsList>

        {(["gmail", "calendar"] as const).map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-3">
            <form
              className="mb-3 flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                setQuery(searchDraft.trim());
              }}
            >
              <Input
                value={searchDraft}
                onChange={(event) => setSearchDraft(event.target.value)}
                placeholder={
                  tab === "gmail"
                    ? "Search Gmail (for example: from:alex)"
                    : "Search calendar events"
                }
              />
              <Button type="submit" variant="outline" size="icon">
                <Search />
                <span className="sr-only">Search</span>
              </Button>
            </form>

            {itemsQuery.isLoading ? (
              <div className="flex min-h-40 items-center justify-center text-sm text-muted-foreground">
                <LoaderCircle className="mr-2 size-4 animate-spin" />
                Loading {tab === "gmail" ? "messages" : "events"}…
              </div>
            ) : itemsQuery.isError ? (
              <Alert variant="destructive">
                <AlertTitle>Google could not load these items</AlertTitle>
                <AlertDescription>{itemsQuery.error.message}</AlertDescription>
              </Alert>
            ) : items.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                No matching {tab === "gmail" ? "messages" : "events"}.
              </p>
            ) : (
              <ul className="space-y-2">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="rounded-xl border border-border/80 bg-background p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                          {item.title}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {item.subtitle}
                        </p>
                        {item.date ? (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatItemDate(item.date)}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {item.url ? (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            render={
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                              />
                            }
                          >
                            <ExternalLink />
                            <span className="sr-only">Open in Google</span>
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          disabled={!canEdit}
                          onClick={() => importItem(item)}
                        >
                          {importedId === item.id ? "Imported" : "Import"}
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

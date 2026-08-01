"use client";

import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type GoogleCredentialSource = "env" | "user" | null;

export type GoogleConnectionStatus = {
  configured: boolean;
  credentialSource: GoogleCredentialSource;
  clientIdHint: string | null;
  redirectUri: string;
  connected: boolean;
  email: string | null;
};

export type GoogleIntegrationItem = {
  id: string;
  kind: "gmail" | "calendar";
  title: string;
  subtitle: string;
  date: string | null;
  content: string;
  url: string | null;
};

export const googleConnectionKey = ["google-integration"] as const;
export const googleItemsKey = ["google-integration-items"] as const;

export async function readJson<T>(response: Response): Promise<T> {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error ?? "Request failed");
  }
  return data;
}

export function useGoogleConnection() {
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: googleConnectionKey,
    queryFn: async () =>
      readJson<GoogleConnectionStatus>(
        await fetch("/api/integrations/google", { cache: "no-store" }),
      ),
  });

  const saveCredentialsMutation = useMutation({
    mutationFn: async (input: { clientId: string; clientSecret: string }) =>
      readJson<GoogleConnectionStatus>(
        await fetch("/api/integrations/google/credentials", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        }),
      ),
    onSuccess: (status) => {
      queryClient.setQueryData(googleConnectionKey, status);
    },
  });

  const clearCredentialsMutation = useMutation({
    mutationFn: async () =>
      readJson<GoogleConnectionStatus>(
        await fetch("/api/integrations/google/credentials", {
          method: "DELETE",
        }),
      ),
    onSuccess: (status) => {
      queryClient.setQueryData(googleConnectionKey, status);
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () =>
      readJson<{ success: boolean }>(
        await fetch("/api/integrations/google", { method: "DELETE" }),
      ),
    onSuccess: () => {
      queryClient.setQueryData<GoogleConnectionStatus>(googleConnectionKey, {
        configured: statusQuery.data?.configured ?? true,
        credentialSource: statusQuery.data?.credentialSource ?? null,
        clientIdHint: statusQuery.data?.clientIdHint ?? null,
        redirectUri: statusQuery.data?.redirectUri ?? "",
        connected: false,
        email: null,
      });
      queryClient.removeQueries({ queryKey: googleItemsKey });
    },
  });

  function connect(returnTo?: string) {
    const target = returnTo ?? `${window.location.pathname}?integration=google`;
    window.location.assign(
      `/api/integrations/google/connect?returnTo=${encodeURIComponent(target)}`,
    );
  }

  return {
    statusQuery,
    saveCredentialsMutation,
    clearCredentialsMutation,
    disconnectMutation,
    connect,
    connected: statusQuery.data?.connected === true,
    configured: statusQuery.data?.configured !== false,
  };
}

/** Reads the one-shot error the OAuth callback puts on the return URL. */
export function useCallbackError() {
  return useSearchParams().get("integrationError");
}

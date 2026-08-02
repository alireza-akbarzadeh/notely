import { redirect } from "next/navigation";

import { workspacePath } from "@/lib/workspace/paths";

type IntegrationsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function IntegrationsPage({
  searchParams,
}: IntegrationsPageProps) {
  const params = await searchParams;
  const extra: Record<string, string> = {};
  for (const [key, value] of Object.entries(params)) {
    if (key === "view") continue;
    if (typeof value === "string" && value) extra[key] = value;
  }

  redirect(
    workspacePath({
      view: "integration",
      params: extra,
    }),
  );
}

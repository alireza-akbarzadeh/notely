import { Suspense } from "react";

import { AppWorkspace } from "@/components/workspace/app-workspace";

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center text-sm text-muted-foreground">
          Loading workspace…
        </div>
      }
    >
      <AppWorkspace />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createWorkspaceStore } from "@/lib/live-workspace-store";

export function useWorkspaceData() {
  const [workspace, setWorkspace] = useState<any>(null);

  useEffect(() => {
    async function loadWorkspace() {
      try {
        const res = await fetch("/api/sync/google-sheets", {
          cache: "no-store",
        });

        const sync = await res.json();

        const workbook = sync?.data ?? {};

        const normalized = createWorkspaceStore(workbook);

        setWorkspace(normalized);
      } catch (error) {
        console.error("Workspace sync failed:", error);
      }
    }

    loadWorkspace();
  }, []);

  return workspace;
}

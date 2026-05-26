"use client";

import { useEffect, useState } from "react";
import {
  createEmptyWorkspaceStore,
  createWorkspaceStore,
  type WorkspaceStore,
} from "@/lib/live-workspace-store";

export function useWorkspaceData(): WorkspaceStore {
  const [workspace, setWorkspace] = useState<WorkspaceStore>(() =>
    createEmptyWorkspaceStore({ loading: true })
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadWorkspace() {
      try {
        const res = await fetch("/api/sync/google-sheets", {
          cache: "no-store",
          signal: controller.signal,
        });

        const sync = await res.json();

        setWorkspace(
          createWorkspaceStore(sync, {
            loading: false,
            error: res.ok ? undefined : sync?.error,
          })
        );
      } catch (error) {
        if (controller.signal.aborted) return;

        setWorkspace(
          createWorkspaceStore(undefined, {
            loading: false,
            error: error instanceof Error ? error.message : String(error),
          })
        );
      }
    }

    loadWorkspace();

    return () => controller.abort();
  }, []);

  return workspace;
}

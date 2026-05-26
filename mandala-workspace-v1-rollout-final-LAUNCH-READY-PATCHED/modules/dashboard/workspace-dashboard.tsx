"use client";

import { useWorkspaceData } from "@/hooks/use-workspace-data";
import { Dashboard } from "@/modules/dashboard/dashboard";

export function WorkspaceDashboard() {
  const workspace = useWorkspaceData();

  return <Dashboard workspace={workspace} />;
}

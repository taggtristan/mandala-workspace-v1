"use client";

import type { ReactNode } from "react";
import { useWorkspaceData } from "@/hooks/use-workspace-data";
import {
  Calendar,
  Bell,
  MessageCircle,
  Plus,
  Search,
  Home,
  FolderKanban,
  BookOpen,
  ListChecks,
  GitBranch,
  ShoppingCart,
  Paintbrush,
  Users,
  FileText,
  Receipt,
  BarChart3,
  Settings,
  RefreshCw
} from "lucide-react";

const navItems = [
  ["Dashboard", "/dashboard", Home],
  ["Projects", "/projects", FolderKanban],
  ["Workbooks", "/workbooks", BookOpen],
  ["Tasks (Agile)", "/tasks", ListChecks],
  ["Gantt / Timeline", "/gantt", GitBranch],
  ["Calendar", "/calendar", Calendar],
  ["Events", "/events", Calendar],
  ["Procurement", "/procurement", ShoppingCart],
  ["Murals", "/murals", Paintbrush],
  ["Clients", "/clients", Users],
  ["Estimates", "/estimates", FileText],
  ["Invoices", "/invoices", Receipt],
  ["Reports", "/reports", BarChart3],
  ["Team", "/team", Users],
  ["Settings", "/settings", Settings]
] as const;

export function Dashboard() {
  const workspaceResult = useWorkspaceData() as any;
  const workspace = workspaceResult?.data ?? workspaceResult;

  if (!workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Loading workspace...
      </div>
    );
  }

  const dashboard = workspace.dashboard ?? {};
  const ganttRows = dashboard.ganttRows?.slice(0, 8) ?? [];
  const workbookRows = dashboard.workbookPreviewRows?.slice(0, 8) ?? [];
  const riskRows = workspace.riskRows?.slice(0, 6) ?? [];

  const projectName = dashboard.projectName ?? "Patineta Project Plan";
  const projectType = dashboard.projectType ?? "Project Plan";
  const projectStatus = dashboard.projectStatus ?? "Active";

  return (
    <div className="min-h-screen overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-2xl ring-1 ring-slate-200">
      <div className="grid min-h-screen lg:grid-cols-[270px_1fr]">
        <aside className="bg-[#081827] text-white">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-400 text-orange-400">
              ✺
            </div>
            <div>
              <div className="text-2xl font-bold tracking-[0.16em]">
                MANDALA
              </div>
              <div className="tracking-[0.38em] text-white/80">
                WORKSPACE
              </div>
            </div>
          </div>

          <nav className="px-3 py-2">
            {navItems.map(([label, href, Icon], index) => (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition hover:bg-white/10 ${
                  index === 0 ? "bg-white/10 text-orange-400" : "text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="bg-slate-50 p-5">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Mandala</h1>
              <p className="text-sm text-slate-500">
                {projectName} • {projectType} • {projectStatus}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 md:flex">
                <Search className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Search anything...</span>
              </div>
              <Bell className="h-5 w-5" />
              <MessageCircle className="h-5 w-5 text-orange-500" />
              <SyncBadge connected={Boolean(workspace.isSynced)} />
              <a
                href="/projects"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                New Project
              </a>
            </div>
          </header>

          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Metric label="Project Status" value={projectStatus} />
            <Metric label="Tasks in Progress" value={dashboard.inProgressTasks ?? 0} />
            <Metric label="Completed Tasks" value={dashboard.completedTasks ?? 0} />
            <Metric label="Risk Items" value={dashboard.riskCount ?? 0} />
            <Metric label="Event Workstreams" value={dashboard.eventCount ?? 0} />
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-3">
            <Panel title="Project Overview">
              {ganttRows.length ? (
                ganttRows.map((task: any, index: number) => (
                  <div
                    key={task.taskID || task.id || index}
                    className="mb-3 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center justify-between">
                      <strong>
                        {task.taskName ||
                          task.task ||
                          task.name ||
                          task.title ||
                          task.Task ||
                          task["Task Name"] ||
                          "Untitled Task"}
                      </strong>
                      <span className="text-xs text-slate-500">
                        {task.status || task.Status || "Open"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No Gantt rows available yet." />
              )}
            </Panel>

            <Panel title="Workbook Preview">
              {workbookRows.length ? (
                workbookRows.map((row: any, index: number) => (
                  <div
                    key={row.taskID || row.id || index}
                    className="mb-3 rounded-lg border border-slate-200 p-3"
                  >
                    <p className="font-medium">
                      {row.taskName ||
                        row.task ||
                        row.name ||
                        row.title ||
                        row.Task ||
                        row["Task Name"] ||
                        "Untitled Row"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {row.owner || row.Owner || "Unassigned"} •{" "}
                      {row.status || row.Status || "Open"}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState message="No workbook rows available yet." />
              )}
            </Panel>

            <Panel title="Risk Register">
              {riskRows.length ? (
                riskRows.map((risk: any, index: number) => (
                  <div
                    key={risk.issueRisk || risk.risk || risk.Risk || index}
                    className="border-b border-slate-100 py-3 text-sm"
                  >
                    <p className="font-medium">
                      {risk.issueRisk ||
                        risk.risk ||
                        risk.Risk ||
                        risk.taskName ||
                        risk.task ||
                        risk.name ||
                        "Risk item"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {risk.owner || risk.Owner || "Unassigned"} •{" "}
                      {risk.status || risk.Status || "Open"}
                    </p>
                  </div>
                ))
              ) : (
                <EmptyState message="No risk rows available yet." />
              )}
            </Panel>
          </section>
        </main>
      </div>
    </div>
  );
}

function SyncBadge({ connected }: { connected: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
        connected ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
      }`}
    >
      <RefreshCw className="h-3.5 w-3.5" />
      {connected ? "Synced / Live" : "No live workbook"}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 text-xs uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="text-3xl font-bold">{value}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-bold uppercase">
        {title}
      </h2>
      <div className="p-4">{children}</div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
      {message}
    </div>
  );
}

export default Dashboard;

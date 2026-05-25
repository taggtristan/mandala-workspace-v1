"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
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
  CheckCircle2,
  Circle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { mapDashboardData, type LiveWorkbookData } from "@/lib/live-workbook-map";

type SyncResponse = {
  connected: boolean;
  status?: number;
  data?: LiveWorkbookData;
  error?: string;
  stage?: string;
  syncedAt?: string;
};

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

function formatDate(value: any) {
  if (!value) return "TBD";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function statusTone(status: any) {
  const s = String(status || "").toLowerCase();
  if (s.includes("complete")) return "green";
  if (s.includes("risk") || s.includes("open") || s.includes("needed")) return "red";
  if (s.includes("progress") || s.includes("monitor") || s.includes("planning") || s.includes("upcoming")) return "orange";
  return "slate";
}

export function Dashboard() {
  const [sync, setSync] = useState<SyncResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sync/google-sheets", { cache: "no-store" })
      .then((res) => res.json())
      .then((payload) => setSync(payload))
      .catch((error) => setSync({ connected: false, error: String(error) }))
      .finally(() => setLoading(false));
  }, []);

const workbook = sync?.data ?? {};

const dashboard = useMemo(
  () =>
    mapDashboardData({
      project: workbook.projectSettings ?? [],
      tasks: workbook.tasks ?? [],
      risks: workbook.risks ?? [],
      events: workbook.eventPlanning ?? [],
      workbookRows: workbook.tasks ?? [],
    }),
  [workbook]
);

  const connected = Boolean(sync?.connected);
  const topGanttRows = dashboard.ganttRows.filter((row: any) => !row.original?.parentID).slice(0, 8);
  const ganttRows = topGanttRows.length ? topGanttRows : dashboard.ganttRows.slice(0, 8);
  const agileRows = [
    ...dashboard.agileBoard.inProgress,
    ...dashboard.agileBoard.todo,
    ...dashboard.agileBoard.done
  ].slice(0, 7);
  const eventRows = dashboard.milestones.slice(0, 5);
  const riskRows = dashboard.riskRows.slice(0, 6);

  return (
    <div className="min-h-screen overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-2xl ring-1 ring-slate-200">
      <div className="grid min-h-screen lg:grid-cols-[270px_1fr]">
        <aside className="bg-[#081827] text-white">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-400 text-orange-400">✺</div>
            <div>
              <div className="text-2xl font-bold leading-5 tracking-[0.16em]">MANDALA</div>
              <div className="tracking-[0.38em] text-white/80">WORKSPACE</div>
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
          <div className="mt-5 border-t border-white/10 p-4 text-sm text-white/75">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-700">MC</div>
              <div>
                <p className="font-medium text-white">Mandala Team</p>
                <p className="text-xs">{connected ? "Live workbook" : "Connecting workbook"}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="bg-slate-50 p-5">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Mandala</h1>
              <p className="text-sm text-slate-500">
                {dashboard.projectStatus.name} • {dashboard.projectStatus.client} • {dashboard.projectStatus.phase}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 md:flex">
                <Search className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Search anything...</span>
              </div>
              <Bell className="h-5 w-5" />
              <MessageCircle className="h-5 w-5 text-orange-500" />
              <SyncBadge loading={loading} connected={connected} syncedAt={dashboard.workbookPreview.syncedAt} />
              <a href="/projects" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white">
                <Plus className="h-4 w-4" />
                New Project
              </a>
            </div>
          </header>

          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Metric label="Project Status" value={dashboard.projectStatus.status} note={dashboard.projectStatus.type} tone={statusTone(dashboard.projectStatus.status) === "red" ? "orange" : "green"} />
            <Metric label="Tasks in Progress" value={String(dashboard.taskStats.inProgress)} note={`${dashboard.taskStats.total} total tasks`} tone="purple" />
            <Metric label="Completed Tasks" value={String(dashboard.taskStats.completed)} note={`${dashboard.taskStats.averageCompletion}% average complete`} tone="green" />
            <Metric label="Risk Items" value={String(dashboard.riskItems)} note={`${riskRows.length} visible below`} tone="orange" />
            <Metric label="Event Workstreams" value={String(dashboard.eventWorkstreams)} note="From event + licensing sheets" tone="purple" />
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.72fr_0.65fr]">
            <Panel title="Project Overview">
              {ganttRows.length ? (
                <div className="overflow-x-auto">
                  <div className="min-w-[720px]">
                    {ganttRows.map((task: any, index: number) => (
                      <GanttRow key={task.id || index} task={task} index={index} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState message="No Gantt rows available yet." />
              )}
              <a href="/gantt" className="mt-3 block text-right text-sm font-medium text-blue-700">View full Gantt →</a>
            </Panel>

            <Panel title="My Tasks (Agile)">
              <div className="mb-3 flex gap-4 border-b text-xs font-medium">
                <span className="border-b-2 border-blue-600 pb-2">To Do ({dashboard.agileBoard.todo.length})</span>
                <span className="pb-2 text-slate-500">In Progress ({dashboard.taskStats.inProgress})</span>
                <span className="pb-2 text-slate-500">Done ({dashboard.taskStats.completed})</span>
              </div>
              {agileRows.length ? agileRows.map((task: any, index: number) => (
                <TaskRow key={task.taskID || task.id || index} task={task} />
              )) : <EmptyState message="No task rows available yet." />}
              <a href="/tasks" className="mt-3 block text-right text-sm font-medium text-blue-700">View all tasks →</a>
            </Panel>

            <Panel title="Upcoming Events">
              {eventRows.length ? eventRows.map((item: any, index: number) => (
                <EventRow key={item.id || item.title || index} item={item} />
              )) : <EmptyState message="No event or milestone rows available yet." />}
              <a href="/calendar" className="mt-3 block text-right text-sm font-medium text-blue-700">View calendar →</a>
            </Panel>
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.65fr]">
            <WorkbookPreview dashboard={dashboard} connected={connected} />
            <Panel title="Risk Register">
              {riskRows.length ? riskRows.map((risk: any, index: number) => (
                <RiskRow key={risk.issueRisk || risk.taskName || index} risk={risk} />
              )) : <EmptyState message="No risk rows available yet." />}
              <a href="/reports" className="mt-3 block text-right text-sm font-medium text-blue-700">View risk report →</a>
            </Panel>
          </section>

          {!connected && !loading && (
            <div className="mt-5 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-900">
              Workbook connection issue: {sync?.error || sync?.stage || "Unable to load workbook data."}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function SyncBadge({ loading, connected, syncedAt }: { loading: boolean; connected: boolean; syncedAt?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${connected ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"}`}>
      <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
      {loading ? "Syncing..." : connected ? `Synced / Live${syncedAt ? " • " + formatDate(syncedAt) : ""}` : "No live workbook"}
    </div>
  );
}

function Metric({ label, value, note, tone }: { label: string; value: string; note: string; tone: "green" | "purple" | "orange" }) {
  const Icon = tone === "green" ? CheckCircle2 : tone === "orange" ? AlertTriangle : Circle;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500">
        <Icon className={`h-3.5 w-3.5 ${tone === "green" ? "text-green-500" : tone === "orange" ? "text-orange-500" : "text-purple-500"}`} />
        {label}
      </div>
      <div className="truncate text-3xl font-bold">{value}</div>
      <div className="mt-2 text-xs text-emerald-700">↗ {note}</div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-100 px-4 py-3 text-sm font-bold uppercase">{title}</h2>
      <div className="p-4">{children}</div>
    </div>
  );
}

function GanttRow({ task, index }: { task: Record<string, any>; index: number }) {
  const colors = ["bg-green-500", "bg-blue-500", "bg-purple-500", "bg-orange-500", "bg-teal-500", "bg-amber-400"];
  const pct = Math.max(6, Math.min(92, Number(task.percentComplete || 0)));
  const left = Math.min(70, 8 + index * 8);
  return (
    <div className="grid grid-cols-[210px_90px_1fr] items-center border-b border-slate-100 py-3 text-xs">
      <strong className="truncate">{task.task || "Untitled Task"}</strong>
      <span className="truncate text-slate-500">{task.phase || task.status || "Phase"}</span>
      <div className="relative h-5 rounded bg-slate-100">
        <span className={`absolute top-1 h-3 rounded ${colors[index % colors.length]}`} style={{ left: `${left}%`, width: `${Math.max(10, pct / 2)}%` }} />
        <span className="absolute left-1/2 top-0 h-5 border-l border-red-500" />
      </div>
    </div>
  );
}

function TaskRow({ task }: { task: Record<string, any> }) {
  const priority = String(task.priority || task.status || "Medium");
  const tone = statusTone(priority);
  return (
    <div className="flex items-center gap-3 border-b border-slate-100 py-3 text-sm">
      <Circle className="h-4 w-4 text-slate-400" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{task.taskName || task.task || "Untitled Task"}</p>
        <p className="truncate text-xs text-slate-500">{task.owner || "Unassigned"} • {task.phase || "No phase"}</p>
      </div>
      <span className={`rounded-full px-2 py-1 text-xs ${
        tone === "red" ? "bg-red-50 text-red-600" :
        tone === "orange" ? "bg-orange-50 text-orange-600" :
        tone === "green" ? "bg-green-50 text-green-600" :
        "bg-slate-100 text-slate-600"
      }`}>
        {task.status || "Open"}
      </span>
    </div>
  );
}

function EventRow({ item }: { item: Record<string, any> }) {
  const date = item.dueDate || item.endDate || item.startDate;
  const d = date ? new Date(date) : null;
  const month = d && !Number.isNaN(d.getTime()) ? d.toLocaleDateString("en-US", { month: "short" }).toUpperCase() : "TBD";
  const day = d && !Number.isNaN(d.getTime()) ? d.getDate() : "--";
  return (
    <div className="flex gap-3 border-b border-slate-100 py-3">
      <div className="rounded-lg bg-slate-100 px-3 py-2 text-center">
        <p className="text-xs font-bold text-blue-700">{month}</p>
        <p className="text-lg font-bold">{day}</p>
      </div>
      <div>
        <p className="text-sm font-semibold">{item.title || item.milestone || item.workstream || item.requirement || "Upcoming item"}</p>
        <p className="text-xs text-slate-500">{item.owner || item.group || "Mandala"} • {item.status || "Planning"}</p>
        <p className="text-xs">{item.priority || item.category || ""}</p>
      </div>
    </div>
  );
}

function RiskRow({ risk }: { risk: Record<string, any> }) {
  return (
    <div className="border-b border-slate-100 py-3 text-sm">
      <p className="font-medium">{risk.issueRisk || risk.taskName || risk.workstream || "Risk item"}</p>
      <p className="text-xs text-slate-500">{risk.owner || "Unassigned"} • {risk.status || "Open"} • Score {risk.score || "-"}</p>
    </div>
  );
}

function WorkbookPreview({ dashboard, connected }: { dashboard: ReturnType<typeof mapDashboardData>; connected: boolean }) {
  const rows = dashboard.workbookPreview.rows.slice(0, 10);
  const headers = ["Task ID", "Task Name", "Owner", "Status", "Phase", "Start Date", "End Date", "% Complete", "Dependency"];

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="font-bold">MANDALA PROJECT MASTER WORKBOOK</h2>
          <p className="text-xs text-slate-500">
            {connected && dashboard.workbookPreview.synced
              ? `Synced / Live • ${dashboard.workbookPreview.workbookName || "Google Sheets"}`
              : "No live workbook rows available"}
          </p>
        </div>
        <a href="/workbooks" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Open Workbook</a>
      </div>
      {rows.length ? (
        <div className="overflow-x-auto">
          <table className="min-w-[1120px] border-collapse text-xs">
            <thead>
              <tr>{headers.map((h) => <th key={h} className="border border-slate-200 bg-green-100 px-2 py-2 text-left font-bold uppercase">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row: any, index: number) => (
                <tr key={row.taskID || row.id || index}>
                  <td className="border border-slate-200 px-2 py-2">{row.taskID || row.id}</td>
                  <td className="border border-slate-200 px-2 py-2">{row.taskName || row.task || row.name}</td>
                  <td className="border border-slate-200 px-2 py-2">{row.owner}</td>
                  <td className="border border-slate-200 px-2 py-2">{row.status}</td>
                  <td className="border border-slate-200 px-2 py-2">{row.phase}</td>
                  <td className="border border-slate-200 px-2 py-2">{formatDate(row.startDate || row.start)}</td>
                  <td className="border border-slate-200 px-2 py-2">{formatDate(row.endDate || row.end || row.dueDate)}</td>
                  <td className="border border-slate-200 px-2 py-2">{row.percentComplete !== undefined ? Math.round(Number(row.percentComplete) <= 1 ? Number(row.percentComplete) * 100 : Number(row.percentComplete)) : "—"}%</td>
                  <td className="border border-slate-200 px-2 py-2">{row.dependencyID || row.dependency || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState message="No workbook rows available yet." />
      )}
      <div className="flex gap-1 overflow-x-auto border-t bg-slate-50 px-4 py-2 text-xs">
        {["PROJECT MASTER", "TASK TRACKER", "GANTT", "RESOURCE PLAN", "BUDGET TRACKER", "RISK LOG", "EVENT PLANNER", "PROCUREMENT", "MURAL ESTIMATES", "DASHBOARD"].map((tab, i) => (
          <span key={tab} className={`whitespace-nowrap rounded px-4 py-2 ${i === 0 ? "bg-blue-100 text-blue-700" : "bg-white"}`}>{tab}</span>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">{message}</div>;
}

export default Dashboard;

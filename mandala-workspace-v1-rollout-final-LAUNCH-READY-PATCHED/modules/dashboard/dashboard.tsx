"use client";

import { useEffect, useState } from "react";

type SyncResponse = {
  connected: boolean;
  data?: {
    projectSettings?: any[];
    tasks?: any[];
    milestones?: any[];
    risks?: any[];
    eventPlanning?: any[];
    licensing?: any[];
    workbookName?: string;
    syncedAt?: string;
  };
  syncedAt?: string;
};

export default function Dashboard() {
  const [sync, setSync] = useState<SyncResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/sync/google-sheets", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSync(data))
      .catch(() => setSync({ connected: false }))
      .finally(() => setLoading(false));
  }, []);

  const workbook = sync?.data || {};
  const tasks = workbook.tasks || [];
  const milestones = workbook.milestones || [];
  const risks = workbook.risks || [];
  const projectSettings = workbook.projectSettings || [];

  const projectName =
    projectSettings.find((item) => item.field === "Project Name")?.value ||
    "Mandala Workspace";

  const activeTasks = tasks.filter((t) => t.status === "In Progress").length;
  const atRisk = risks.filter((r) => r.status === "Open" || r.status === "Monitor").length;

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-wide text-slate-500">Mandala Creative Workspace</p>
        <h1 className="text-4xl font-bold">{projectName}</h1>
        <p className="mt-2 text-slate-600">
          {loading
            ? "Loading workbook data..."
            : sync?.connected
            ? `Live workbook connected • ${workbook.workbookName || "Google Sheets"}`
            : "Workbook not connected"}
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Card title="Tasks" value={tasks.length} />
        <Card title="Active Tasks" value={activeTasks} />
        <Card title="Milestones" value={milestones.length} />
        <Card title="Risks" value={atRisk} />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Panel title="Current Tasks">
          {tasks.slice(0, 8).map((task) => (
            <Row
              key={task.taskID}
              title={task.taskName}
              meta={`${task.owner || "Unassigned"} • ${task.status || "No status"}`}
            />
          ))}
        </Panel>

        <Panel title="Milestones">
          {milestones.slice(0, 8).map((milestone) => (
            <Row
              key={milestone.milestone}
              title={milestone.milestone}
              meta={`${milestone.owner || "Unassigned"} • Due ${milestone.dueDate || "TBD"}`}
            />
          ))}
        </Panel>
      </section>

      <section className="mt-8">
        <Panel title="Risk Register">
          {risks.slice(0, 6).map((risk) => (
            <Row
              key={risk.issueRisk}
              title={risk.issueRisk}
              meta={`${risk.owner || "Unassigned"} • ${risk.status || "No status"} • Score ${risk.score || "-"}`}
            />
          ))}
        </Panel>
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Row({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <p className="font-medium">{title}</p>
      <p className="text-sm text-slate-500">{meta}</p>
    </div>
  );
}

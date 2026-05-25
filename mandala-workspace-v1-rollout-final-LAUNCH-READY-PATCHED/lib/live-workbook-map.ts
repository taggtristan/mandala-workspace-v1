export type LiveRow = Record<string, any>;

export type LiveWorkbookData = {
  project?: LiveRow;
  projectSettings?: LiveRow[];
  tasks?: LiveRow[];
  milestones?: LiveRow[];
  risks?: LiveRow[];
  events?: LiveRow[];
  eventPlanning?: LiveRow[];
  eventVendors?: LiveRow[];
  licensing?: LiveRow[];
  workbookRows?: LiveRow[];
  workbookName?: string;
  syncedAt?: string;
};

const norm = (v?: unknown) => String(v ?? "").trim().toLowerCase();

const isInProgress = (s?: unknown) => norm(s) === "in progress";
const isComplete = (s?: unknown) => ["complete", "completed"].includes(norm(s));
const isAtRisk = (s?: unknown) => norm(s) === "at risk";

const numberOrNull = (value: unknown) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

const completionPercent = (row: LiveRow) => {
  const raw =
    row.percentComplete ??
    row["% complete"] ??
    row.completion ??
    row.complete ??
    row.percent ??
    0;

  const n = numberOrNull(raw);
  if (n === null) return null;
  return n <= 1 ? Math.round(n * 100) : Math.round(n);
};

export function settingValue(settings: LiveRow[] = [], field: string, fallback = "") {
  const match = settings.find((item) => norm(item.field) === norm(field));
  return String(match?.value ?? fallback);
}

export function mapDashboardData({
  project,
  projectSettings = [],
  tasks = [],
  milestones = [],
  risks = [],
  events = [],
  eventPlanning = [],
  eventVendors = [],
  licensing = [],
  workbookRows = [],
  workbookName = "",
  syncedAt = "",
}: LiveWorkbookData) {
  const activeProject = project ?? {};

  const inProgressTasks = tasks.filter((t) => isInProgress(t.status));
  const completedTasks = tasks.filter((t) => isComplete(t.status));

  const completionValues = tasks
    .map(completionPercent)
    .filter((n): n is number => Number.isFinite(n));

  const avgCompletion =
    completionValues.length > 0
      ? Math.round(completionValues.reduce((a, b) => a + b, 0) / completionValues.length)
      : 0;

  const eventRows = events.length ? events : eventPlanning;
  const riskItems = [
    ...risks,
    ...tasks.filter((t) => isAtRisk(t.status)),
    ...eventRows.filter((e) => isAtRisk(e.status)),
  ];

  const eventWorkstreams = eventRows.length
    ? eventRows
    : [
        ...eventVendors.map((item) => ({ ...item, type: "Vendor" })),
        ...licensing.map((item) => ({ ...item, type: "Licensing" })),
      ];

  const projectName =
    activeProject.name ||
    activeProject.projectName ||
    settingValue(projectSettings, "Project Name", "Patineta Project Plan");

  const projectType =
    activeProject.type ||
    activeProject.projectType ||
    settingValue(projectSettings, "Project Type", "Project Plan");

  const projectStatus =
    activeProject.status ||
    settingValue(projectSettings, "Status", riskItems.length ? "At Risk" : "Live");

  const currentPhase =
    activeProject.phase ||
    activeProject.currentPhase ||
    settingValue(projectSettings, "Current Phase", "Operations");

  const client =
    activeProject.client ||
    activeProject.clientPartner ||
    settingValue(projectSettings, "Client / Partner", "Mandala Creative");

  return {
    projectStatus: {
      name: projectName,
      type: projectType,
      status: projectStatus,
      phase: currentPhase,
      client,
    },

    taskStats: {
      total: tasks.length,
      inProgress: inProgressTasks.length,
      completed: completedTasks.length,
      averageCompletion: avgCompletion,
    },

    riskItems: riskItems.length,
    riskRows: riskItems,

    eventWorkstreams: eventWorkstreams.length,

    agileBoard: {
      todo: tasks.filter((t) => ["to do", "todo", "not started", "backlog", "upcoming"].includes(norm(t.status))),
      inProgress: inProgressTasks,
      done: completedTasks,
    },

    ganttRows: tasks.map((t, index) => ({
      id: t.id || t.taskID || String(index),
      task: t.task || t.taskName || t.name || t.title || "Untitled Task",
      phase: t.phase || "",
      startDate: t.startDate || t.start || "",
      endDate: t.endDate || t.end || t.dueDate || "",
      dependency: t.dependency || t.dependsOn || t.dependencyID || "",
      status: t.status || "",
      percentComplete: completionPercent(t) ?? 0,
      owner: t.owner || "",
      original: t,
    })),

    milestones: milestones.map((m, index) => ({
      id: m.id || m.milestoneID || String(index),
      title: m.milestone || m.title || m.name || "Milestone",
      owner: m.owner || "",
      dueDate: m.dueDate || m.endDate || "",
      status: m.status || "",
      priority: m.priority || "",
      original: m,
    })),

    workbookPreview: {
      synced: workbookRows.length > 0 || tasks.length > 0,
      rows: workbookRows.length > 0 ? workbookRows : tasks,
      workbookName,
      syncedAt,
    },
  };
}

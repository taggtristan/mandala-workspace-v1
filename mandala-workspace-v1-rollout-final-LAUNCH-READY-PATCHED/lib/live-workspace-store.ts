export type LiveRow = Record<string, any>;

export type LiveWorkbookData = {
  connected?: boolean;
  project?: LiveRow | LiveRow[];
  projectSettings?: LiveRow[];
  tasks?: LiveRow[];
  milestones?: LiveRow[];
  risks?: LiveRow[];
  events?: LiveRow[];
  eventPlanning?: LiveRow[];
  eventVendors?: LiveRow[];
  licensing?: LiveRow[];
  procurement?: LiveRow[];
  readiness?: LiveRow[];
  estimate?: LiveRow[];
  estimateExclusions?: LiveRow[];
  workbookRows?: LiveRow[];
  workbookId?: string;
  workbookName?: string;
  syncedAt?: string;
};

export type WorkspaceSyncResponse = {
  connected?: boolean;
  status?: number;
  data?: LiveWorkbookData;
  error?: string;
  stage?: string;
  syncedAt?: string;
};

export type CanonicalWorkbook = {
  project: LiveRow;
  projectSettings: LiveRow[];
  tasks: LiveRow[];
  milestones: LiveRow[];
  risks: LiveRow[];
  events: LiveRow[];
  eventPlanning: LiveRow[];
  eventVendors: LiveRow[];
  licensing: LiveRow[];
  procurement: LiveRow[];
  readiness: LiveRow[];
  estimate: LiveRow[];
  estimateExclusions: LiveRow[];
  workbookRows: LiveRow[];
  workbookId: string;
  workbookName: string;
  syncedAt: string;
  raw: LiveWorkbookData;
};

export type WorkspaceDashboardData = {
  projectName: string;
  projectType: string;
  projectStatus: string;
  projectPhase: string;
  projectClient: string;
  totalTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  averageCompletion: number;
  riskCount: number;
  eventCount: number;
  ganttRows: LiveRow[];
  workbookPreviewRows: LiveRow[];
  riskRows: LiveRow[];
};

export type WorkspaceStore = {
  loading: boolean;
  connected: boolean;
  isSynced: boolean;
  syncStatus: "loading" | "synced" | "empty" | "error";
  status?: number;
  stage?: string;
  error?: string;
  project: LiveRow[];
  projectCommandCenterRows: LiveRow[];
  patinetaWorkbookRows: LiveRow[];
  tasks: LiveRow[];
  milestones: LiveRow[];
  riskRows: LiveRow[];
  risks: LiveRow[];
  events: LiveRow[];
  vendors: LiveRow[];
  licensing: LiveRow[];
  workbookRows: LiveRow[];
  workbook: CanonicalWorkbook;
  dashboard: WorkspaceDashboardData;
  syncedAt?: string;
};

type WorkspaceStoreOptions = {
  loading?: boolean;
  error?: string;
};

export const norm = (value?: unknown) =>
  String(value ?? "").trim().toLowerCase();

const asRows = (value: unknown): LiveRow[] => {
  if (Array.isArray(value)) {
    return value.filter((row): row is LiveRow => Boolean(row) && typeof row === "object");
  }

  if (value && typeof value === "object") {
    return [value as LiveRow];
  }

  return [];
};

const firstRow = (value: unknown): LiveRow => asRows(value)[0] ?? {};

const isInProgress = (status: unknown) => norm(status) === "in progress";

const isComplete = (status: unknown) =>
  ["complete", "completed"].includes(norm(status));

const isAtRisk = (status: unknown) =>
  ["at risk", "open", "monitor", "needed"].includes(norm(status));

const numberOrNull = (value: unknown) => {
  if (typeof value === "string") {
    const clean = value.trim().replace(/%$/, "");
    if (!clean) return null;
    const parsed = Number(clean);
    return Number.isFinite(parsed) ? parsed : null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const completionPercent = (row: LiveRow) => {
  const raw =
    row.percentComplete ??
    row["% complete"] ??
    row.completion ??
    row.complete ??
    row.percent ??
    0;

  const parsed = numberOrNull(raw);
  if (parsed === null) return null;
  return parsed <= 1 ? Math.round(parsed * 100) : Math.round(parsed);
};

export function settingValue(settings: LiveRow[] = [], field: string, fallback = "") {
  const match = settings.find(
    (item) => norm(item.field ?? item.setting ?? item.name) === norm(field)
  );

  return String(match?.value ?? match?.settingValue ?? fallback);
}

export function normalizeTask(row: LiveRow, index = 0): LiveRow {
  const id = row.id ?? row.taskID ?? row.taskId ?? `task-${index + 1}`;
  const taskName = row.taskName ?? row.task ?? row.name ?? row.title ?? "Untitled Task";

  return {
    ...row,
    id,
    taskID: row.taskID ?? row.taskId ?? id,
    taskName,
    task: row.task ?? taskName,
    startDate: row.startDate ?? row.start ?? "",
    endDate: row.endDate ?? row.end ?? row.dueDate ?? "",
    percentComplete: completionPercent(row) ?? 0,
  };
}

function unpackSyncResponse(source: unknown) {
  const payload = source && typeof source === "object" ? (source as WorkspaceSyncResponse) : {};
  const hasEnvelope = "data" in payload || "status" in payload || "stage" in payload || "error" in payload;

  return {
    response: hasEnvelope ? payload : {},
    workbook: (hasEnvelope ? payload.data ?? {} : payload) as LiveWorkbookData,
  };
}

export function mapDashboardData(workbook: Partial<CanonicalWorkbook>): WorkspaceDashboardData {
  const {
    project = {},
    projectSettings = [],
    tasks = [],
    milestones = [],
    risks = [],
    events = [],
    eventPlanning = [],
    eventVendors = [],
    licensing = [],
    workbookRows = [],
  } = workbook;

  const eventRows = events.length ? events : eventPlanning;
  const inProgressTasks = tasks.filter((task) => isInProgress(task.status));
  const completedTasks = tasks.filter((task) => isComplete(task.status));
  const completionValues = tasks
    .map(completionPercent)
    .filter((value): value is number => Number.isFinite(value));

  const riskRows = [
    ...risks,
    ...tasks.filter((task) => isAtRisk(task.status)),
    ...eventRows.filter((event) => isAtRisk(event.status)),
    ...licensing.filter((item) => isAtRisk(item.status)),
  ];

  const eventWorkstreamRows = eventRows.length
    ? eventRows
    : [
        ...eventVendors.map((item) => ({ ...item, type: "Vendor" })),
        ...licensing.map((item) => ({ ...item, type: "Licensing" })),
      ];

  return {
    projectName:
      project.name ||
      project.projectName ||
      settingValue(projectSettings, "Project Name", "Patineta Project Plan"),
    projectType:
      project.type ||
      project.projectType ||
      settingValue(projectSettings, "Project Type", "Project Plan"),
    projectStatus:
      project.status ||
      settingValue(projectSettings, "Status", riskRows.length ? "At Risk" : "Active"),
    projectPhase:
      project.phase ||
      project.currentPhase ||
      settingValue(projectSettings, "Current Phase", "Operations"),
    projectClient:
      project.client ||
      project.clientPartner ||
      settingValue(projectSettings, "Client / Partner", "Mandala Creative"),
    totalTasks: tasks.length,
    inProgressTasks: inProgressTasks.length,
    completedTasks: completedTasks.length,
    averageCompletion:
      completionValues.length > 0
        ? Math.round(completionValues.reduce((total, value) => total + value, 0) / completionValues.length)
        : 0,
    riskCount: riskRows.length,
    eventCount: eventWorkstreamRows.length,
    ganttRows: tasks,
    workbookPreviewRows: workbookRows.length ? workbookRows : tasks,
    riskRows,
  };
}

export function createWorkspaceStore(source?: unknown, options: WorkspaceStoreOptions = {}): WorkspaceStore {
  const { response, workbook } = unpackSyncResponse(source);
  const tasks = asRows(workbook.tasks).map(normalizeTask);
  const projectSettings = asRows(workbook.projectSettings);
  const eventPlanning = asRows(workbook.eventPlanning);
  const licensing = asRows(workbook.licensing);
  const workbookRows = asRows(workbook.workbookRows).length ? asRows(workbook.workbookRows) : tasks;

  const canonicalWorkbook: CanonicalWorkbook = {
    project: firstRow(workbook.project),
    projectSettings,
    tasks,
    milestones: asRows(workbook.milestones),
    risks: asRows(workbook.risks),
    events: asRows(workbook.events),
    eventPlanning,
    eventVendors: asRows(workbook.eventVendors),
    licensing,
    procurement: asRows(workbook.procurement),
    readiness: asRows(workbook.readiness),
    estimate: asRows(workbook.estimate),
    estimateExclusions: asRows(workbook.estimateExclusions),
    workbookRows,
    workbookId: String(workbook.workbookId ?? ""),
    workbookName: String(workbook.workbookName ?? ""),
    syncedAt: String(workbook.syncedAt ?? response.syncedAt ?? ""),
    raw: workbook,
  };

  const dashboard = mapDashboardData(canonicalWorkbook);
  const isSynced = tasks.length > 0 || projectSettings.length > 0;
  const connected = Boolean((response.connected ?? workbook.connected ?? isSynced) && workbook.connected !== false);
  const error = options.error ?? response.error;
  const loading = Boolean(options.loading);
  const syncStatus = loading ? "loading" : error || response.stage ? "error" : isSynced ? "synced" : "empty";

  return {
    loading,
    connected,
    isSynced,
    syncStatus,
    status: response.status,
    stage: response.stage,
    error,
    project: projectSettings,
    projectCommandCenterRows: tasks,
    patinetaWorkbookRows: tasks,
    tasks,
    milestones: canonicalWorkbook.milestones,
    riskRows: dashboard.riskRows,
    risks: canonicalWorkbook.risks,
    events: eventPlanning,
    vendors: canonicalWorkbook.eventVendors,
    licensing,
    workbookRows,
    workbook: canonicalWorkbook,
    dashboard,
    syncedAt: canonicalWorkbook.syncedAt,
  };
}

export function createEmptyWorkspaceStore(options: WorkspaceStoreOptions = {}) {
  return createWorkspaceStore(undefined, options);
}

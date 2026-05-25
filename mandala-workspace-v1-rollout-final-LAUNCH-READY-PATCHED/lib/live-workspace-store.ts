export type WorkspaceStore = {
  isSynced: boolean;
  syncStatus: "synced" | "empty";
  project: any[];
  projectCommandCenterRows: any[];
  patinetaWorkbookRows: any[];
  tasks: any[];
  milestones: any[];
  riskRows: any[];
  risks: any[];
  events: any[];
  vendors: any[];
  licensing: any[];
  workbookRows: any[];
  dashboard: {
    projectName: string;
    projectType: string;
    projectStatus: string;
    totalTasks: number;
    inProgressTasks: number;
    completedTasks: number;
    riskCount: number;
    eventCount: number;
    ganttRows: any[];
    workbookPreviewRows: any[];
  };
  syncedAt?: string;
};

const norm = (value: any) => String(value ?? "").trim().toLowerCase();

const safeArray = (value: any) => Array.isArray(value) ? value : [];

const isInProgress = (status: any) => norm(status) === "in progress";

const isComplete = (status: any) =>
  ["complete", "completed"].includes(norm(status));

const isAtRisk = (status: any) =>
  ["at risk", "open", "monitor", "needed"].includes(norm(status));

function getProjectValue(
  projectSettings: any[],
  field: string,
  fallback: string
) {
  return (
    projectSettings.find(
      (item) => norm(item.field) === norm(field)
    )?.value || fallback
  );
}

export function createWorkspaceStore(payload: any): WorkspaceStore {
  const project = safeArray(payload?.projectSettings);
  const tasks = safeArray(payload?.tasks);
  const milestones = safeArray(payload?.milestones);
  const risks = safeArray(payload?.risks);
  const events = safeArray(payload?.eventPlanning);
  const vendors = safeArray(payload?.eventVendors);
  const licensing = safeArray(payload?.licensing);

  const projectCommandCenterRows = tasks;
  const patinetaWorkbookRows = tasks;
  const workbookRows = tasks;

  const inProgressTasks = tasks.filter((task: any) =>
    isInProgress(task.status)
  );

  const completedTasks = tasks.filter((task: any) =>
    isComplete(task.status)
  );

  const riskRows = [
    ...risks,
    ...tasks.filter((task: any) => isAtRisk(task.status)),
    ...events.filter((event: any) => isAtRisk(event.status)),
    ...licensing.filter((item: any) => isAtRisk(item.status)),
  ];

  const dashboard = {
    projectName: getProjectValue(
      project,
      "Project Name",
      "Patineta Project Plan"
    ),
    projectType: getProjectValue(
      project,
      "Project Type",
      "Project Plan"
    ),
    projectStatus: getProjectValue(
      project,
      "Status",
      "Active"
    ),
    totalTasks: tasks.length,
    inProgressTasks: inProgressTasks.length,
    completedTasks: completedTasks.length,
    riskCount: riskRows.length,
    eventCount: events.length + licensing.length,
    ganttRows: tasks,
    workbookPreviewRows: workbookRows,
  };

  return {
    isSynced: tasks.length > 0 || project.length > 0,
    syncStatus: tasks.length > 0 || project.length > 0 ? "synced" : "empty",
    project,
    projectCommandCenterRows,
    patinetaWorkbookRows,
    tasks,
    milestones,
    riskRows,
    risks,
    events,
    vendors,
    licensing,
    workbookRows,
    dashboard,
    syncedAt: payload?.syncedAt,
  };
}

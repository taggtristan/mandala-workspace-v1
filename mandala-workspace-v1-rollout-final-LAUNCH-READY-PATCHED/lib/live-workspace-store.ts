export type WorkspaceStore = {
  project: any;
  tasks: any[];
  milestones: any[];
  risks: any[];
  events: any[];
  vendors: any[];
  licensing: any[];
  workbookRows: any[];
  syncedAt?: string;
};

export function createWorkspaceStore(payload: any): WorkspaceStore {
  return {
    project: payload?.projectSettings ?? [],
    tasks: payload?.tasks ?? [],
    milestones: payload?.milestones ?? [],
    risks: payload?.risks ?? [],
    events: payload?.eventPlanning ?? [],
    vendors: payload?.eventVendors ?? [],
    licensing: payload?.licensing ?? [],
    workbookRows: payload?.tasks ?? [],
    syncedAt: payload?.syncedAt,
  };
}

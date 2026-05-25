import { projectTemplates } from "@/data/mandala";

export type NewProjectInput = {
  name: string;
  clientOrOwner: string;
  templateId: string;
  lead: string;
  startDate?: string;
  endDate?: string;
  workbookUrl?: string;
};

export function createProjectWorkspace(input: NewProjectInput) {
  const template = projectTemplates.find(t => t.id === input.templateId);
  if (!template) throw new Error("Unknown project template");

  return {
    id: `${input.templateId}-${Date.now()}`.toLowerCase(),
    name: input.name,
    clientOrOwner: input.clientOrOwner,
    type: template.name,
    framework: template.framework,
    status: "Not Started",
    currentPhase: template.phases[0],
    phases: template.phases,
    modules: template.modules,
    lead: input.lead,
    workbookUrl: input.workbookUrl || "",
    roles: ["Admin","Project Manager","Creative Lead","Member","Client Viewer","Vendor Viewer"],
    folders: ["Contracts","Design","Production","Photos","Reports","Client Deliverables","Procurement","Event Planning","Archive"],
    createdAt: new Date().toISOString()
  };
}

export type Role = "Admin"|"Project Manager"|"Creative Lead"|"Member"|"Client Viewer"|"Vendor Viewer";

const permissions: Record<Role,string[]> = {
  "Admin": ["*"],
  "Project Manager": ["projects:edit","tasks:edit","risks:edit","reports:publish","workbook:sync"],
  "Creative Lead": ["tasks:edit","creative:approve","estimates:edit","field-notes:edit"],
  "Member": ["assigned:edit","notes:add","documents:upload"],
  "Client Viewer": ["approved:view","reports:view"],
  "Vendor Viewer": ["vendor:view","documents:submit"]
};

export function can(role: Role, action: string) {
  return permissions[role]?.includes("*") || permissions[role]?.includes(action);
}

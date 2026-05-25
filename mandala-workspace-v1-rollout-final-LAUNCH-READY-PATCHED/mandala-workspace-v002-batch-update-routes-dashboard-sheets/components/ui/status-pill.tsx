const styles: Record<string,string> = {
  Complete:"bg-emerald-100 text-emerald-800",
  "In Progress":"bg-blue-100 text-blue-800",
  Upcoming:"bg-stone-100 text-stone-700",
  "At Risk":"bg-amber-100 text-amber-800",
  Blocked:"bg-red-100 text-red-800",
  Planning:"bg-stone-100 text-stone-700",
  Ready:"bg-emerald-100 text-emerald-800"
};

export function StatusPill({status}:{status:string}) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status] || "bg-stone-100 text-stone-700"}`}>{status}</span>;
}

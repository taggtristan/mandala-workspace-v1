import { tasks } from "@/data/mandala";
import { StatusPill } from "@/components/ui/status-pill";

export function TaskBoard({clientMode=false}:{clientMode?:boolean}) {
  const visibleTasks = clientMode ? tasks.filter(t => t.clientVisible) : tasks;

  return (
    <div className="rounded-3xl border border-mandala-sand bg-white p-5">
      <h2 className="text-xl font-semibold">{clientMode ? "Client Timeline View" : "Project Command Center"}</h2>
      <div className="mt-4 overflow-hidden rounded-2xl border border-mandala-sand">
        <div className="grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr] bg-mandala-charcoal px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white">
          <div>Task</div><div>Owner</div><div>Status</div><div>Dependency</div>
        </div>
        {visibleTasks.map(t => (
          <div key={t.id} className={`grid grid-cols-[1fr_0.6fr_0.6fr_0.6fr] border-t border-mandala-sand px-4 py-3 text-sm ${t.blocked ? "bg-red-50" : ""}`}>
            <div><p className="font-medium">{t.name}</p><p className="text-xs text-stone-500">{t.id}</p></div>
            <div>{clientMode ? "Mandala" : t.owner}</div>
            <StatusPill status={t.status} />
            <div>{clientMode ? "Approved" : t.dependency}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

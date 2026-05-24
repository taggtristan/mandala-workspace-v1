import { projects, tasks } from "@/data/mandala";

export function Dashboard() {
  const project = projects[0];
  const completion = Math.round(tasks.reduce((sum,t)=>sum+t.complete,0)/tasks.length);
  const blocked = tasks.filter(t=>t.blocked).length;
  const critical = tasks.filter(t=>t.critical).length;

  return (
    <section className="grid gap-4 md:grid-cols-4">
      <Kpi label="Portfolio Health" value={`${project.health}%`} />
      <Kpi label="Completion" value={`${completion}%`} />
      <Kpi label="Blocked Tasks" value={String(blocked)} />
      <Kpi label="Critical Path" value={String(critical)} />
    </section>
  );
}

function Kpi({label,value}:{label:string;value:string}) {
  return <div className="rounded-3xl border border-mandala-sand bg-white p-5 shadow-sm"><p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p><p className="mt-2 text-3xl font-semibold">{value}</p></div>;
}

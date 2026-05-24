import { eventWorkstreams } from "@/data/mandala";
import { StatusPill } from "@/components/ui/status-pill";

export function EventOps({clientMode=false}:{clientMode?:boolean}) {
  const rows = clientMode ? eventWorkstreams.filter(e => e.clientVisible) : eventWorkstreams;
  return (
    <div className="rounded-3xl border border-mandala-sand bg-white p-5">
      <h2 className="text-xl font-semibold">Event Operations</h2>
      <p className="mt-1 text-sm text-stone-500">Vendors, licensing, outreach, merchandising, and activation readiness.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        {rows.map(e => (
          <div key={e.subject} className="rounded-2xl bg-mandala-cream p-4">
            <h3 className="font-semibold">{e.subject}</h3>
            <p className="mt-1 text-xs text-stone-500">Owner: {clientMode ? "Mandala" : e.owner}</p>
            <div className="mt-3 flex items-center justify-between"><StatusPill status={e.status}/><span className="text-sm font-semibold">{e.readiness}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

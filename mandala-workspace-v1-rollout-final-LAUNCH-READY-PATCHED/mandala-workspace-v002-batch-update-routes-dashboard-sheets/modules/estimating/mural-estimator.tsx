import { estimateExample } from "@/data/mandala";
import { calculateMuralEstimate } from "@/lib/estimate-engine";

export function MuralEstimator() {
  const result = calculateMuralEstimate(estimateExample);

  return (
    <div className="rounded-3xl border border-mandala-sand bg-white p-5">
      <h2 className="text-xl font-semibold">Mural + Paint Estimate</h2>
      <p className="mt-1 text-sm text-stone-500">Calculates gross wall area, excluded windows/doors/no-paint zones, and net paintable square footage.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Kpi label="Gross SF" value={`${result.grossSquareFeet}`} />
        <Kpi label="Excluded SF" value={`${result.excludedSquareFeet}`} />
        <Kpi label="Net Paintable SF" value={`${result.netPaintableSquareFeet}`} />
        <Kpi label="Paint Gallons" value={`${result.paintGallons}`} />
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-mandala-sand">
        <div className="grid grid-cols-[0.8fr_0.6fr_0.6fr_0.6fr_1fr] bg-mandala-charcoal px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white">
          <div>Exclusion</div><div>Width</div><div>Height</div><div>Qty</div><div>Notes</div>
        </div>
        {estimateExample.exclusions.map(ex => (
          <div key={ex.id} className="grid grid-cols-[0.8fr_0.6fr_0.6fr_0.6fr_1fr] border-t border-mandala-sand px-4 py-3 text-sm">
            <div>{ex.type}</div><div>{ex.width} ft</div><div>{ex.height} ft</div><div>{ex.quantity}</div><div className="text-stone-500">{ex.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Kpi({label,value}:{label:string;value:string}) {
  return <div className="rounded-2xl bg-mandala-cream p-4"><p className="text-xs uppercase tracking-wider text-stone-500">{label}</p><p className="mt-1 text-2xl font-semibold">{value}</p></div>
}

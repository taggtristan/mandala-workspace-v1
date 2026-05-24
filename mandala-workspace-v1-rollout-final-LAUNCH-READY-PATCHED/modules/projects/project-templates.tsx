import { projectTemplates } from "@/data/mandala";

export function ProjectTemplates() {
  return (
    <div className="rounded-3xl border border-mandala-sand bg-white p-5">
      <h2 className="text-xl font-semibold">Universal Project Creation Engine</h2>
      <p className="mt-1 text-sm text-stone-500">Create any Mandala project type from a template.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {projectTemplates.map(t => (
          <div key={t.id} className="rounded-2xl bg-mandala-cream p-4">
            <p className="text-xs uppercase tracking-wider text-mandala-ocean">{t.framework}</p>
            <h3 className="mt-1 font-semibold">{t.name}</h3>
            <p className="mt-1 text-xs text-stone-500">{t.category}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {t.modules.slice(0,3).map(m => <span key={m} className="rounded-full bg-white px-2.5 py-1 text-xs">{m}</span>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

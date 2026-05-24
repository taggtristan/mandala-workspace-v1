import { brand, projects } from "@/data/mandala";
import { Dashboard } from "@/modules/dashboard/dashboard";
import { ProjectTemplates } from "@/modules/projects/project-templates";
import { TaskBoard } from "@/modules/tasks/task-board";
import { MuralEstimator } from "@/modules/estimating/mural-estimator";
import { EventOps } from "@/modules/events/event-ops";
import { ClientPortalPreview } from "@/modules/portals/client-portal";

export default function Home() {
  const project = projects[0];

  return (
    <main className="min-h-screen bg-mandala-cream text-mandala-ink">
      <div className="mx-auto max-w-7xl px-5 py-6">
        <header className="rounded-[2rem] bg-gradient-to-br from-mandala-charcoal via-[#303027] to-mandala-ocean p-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/75">
                {brand.name} Workspace
              </div>
              <h1 className="text-4xl font-semibold tracking-tight">Rollout-Ready Operations Platform</h1>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-white/70">
                {brand.tagline} Universal project management for murals, events, branding, digital, fabrication, consulting, internal operations, and client portals.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-4 text-sm">
              <p className="text-white/60">Active project</p>
              <p className="mt-1 text-lg font-semibold">{project.name}</p>
              <p className="mt-1 text-white/70">{project.type} · {project.status}</p>
            </div>
          </div>
        </header>

        <section className="mt-6"><Dashboard /></section>
        <section className="mt-6"><ProjectTemplates /></section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <TaskBoard />
          <EventOps />
        </section>

        <section className="mt-6"><MuralEstimator /></section>
        <section className="mt-6"><ClientPortalPreview /></section>

        <footer className="mt-6 rounded-3xl border border-mandala-sand bg-white/70 p-5 text-sm text-stone-500">
          Rollout foundation includes universal project templates, internal workspace, client portal preview, workbook sync scaffold, square-foot exclusions, role model, and deployment documentation.
        </footer>
      </div>
    </main>
  );
}

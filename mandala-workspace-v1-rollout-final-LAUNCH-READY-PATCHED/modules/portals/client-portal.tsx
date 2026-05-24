import { TaskBoard } from "@/modules/tasks/task-board";
import { EventOps } from "@/modules/events/event-ops";

export function ClientPortalPreview() {
  return (
    <section className="grid gap-6">
      <div className="rounded-3xl border border-mandala-sand bg-white p-5">
        <h2 className="text-xl font-semibold">Client Portal Preview</h2>
        <p className="mt-1 text-sm text-stone-500">Restricted stakeholder view showing only approved schedule, milestones, and reports.</p>
      </div>
      <TaskBoard clientMode />
      <EventOps clientMode />
    </section>
  );
}

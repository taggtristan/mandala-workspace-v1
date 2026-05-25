import type { ReactNode } from "react";
import { Calendar, Bell, MessageCircle, Plus, Search, Home, FolderKanban, BookOpen, ListChecks, GitBranch, ShoppingCart, Paintbrush, Users, FileText, Receipt, BarChart3, Settings, CheckCircle2, Circle, AlertTriangle } from "lucide-react";
import { projects, tasks, eventWorkstreams } from "@/data/mandala";

const navItems = [
  ["Dashboard", "/dashboard", Home],
  ["Projects", "/projects", FolderKanban],
  ["Workbooks", "/workbooks", BookOpen],
  ["Tasks (Agile)", "/tasks", ListChecks],
  ["Gantt / Timeline", "/gantt", GitBranch],
  ["Calendar", "/calendar", Calendar],
  ["Events", "/events", Calendar],
  ["Procurement", "/procurement", ShoppingCart],
  ["Murals", "/murals", Paintbrush],
  ["Clients", "/clients", Users],
  ["Estimates", "/estimates", FileText],
  ["Invoices", "/invoices", Receipt],
  ["Reports", "/reports", BarChart3],
  ["Team", "/team", Users],
  ["Settings", "/settings", Settings]
] as const;

const workbookRows = [
  ["MC-25-001", "CityLights Mural Series", "City of Coquitlam", "Public Art", "Marisa Crocker", "Active", "Production", "2025-04-15", "2025-06-20", "$85,000", "$45,300", "53%", "High", "🟢", "Installation Phase", "15", "Install scheduled"],
  ["MC-25-002", "Riverside Event Activation", "Riverside BIA", "Event", "Marisa Crocker", "Active", "Planning", "2025-05-01", "2025-06-15", "$32,000", "$8,500", "27%", "High", "🟡", "Vendor Confirmation", "10", "Confirm vendors"],
  ["MC-25-003", "Brand Identity - Horizon", "Horizon Developments", "Branding", "Tristan Pittard", "Active", "Design", "2025-04-20", "2025-05-30", "$18,000", "$9,200", "51%", "Medium", "🟢", "Client Presentation", "5", "Deck in review"],
  ["MC-25-004", "Community Mural Program", "City of Coquitlam", "Public Art", "Marisa Crocker", "Active", "Permitting", "2025-03-10", "2025-07-01", "$120,000", "$22,100", "18%", "High", "🔴", "Permit Approval", "20", "Awaiting city review"],
  ["MC-25-005", "Website Redesign", "Mandala Creative", "Digital", "Tristan Pittard", "Active", "Development", "2025-04-28", "2025-06-10", "$16,500", "$6,800", "41%", "Medium", "🟢", "Beta Launch", "13", "Dev in progress"],
  ["MC-25-006", "Public Art Consultation", "Port Coquitlam", "Consulting", "Marisa Crocker", "Active", "Planning", "2025-05-05", "2025-06-30", "$12,000", "$1,500", "13%", "Low", "🟡", "Stakeholder Meeting", "18", "Outreach phase"]
];

export function Dashboard() {
  const completion = Math.round(tasks.reduce((sum,t)=>sum+t.complete,0)/tasks.length);
  const completed = tasks.filter(t => t.status.toLowerCase().includes("complete")).length || 15;
  const activeProjects = Math.max(projects.length, 24);
  const upcomingEvents = Math.max(eventWorkstreams.length, 6);

  return (
    <div className="min-h-screen overflow-hidden rounded-[2rem] bg-white text-slate-950 shadow-2xl ring-1 ring-slate-200">
      <div className="grid min-h-screen lg:grid-cols-[270px_1fr]">
        <aside className="bg-[#081827] text-white">
          <div className="flex items-center gap-3 px-5 py-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-400 text-orange-400">✺</div>
            <div>
              <div className="text-2xl font-bold leading-5 tracking-[0.16em]">MANDALA</div>
              <div className="tracking-[0.38em] text-white/80">WORKSPACE</div>
            </div>
          </div>
          <nav className="px-3 py-2">
            {navItems.map(([label, href, Icon], index) => (
              <a key={href} href={href} className={`flex items-center gap-3 rounded-md px-4 py-2.5 text-sm transition hover:bg-white/10 ${index === 0 ? "bg-white/10 text-orange-400" : "text-white"}`}>
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-5 border-t border-white/10 p-4 text-sm text-white/75">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-700">IS</div>
              <div>
                <p className="font-medium text-white">Isobel D’Alessio</p>
                <p className="text-xs">Admin</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="bg-slate-50 p-5">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Welcome back, Isobel</h1>
              <p className="text-sm text-slate-500">Mandala Creative Operations Overview</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 md:flex">
                <Search className="h-4 w-4 text-slate-400" />
                <span className="text-sm text-slate-500">Search anything...</span>
              </div>
              <Bell className="h-5 w-5" />
              <MessageCircle className="h-5 w-5 text-orange-500" />
              <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-950 text-xs text-white">IS</div>
              <a href="/projects" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white"><Plus className="h-4 w-4"/>New Project</a>
            </div>
          </header>

          <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <Metric label="Active Projects" value={String(activeProjects)} note="8% from last month" tone="green" />
            <Metric label="Tasks in Progress" value="37" note="12% from last week" tone="purple" />
            <Metric label="Completed This Month" value={String(Math.max(completed,15))} note="25% from last month" tone="green" />
            <Metric label="Budget Utilization" value="68%" note="On track" tone="orange" />
            <Metric label="Upcoming Events" value={String(upcomingEvents)} note="View calendar →" tone="purple" />
          </section>

          <section className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.72fr_0.65fr]">
            <Panel title="Project Overview">
              <div className="overflow-x-auto">
                <div className="min-w-[680px]">
                  {[
                    ["CityLights Mural Series", "Planning", "bg-green-500", "left-[30%] w-[23%]"],
                    ["Riverside Event Activation", "Production", "bg-blue-500", "left-[38%] w-[34%]"],
                    ["Brand Identity - Horizon", "Design", "bg-purple-500", "left-[52%] w-[23%]"],
                    ["Community Mural Program", "Installation", "bg-orange-500", "left-[58%] w-[40%]"],
                    ["Website Redesign", "Development", "bg-teal-500", "left-[68%] w-[28%]"],
                    ["Public Art Consultation", "Permitting", "bg-amber-400", "left-[70%] w-[27%]"]
                  ].map(([name, phase, color, pos]) => (
                    <div key={name} className="grid grid-cols-[210px_90px_1fr] items-center border-b border-slate-100 py-3 text-xs">
                      <strong>{name}</strong><span className="text-slate-500">{phase}</span>
                      <div className="relative h-5 rounded bg-slate-100">
                        <span className={`absolute top-1 h-3 rounded ${color} ${pos}`}></span>
                        <span className="absolute left-1/2 top-0 h-5 border-l border-red-500"></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <a href="/gantt" className="mt-3 block text-right text-sm font-medium text-blue-700">View full Gantt →</a>
            </Panel>

            <Panel title="My Tasks (Agile)">
              <div className="mb-3 flex gap-4 border-b text-xs font-medium">
                <span className="border-b-2 border-blue-600 pb-2">To Do (12)</span><span className="pb-2 text-slate-500">In Progress (7)</span><span className="pb-2 text-slate-500">Done (26)</span>
              </div>
              {[
                ["Finalize mural concept sketches", "CityLights Mural Series", "High"],
                ["Prepare client presentation", "Brand Identity - Horizon", "High"],
                ["Review permit requirements", "Community Mural Program", "Medium"],
                ["Update project budget", "Riverside Event Activation", "Medium"],
                ["Social media content plan", "Marketing", "Low"]
              ].map(([task, project, priority]) => (
                <div key={task} className="flex items-center gap-3 border-b border-slate-100 py-3 text-sm">
                  <Circle className="h-4 w-4 text-slate-400" />
                  <div className="flex-1"><p className="font-medium">{task}</p><p className="text-xs text-slate-500">{project}</p></div>
                  <span className={`rounded-full px-2 py-1 text-xs ${priority==="High" ? "bg-red-50 text-red-600" : priority==="Medium" ? "bg-orange-50 text-orange-600" : "bg-green-50 text-green-600"}`}>{priority}</span>
                </div>
              ))}
              <a href="/tasks" className="mt-3 block text-right text-sm font-medium text-blue-700">View all tasks →</a>
            </Panel>

            <Panel title="Upcoming Events">
              {[
                ["MAY", "16", "Client Presentation", "Horizon Brand Identity", "10:00 AM"],
                ["MAY", "18", "Community Paint Day", "Unity Mural Project", "9:00 AM"],
                ["MAY", "22", "Vendor Meeting", "Riverside Event Activation", "1:00 PM"],
                ["MAY", "24", "Installation Day", "CityLights Mural Series", "7:00 AM"]
              ].map(([mo, day, title, sub, time]) => (
                <div key={title} className="flex gap-3 border-b border-slate-100 py-3">
                  <div className="rounded-lg bg-slate-100 px-3 py-2 text-center"><p className="text-xs font-bold text-blue-700">{mo}</p><p className="text-lg font-bold">{day}</p></div>
                  <div><p className="text-sm font-semibold">{title}</p><p className="text-xs text-slate-500">{sub}</p><p className="text-xs">{time}</p></div>
                </div>
              ))}
              <a href="/calendar" className="mt-3 block text-right text-sm font-medium text-blue-700">View calendar →</a>
            </Panel>
          </section>

          <WorkbookPreview />
        </main>
      </div>
    </div>
  );
}

function Metric({label,value,note,tone}:{label:string;value:string;note:string;tone:"green"|"purple"|"orange"}) {
  const Icon = tone === "green" ? CheckCircle2 : tone === "orange" ? AlertTriangle : Circle;
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500"><Icon className={`h-3.5 w-3.5 ${tone==="green" ? "text-green-500" : tone==="orange" ? "text-orange-500" : "text-purple-500"}`}/>{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      <div className="mt-2 text-xs text-emerald-700">↗ {note}</div>
    </div>
  );
}

function Panel({title, children}:{title:string; children:ReactNode}) {
  return <div className="rounded-xl border border-slate-200 bg-white shadow-sm"><h2 className="border-b border-slate-100 px-4 py-3 text-sm font-bold uppercase">{title}</h2><div className="p-4">{children}</div></div>
}

function WorkbookPreview() {
  const headers = ["Project ID","Project Name","Client","Project Type","PM","Status","Phase","Start Date","End Date","Budget","Spent","% Complete","Priority","RAG","Next Milestone","Days Left","Notes"];
  return (
    <section className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <div><h2 className="font-bold">MANDALA PROJECT MASTER WORKBOOK</h2><p className="text-xs text-slate-500">Spreadsheet sync preview • uses demo data until Google Apps Script is connected</p></div>
        <a href="/workbooks" className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">Open Workbook</a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[1400px] border-collapse text-xs">
          <thead><tr>{headers.map(h => <th key={h} className="border border-slate-200 bg-green-100 px-2 py-2 text-left font-bold uppercase">{h}</th>)}</tr></thead>
          <tbody>{workbookRows.map(row => <tr key={row[0]}>{row.map((cell,i) => <td key={i} className="border border-slate-200 px-2 py-2">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
      <div className="flex gap-1 border-t bg-slate-50 px-4 py-2 text-xs">
        {["PROJECT MASTER","TASK TRACKER","GANTT","RESOURCE PLAN","BUDGET TRACKER","RISK LOG","EVENT PLANNER","PROCUREMENT","MURAL ESTIMATES","DASHBOARD"].map((tab,i) => <span key={tab} className={`rounded px-4 py-2 ${i===0 ? "bg-blue-100 text-blue-700" : "bg-white"}`}>{tab}</span>)}
      </div>
    </section>
  )
}

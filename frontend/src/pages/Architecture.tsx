import { Card } from "../components/ui/Card";
import { PageHero } from "../components/layout/PageHero";
import { Shield, Brain, Database, Layers, ArrowRight, Zap, Cpu, Server, Monitor } from "lucide-react";

export default function Architecture() {
  const steps = [
    {
      id: "source",
      title: "Outlook / Teams",
      desc: "User communication feeds, group conversations, and emails.",
      tech: "Microsoft 365",
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: "graph",
      title: "Graph API",
      desc: "Secure OAuth access to message bodies and metadata via MSAL.",
      tech: "Microsoft Graph",
      icon: <Cpu className="h-5 w-5" />
    },
    {
      id: "backend",
      title: "FlowMind Backend",
      desc: "Express server orchestrating message ingestion and clustering.",
      tech: "Node.js + TS",
      icon: <Server className="h-5 w-5" />
    },
    {
      id: "ai",
      title: "Azure OpenAI & Groq",
      desc: "Dynamic hybrid LLM pipeline supporting Azure OpenAI (GPT-4o) and Groq (Llama 3.3 70B) for sub-second structured JSON extraction.",
      tech: "Hybrid LLM Engine",
      icon: <Brain className="h-5 w-5" />
    },
    {
      id: "db",
      title: "MongoDB Store",
      desc: "Persistent storage of clusters, items, decisions, and history.",
      tech: "Mongoose DB",
      icon: <Database className="h-5 w-5" />
    },
    {
      id: "frontend",
      title: "React Dashboard",
      desc: "Premium, responsive drag-and-drop workspace UI.",
      tech: "Vite + React",
      icon: <Monitor className="h-5 w-5" />
    }
  ];

  const techBadges = [
    { category: "Frontend", items: ["React 18", "Vite", "Tailwind CSS", "@hello-pangea/dnd", "Lucide React", "@azure/msal-react"] },
    { category: "Backend", items: ["TypeScript 5", "Express", "MongoDB / Mongoose", "Axios", "Zod Validation"] },
    { category: "AI & Cloud", items: ["Groq Llama-3.3-70b", "Azure OpenAI SDK", "Microsoft Graph API", "App Service"] }
  ];

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Architecture"
        title="Microsoft Cloud Delivery Stack"
        description="Present the app as a production-ready Microsoft workload with Azure Static Web Apps, App Service, Microsoft Graph, and Azure OpenAI all mapped clearly."
        aside={
          <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-4.5 dark:border-zinc-800/80 dark:bg-zinc-900/60 backdrop-blur-md">
            <p className="text-[10px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-zinc-500">Delivery Stack</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950 dark:text-white font-outfit">6 Layers</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-zinc-450">Full end-to-end data flow visualization for the Microsoft hackathon judges.</p>
          </div>
        }
      />

      {/* Custom Microsoft Build AI 2026 Hackathon Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/60 p-6 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-xl shadow-soft">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              Microsoft Build AI 2026
            </span>
            <h2 className="mt-3 text-xl font-extrabold text-slate-900 dark:text-white font-outfit">Hackathon Project Submission</h2>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
              FlowMind combines the power of Microsoft 365 Graph events with local model execution and premium interface mechanics.
            </p>
          </div>
          <div className="shrink-0 font-mono text-xs bg-violet-500/10 border border-violet-550/20 px-4 py-2.5 rounded-xl text-violet-600 dark:text-violet-400 font-extrabold tracking-wide">
            Status: <span className="text-emerald-500 dark:text-emerald-400 font-extrabold">Production Ready</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Visual Graph Panel (Span 2 cols on large screen) */}
        <Card className="lg:col-span-2 overflow-hidden border border-slate-200/80 bg-white/60 dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-xl p-6 rounded-2xl shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white font-outfit">System Data Flow</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-450 mt-1">
                Realtime updates pass through authorization, aggregation, structured parsing, and storage.
              </p>
            </div>
            <div className="p-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-violet-500 dark:text-violet-400">
              <Layers className="h-5 w-5" />
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={step.id} className="relative">
                {/* Horizontal Flow Container */}
                <div className="hover-lift flex flex-col md:flex-row md:items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/60 p-4 shadow-soft dark:border-zinc-800/85 dark:bg-zinc-900/20 backdrop-blur-xl transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/0 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${
                    idx % 3 === 0 ? "from-violet-500/10 to-indigo-500/10 border border-violet-500/20 text-violet-500 dark:text-violet-400" :
                    idx % 3 === 1 ? "from-indigo-500/10 to-fuchsia-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400" :
                    "from-fuchsia-500/10 to-violet-500/10 border border-fuchsia-500/20 text-fuchsia-500 dark:text-fuchsia-400"
                  }`}>
                    {step.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-outfit">{step.title}</h4>
                      <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-lg border border-slate-200 bg-slate-50 dark:border-zinc-850 dark:bg-zinc-900/80 text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                        {step.tech}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-650 dark:text-zinc-450 leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </div>

                {/* Arrow Connector between blocks (Not on the last) */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center md:justify-start md:pl-8 my-2.5">
                    <div className="h-8 w-0.5 bg-gradient-to-b from-violet-550 to-indigo-500 shadow-[0_0_8px_rgba(139,92,246,0.5)] flex items-center justify-center relative">
                      <div className="absolute top-1/2 -translate-y-1/2 rounded-full bg-zinc-950 border border-violet-500/40 p-0.5 shadow-[0_0_8px_rgba(139,92,246,0.2)] animate-pulse">
                        <ArrowRight className="h-3 w-3 text-violet-400 rotate-90" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Info & Tech Badges Panel */}
        <div className="space-y-6">
          {/* Tech Stack Card */}
          <Card className="border border-slate-200/80 bg-white/70 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-xl p-6 rounded-2xl shadow-soft hover-lift">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 mb-4 font-outfit">
              <div className="p-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-500 dark:text-violet-400">
                <Cpu className="h-4 w-4" />
              </div>
              Technology Stack
            </h3>
            <div className="space-y-4">
              {techBadges.map((group) => (
                <div key={group.category} className="space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-550">
                    {group.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {group.items.map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center rounded-lg border border-slate-200/60 bg-slate-50/60 px-2.5 py-1 text-xs font-bold text-slate-650 dark:border-zinc-850 dark:bg-zinc-900/60 dark:text-zinc-350 hover:border-violet-500/30 transition duration-150"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hardening & Security info */}
          <Card className="border border-slate-200/80 bg-white/70 backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/20 backdrop-blur-xl p-6 rounded-2xl shadow-soft hover-lift space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 font-outfit">
              <div className="p-1.5 bg-violet-500/10 border border-violet-500/20 rounded-lg text-violet-500 dark:text-violet-400">
                <Shield className="h-4 w-4" />
              </div>
              Hardening Highlights
            </h3>
            
            <div className="space-y-3.5 text-xs leading-relaxed text-slate-600 dark:text-zinc-405">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
                <p className="font-medium text-slate-650 dark:text-zinc-400">
                  <strong className="text-slate-900 dark:text-zinc-200">Auth Validation:</strong> Microsoft identity tokens are validated cryptographically against Microsoft Entra ID public keys for every API request.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
                <p className="font-medium text-slate-650 dark:text-zinc-400">
                  <strong className="text-slate-900 dark:text-zinc-200">Self-Repairing Prompts:</strong> Double-try Zod schema checks prevent model formatting failures on Groq pipelines.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-500">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                </div>
                <p className="font-medium text-slate-650 dark:text-zinc-400">
                  <strong className="text-slate-900 dark:text-zinc-200">Microsoft Graph Sync:</strong> Real-time secure API pipeline queries Outlook mails and Teams channels directly.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}


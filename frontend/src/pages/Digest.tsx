import { useState } from "react";
import toast from "react-hot-toast";
import { Copy, Mail, Sparkles, Wand2, Calendar, ExternalLink, Loader2, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PageHero } from "../components/layout/PageHero";
import { flowmindApi } from "../services/api";

export default function Digest() {
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [to, setTo] = useState("stakeholders@company.com");
  const [subject, setSubject] = useState("FlowMind Project Update & Daily Digest");
  
  const [includeActions, setIncludeActions] = useState(true);
  const [includeDecisions, setIncludeDecisions] = useState(true);
  const [includeBlockers, setIncludeBlockers] = useState(true);

  const generate = async () => {
    setLoading(true);
    try {
      const result = await flowmindApi.digest();
      setDraft(result.draft);
      toast.success("Digest draft generated successfully!");
    } catch {
      toast.error("Failed to generate digest draft.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = `To: ${to}\nSubject: ${subject}\n\n${draft}`;
    void navigator.clipboard.writeText(textToCopy);
    toast.success("Copied to clipboard!");
  };

  const mailtoHref = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`;

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Digest"
        title="AI email generation"
        description="Produce a polished executive update with a preview panel, copy-ready content, and a clear before/after workflow for the demo."
        aside={
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-zinc-500">Preview mode</p>
            <p className="mt-1 text-3xl font-extrabold text-slate-950 dark:text-white font-outfit">Email</p>
            <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-zinc-450">Use this panel to show how the pipeline becomes a stakeholder-ready message.</p>
          </div>
        }
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Options Panel - 40% (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-zinc-850 dark:bg-zinc-950/40 p-6 space-y-6 shadow-soft">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-650 dark:text-purple-400">Configuration</p>
              <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white font-outfit">Digest parameters</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-zinc-450">
                Select the time horizon and items to pull from the captured Microsoft Graph activity feed.
              </p>
            </div>

            {/* Date Range Pickers */}
            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-violet-500 dark:text-purple-400" />
                  Time Horizon
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-550 uppercase font-bold">Start Date</span>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-550 uppercase font-bold">End Date</span>
                    <input
                      type="date"
                      className="mt-1 block w-full rounded-xl border border-slate-200 bg-white/50 px-3 py-2 text-sm text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Signals Checkboxes */}
              <div className="pt-4 border-t border-slate-150 dark:border-zinc-800/80">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-zinc-400 mb-3 flex items-center gap-1.5">
                  <Wand2 className="h-3.5 w-3.5 text-violet-500 dark:text-purple-400" />
                  Included Intelligence Signals
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-violet-650 focus:ring-violet-550 h-4 w-4 dark:border-zinc-800 dark:bg-zinc-950 dark:checked:bg-violet-600"
                      checked={includeActions}
                      onChange={(e) => setIncludeActions(e.target.checked)}
                    />
                    <span className="text-sm font-semibold text-slate-650 dark:text-zinc-350 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150">
                      Include identified Action Items
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-violet-655 focus:ring-violet-550 h-4 w-4 dark:border-zinc-800 dark:bg-zinc-950 dark:checked:bg-violet-600"
                      checked={includeDecisions}
                      onChange={(e) => setIncludeDecisions(e.target.checked)}
                    />
                    <span className="text-sm font-semibold text-slate-655 dark:text-zinc-355 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150">
                      Include agreed Decisions
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 text-violet-655 focus:ring-violet-550 h-4 w-4 dark:border-zinc-800 dark:bg-zinc-950 dark:checked:bg-violet-600"
                      checked={includeBlockers}
                      onChange={(e) => setIncludeBlockers(e.target.checked)}
                    />
                    <span className="text-sm font-semibold text-slate-655 dark:text-zinc-355 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-150">
                      Include unresolved Blockers
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-150 dark:border-zinc-800/80">
              <button
                onClick={generate}
                disabled={loading}
                className="w-full h-12 flex items-center justify-center gap-2 rounded-xl text-white font-extrabold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="h-5 w-5 animate-pulse text-purple-300" />
                )}
                {loading ? "Generating Draft..." : "Generate Digest Draft"}
              </button>
            </div>
          </div>
        </div>

        {/* Right Preview Panel - 60% (lg:col-span-7) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white/70 backdrop-blur-xl dark:border-zinc-850 dark:bg-zinc-950/40 p-0 overflow-hidden h-full flex flex-col min-h-[500px] shadow-soft">
            {/* Header bar */}
            <div className="border-b border-slate-200/80 bg-slate-50/50 px-6 py-4 flex items-center justify-between dark:border-zinc-850 dark:bg-zinc-950/40">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-violet-650 dark:text-purple-400">Live Draft Preview</p>
                <h3 className="mt-0.5 text-base font-bold text-slate-900 dark:text-white font-outfit">Stakeholder Email</h3>
              </div>
              <Mail className="h-5 w-5 text-slate-400 dark:text-zinc-500" />
            </div>

            {/* Content body */}
            <div className="flex-1 p-6 flex flex-col">
              {!draft ? (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-white border border-slate-200/80 shadow-soft dark:bg-zinc-900/60 dark:border-zinc-800/80 mb-6">
                    <Mail className="h-10 w-10 text-slate-350 dark:text-zinc-500" />
                    <div className="absolute -right-1 -top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-extrabold text-white shadow-sm animate-pulse">
                      ⚡
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white font-outfit">Your Digest is ready to compile</h4>
                  <p className="mt-2 text-sm text-slate-650 dark:text-zinc-450 max-w-sm leading-relaxed">
                    Select your reporting parameters on the left and click "Generate Digest Draft" to construct a professional team status update.
                  </p>
                  <button
                    onClick={generate}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-violet-600 dark:text-purple-400 hover:underline"
                  >
                    Quick generate demo draft <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                /* Email compose card */
                <div className="space-y-4 flex-1 flex flex-col">
                  {/* To: Field */}
                  <div className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/60 flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 dark:text-zinc-500 w-12 shrink-0">To:</span>
                    <input
                      type="email"
                      className="bg-transparent border-none p-0 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 flex-1"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>

                  {/* Subject: Field */}
                  <div className="rounded-xl border border-slate-200 bg-white/50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900/60 flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase text-slate-400 dark:text-zinc-500 w-12 shrink-0">Subject:</span>
                    <input
                      type="text"
                      className="bg-transparent border-none p-0 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-0 flex-1"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>

                  {/* Editable Body Draft */}
                  <div className="flex-1 flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase font-bold mb-1 ml-1">Email Body Draft</span>
                    <textarea
                      className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm leading-relaxed text-slate-700 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-slate-200 font-mono resize-none"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={12}
                    />
                  </div>

                  {/* Copy & Outlook Buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button variant="secondary" onClick={handleCopy} className="h-11 font-bold">
                      <Copy className="h-4 w-4 text-violet-500" />
                      Copy Draft
                    </Button>
                    <a
                      href={mailtoHref}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-650 hover:from-violet-550 hover:to-indigo-550 text-white text-sm font-extrabold shadow-md transition-all duration-250 active:scale-[0.98]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Outlook
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


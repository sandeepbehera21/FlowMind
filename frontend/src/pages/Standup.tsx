import { useState, useEffect, useRef } from "react";
import { usePipeline } from "../hooks/usePipeline";
import { PageHero } from "../components/layout/PageHero";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Volume2, VolumeX, Play, User, AlertCircle, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";


export default function Standup() {
  const { dashboard } = usePipeline();
  const [selectedOwner, setSelectedOwner] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize Speech Synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Fetch unique action owners from the dashboard actions list
  const actions = dashboard?.actions ?? [];
  const blockers = dashboard?.blockers ?? [];

  // Filter out non-human senders: system accounts, Microsoft notifications, no-reply addresses
  const BOT_PATTERNS = [
    /microsoft/i, /no.?reply/i, /noreply/i, /account.?team/i,
    /security/i, /notification/i, /alert/i, /support/i, /admin/i,
    /ambassador/i, /student/i, /unassigned/i, /@/
  ];
  const isHumanName = (name: string) =>
    name.trim().length > 0 &&
    name.trim().length < 40 &&
    !BOT_PATTERNS.some((p) => p.test(name));

  const owners = Array.from(
    new Set(actions.map((action) => action.owner).filter(Boolean))
  ).filter(isHumanName) as string[];

  // Fallback default owners if no valid human names found
  const defaultOwners = ["Sandeep", "Alex", "Jamie", "Morgan", "Taylor"];
  const displayOwners = owners.length > 0 ? owners : defaultOwners;

  // Set initial selected owner
  useEffect(() => {
    if (displayOwners.length > 0 && !selectedOwner) {
      setSelectedOwner(displayOwners[0]);
    }
  }, [displayOwners, selectedOwner]);

  // Stop speaking if selected owner changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
  }, [selectedOwner]);

  // Compute stats and brief dynamically for selected owner
  const ownerActions = actions.filter((a) => a.owner === selectedOwner);
  const completedActions = ownerActions.filter((a) => a.status === "complete");
  const activeActions = ownerActions.filter((a) => a.status !== "complete");

  // Determine owner role or context
  const getRole = (name: string) => {
    switch (name.toLowerCase()) {
      case "nisha": return "Lead Frontend Engineer";
      case "mira": return "Security Compliance Officer";
      case "sarah": return "Lead QA & Release Engineer";
      case "alex": return "Product Owner";
      case "john": return "Fullstack Architect";
      default: return "Fullstack Developer";
    }
  };

  // Determine blockers related to this owner or generic high severity ones
  const ownerBlockers = blockers.filter((b) => {
    const isOwnerMentioned = 
      (b.title || "").toLowerCase().includes(selectedOwner.toLowerCase()) || 
      (b.description || "").toLowerCase().includes(selectedOwner.toLowerCase());
    return b.status === "open" && (isOwnerMentioned || b.severity === "high");
  });

  // Synthesize standard brief list
  const yesterdayTasks = completedActions.length > 0 
    ? completedActions.map((a) => `Completed: ${a.title}`)
    : [`Reviewed inbox feeds and aligned on sprint goals for topic clusters.`];

  const todayTasks = activeActions.length > 0
    ? activeActions.map((a) => `${a.priority.toUpperCase()} Priority: ${a.title}`)
    : [`No pending action items. Ready to pair-program and assist team members.`];

  const blockerNotes = ownerBlockers.length > 0
    ? ownerBlockers.map((b) => `[${b.severity.toUpperCase()} RISK] ${b.title}`)
    : [`No direct blockers identified. Project board is clear.`];

  // Speech summary script
  const buildSpeechText = () => {
    const activeHighCount = activeActions.filter((a) => a.priority === "high").length;
    const blockerCount = ownerBlockers.length;

    let text = `Good morning ${selectedOwner}. Here is your 30-second standup sync brief for today. `;
    
    if (completedActions.length > 0) {
      text += `Yesterday, you successfully finished ${completedActions.length} action item. `;
    } else {
      text += `Yesterday, you reviewed inbound M365 email signals and synced on active project channels. `;
    }

    if (activeActions.length > 0) {
      text += `Today, you have ${activeActions.length} pending items, including ${activeHighCount} high priority task. `;
    } else {
      text += `Today your personal pipeline looks clear, with no pending action items. `;
    }

    if (blockerCount > 0) {
      text += `Please note that there are ${blockerCount} unresolved project risks that might impact your workflow. `;
    } else {
      text += `There are no critical blockers in your path today. `;
    }

    text += `Have a productive day of work!`;
    return text;
  };

  const handleSpeak = () => {
    if (!synthRef.current) {
      toast.error("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      return;
    }

    const textToSpeak = buildSpeechText();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = (e) => {
      // 'interrupted' fires when user manually stops speech — not a real error
      if (e.error === "interrupted" || e.error === "canceled") {
        setIsPlaying(false);
        return;
      }
      console.error("Speech Synthesis Error", e);
      setIsPlaying(false);
      toast.error("Speech playback error. Try again.");
    };

    utteranceRef.current = utterance;
    setIsPlaying(true);
    synthRef.current.speak(utterance);
  };

  return (
    <div className="space-y-6">
      <PageHero
        eyebrow="Sync Companion"
        title="AI Standup Hub"
        description="Select a team member to synthesize a personalized daily standup briefing, mapping past progress, active priorities, and roadblocks with interactive Text-To-Speech audio readout."
      />

      {/* Team Selector Row */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-zinc-500">Select Team Member</label>
        <div className="flex flex-wrap gap-3">
          {displayOwners.map((owner) => {
            const isSelected = selectedOwner === owner;
            const initials = owner.substring(0, 2).toUpperCase();
            return (
              <button
                key={owner}
                onClick={() => setSelectedOwner(owner)}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  isSelected
                    ? "border-violet-500/80 bg-violet-500/10 text-violet-600 dark:border-violet-500 dark:bg-violet-500/15 dark:text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)] ring-1 ring-violet-500/30"
                    : "border-slate-200/80 bg-white/40 hover:bg-white/70 text-slate-700 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:text-zinc-300 dark:hover:bg-zinc-800/60 backdrop-blur-md"
                }`}
              >
                <div className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold transition-all duration-300 ${
                  isSelected 
                    ? "bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20" 
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800/80 dark:text-zinc-400"
                }`}>
                  {initials}
                </div>
                <span>{owner}</span>
              </button>
            );
          })}
        </div>
      </div>

      {selectedOwner && (
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          
          {/* Voice Brief Playback Card */}
          <Card className="flex flex-col items-center justify-center p-6 text-center border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/20 backdrop-blur-xl rounded-2xl shadow-soft hover-lift">
            <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500/10 to-indigo-500/10 border border-violet-550/20 text-violet-600 dark:text-violet-400">
              <User size={36} />
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border border-violet-500 animate-ping opacity-60" />
              )}
            </div>
            
            <h3 className="text-xl font-bold text-slate-950 dark:text-white font-outfit">
              {selectedOwner}
            </h3>
            <p className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-550 uppercase tracking-wider">
              {getRole(selectedOwner)}
            </p>

            {/* Simulated Animated Waveform when playing */}
            <div className="my-6 flex h-8 items-center justify-center gap-1.5 px-4 w-full">
              {isPlaying ? (
                Array.from({ length: 9 }).map((_, i) => {
                  const animDelays = ["0.1s", "0.4s", "0.2s", "0.6s", "0.3s", "0.5s", "0.2s", "0.7s", "0.4s"];
                  const baseHeights = ["h-3", "h-6", "h-4", "h-7", "h-2", "h-5", "h-3", "h-6", "h-4"];
                  return (
                    <div
                      key={i}
                      style={{ animationDelay: animDelays[i] }}
                      className={`w-1 bg-gradient-to-t from-violet-600 via-fuchsia-500 to-indigo-500 rounded-full animate-waveform shadow-[0_0_8px_rgba(139,92,246,0.6)] ${baseHeights[i]}`}
                    />
                  );
                })
              ) : (
                <div className="text-xs font-semibold text-slate-400 dark:text-zinc-500 tracking-wide">Audio briefing paused.</div>
              )}
            </div>

            <Button
              onClick={handleSpeak}
              className={`w-full gap-2 transition-all duration-300 border-0 ${
                isPlaying 
                  ? "border border-zinc-200 dark:border-zinc-800 bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-zinc-100 hover:scale-[1.02] active:scale-[0.98]" 
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-550 hover:to-indigo-550 text-white shadow-lg shadow-violet-550/20 dark:shadow-violet-950/40 hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isPlaying ? (
                <>
                  <VolumeX size={18} />
                  <span>Stop Speech</span>
                </>
              ) : (
                <>
                  <Volume2 size={18} />
                  <span>Play Standup Brief</span>
                </>
              )}
            </Button>
          </Card>

          {/* Structured Standup Text Panels */}
          <div className="space-y-4">
            
            {/* Yesterday Card */}
            <Card className="p-5 border border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/20 backdrop-blur-xl rounded-2xl shadow-soft hover-lift">
              <div className="mb-4 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-450 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                <CheckCircle size={16} />
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider">Yesterday's Accomplishments</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 pl-1">
                {yesterdayTasks.map((t, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-emerald-500 shrink-0 mt-1 font-bold text-xs select-none">✓</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Today Card */}
            <Card className="p-5 border border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/20 backdrop-blur-xl rounded-2xl shadow-soft hover-lift">
              <div className="mb-4 inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1.5 rounded-xl border border-violet-500/20">
                <Play size={14} className="fill-current" />
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider">Today's Focus</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 pl-1">
                {todayTasks.map((t, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-violet-500 dark:text-violet-400 shrink-0 mt-1 font-bold text-xs select-none">→</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Blockers Card */}
            <Card className="p-5 border border-slate-200/80 dark:border-zinc-800/80 bg-white/60 dark:bg-zinc-900/20 backdrop-blur-xl rounded-2xl shadow-soft hover-lift">
              <div className="mb-4 inline-flex items-center gap-2 text-rose-600 dark:text-rose-450 bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-500/20">
                <AlertCircle size={16} />
                <h4 className="text-[10px] font-extrabold uppercase tracking-wider">Roadblocks & Risks</h4>
              </div>
              <ul className="space-y-3 text-sm text-slate-700 dark:text-zinc-300 pl-1">
                {blockerNotes.map((t, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="text-rose-500 shrink-0 mt-1 font-bold text-xs select-none">!</span>
                    <span className="leading-relaxed">{t}</span>
                  </li>
                ))}
              </ul>
            </Card>

          </div>
        </div>
      )}
    </div>
  );
}

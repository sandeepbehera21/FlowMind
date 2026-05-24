import { useState } from "react";
import { ShieldCheck, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export function LoginPage({ 
  onLogin, 
  onDemo, 
  isConfigured 
}: { 
  onLogin: () => void; 
  onDemo: () => Promise<void>; 
  isConfigured: boolean 
}) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await onLogin();
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    const id = toast.loading("Initializing Demo Workspace...");
    try {
      await onDemo();
      toast.success("FlowMind Demo sandbox active!", { id });
    } catch (err) {
      console.error("Demo login failed", err);
      toast.error("Failed to spin up demo workspace.", { id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative grid min-h-screen place-items-center px-6 overflow-hidden bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 transition-colors duration-300">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern-light dark:bg-grid-pattern opacity-70" />
      
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-violet-600/10 dark:bg-purple-650/15 blur-[120px] animate-pulse-glow-1" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/10 dark:bg-indigo-650/15 blur-[140px] animate-pulse-glow-2" />
 
      {/* Card container */}
      <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/60 hover:border-violet-500/20 dark:hover:border-violet-500/10 transition-all duration-500">
        <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left panel - Main auth */}
          <div className="p-8 md:p-14 flex flex-col justify-between">
            <div>
              {/* App Brand Header */}
              <div className="flex items-center gap-3.5 mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]">
                  <ShieldCheck size={24} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-sm font-bold uppercase tracking-[0.25em] bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">FlowMind</span>
                  <div className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium tracking-wide">Work Intelligence Platform</div>
                </div>
              </div>

              {/* Title & Desc */}
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15] font-outfit">
                Turn chat signals into <span className="bg-gradient-to-r from-violet-500 to-indigo-500 bg-clip-text text-transparent dark:from-purple-400 dark:to-indigo-400">structured execution</span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-slate-650 dark:text-zinc-400">
                Connect your workspace via secure Microsoft 365 MSAL authentication. FlowMind parses Outlook emails and Teams messages into actions, decisions, and blocker logs.
              </p>

              {!isConfigured && (
                <div className="mt-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-850 dark:text-amber-300">
                  <span className="font-semibold block mb-0.5">⚠️ Microsoft 365 OAuth Config Required</span>
                  Add your <code className="font-mono bg-amber-500/10 px-1 rounded font-bold">VITE_MSAL_CLIENT_ID</code> to your local environment file to activate live Entra ID sign-in.
                </div>
              )}
            </div>

            {/* Login buttons */}
            <div className="mt-10 flex flex-col gap-3">
              <button 
                onClick={handleLogin}
                disabled={loading || !isConfigured}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-4 px-6 text-sm font-bold rounded-xl shadow-[0_8px_24px_-8px_rgba(99,102,241,0.5)] hover:shadow-[0_12px_28px_-6px_rgba(99,102,241,0.6)] disabled:opacity-50 transition-all duration-300 transform active:scale-[0.98]"
              >
                {loading && isConfigured ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Signing you in...
                  </span>
                ) : (
                  <>
                    <span>Sign in with Microsoft 365</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <button 
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 border border-slate-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 text-slate-800 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800/80 py-4 px-6 text-sm font-bold rounded-xl transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50"
              >
                {loading && !isConfigured ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800 dark:text-zinc-200" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading sandbox...
                  </span>
                ) : (
                  <>
                    <span>Continue in Demo Mode</span>
                    <ArrowRight size={16} className="text-violet-500" />
                  </>
                )}
              </button>
              
              <div className="mt-3 text-center text-xs text-slate-500 dark:text-zinc-500">
                Secure authentication handled natively by Microsoft Identity Platform.
              </div>
            </div>
          </div>

          {/* Right panel - Hackathon Highlights */}
          <div className="border-t border-slate-200/80 bg-slate-50/50 p-8 md:p-14 md:border-l md:border-t-0 dark:border-zinc-800/80 dark:bg-zinc-950/40 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Demo System Active
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-zinc-500">Hackathon Highlights</p>
              
              <div className="mt-6 space-y-6">
                <div className="group">
                  <p className="font-semibold text-slate-900 dark:text-zinc-200 text-sm group-hover:text-violet-500 dark:group-hover:text-purple-400 transition-colors">Microsoft Graph Integration</p>
                  <p className="mt-1.5 text-xs text-slate-550 dark:text-zinc-400 leading-relaxed">
                    Uses Microsoft MSAL SDK to pull mail summaries and chat streams using official Microsoft 365 identity scopes.
                  </p>
                </div>
                
                <div className="group">
                  <p className="font-semibold text-slate-900 dark:text-zinc-200 text-sm group-hover:text-violet-500 dark:group-hover:text-purple-400 transition-colors">OpenAI Orchestration Pipeline</p>
                  <p className="mt-1.5 text-xs text-slate-555 dark:text-zinc-400 leading-relaxed">
                    Channels scattered unstructured inputs into precise JSON outputs for the Kanban board using a structured 5-stage pipeline.
                  </p>
                </div>

                <div className="group">
                  <p className="font-semibold text-slate-900 dark:text-zinc-200 text-sm group-hover:text-violet-500 dark:group-hover:text-purple-400 transition-colors">Zero-friction Demo Sandbox</p>
                  <p className="mt-1.5 text-xs text-slate-550 dark:text-zinc-400 leading-relaxed">
                    Judges can launch the bypass sandbox from the home screen to test all database writes and pipeline features.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-6 border-t border-slate-200/60 dark:border-zinc-800/80 text-xs text-slate-500 dark:text-zinc-500 flex items-center justify-between">
              <span>Microsoft Build AI 2026</span>
              <span>v1.2.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

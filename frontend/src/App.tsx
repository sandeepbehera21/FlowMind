import React, { Suspense, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { PageWrapper } from "./components/layout/PageWrapper";
import { Sidebar } from "./components/layout/Sidebar";
import { Toast } from "./components/ui/Toast";
import { PageSkeleton } from "./components/ui/PageSkeleton";
import { AuthGuard } from "./components/auth/AuthGuard";
import { useAuth } from "./hooks/useAuth";
import { usePipeline } from "./hooks/usePipeline";
import { useAppStore } from "./store/useAppStore";
import { LoginPage } from "./components/auth/LoginPage";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const ActionItems = React.lazy(() => import("./pages/ActionItems"));
const Decisions = React.lazy(() => import("./pages/Decisions"));
const Blockers = React.lazy(() => import("./pages/Blockers"));
const Digest = React.lazy(() => import("./pages/Digest"));
const Standup = React.lazy(() => import("./pages/Standup"));
const Architecture = React.lazy(() => import("./pages/Architecture"));

function LoginPageWrapper() {
  const auth = useAuth();
  if (auth.isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <LoginPage onLogin={auth.login} isConfigured={auth.isConfigured} />;
}

function Shell() {
  const auth = useAuth();
  const { processNow } = usePipeline({ autoRefresh: false });
  return (
    <div className="flex min-h-screen text-slate-950 dark:text-white">
      <div className="fixed inset-0 -z-20 bg-[radial-gradient(circle_at_top_left,rgba(0,120,212,0.16),transparent_28%),radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_26%),linear-gradient(180deg,#f8fbff_0%,#eef4fb_100%)] dark:bg-[#1B1A19]" />
      <Sidebar />
      <div className="min-w-0 flex-1">
        <Header onProcess={processNow} user={auth.user} onLogout={auth.logout} />
        <PageWrapper>
          <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/actions" element={<ActionItems />} />
              <Route path="/decisions" element={<Decisions />} />
              <Route path="/blockers" element={<Blockers />} />
              <Route path="/digest" element={<Digest />} />
              <Route path="/standup" element={<Standup />} />
              <Route path="/architecture" element={<Architecture />} />
            </Routes>
          </Suspense>
        </PageWrapper>
      </div>
    </div>
  );
}

export function App() {
  const darkMode = useAppStore((state) => state.darkMode);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <Suspense fallback={<PageSkeleton />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPageWrapper />} />
          <Route
            path="/*"
            element={
              <AuthGuard>
                <Shell />
              </AuthGuard>
            }
          />
        </Routes>
      </Suspense>
      <Toast />
    </>
  );
}

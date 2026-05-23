import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { Skeleton } from "../ui/Skeleton";
import { useAuth } from "../../hooks/useAuth";

export function AuthGuard({ children }: { children: ReactNode }) {
  const auth = useAuth();
  if (auth.loading) return <div className="p-8"><Skeleton className="h-96" /></div>;
  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

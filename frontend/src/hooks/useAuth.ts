import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import toast from "react-hot-toast";
import { attachAuth, flowmindApi } from "../services/api";
import { isMsalConfigured, loginRequest } from "../services/msalConfig";
import type { User } from "../types";

export function useAuth() {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const account = accounts[0];

  useEffect(() => {
    if (sessionStorage.getItem("flowmind_demo_mode") === "true") {
      setUser({
        id: "demo-user-id",
        microsoftId: "demo-user-id",
        email: "demo@flowmind.ai",
        name: "Demo Account"
      });
      return;
    }
    if (!account) {
      setUser(null);
      return;
    }
    setLoading(true);
    attachAuth(instance, account)
      .then(() => flowmindApi.me())
      .then(setUser)
      .catch(() => toast.error("Unable to validate your Microsoft session. Please try logging in again."))
      .finally(() => setLoading(false));
  }, [account, instance]);

  const isDemo = sessionStorage.getItem("flowmind_demo_mode") === "true";

  return {
    user,
    loading,
    isConfigured: isMsalConfigured,
    isAuthenticated: Boolean(account) || isDemo,
    login: () => {
      if (!isMsalConfigured) {
        toast.error("Microsoft 365 Integration is not configured. Please add VITE_MSAL_CLIENT_ID to your env variables.");
        return Promise.reject(new Error("MSAL is not configured"));
      }
      return instance.loginPopup(loginRequest);
    },
    logout: () => {
      setUser(null);
      if (sessionStorage.getItem("flowmind_demo_mode") === "true") {
        sessionStorage.removeItem("flowmind_demo_mode");
        window.location.href = "/";
        return Promise.resolve();
      }
      const p = account ? instance.logoutPopup() : Promise.resolve();
      return p.then(() => {
        window.location.href = "/";
      });
    }
  };
}

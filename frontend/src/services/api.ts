import axios from "axios";
import type { AccountInfo, IPublicClientApplication } from "@azure/msal-browser";
import { graphScopes, loginRequest } from "./msalConfig";
import type { ActionItem, ApiResponse, Blocker, DashboardData, User } from "../types";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api"
});

let authInterceptorAttached = false;

api.interceptors.request.use((config) => {
  if (sessionStorage.getItem("flowmind_demo_mode") === "true") {
    config.headers.Authorization = "Bearer demo-token";
    config.headers["x-graph-token"] = "demo-graph-token";
  }
  return config;
});

export async function attachAuth(instance: IPublicClientApplication, account: AccountInfo) {
  if (authInterceptorAttached) return;
  authInterceptorAttached = true;
  api.interceptors.request.use(async (config) => {
    if (sessionStorage.getItem("flowmind_demo_mode") === "true") {
      config.headers.Authorization = "Bearer demo-token";
      config.headers["x-graph-token"] = "demo-graph-token";
      return config;
    }
    const idToken = await instance.acquireTokenSilent({ ...loginRequest, account, scopes: ["openid", "profile", "email"] });
    const graphToken = await instance.acquireTokenSilent({ account, scopes: graphScopes });
    config.headers.Authorization = `Bearer ${idToken.idToken}`;
    config.headers["x-graph-token"] = graphToken.accessToken;
    return config;
  });
}

const unwrap = <T>(response: { data: ApiResponse<T> }) => response.data.data;

export const flowmindApi = {
  me: () => api.get<ApiResponse<User>>("/auth/me").then(unwrap),
  dashboard: () => api.get<ApiResponse<DashboardData>>("/pipeline/dashboard").then(unwrap),
  ingest: () => api.post<ApiResponse<{ cached: number; email: number; teams: number }>>("/messages/ingest").then(unwrap),
  runPipeline: () => api.post<ApiResponse<DashboardData & { run: { id: string; messageCount: number } }>>("/pipeline/run").then(unwrap),
  updateAction: (id: string, patch: Partial<Pick<ActionItem, "status" | "owner">>) =>
    api.patch<ApiResponse<ActionItem>>(`/actions/${id}`, patch).then(unwrap),
  updateBlocker: (id: string, patch: Partial<Pick<Blocker, "status">>) =>
    api.patch<ApiResponse<Blocker>>(`/blockers/${id}`, patch).then(unwrap),
  digest: () => api.post<ApiResponse<{ draft: string }>>("/pipeline/digest").then(unwrap),
  demo: () => api.post<ApiResponse<{ status: string }>>("/pipeline/demo").then(unwrap)
};

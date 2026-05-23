import type { Configuration, PopupRequest } from "@azure/msal-browser";

const tenantId = import.meta.env.VITE_MSAL_TENANT_ID ?? "common";
const clientId = import.meta.env.VITE_MSAL_CLIENT_ID ?? "";

export const isMsalConfigured = clientId.trim().length > 0;

export const msalConfig: Configuration = {
  auth: {
    clientId,
    authority: `https://login.microsoftonline.com/${tenantId}`,
    redirectUri: import.meta.env.VITE_MSAL_REDIRECT_URI ?? window.location.origin
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const graphScopes = (import.meta.env.VITE_GRAPH_SCOPES ?? "User.Read Mail.Read Chat.Read").split(" ");

export const loginRequest: PopupRequest = {
  scopes: ["openid", "profile", "email", ...graphScopes]
};

import type { AuthenticatedUser } from "./domain.js";

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      graphAccessToken?: string;
    }
  }
}

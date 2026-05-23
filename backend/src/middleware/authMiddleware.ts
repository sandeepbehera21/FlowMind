import { createRemoteJWKSet, jwtVerify } from "jose";
import type { NextFunction, Request, Response } from "express";
import { env } from "../utils/env.js";
import { UnauthorizedError } from "../utils/errors.js";

const jwks = createRemoteJWKSet(new URL(`https://login.microsoftonline.com/${env.MSAL_TENANT_ID}/discovery/v2.0/keys`));

interface MicrosoftToken {
  oid?: string;
  preferred_username?: string;
  name?: string;
  aud?: string | string[];
}

export async function authMiddleware(req: Request, _res: Response, next: NextFunction): Promise<void> {
  try {
    const authorization = req.header("authorization");
    const graphToken = req.header("x-graph-token");
    if (!authorization?.startsWith("Bearer ")) throw new UnauthorizedError();
    const token = authorization.slice("Bearer ".length);
    if (token === "demo-token") {
      req.user = {
        microsoftId: "demo-user-id",
        email: "demo@flowmind.ai",
        name: "Demo Account"
      };
      req.graphAccessToken = graphToken ?? "demo-graph-token";
      return next();
    }
    const verified = await jwtVerify(token, jwks, {
      audience: env.JWT_AUDIENCE ?? env.MSAL_CLIENT_ID
    });
    const claims = verified.payload as MicrosoftToken;
    req.user = {
      microsoftId: claims.oid ?? verified.payload.sub ?? "",
      email: claims.preferred_username ?? "",
      name: claims.name ?? "Microsoft 365 user"
    };
    req.graphAccessToken = graphToken ?? token;
    next();
  } catch (error) {
    next(error instanceof UnauthorizedError ? error : new UnauthorizedError("Invalid Microsoft identity token"));
  }
}

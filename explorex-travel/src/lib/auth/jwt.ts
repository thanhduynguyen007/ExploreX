import jwt, { type SignOptions } from "jsonwebtoken";

import { env } from "@/lib/env";
import type { AuthUser, JwtPayload } from "@/types/auth";

export const signAuthToken = (user: AuthUser) =>
  jwt.sign(user, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions["expiresIn"],
  });

export const verifyAuthToken = (token: string) =>
  jwt.verify(token, env.jwtSecret) as JwtPayload;

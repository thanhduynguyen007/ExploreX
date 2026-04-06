import mysql from "mysql2/promise";

import { env } from "@/lib/env";

declare global {
  var __explorexMysqlPool: mysql.Pool | undefined;
}

export const getDbPool = () => {
  if (!globalThis.__explorexMysqlPool) {
    globalThis.__explorexMysqlPool = mysql.createPool({
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.name,
      connectionLimit: 1,
      maxIdle: 1,
      idleTimeout: 10000,
      waitForConnections: true,
      queueLimit: 0,
      namedPlaceholders: true,
    });
  }

  return globalThis.__explorexMysqlPool;
};

export const isDatabaseUnavailableError = (error: unknown) => {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return false;
  }

  const code = String(error.code);
  return code === "ECONNREFUSED" || code === "ETIMEDOUT" || code === "PROTOCOL_CONNECTION_LOST";
};

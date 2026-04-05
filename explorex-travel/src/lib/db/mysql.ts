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

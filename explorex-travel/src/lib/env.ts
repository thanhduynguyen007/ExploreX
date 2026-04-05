export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "ExploreX Travel",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  authUseMock: process.env.AUTH_USE_MOCK !== "false",
  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    name: process.env.DB_NAME ?? "crebas5",
  },
};

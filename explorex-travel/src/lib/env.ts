export const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? "ExploreX Travel",
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET ?? "dev-jwt-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  authUseMock: process.env.AUTH_USE_MOCK !== "false",
  vnpay: {
    tmnCode: process.env.VNPAY_TMN_CODE ?? "",
    hashSecret: process.env.VNPAY_HASH_SECRET ?? "",
    paymentUrl: process.env.VNPAY_PAYMENT_URL ?? "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    returnPath: process.env.VNPAY_RETURN_PATH ?? "/api/payments/vnpay/return",
    orderType: process.env.VNPAY_ORDER_TYPE ?? "other",
    locale: process.env.VNPAY_LOCALE ?? "vn",
  },
  db: {
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    name: process.env.DB_NAME ?? "crebas5",
  },
};

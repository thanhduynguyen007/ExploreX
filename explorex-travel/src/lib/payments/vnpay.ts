import crypto from "node:crypto";

import { env } from "@/lib/env";

type VnpayPrimitive = string | number;
type VnpayParams = Record<string, VnpayPrimitive | undefined>;

export const VNPAY_SUCCESS_CODE = "00";
const TXN_REF_SEPARATOR = "__";

const sortVnpayParams = (params: VnpayParams) => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => [key, String(value)] as const);
};

export const buildVnpayHashData = (params: VnpayParams) => {
  return sortVnpayParams(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
};

export const createVnpaySecureHash = (params: VnpayParams, hashSecret: string) => {
  return crypto.createHmac("sha512", hashSecret).update(buildVnpayHashData(params), "utf8").digest("hex");
};

export const createVnpayTxnRef = (bookingId: string, timestamp = Date.now()) => {
  return `${bookingId}${TXN_REF_SEPARATOR}${timestamp}`;
};

export const extractBookingIdFromTxnRef = (txnRef: string) => {
  const separatorIndex = txnRef.indexOf(TXN_REF_SEPARATOR);
  return separatorIndex === -1 ? txnRef : txnRef.slice(0, separatorIndex);
};

export const extractVnpayResponseParams = (searchParams: URLSearchParams) => {
  const params: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    if (key.startsWith("vnp_")) {
      params[key] = value;
    }
  }

  return params;
};

export const verifyVnpayResponse = (params: Record<string, string>, hashSecret: string) => {
  const { vnp_SecureHash: secureHash, vnp_SecureHashType: _hashType, ...rest } = params;

  if (!secureHash) {
    return false;
  }

  const expectedHash = createVnpaySecureHash(rest, hashSecret);
  return expectedHash.toLowerCase() === secureHash.toLowerCase();
};

export const isVnpayPaymentSuccess = (params: Record<string, string>) => {
  return params.vnp_ResponseCode === VNPAY_SUCCESS_CODE && params.vnp_TransactionStatus === VNPAY_SUCCESS_CODE;
};

const pad = (value: number) => String(value).padStart(2, "0");

export const formatVnpayDate = (date: Date) => {
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
};

export const getVnpayReturnUrl = () => {
  return new URL(env.vnpay.returnPath, env.appUrl).toString();
};

export const isVnpayConfigured = () => {
  return Boolean(env.vnpay.tmnCode && env.vnpay.hashSecret);
};

export const buildInternalVnpayDemoUrl = ({
  bookingId,
}: {
  bookingId: string;
}) => {
  const url = new URL("/payments/vnpay/demo", env.appUrl);
  url.searchParams.set("bookingId", bookingId);
  return url.toString();
};

export const buildVnpayPaymentUrl = ({
  amount,
  ipAddress,
  txnRef,
  orderInfo,
}: {
  amount: number;
  ipAddress: string;
  txnRef: string;
  orderInfo: string;
}) => {
  if (!isVnpayConfigured()) {
    throw new Error("VNPAY sandbox chưa được cấu hình.");
  }

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000);
  const requestParams: Record<string, string | number> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: env.vnpay.tmnCode,
    vnp_Amount: amount * 100,
    vnp_CreateDate: formatVnpayDate(createdAt),
    vnp_CurrCode: "VND",
    vnp_IpAddr: ipAddress,
    vnp_Locale: env.vnpay.locale,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: env.vnpay.orderType,
    vnp_ReturnUrl: getVnpayReturnUrl(),
    vnp_TxnRef: txnRef,
    vnp_ExpireDate: formatVnpayDate(expiresAt),
  };

  const query = new URLSearchParams();
  for (const [key, value] of sortVnpayParams(requestParams)) {
    query.set(key, value);
  }

  query.set("vnp_SecureHash", createVnpaySecureHash(requestParams, env.vnpay.hashSecret));

  return `${env.vnpay.paymentUrl}?${query.toString()}`;
};

export const getVnpayResponseMessage = (responseCode?: string) => {
  switch (responseCode) {
    case "00":
      return "Thanh toán thành công.";
    case "07":
      return "Giao dịch thành công nhưng đang bị nghi ngờ, cần kiểm tra thêm.";
    case "09":
      return "Tài khoản chưa đăng ký Internet Banking.";
    case "10":
      return "Thông tin thẻ hoặc tài khoản xác thực chưa đúng.";
    case "11":
      return "Giao dịch đã hết hạn chờ thanh toán.";
    case "12":
      return "Thẻ hoặc tài khoản đã bị khóa.";
    case "13":
      return "Mật khẩu OTP chưa đúng.";
    case "24":
      return "Bạn đã hủy giao dịch thanh toán.";
    case "51":
      return "Tài khoản không đủ số dư để thanh toán.";
    case "65":
      return "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.";
    case "75":
      return "Ngân hàng thanh toán đang bảo trì.";
    case "79":
      return "Bạn nhập sai mật khẩu thanh toán quá số lần quy định.";
    default:
      return "Thanh toán chưa hoàn tất hoặc không thành công.";
  }
};

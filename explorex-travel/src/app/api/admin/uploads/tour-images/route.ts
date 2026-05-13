import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";

import { ApiRequestError, getRequiredApiUser, requireApiRole, toApiErrorResponse } from "@/lib/auth/guards";

export const runtime = "nodejs";

const uploadDirectory = path.join(process.cwd(), "public", "uploads", "tours");
const publicUploadPath = "/uploads/tours";
const maxFileSize = 5 * 1024 * 1024;
const allowedMimeTypes = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const normalizeBaseName = (fileName: string) => {
  const parsed = path.parse(fileName);
  const normalized = parsed.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

  return normalized || "tour";
};

export async function POST(request: Request) {
  try {
    const user = await getRequiredApiUser();
    requireApiRole(user, ["ADMIN", "PROVIDER"]);

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new ApiRequestError("Vui lòng chọn một file ảnh.", 400);
    }

    const extension = allowedMimeTypes.get(file.type);
    if (!extension) {
      throw new ApiRequestError("Chỉ hỗ trợ ảnh JPG, PNG, WEBP hoặc GIF.", 400);
    }

    if (file.size <= 0) {
      throw new ApiRequestError("File ảnh đang trống.", 400);
    }

    if (file.size > maxFileSize) {
      throw new ApiRequestError("Ảnh không được vượt quá 5MB.", 400);
    }

    await mkdir(uploadDirectory, { recursive: true });

    const uniquePart = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const fileName = `${normalizeBaseName(file.name)}-${uniquePart}.${extension}`;
    const destination = path.join(uploadDirectory, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());

    await writeFile(destination, buffer, { flag: "wx" });

    return NextResponse.json({
      path: `${publicUploadPath}/${fileName}`,
    });
  } catch (error) {
    return toApiErrorResponse(error);
  }
}

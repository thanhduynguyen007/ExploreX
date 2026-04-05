import * as yup from "yup";

export const createReviewSchema = yup
  .object({
    maDanhGia: yup.string().trim().required("Mã đánh giá là bắt buộc").max(254, "Mã đánh giá quá dài"),
    maDatTour: yup.string().trim().required("Mã đặt tour là bắt buộc").max(254, "Mã đặt tour quá dài"),
    soSao: yup
      .number()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue === null || originalValue === undefined) {
          return Number.NaN;
        }

        return value;
      })
      .typeError("Số sao phải là số")
      .integer("Số sao phải là số nguyên")
      .min(1, "Số sao phải từ 1 đến 5")
      .max(5, "Số sao phải từ 1 đến 5")
      .required("Số sao là bắt buộc"),
    binhLuan: yup.string().trim().required("Bình luận là bắt buộc").max(254, "Bình luận quá dài"),
  })
  .required();

export type CreateReviewInput = yup.InferType<typeof createReviewSchema>;

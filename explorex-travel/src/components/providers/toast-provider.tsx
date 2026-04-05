"use client";

import { Toaster } from "sonner";

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast: "rounded-2xl",
          title: "text-sm font-semibold",
          description: "text-sm",
        },
      }}
    />
  );
};

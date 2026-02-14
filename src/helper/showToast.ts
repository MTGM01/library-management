import { useToast } from "vue-toastification";

type ToastTypes = "success" | "warning" | "error" | "info";

export function showToast(type: ToastTypes, message: string) {
  const toast = useToast();
  const mappedToastType: Record<ToastTypes, any> = {
    success: () => toast.success(message),
    error: () => toast.error(message),
    warning: () => toast.warning(message),
    info: () => toast.info(message),
  };
  mappedToastType[type]();
}

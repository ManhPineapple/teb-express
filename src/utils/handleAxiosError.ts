import { isAxiosError } from "axios";
import { toast } from "react-toastify";

export function handleAxiosError(err: unknown, customErrorMessage?: string) {
  const defaultMessage = customErrorMessage || "Có lỗi xảy ra!";

  if (isAxiosError(err) && err.response) {
    const data = err.response.data;

    if (typeof data === "object" && data?.error) {
      toast.error(data.error);
      return;
    }

    if (typeof data === "string") {
      toast.error(data);
      return;
    }
  }

  console.error("Unhandled error:", err);
  toast.error(defaultMessage);
  return err
}

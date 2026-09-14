export const SERVER_ERROR_MESSAGE =
  "خطای سرور. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.";

/** fetch itself failed (connection refused, DNS, CORS, timeout, ...). */
export function isNetworkError(error: any): boolean {
  return error instanceof TypeError && error.message.includes("fetch");
}

/** HTTP status code is in the 5xx (server error) range. */
export function isServerError(error: any): boolean {
  return (
    typeof error?.status === "number" &&
    error.status >= 500 &&
    error.status < 600
  );
}

/**
 * Proper message for a failed fetch: when the browser is online the problem
 * is on the server side (e.g. server is down), not the user's internet.
 */
export function getNetworkErrorMessage(): string {
  if (typeof navigator !== "undefined" && navigator.onLine) {
    return "ارتباط با سرور برقرار نشد. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.";
  }
  return "اتصال به اینترنت برقرار نیست";
}

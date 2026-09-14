export function isSessionRevokedError(error: any): boolean {
  if (!error) return false;
  if (error.message === "USER_BLOCKED") return true;
  return error.status === 401 || error.status === 403;
}

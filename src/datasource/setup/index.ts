const baseApi = "http://localhost:4000/lib";

type BlockedHandler = () => void;

let onBlockedCallback: BlockedHandler | null = null;

export function setBlockedHandler(callback: BlockedHandler) {
  onBlockedCallback = callback;
}

export const setForbiddenHandler = setBlockedHandler;

let onUnauthenticatedCallback: BlockedHandler | null = null;

export function setUnauthenticatedHandler(callback: BlockedHandler) {
  onUnauthenticatedCallback = callback;
}

const AUTH_KEY = "isAuthenticated";
const PROFILE_KEY = "user-profile";

function isAuthFreePath(path: string) {
  return (
    path.includes("/users/login") ||
    path.includes("/users/register") ||
    path.includes("/users/status")
  );
}

function readStoredStatus(): string | null {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return null;
    const profile = JSON.parse(raw);
    return profile?.status ?? null;
  } catch {
    return null;
  }
}

function readStoredSession(): { isAuthenticated: boolean; hasProfile: boolean } {
  try {
    const authRaw = localStorage.getItem(AUTH_KEY);
    const isAuthenticated = authRaw ? JSON.parse(authRaw) === true : false;
    const profileRaw = localStorage.getItem(PROFILE_KEY);
    const profile = profileRaw ? JSON.parse(profileRaw) : null;
    return { isAuthenticated, hasProfile: !!(profile && profile._id) };
  } catch {
    return { isAuthenticated: false, hasProfile: false };
  }
}

function notifyBlocked() {
  if (onBlockedCallback) {
    try {
      onBlockedCallback();
    } catch (error) {
      console.error(error);
    }
  }
}

function blockedError(): any {
  const error = new Error("USER_BLOCKED") as any;
  error.status = 403;
  return error;
}

function notifyUnauthenticated() {
  if (onUnauthenticatedCallback) {
    try {
      onUnauthenticatedCallback();
    } catch (error) {
      console.error(error);
    }
  }
}

function unauthenticatedError(): any {
  const error = new Error("UNAUTHENTICATED") as any;
  error.status = 401;
  return error;
}

/**
 * Request middleware (authentication + status):
 * 1. Stops any protected API call when there is no valid session
 *    (missing isAuthenticated flag or user-profile) and redirects to login.
 * 2. Instantly stops any API call when the locally stored session is
 *    already BLOCKed (e.g. admin blocked the user while they were
 *    exploring the app).
 * Auth-free endpoints (login / register / status check) always pass through.
 */
function assertSessionActive(path: string) {
  if (isAuthFreePath(path)) return;
  const { isAuthenticated, hasProfile } = readStoredSession();
  if (!isAuthenticated || !hasProfile) {
    notifyUnauthenticated();
    throw unauthenticatedError();
  }
  if (readStoredStatus() === "BLOCK") {
    notifyBlocked();
    throw blockedError();
  }
}

async function handleResponse<T>(response: Response, path: string): Promise<T> {
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as any;
    error.status = response.status;
    try {
      (error as any).body = await response.clone().json();
    } catch {}

    if (
      (response.status === 401 || response.status === 403) &&
      !isAuthFreePath(path) &&
      onBlockedCallback
    ) {
      notifyBlocked();
    }

    throw error;
  }
  return await response.json();
}

export async function httpGet<T>(path: string): Promise<T> {
  try {
    assertSessionActive(path);
    const response = await fetch(`${baseApi}${path}`);
    return await handleResponse<T>(response, path);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpPost<T>(path: string, body: object): Promise<T> {
  try {
    assertSessionActive(path);
    const response = await fetch(`${baseApi}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response, path);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpPut<T>(path: string, body: object): Promise<T> {
  try {
    assertSessionActive(path);
    const response = await fetch(`${baseApi}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response, path);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpDelete<T>(path: string, body: object): Promise<T> {
  try {
    assertSessionActive(path);
    const response = await fetch(`${baseApi}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response, path);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpDeleteWithQuery<T>(
  path: string,
  params: Record<string, string>,
): Promise<T> {
  try {
    const query = new URLSearchParams(params).toString();
    const fullPath = `${path}?${query}`;
    assertSessionActive(fullPath);
    const response = await fetch(`${baseApi}${fullPath}`, {
      method: "DELETE",
    });
    return await handleResponse<T>(response, fullPath);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpPostFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  try {
    assertSessionActive(path);
    const response = await fetch(`${baseApi}${path}`, {
      method: "POST",
      body: formData,
    });
    return await handleResponse<T>(response, path);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpPutFormData<T>(
  path: string,
  formData: FormData,
): Promise<T> {
  try {
    assertSessionActive(path);
    const response = await fetch(`${baseApi}${path}`, {
      method: "PUT",
      body: formData,
    });
    return await handleResponse<T>(response, path);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

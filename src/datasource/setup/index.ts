const baseApi = "http://localhost:4000/lib";

type BlockedHandler = () => void;

let onBlockedCallback: BlockedHandler | null = null;

export function setBlockedHandler(callback: BlockedHandler) {
  onBlockedCallback = callback;
}

export const setForbiddenHandler = setBlockedHandler;

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

/**
 * Request middleware: instantly stops any API call when the locally stored
 * session is already BLOCKed (e.g. admin blocked the user while they were
 * exploring the app). The auth store re-validates against the server on
 * route change / reload, so this local check is only a fast first line.
 */
function assertSessionActive(path: string) {
  if (isAuthFreePath(path)) return;
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

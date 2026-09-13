const baseApi = "http://localhost:4000/lib";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`) as any;
    error.status = response.status;
    throw error;
  }
  return await response.json();
}

export async function httpGet<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${baseApi}${path}`);
    return await handleResponse<T>(response);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpPost<T>(path: string, body: object): Promise<T> {
  try {
    const response = await fetch(`${baseApi}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpPut<T>(path: string, body: object): Promise<T> {
  try {
    const response = await fetch(`${baseApi}${path}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

export async function httpDelete<T>(path: string, body: object): Promise<T> {
  try {
    const response = await fetch(`${baseApi}${path}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await handleResponse<T>(response);
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
    const response = await fetch(`${baseApi}${path}`, {
      method: "POST",
      body: formData,
    });
    return await handleResponse<T>(response);
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
    const response = await fetch(`${baseApi}${path}`, {
      method: "PUT",
      body: formData,
    });
    return await handleResponse<T>(response);
  } catch (error: any) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw error;
    }
    throw error;
  }
}

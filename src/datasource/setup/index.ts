const baseApi = "http://localhost:4000/lib";

export async function httpGet<T>(path: string): Promise<T> {
  const response = await fetch(`${baseApi}${path}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function httpPost<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${baseApi}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function httpPut<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${baseApi}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

export async function httpDelete<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${baseApi}${path}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}

// مثال استفاده:
// const res = await httpPost('/users/register', {
//   userName: "Loyal.Weissnat",
//   password: "FnrGNK56789",
//   mobile: "587-886-6995"
// });

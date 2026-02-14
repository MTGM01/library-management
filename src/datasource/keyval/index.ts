export async function setKey(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getKey(key: string) {
  const value = localStorage.getItem(key);
  return value && JSON.parse(value);
}

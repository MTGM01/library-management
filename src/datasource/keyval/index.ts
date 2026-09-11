export function setKey(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getKey<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function removeKey(key: string) {
  localStorage.removeItem(key);
}

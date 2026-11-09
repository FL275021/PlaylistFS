import { SESSION_KEY } from "./config";

// Cuenta de prueba: se reutiliza por pestaña vía sessionStorage.
export const loadTestAccount = () => {
  try {
    const existing = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    if (existing?.username && existing?.email && existing.username.length <= 30) {
      return existing;
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }

  const suffix = Date.now().toString(36);
  const account = {
    username: `hito1${suffix}`.slice(0, 30),
    email: `hito1-${suffix}@example.com`,
  };
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(account));
  return account;
};

// Oculta cualquier campo que contenga "token" antes de mostrar la respuesta.
export const redact = (value) => {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        /token/i.test(key) ? "[oculto]" : redact(item),
      ]),
    );
  }
  return value;
};

export const buildApiUrl = (base, path) => {
  const clean = base.trim().replace(/\/+$/, "");
  if (!/^https?:\/\//i.test(clean)) {
    throw new Error("La URL base debe comenzar con http:// o https://");
  }
  if (path === "/health") return new URL(path, clean).href;
  return `${clean}${path}`;
};

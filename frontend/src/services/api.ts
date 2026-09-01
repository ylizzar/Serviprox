/** Cliente HTTP minimo para la API de Serviprox. */
import type { Paginated } from '@/types';
import { storage } from '@/services/storage';

// Unica fuente de la URL de la API. El fallback existe solo para desarrollo Web:
// en Android/iOS `localhost` apunta al propio dispositivo, asi que el build movil
// siempre debe definir VITE_API_URL con un dominio HTTPS accesible.
const DEV_FALLBACK_URL = 'http://localhost:8000/api/v1';
const BASE_URL = (import.meta.env.VITE_API_URL ?? DEV_FALLBACK_URL).replace(/\/+$/, '');
const TOKEN_KEY = 'serviprox.access_token';

export class ApiError extends Error {
  constructor(
    public status: number,
    public detail: unknown,
  ) {
    super(typeof detail === 'string' ? detail : `Error ${status} en la API`);
    this.name = 'ApiError';
  }
}

export function getToken(): string | null {
  return storage.get(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) storage.set(TOKEN_KEY, token);
  else storage.remove(TOKEN_KEY);
}

type Query = Record<string, string | number | boolean | undefined | null>;

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

async function request<T>(
  method: string,
  path: string,
  options: { body?: unknown; query?: Query } = {},
  allowRetry = true,
): Promise<T> {
  const token = getToken();
  const response = await fetch(buildUrl(path, options.query), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  // Un token vencido hace fallar incluso los endpoints publicos: DRF rechaza la
  // credencial antes de evaluar los permisos. Lo descartamos y reintentamos como
  // anonimo, para que el catalogo y la busqueda sigan funcionando.
  if (response.status === 401 && token && allowRetry) {
    setToken(null);
    return request<T>(method, path, options, false);
  }

  if (response.status === 204) return undefined as T;

  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new ApiError(response.status, payload ?? response.statusText);
  return payload as T;
}

export const api = {
  get: <T>(path: string, query?: Query) => request<T>('GET', path, { query }),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, { body }),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, { body }),
  delete: <T>(path: string) => request<T>('DELETE', path),
};

/** Devuelve `results` tanto si la vista pagina como si no. */
export function unwrap<T>(payload: Paginated<T> | T[]): T[] {
  return Array.isArray(payload) ? payload : payload.results;
}

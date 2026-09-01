import { create } from 'zustand';
import { getToken } from '@/services/api';
import { getMe, listCategories, listHouseholds, login } from '@/services/endpoints';
import type { DiagnosticSession, Household, ServiceCategory, User } from '@/types';

/** Credenciales del usuario sembrado por `seed_demo.py` (solo para la demo). */
const DEMO_EMAIL = import.meta.env.VITE_DEMO_EMAIL ?? 'camila@demo.serviprox.co';
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD ?? 'serviprox2026';

/**
 * Reutiliza la sesion guardada; si el token ya no sirve (base resembrada, token
 * vencido) vuelve a autenticar. Sin sesion la app sigue navegable: el catalogo y
 * la busqueda son publicos.
 */
async function resolveUser(): Promise<User | null> {
  if (getToken()) {
    try {
      return await getMe();
    } catch {
      // Token invalido: `api.ts` ya lo descarto, seguimos con login.
    }
  }
  try {
    return await login(DEMO_EMAIL, DEMO_PASSWORD);
  } catch {
    return null;
  }
}

interface AppState {
  user: User | null;
  household: Household | null;
  categories: ServiceCategory[];
  /** Lo que propuso el diagnostico. Informativo: nunca decide por el cliente. */
  suggestedCategory: ServiceCategory | null;
  /** Lo que el cliente confirmo. Es lo unico que dispara la busqueda. */
  selectedCategory: ServiceCategory | null;
  diagnosticSessionId: number | null;
  radiusKm: number;
  ready: boolean;
  error: string | null;

  bootstrap: () => Promise<void>;
  applySuggestion: (session: DiagnosticSession) => void;
  confirmCategory: (category: ServiceCategory) => void;
  setRadius: (radiusKm: number) => void;
  clearFlow: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  household: null,
  categories: [],
  suggestedCategory: null,
  selectedCategory: null,
  diagnosticSessionId: null,
  radiusKm: 5,
  ready: false,
  error: null,

  async bootstrap() {
    if (get().ready) return;
    try {
      const categories = await listCategories();
      const user = await resolveUser();
      const households = user ? await listHouseholds().catch(() => []) : [];
      set({
        categories,
        user,
        household: households.find((item) => item.is_default) ?? households[0] ?? null,
        ready: true,
        error: null,
      });
    } catch (error) {
      set({
        ready: true,
        error:
          error instanceof Error
            ? `No pudimos conectar con la API: ${error.message}`
            : 'No pudimos conectar con la API.',
      });
    }
  },

  applySuggestion(session) {
    set({
      suggestedCategory: session.suggested_category,
      diagnosticSessionId: session.id,
    });
  },

  confirmCategory(category) {
    set({ selectedCategory: category });
  },

  setRadius(radiusKm) {
    set({ radiusKm });
  },

  clearFlow() {
    set({ suggestedCategory: null, selectedCategory: null, diagnosticSessionId: null });
  },
}));

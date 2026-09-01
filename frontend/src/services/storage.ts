/**
 * Almacenamiento clave/valor con la misma API en Web y en el WebView de Capacitor.
 *
 * TODO(movil): antes de publicar en Play Store / App Store, el JWT debe migrar a
 * almacenamiento seguro nativo (Keychain en iOS, EncryptedSharedPreferences en
 * Android). localStorage es aceptable para Web y para desarrollo, no para produccion movil.
 */

// Algunos WebView bloquean localStorage (modo privado, cookies deshabilitadas).
// En ese caso degradamos a memoria en lugar de romper la aplicacion.
const fallback = new Map<string, string>();

function available(): boolean {
  try {
    const probe = '__serviprox_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}

const useLocalStorage = typeof window !== 'undefined' && available();

export const storage = {
  get(key: string): string | null {
    return useLocalStorage ? window.localStorage.getItem(key) : (fallback.get(key) ?? null);
  },
  set(key: string, value: string): void {
    if (useLocalStorage) window.localStorage.setItem(key, value);
    else fallback.set(key, value);
  },
  remove(key: string): void {
    if (useLocalStorage) window.localStorage.removeItem(key);
    else fallback.delete(key);
  },
};

/**
 * Ubicacion del dispositivo, unica abstraccion para Web y nativo.
 *
 * Web      -> navigator.geolocation
 * Android/iOS -> @capacitor/geolocation
 *
 * Serviprox no depende solo del GPS: el usuario podra elegir entre su ubicacion
 * actual y una vivienda registrada, asi que este servicio nunca reemplaza las
 * coordenadas de Household, solo las complementa.
 */
import { Capacitor } from '@capacitor/core';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type GeolocationErrorCode =
  | 'unsupported'
  | 'permission-denied'
  | 'unavailable'
  | 'timeout'
  | 'unknown';

export class GeolocationError extends Error {
  constructor(
    public code: GeolocationErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'GeolocationError';
  }
}

const MESSAGES: Record<GeolocationErrorCode, string> = {
  unsupported: 'Este dispositivo no permite obtener la ubicacion.',
  'permission-denied': 'Permiso de ubicacion denegado.',
  unavailable: 'No se pudo determinar la ubicacion en este momento.',
  timeout: 'La busqueda de ubicacion tardo demasiado.',
  unknown: 'Error inesperado al obtener la ubicacion.',
};

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

const DEFAULT_TIMEOUT_MS = 10_000;

async function nativePosition(timeout: number): Promise<Coordinates> {
  // Import dinamico: el bundle Web no carga el plugin nativo.
  const { Geolocation } = await import('@capacitor/geolocation');
  const status = await Geolocation.checkPermissions();
  if (status.location !== 'granted') {
    const asked = await Geolocation.requestPermissions();
    if (asked.location !== 'granted') {
      throw new GeolocationError('permission-denied', MESSAGES['permission-denied']);
    }
  }
  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout,
  });
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}

function webPosition(timeout: number): Promise<Coordinates> {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    return Promise.reject(new GeolocationError('unsupported', MESSAGES.unsupported));
  }
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (error) => {
        const code: GeolocationErrorCode =
          error.code === error.PERMISSION_DENIED
            ? 'permission-denied'
            : error.code === error.POSITION_UNAVAILABLE
              ? 'unavailable'
              : error.code === error.TIMEOUT
                ? 'timeout'
                : 'unknown';
        reject(new GeolocationError(code, error.message || MESSAGES[code]));
      },
      { enableHighAccuracy: true, timeout },
    );
  });
}

/** Devuelve la posicion actual o lanza `GeolocationError` con un codigo tratable. */
export async function getCurrentPosition(
  options: { timeout?: number } = {},
): Promise<Coordinates> {
  const timeout = options.timeout ?? DEFAULT_TIMEOUT_MS;
  try {
    return isNativePlatform() ? await nativePosition(timeout) : await webPosition(timeout);
  } catch (error) {
    if (error instanceof GeolocationError) throw error;
    const message = error instanceof Error ? error.message : '';
    const denied = /denied|permission/i.test(message);
    const code: GeolocationErrorCode = denied ? 'permission-denied' : 'unavailable';
    throw new GeolocationError(code, message || MESSAGES[code]);
  }
}

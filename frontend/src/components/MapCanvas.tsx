import type { Professional } from '@/types';

const KM_PER_DEG_LAT = 110.574;
const CANVAS_HEIGHT = 270;

interface MapCanvasProps {
  center: { latitude: number; longitude: number };
  radiusKm: number;
  professionals: Professional[];
  onPinClick: (professional: Professional) => void;
}

function kmPerDegLng(latitude: number): number {
  return 111.32 * Math.cos((latitude * Math.PI) / 180);
}

/**
 * Mapa esquematico: proyecta lat/lng a pixeles con una escala lineal centrada
 * en el hogar. Es suficiente para el radio de pocos kilometros que maneja la
 * app y evita cargar un motor de mapas completo en el prototipo funcional.
 */
export function MapCanvas({ center, radiusKm, professionals, onPinClick }: MapCanvasProps) {
  // El anillo del radio ocupa ~40% del alto; asi entra el doble del radio en pantalla.
  const pxPerKm = (CANVAS_HEIGHT * 0.4) / Math.max(radiusKm, 0.5);
  const ringSize = radiusKm * pxPerKm * 2;

  const project = (professional: Professional) => {
    const dxKm =
      (professional.longitude - center.longitude) * kmPerDegLng(center.latitude);
    const dyKm = (professional.latitude - center.latitude) * KM_PER_DEG_LAT;
    return {
      left: `calc(50% + ${dxKm * pxPerKm}px)`,
      // El eje Y de la pantalla crece hacia abajo, al reves que la latitud.
      top: `calc(50% - ${dyKm * pxPerKm}px)`,
    };
  };

  return (
    <div className="map-canvas">
      <div className="grid-line" style={{ width: 1, height: '100%', left: '22%' }} />
      <div className="grid-line" style={{ width: 1, height: '100%', left: '68%' }} />
      <div className="grid-line" style={{ height: 1, width: '100%', top: '35%' }} />
      <div className="grid-line" style={{ height: 1, width: '100%', top: '72%' }} />
      <div className="radius-ring" style={{ width: ringSize, height: ringSize }} />
      <div className="user-dot" />
      {professionals.map((professional, index) => (
        <button
          key={professional.id}
          type="button"
          className="pin"
          style={project(professional)}
          onClick={() => onPinClick(professional)}
          aria-label={`Ver a ${professional.display_name}`}
        >
          <span>{index + 1}</span>
        </button>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Icon } from '@/components/Icon';
import { MapCanvas } from '@/components/MapCanvas';
import { ProfessionalCard } from '@/components/ProfessionalCard';
import { ProfessionalSheet } from '@/components/ProfessionalSheet';
import { StatusStrip } from '@/components/StatusStrip';
import { createServiceRequest, scheduleVisit, searchProfessionals } from '@/services/endpoints';
import { useAppStore } from '@/store/useAppStore';
import { useAsync } from '@/store/useAsync';
import type { Professional } from '@/types';

const RADII = [1, 3, 5, 10];

export function MapPage() {
  const navigate = useNavigate();
  const {
    household,
    suggestedCategory,
    selectedCategory,
    diagnosticSessionId,
    radiusKm,
    setRadius,
  } = useAppStore();

  const [active, setActive] = useState<Professional | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const center = household ?? { latitude: 4.628, longitude: -74.15 };

  const search = useAsync(
    () =>
      searchProfessionals({
        lat: center.latitude,
        lng: center.longitude,
        radius_km: radiusKm,
        category: selectedCategory?.slug,
      }),
    [center.latitude, center.longitude, radiusKm, selectedCategory?.slug],
  );

  const professionals = search.data ?? [];

  /** Registra la solicitud (dejando constancia de sugerido vs elegido) y agenda. */
  async function handleSchedule(professional: Professional) {
    if (!household || !selectedCategory) {
      setNotice('Necesitas una sesión activa y un servicio confirmado para agendar.');
      return;
    }
    try {
      const request = await createServiceRequest({
        household: household.id,
        selected_category: selectedCategory.id,
        suggested_category: suggestedCategory?.id ?? null,
        diagnostic_session: diagnosticSessionId,
        search_radius_km: radiusKm,
      });
      await scheduleVisit({ service_request: request.id, professional: professional.id });
      setActive(null);
      setNotice(`Visita solicitada a ${professional.display_name}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'No pudimos agendar la visita.');
    }
  }

  return (
    <div className="screen">
      <StatusStrip suggested={suggestedCategory} selected={selectedCategory} />

      <div className="map-wrap">
        <MapCanvas
          center={center}
          radiusKm={radiusKm}
          professionals={professionals}
          onPinClick={setActive}
        />
        <div className="map-topfade" />
        <div className="map-header">
          <div className="back-row" style={{ padding: 0 }}>
            <button
              type="button"
              className="icon-btn"
              onClick={() => navigate(-1)}
              aria-label="Volver"
            >
              <Icon name="back" strokeWidth={2.1} />
            </button>
            <div className="loc-pill">
              <Icon name="map-pin" strokeWidth={2} />
              {household?.short_location ?? 'Kennedy, Bogotá'}
            </div>
          </div>
        </div>
      </div>

      <div className="radius-row">
        {RADII.map((value) => (
          <button
            type="button"
            key={value}
            className={`radius-chip${value === radiusKm ? ' on' : ''}`}
            onClick={() => setRadius(value)}
          >
            {value} km
          </button>
        ))}
      </div>

      <div className="screen-scroll" style={{ paddingTop: 2 }}>
        <p className="section-label" style={{ marginTop: 6 }}>
          {search.loading
            ? 'Buscando profesionales…'
            : `${professionals.length} ${
                professionals.length === 1 ? 'profesional cerca' : 'profesionales cerca'
              } de ti`}
        </p>

        {notice && <p className="state-msg">{notice}</p>}
        {search.error && <p className="state-msg error">{search.error}</p>}

        {search.loading && (
          <>
            <div className="skeleton" />
            <div className="skeleton" />
          </>
        )}

        {!search.loading && professionals.length === 0 && !search.error && (
          <p className="state-msg">
            No hay profesionales en {radiusKm} km. Prueba ampliando el radio.
          </p>
        )}

        {professionals.map((professional) => (
          <ProfessionalCard
            key={professional.id}
            professional={professional}
            onSelect={setActive}
          />
        ))}
      </div>

      <ProfessionalSheet
        professional={active}
        categoryName={selectedCategory?.name}
        onClose={() => setActive(null)}
        onSchedule={handleSchedule}
      />

      <BottomNav />
    </div>
  );
}

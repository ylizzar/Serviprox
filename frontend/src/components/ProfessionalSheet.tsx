import { useEffect, useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Icon } from './Icon';
import { getProfessional } from '@/services/endpoints';
import type { Professional, ProfessionalDetail } from '@/types';

interface ProfessionalSheetProps {
  professional: Professional | null;
  categoryName?: string;
  onClose: () => void;
  onSchedule?: (professional: Professional) => void;
}

const currency = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

function priceRange(detail: ProfessionalDetail | null, categorySlug?: string): string {
  const service =
    detail?.services.find((item) => item.category_slug === categorySlug) ?? detail?.services[0];
  if (!service?.price_min || !service.price_max) return 'A convenir';
  return `${currency.format(Number(service.price_min))} – ${currency.format(Number(service.price_max))}`;
}

export function ProfessionalSheet({
  professional,
  categoryName,
  onClose,
  onSchedule,
}: ProfessionalSheetProps) {
  const [detail, setDetail] = useState<ProfessionalDetail | null>(null);

  useEffect(() => {
    if (!professional) return;
    let cancelled = false;
    setDetail(null);
    getProfessional(professional.id)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [professional]);

  const today = detail?.availability.find(
    (slot) => slot.weekday === (new Date().getDay() + 6) % 7,
  );

  return (
    <BottomSheet open={Boolean(professional)} onClose={onClose}>
      {professional && (
        <>
          <div className="pro-hero">
            <div className="pro-avatar">{professional.initials}</div>
            <div>
              <h3>{professional.display_name}</h3>
              <div className="pro-meta">
                <span className="stars">★ {Number(professional.rating_avg).toFixed(1)}</span>
                <span>· {professional.jobs_completed} servicios completados</span>
              </div>
              {professional.is_verified && (
                <div className="badge-verified">
                  <Icon name="check" size={11} strokeWidth={3} />
                  Verificado por Serviprox
                </div>
              )}
            </div>
          </div>

          <div className="gallery-row">
            {(detail?.portfolio.length ? detail.portfolio : [0, 1, 2, 3]).map((item, index) => (
              <div key={typeof item === 'number' ? index : item.id} />
            ))}
          </div>

          <div className="info-line">
            <span>Servicio</span>
            <span>{categoryName ?? professional.categories[0] ?? '—'}</span>
          </div>
          <div className="info-line">
            <span>Distancia</span>
            <span>
              {professional.distance_km !== undefined
                ? `${professional.distance_km.toFixed(1)} km · ${professional.neighborhood}`
                : professional.neighborhood}
            </span>
          </div>
          <div className="info-line">
            <span>Tarifa estimada</span>
            <span>{priceRange(detail, professional.categories[0])}</span>
          </div>
          <div className="info-line">
            <span>Disponibilidad</span>
            <span>
              {today
                ? `Hoy, ${today.start_time.slice(0, 5)} – ${today.end_time.slice(0, 5)}`
                : 'Consultar agenda'}
            </span>
          </div>

          <button
            type="button"
            className="primary-btn red"
            onClick={() => onSchedule?.(professional)}
          >
            Agendar visita
          </button>
          <button type="button" className="ghost-btn" onClick={onClose}>
            Volver
          </button>
        </>
      )}
    </BottomSheet>
  );
}

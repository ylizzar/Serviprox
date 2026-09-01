import type { Professional } from '@/types';

interface ProfessionalCardProps {
  professional: Professional;
  onSelect: (professional: Professional) => void;
}

export function ProfessionalCard({ professional, onSelect }: ProfessionalCardProps) {
  return (
    <button
      type="button"
      className="glass-card pro-card"
      onClick={() => onSelect(professional)}
    >
      <div className="pro-avatar">{professional.initials}</div>
      <div className="pro-info">
        <h4>{professional.display_name}</h4>
        <div className="pro-meta">
          <span className="stars">★ {Number(professional.rating_avg).toFixed(1)}</span>
          <span>· {professional.jobs_completed} servicios</span>
        </div>
      </div>
      <div className="pro-dist">
        <b>
          {professional.distance_km !== undefined
            ? `${professional.distance_km.toFixed(1)} km`
            : professional.neighborhood}
        </b>
        <span>{professional.accepts_urgent ? 'Disponible hoy' : 'Agenda programada'}</span>
      </div>
    </button>
  );
}

import { BottomNav } from '@/components/BottomNav';
import { useAppStore } from '@/store/useAppStore';

export function ProfilePage() {
  const { user, household, suggestedCategory, selectedCategory, clearFlow } = useAppStore();

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <p className="greeting">Tu cuenta</p>
          <h2>{user ? `${user.first_name} ${user.last_name}` : 'Invitado'}</h2>
        </div>
        <div className="avatar-btn">{user?.initials ?? 'SP'}</div>
      </header>

      <div className="screen-scroll">
        <p className="section-label">Hogar</p>
        <div className="glass-card" style={{ padding: 18 }}>
          <div className="info-line">
            <span>Dirección</span>
            <span>{household?.short_location ?? 'Sin registrar'}</span>
          </div>
          <div className="info-line">
            <span>Tipo</span>
            <span>{household?.property_type ?? '—'}</span>
          </div>
          <div className="info-line" style={{ borderBottom: 'none' }}>
            <span>Área</span>
            <span>{household?.area_m2 ? `${household.area_m2} m²` : '—'}</span>
          </div>
        </div>

        <p className="section-label">Búsqueda actual</p>
        <div className="glass-card" style={{ padding: 18 }}>
          <div className="info-line">
            <span>Sugerido por el sistema</span>
            <span style={{ color: 'var(--blue-600)' }}>{suggestedCategory?.name ?? '—'}</span>
          </div>
          <div className="info-line" style={{ borderBottom: 'none' }}>
            <span>Confirmado por ti</span>
            <span style={{ color: 'var(--red-600)' }}>{selectedCategory?.name ?? '—'}</span>
          </div>
        </div>

        <button type="button" className="ghost-btn" onClick={clearFlow}>
          Reiniciar selección
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

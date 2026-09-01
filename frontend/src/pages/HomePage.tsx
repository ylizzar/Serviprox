import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Icon } from '@/components/Icon';
import { useAppStore } from '@/store/useAppStore';

export function HomePage() {
  const navigate = useNavigate();
  const { user, categories, confirmCategory } = useAppStore();

  const frequent = categories.slice(0, 4);

  return (
    <div className="screen">
      <header className="topbar">
        <div>
          <p className="greeting">Hola{user?.first_name ? `, ${user.first_name}` : ''}</p>
          <h2>¿Qué necesitas hoy?</h2>
        </div>
        <div className="avatar-btn">{user?.initials ?? 'SP'}</div>
      </header>

      <div className="screen-scroll">
        <button
          type="button"
          className="glass-card path-card blue"
          onClick={() => navigate('/servicios')}
        >
          <div className="icon-wrap">
            <Icon name="calendar" />
          </div>
          <div>
            <h3>Ya sé qué servicio necesito</h3>
            <p>Elige directamente entre plomería, electricidad y más categorías.</p>
          </div>
          <div className="chev">
            <Icon name="chevron" size={16} strokeWidth={2} />
          </div>
        </button>

        <button
          type="button"
          className="glass-card path-card red"
          onClick={() => navigate('/diagnostico')}
        >
          <div className="icon-wrap">
            <Icon name="help" />
          </div>
          <div>
            <h3>Aún no sé qué necesito</h3>
            <p>Describe el problema y te guiamos hacia el servicio adecuado.</p>
          </div>
          <div className="chev">
            <Icon name="chevron" size={16} strokeWidth={2} />
          </div>
        </button>

        {frequent.length > 0 && (
          <>
            <p className="section-label">Categorías frecuentes</p>
            <div className="chip-row">
              {frequent.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="chip"
                  onClick={() => {
                    confirmCategory(category);
                    navigate('/mapa');
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </>
        )}

        <p className="section-label">Cómo funciona</p>
        <div className="glass-card" style={{ padding: 18 }}>
          <div className="info-line">
            <span>1. Cuéntanos el problema</span>
            <span>Diagnóstico</span>
          </div>
          <div className="info-line">
            <span>2. Te sugerimos un servicio</span>
            <span style={{ color: 'var(--blue-600)' }}>No vinculante</span>
          </div>
          <div className="info-line" style={{ borderBottom: 'none' }}>
            <span>3. Tú confirmas y eliges</span>
            <span style={{ color: 'var(--red-600)' }}>Tu decisión</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

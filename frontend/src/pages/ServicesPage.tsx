import { useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { Icon } from '@/components/Icon';
import { useAppStore } from '@/store/useAppStore';

export function ServicesPage() {
  const navigate = useNavigate();
  const { categories, confirmCategory, error } = useAppStore();

  return (
    <div className="screen">
      <div className="back-row">
        <button type="button" className="icon-btn" onClick={() => navigate('/')} aria-label="Volver">
          <Icon name="back" strokeWidth={2.1} />
        </button>
        <div className="title">Elige un servicio</div>
      </div>

      <div className="screen-scroll">
        {error && <p className="state-msg error">{error}</p>}
        {!error && categories.length === 0 && (
          <p className="state-msg">Cargando categorías…</p>
        )}
        <div className="service-grid">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="glass-card service-tile"
              onClick={() => {
                confirmCategory(category);
                navigate('/mapa');
              }}
            >
              <div className="tile-icon">
                <Icon name={category.icon_key} />
              </div>
              <h4>{category.name}</h4>
              <span>
                {category.professionals_count > 0
                  ? `${category.professionals_count} ${
                      category.professionals_count === 1 ? 'profesional' : 'profesionales'
                    }`
                  : 'Aún sin profesionales'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}

import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { DiagnosticPage } from '@/pages/DiagnosticPage';
import { HomePage } from '@/pages/HomePage';
import { MapPage } from '@/pages/MapPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { ServicesPage } from '@/pages/ServicesPage';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  const { bootstrap, ready } = useAppStore();

  useEffect(() => {
    void bootstrap();
  }, [bootstrap]);

  return (
    <div className="app-shell">
      <div className="device">
        {!ready ? (
          <p className="state-msg" style={{ margin: 'auto' }}>
            Cargando Serviprox…
          </p>
        ) : (
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/servicios" element={<ServicesPage />} />
            <Route path="/diagnostico" element={<DiagnosticPage />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </div>
  );
}

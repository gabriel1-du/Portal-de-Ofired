import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/barrasLaterales/BarraLateralAdmin.css';

const BarraLateralAdmin = ({ menuActivo }) => {
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar-menu">
      <nav>
        <button 
          className={`admin-menu-btn ${menuActivo === 'usuarios' ? 'activo' : ''}`}
          onClick={() => navigate('/admin/usuarios')}
        >
          👥 Entidad: Usuarios
        </button>
        <button 
          className={`admin-menu-btn ${menuActivo === 'regiones' ? 'activo' : ''}`}
          onClick={() => navigate('/admin/regiones')}
        >
          📍 Entidad: Regiones
        </button>
        <button 
          className={`admin-menu-btn ${menuActivo === 'comunas' ? 'activo' : ''}`}
          onClick={() => navigate('/admin/comunas')}
        >
          🏙️ Entidad: Comunas
        </button>
        <button 
          className={`admin-menu-btn ${menuActivo === 'oficios' ? 'activo' : ''}`}
          onClick={() => navigate('/admin/oficios')}
        >
          💼 Entidad: Oficios
        </button>
      </nav>
    </aside>
  );
};

export default BarraLateralAdmin;

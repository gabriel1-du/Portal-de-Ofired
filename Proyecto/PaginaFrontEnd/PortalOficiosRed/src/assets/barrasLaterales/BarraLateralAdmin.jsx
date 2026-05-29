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
      </nav>
    </aside>
  );
};

export default BarraLateralAdmin;

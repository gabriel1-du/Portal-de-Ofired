import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../style/styleAdmin/pantallaAdminUsuarios.css';

const PantallaAdministradorUsuarios = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-usuarios-contenedor">
      <header className="admin-header">
        <button className="btn-volver" onClick={() => navigate(-1)}>&#10094; Volver</button>
        <h1>Menú Administrador</h1>
      </header>
      <main className="admin-main">
        <h2>Bienvenido a menú de administrador, estamos bien.</h2>
      </main>
    </div>
  );
};

export default PantallaAdministradorUsuarios;

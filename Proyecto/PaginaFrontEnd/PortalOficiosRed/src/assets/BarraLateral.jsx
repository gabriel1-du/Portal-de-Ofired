import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../style/BarraLateral.css';

const BarraLateral = ({ abierta, alCerrar }) => {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const navigate = useNavigate();

  // Si no está abierta, no renderizamos nada.
  if (!abierta) {
    return null;
  }

  const handleLogout = () => {
    cerrarSesion();
    alCerrar(); // Cierra la barra lateral al hacer logout
    navigate('/iniciar-sesion');
  };

  // Usamos el portal para renderizar la barra lateral y el fondo en el body.
  return ReactDOM.createPortal(
    <>
      <div className="sidebar-backdrop abierto" onClick={alCerrar}></div>
      <div className="barra-lateral abierta">
        <div className="barra-lateral-header">
          <h3>Menú</h3>
          <button onClick={alCerrar} className="btn-cerrar-sidebar">&times;</button>
        </div>
        <nav className="sidebar-nav">
          {usuario ? (
            // Opciones para usuario logueado
            <>
              <Link to={`/perfil/${usuario.idUsuario}`} onClick={alCerrar} className="sidebar-link">
                Ver mi Perfil
              </Link>
              <Link to="/perfil/modificar" onClick={alCerrar} className="sidebar-link">
                Configuraciones
              </Link>
              <button onClick={handleLogout} className="btn-logout">
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Opciones para usuario no logueado
            <>
              <Link to="/iniciar-sesion" onClick={alCerrar} className="sidebar-link">
                Iniciar Sesión
              </Link>
              <Link to="/" onClick={alCerrar} className="sidebar-link">
                Crear Cuenta
              </Link>
            </>
          )}
        </nav>
      </div>
    </>,
    document.getElementById('sidebar-root')
  );
};

export default BarraLateral;

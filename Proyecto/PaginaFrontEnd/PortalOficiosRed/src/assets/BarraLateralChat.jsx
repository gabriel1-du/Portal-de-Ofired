import React from 'react';
import ReactDOM from 'react-dom';
import '../style/BarraLateral.css'; // Heredamos los estilos de fondo y estructura de tu barra original
import '../style/BarraLateralChat.css'; // Estilos específicos para los botones del chat

const BarraLateralChat = ({ abierta, alCerrar, otroNombre, yoLoBloquee, onToggleBloqueo }) => {
  if (!abierta) {
    return null;
  }

  return ReactDOM.createPortal(
    <>
      {/* Fondo oscuro para cerrar la barra al hacer clic afuera */}
      <div className="sidebar-backdrop abierto" onClick={alCerrar}></div>
      
      <div className="barra-lateral abierta">
        <div className="barra-lateral-header">
          <h3>Opciones del Chat</h3>
          <button onClick={alCerrar} className="btn-cerrar-sidebar">&times;</button>
        </div>
        <nav className="sidebar-nav">
          <button 
            onClick={() => { onToggleBloqueo(); alCerrar(); }} 
            className={`sidebar-link btn-bloqueo ${yoLoBloquee ? 'desbloquear' : 'bloquear'}`}
          >
            {yoLoBloquee ? `🔓 Desbloquear a ${otroNombre}` : `🚫 Bloquear a ${otroNombre}`}
          </button>
        </nav>
      </div>
    </>,
    document.getElementById('sidebar-root') || document.body // Fallback por si acaso
  );
};

export default BarraLateralChat;

import React from 'react';
import '../../style/cards/UsuarioCard.css';
import { useNavigate } from 'react-router-dom';

const UsuarioCard = ({ usuario }) => {
  const { idUsuario, primerNombre, primerApellido, foto, nombreOficio } = usuario;
  const navigate = useNavigate();

  // Si por alguna razón la card no recibe un usuario con ID, no se renderiza.
  if (!idUsuario) return null;

  // Navega a la ruta del perfil usando el ID del usuario de la card.
  const handleVerPerfil = () => navigate(`/perfil/${idUsuario}`);

  return (
    <div className="card-fixed-wrapper mb-3">
      <div className="card h-100 shadow-sm border rounded-4 overflow-hidden">
        <div className="row g-0 h-100 align-items-center flex-nowrap">
          <div className="col-auto p-4 d-flex align-items-center justify-content-center">
            <img 
              src={foto || 'https://via.placeholder.com/150'} 
              alt={primerNombre}
              className="rounded-circle usuario-card-img shadow-sm"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Si la imagen falla, muestra un placeholder
            />
          </div>
          <div className="col px-4 py-3 overflow-hidden">
            <div className="card-body p-0 d-flex flex-column justify-content-center align-items-center text-center h-100">
              <h4 className="card-title fw-bold text-dark mb-2 text-truncate w-100">
                {`${primerNombre} ${primerApellido}`}
              </h4>
              <p className="card-text text-muted mb-3 text-truncate w-100" style={{ fontSize: '1.15rem' }}>
                {nombreOficio || 'Cliente'}
              </p>
              <div className="w-100 px-3 mt-1">
                <button onClick={handleVerPerfil} className="btn btn-primary w-100 rounded-pill fw-bold shadow">
                  Ver perfil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsuarioCard;
import React from 'react';
import '../style/UsuarioCard.css';
import { useNavigate } from 'react-router-dom';

const UsuarioCard = ({ usuario }) => {
  const { idUsuario, primerNombre, primerApellido, foto, nombreOficio } = usuario;
  const navigate = useNavigate();

  // Si por alguna razón la card no recibe un usuario con ID, no se renderiza.
  if (!idUsuario) return null;

  // Navega a la ruta del perfil usando el ID del usuario de la card.
  const handleVerPerfil = () => navigate(`/perfil/${idUsuario}`);

  return (
    <div className="card-fixed-wrapper">
      <div className="usuario-card">
        <div className="usuario-card-img-container">
          <img 
            src={foto || 'https://via.placeholder.com/150'} 
            alt={primerNombre}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Si la imagen falla, muestra un placeholder
          />
        </div>
        <div className="usuario-card-body">
          <h4 className="text-truncate">{`${primerNombre} ${primerApellido}`}</h4>
          <p className="text-truncate">{nombreOficio || 'Cliente'}</p>
          <button onClick={handleVerPerfil} className="btn-ver-perfil">Ver perfil</button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioCard;
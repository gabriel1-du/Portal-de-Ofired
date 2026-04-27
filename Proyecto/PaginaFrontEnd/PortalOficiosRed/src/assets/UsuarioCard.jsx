import React from 'react';
import '../style/UsuarioCard.css';

const UsuarioCard = ({ usuario }) => {
  const { primerNombre, primerApellido, foto, nombreOficio } = usuario;

  return (
    <div className="card-fixed-wrapper">
      <div className="usuario-card">
        <div className="avatar-frame">
          <img 
            src={foto || 'https://via.placeholder.com/150'} 
            alt={primerNombre}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} // Si la imagen falla, muestra un placeholder
          />
        </div>
        <div className="usuario-card-body">
          <h4 className="text-truncate">{`${primerNombre} ${primerApellido}`}</h4>
          <p className="text-truncate">{nombreOficio || 'Cliente'}</p>
        </div>
      </div>
    </div>
  );
};
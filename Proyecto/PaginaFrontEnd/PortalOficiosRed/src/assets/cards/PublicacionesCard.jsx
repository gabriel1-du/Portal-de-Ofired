import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import '../../style/cards/PublicacionCard.css'

const PublicacionCard = ({ publicacion }) => {
  const navigate = useNavigate(); 
  const location = useLocation();

  const esDetalle = location.pathname.includes('/publicacion/');

  const {
    idPublicacion, 
    tituloPublicacion,
    nombreRegion,
    nombreComuna,
    descripcionPublicacion,
    cantidadLikes,
    imagenUrl, 
    precioServicio 
  } = publicacion;

  return (
    <div className={`publicacion-card ${esDetalle ? 'modo-detalle' : ''}`}>
      
      <div className="publicacion-card-image">
        <img 
          src={imagenUrl || 'https://via.placeholder.com/800x400?text=Servicio+Ofired'} 
          alt={tituloPublicacion} 
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = 'https://via.placeholder.com/800x400?text=Servicio+Ofired'; 
          }}
        />
        {precioServicio && <span className="badge-precio">${precioServicio}</span>}
      </div>

      <div className="publicacion-card-content">
        <div className="publicacion-card-header">
          <h3>{tituloPublicacion || "Servicio sin título"}</h3>
        </div>
        
        <div className="publicacion-card-body">
          <p className="ubicacion">
            <i className="fas fa-map-marker-alt"></i> {nombreRegion}, {nombreComuna}
          </p>
          <p className={`descripcion ${esDetalle ? 'descripcion-completa' : ''}`}>
            {descripcionPublicacion}
          </p>
        </div>

        <div className="publicacion-card-footer">
          <div className="likes-section">
            <span role="img" aria-label="like">❤️</span> {cantidadLikes || 0}
          </div>
          {!esDetalle && (
            <button 
              className="btn-ver-perfil" 
              onClick={() => navigate(`/publicacion/${idPublicacion}`)}
            >
              Ver Detalles
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicacionCard;
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import '../../style/cards/PublicacionCard.css';

const PublicacionCard = ({ publicacion }) => {
  const navigate = useNavigate(); 
  const location = useLocation(); // Detecta en qué URL estamos

  // Si la URL actual incluye "/publicacion/", significa que estamos en la vista de detalle
  const esDetalle = location.pathname.includes('/publicacion/');

  const {
    idPublicacion, 
    tituloPublicacion,
    nombreRegion,
    nombreComuna,
    ubicacionPublicacion, // Por si lo usas más adelante
    descripcionPublicacion,
    cantidadLikes,
    imagenUrl, 
    precioServicio 
  } = publicacion;

  return (
    <div className={`publicacion-card ${esDetalle ? 'modo-detalle' : ''}`}>
      
      <div className="publicacion-card-image">
        {/* 👇 AQUÍ ESTÁ LA MAGIA: Si la imagen falla, pone una de repuesto y no se achica */}
        <img 
          src={imagenUrl || 'https://via.placeholder.com/800x400?text=Servicio+Ofired'} 
          alt={tituloPublicacion} 
          onError={(e) => { 
            e.target.onerror = null; // Evita un bucle infinito si la imagen de repuesto también falla
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
          {/* La descripción completa solo se muestra si estamos en el detalle */}
          <p className={`descripcion ${esDetalle ? 'descripcion-completa' : ''}`}>
            {descripcionPublicacion}
          </p>
        </div>

        <div className="publicacion-card-footer">
          <div className="likes-section">
            <span>❤️ {cantidadLikes || 0}</span>
          </div>
          {/* Si NO estamos en el detalle, mostramos el botón. Si estamos, lo ocultamos. */}
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
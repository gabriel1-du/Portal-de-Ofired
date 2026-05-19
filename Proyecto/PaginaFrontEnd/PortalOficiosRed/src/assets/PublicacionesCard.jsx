import React from 'react';
import '../style/PublicacionCard.css'; 

const PublicacionCard = ({ publicacion }) => {
  const {
    tituloPublicacion,
    nombreRegion,
    nombreComuna,
    ubicacionPublicacion,
    descripcionPublicacion,
    cantidadLikes,
    // Podrías añadir estos campos si los tienes en tu base de datos:
    imagenUrl, 
    precioServicio 
  } = publicacion;

  return (
    <div className="publicacion-card">
      {/* Añadimos un contenedor de imagen para que se vea más atractivo */}
      <div className="publicacion-card-image">
        <img 
          src={imagenUrl || 'https://via.placeholder.com/350x200?text=Servicio+Ofired'} 
          alt={tituloPublicacion} 
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
          <p className="descripcion">{descripcionPublicacion}</p>
        </div>

        <div className="publicacion-card-footer">
          <div className="likes-section">
            <span>❤️ {cantidadLikes || 0}</span>
          </div>
          <button className="btn-ver-perfil">Ver Detalles</button>
        </div>
      </div>
    </div>
  );
};

export default PublicacionCard;
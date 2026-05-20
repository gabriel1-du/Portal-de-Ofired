import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importamos la herramienta de navegación de react-router-dom
import '../style/PublicacionCard.css'; 

const PublicacionCard = ({ publicacion }) => {
  const navigate = useNavigate(); // 2. Inicializamos la función para poder cambiar de pantalla

  const {
    idPublicacion, // 3. Extraemos el idPublicacion que viene desde la base de datos
    tituloPublicacion,
    nombreRegion,
    nombreComuna,
    ubicacionPublicacion,
    descripcionPublicacion,
    cantidadLikes,
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
          {/* 4. Le asignamos el evento onClick al botón para navegar dinámicamente */}
          <button 
            className="btn-ver-perfil" 
            onClick={() => navigate(`/publicacion/${idPublicacion}`)}
          >
            Ver Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublicacionCard;
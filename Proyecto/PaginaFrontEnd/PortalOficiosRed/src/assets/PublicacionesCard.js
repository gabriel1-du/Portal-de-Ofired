import React from 'react';
import '../style/PulbicacioncCard.css'; // Importamos los estilos para la tarjeta

/**
 * Componente funcional para mostrar una publicación en formato de tarjeta.
 * @param {object} props - Las propiedades del componente.
 * @param {object} props.publicacion - El objeto con los datos de la publicación.
 */
const PublicacionCard = ({ publicacion }) => {
  // Desestructuramos los datos de la publicación para un uso más fácil
  const {
    tituloPublicacion,
    nombreRegion,
    nombreComuna,
    ubicacionPublicacion,
    descripcionPublicacion,
    cantidadLikes
  } = publicacion;

  return (
    <div className="publicacion-card">
      <div className="publicacion-card-header">
        <h3>{tituloPublicacion}</h3>
      </div>
      <div className="publicacion-card-body">
        <p className="ubicacion"><strong>Ubicación:</strong> {nombreRegion}, {nombreComuna}</p>
        <p className="ubicacion-detalle">{ubicacionPublicacion}</p>
        <p className="descripcion">{descripcionPublicacion}</p>
      </div>
      <div className="publicacion-card-footer">
        <span>❤️ {cantidadLikes} Likes</span>
        <button className="btn-contactar">Contactar</button>
      </div>
    </div>
  );
};

export default PublicacionCard;
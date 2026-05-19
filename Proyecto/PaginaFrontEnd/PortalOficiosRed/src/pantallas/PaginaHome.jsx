import React, { useState, useEffect } from 'react';
import '../style/home.css';
import PublicacionCard from '../assets/PublicacionesCard.jsx'; 
import BarraBusqueda from '../assets/barraBusqueda.jsx';

function PaginaHome() {
  // Estado para guardar la lista de publicaciones que vengan del backend
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // URL de tu endpoint de Spring Boot (Puerto 8085 según tus capturas)
    // Agregamos un límite (ejemplo: traer un máximo de 10 publicaciones iniciales)
    const limitePublicaciones = 10; 
    
    fetch(`http://localhost:8085/api/publicacionesApi?limit=${limitePublicaciones}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return res.json();
      })
      .then((data) => {
        // Si tu backend devuelve un array directamente, lo guardamos.
        // Si viene paginado en un objeto (ej: data.content), asegúrate de adaptarlo.
        // Aquí tomamos un slice de respaldo por si el backend no soporta el parámetro ?limit todavía
        const listaLimitada = Array.isArray(data) ? data.slice(0, limitePublicaciones) : [];
        setPublicaciones(listaLimitada);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando publicaciones generales:", err);
        setCargando(false);
      });
  }, []);

  return (
    <div>
      {/* Navbar que abre la Barra Lateral al tocar el avatar */}
      <BarraBusqueda />

      {/* Contenedor principal */}
      <div className="container mt-4 mi-pagina-contenedor">
        <h3 style={{ marginBottom: '10px' }}>Servicios Disponibles</h3>
        <p style={{ color: '#666', marginBottom: '25px' }}>
          Explora los servicios ofrecidos por nuestra comunidad de técnicos y profesionales.
        </p>
        
        {/* LÓGICA DE RENDERIZADO DINÁMICO */}
        {cargando ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#888' }}>
            Cargando servicios disponibles...
          </p>
        ) : publicaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <p style={{ color: '#777', margin: 0 }}>No hay publicaciones activas de momento. ¡Sé el primero en ofrecer un servicio!</p>
          </div>
        ) : (
          // El contenedor de tus tarjetas (puedes meterle clases de Bootstrap si usas, ej: row o grid CSS)
          <div className="publicaciones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {publicaciones.map((pub) => (
              // Mapeamos el array y le pasamos cada publicación individual al componente Card
              <PublicacionCard key={pub.idPublicacion} publicacion={pub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginaHome;
import React, { useState, useEffect, useContext } from 'react';
import '../style/paginaPrincipal.css';
import PublicacionCard from '../assets/PublicacionesCard.jsx'; 
import BarraBusqueda from '../assets/barraBusqueda.jsx';
import { AuthContext } from '../context/AuthContext.jsx'; // CORREGIDO: Subimos solo un nivel

function PaginaHome() {
  // Estado para guardar la lista de publicaciones que vengan del backend
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // Extraemos el token para poder pasarlo en la cabecera de la petición
  const { token } = useContext(AuthContext); 

  useEffect(() => {
    // Límite de publicaciones iniciales
    const limitePublicaciones = 10; 
    
    // CORRECCIÓN: Apunta a la ApiGateway (8888) usando la ruta /proxy/
    fetch(`http://localhost:8888/api/proxy/publicacionesApi?limit=${limitePublicaciones}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Pasamos el Token para cruzar la seguridad de la Gateway y del Microservicio
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Error en la respuesta del servidor o falta de autorización");
        }
        return res.json();
      })
      .then((data) => {
        // Soporte por si el backend devuelve el array limpio o dentro de un objeto paginado (.content)
        const publicacionesRaw = Array.isArray(data) ? data : (data.content || []);
        const listaLimitada = publicacionesRaw.slice(0, limitePublicaciones);
        
        setPublicaciones(listaLimitada);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando publicaciones generales:", err);
        setCargando(false);
      });
  }, [token]); // Si el token tarda en cargar, el useEffect se vuelve a disparar de forma segura

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
          // Contenedor en cuadricula para las tarjetas
          <div className="publicaciones-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {publicaciones.map((pub) => (
              // Mapeamos el array y le pasamos cada publicación al componente Card
              <PublicacionCard key={pub.idPublicacion} publicacion={pub} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginaHome;
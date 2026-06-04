import React, { useState, useEffect, useContext } from 'react';
import '../style/home.css';
import PublicacionCard from '../assets/cards/PublicacionesCard.jsx'; 
import BarraBusqueda from '../assets/barraBusqueda.jsx';
import { AuthContext } from '../context/AuthContext.jsx'; 

function PaginaHome() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const { token } = useContext(AuthContext); 

  useEffect(() => {
    const limitePublicaciones = 10; 
    
    fetch(`http://localhost:8888/api/proxy/publicacionesApi?limit=${limitePublicaciones}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
        const publicacionesRaw = Array.isArray(data) ? data : (data.content || []);
        const listaLimitada = publicacionesRaw.slice(0, limitePublicaciones);
        
        setPublicaciones(listaLimitada);
        setCargando(false);
      })
      .catch((err) => {
        console.error("Error cargando publicaciones generales:", err);
        setCargando(false);
      });
  }, [token]); 

  return (
    <div style={{ backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Navbar */}
      <BarraBusqueda />

      {/* Contenedor principal centrado estilo Facebook */}
      <div className="container mt-4 mi-pagina-contenedor" style={{ maxWidth: '680px', margin: '0 auto', paddingTop: '20px' }}>
        
        {/* LÓGICA DE RENDERIZADO DINÁMICO */}
        {cargando ? (
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#888', marginTop: '50px' }}>
            Cargando servicios disponibles...
          </p>
        ) : publicaciones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            <p style={{ color: '#777', margin: 0 }}>No hay publicaciones activas de momento. ¡Sé el primero en ofrecer un servicio!</p>
          </div>
        ) : (
          // 👇 AQUÍ ESTÁ LA MAGIA: Contenedor vertical (Feed)
          <div className="publicaciones-feed" style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '25px' // Espacio entre cada publicación
          }}>
            {publicaciones.map((pub) => (
              <div key={pub.idPublicacion} style={{ width: '100%' }}>
                <PublicacionCard publicacion={pub} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaginaHome;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ValoracionCard from '../assets/ValoracionCard'; // Ruta corregida según tu proyecto
import RespuestaValoracionCard from '../assets/RespuestaValoracionCard'; // Ajusta la ruta
import { listarReseniasPorUsuario } from '../servicios/reseniasService';
import { getRespuestasPorReseniaFront } from '../servicios/respuestasReseniasService';
import { AuthContext } from '../context/AuthContext';
import '../style/ValoracionPantalla.css'; // Asegúrate de tener este archivo CSS para los estilos

const ValoracionesPantalla = () => {
  const navigate = useNavigate();
  const { idUsuario } = useParams(); // Rescata el idUsuario de la URL
  const { usuario } = useContext(AuthContext); // Extraemos el usuario logueado

  // ESTADO: Controla qué reseñas tienen sus respuestas visibles (Ej: { 1: true, 2: false })
  const [respuestasExpandidas, setRespuestasExpandidas] = useState({});
  
  // ESTADO: Controla las respuestas cargadas por cada reseña y su estado de carga
  const [respuestasPorResenia, setRespuestasPorResenia] = useState({});
  const [cargandoRespuestas, setCargandoRespuestas] = useState({});

  // ESTADO: Guardamos las reseñas traídas de la API
  const [resenias, setResenias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // EFECTO: Llama a la API para obtener reseñas de este usuario
  useEffect(() => {
    const cargarValoraciones = async () => {
      try {
        setCargando(true);
        // Usamos listarReseniasPorUsuario porque filtra por backend usando el ID
        const data = await listarReseniasPorUsuario(idUsuario);
        setResenias(data);
      } catch (err) {
        setError("Ocurrió un error al cargar las valoraciones.");
      } finally {
        setCargando(false);
      }
    };

    if (idUsuario) {
      cargarValoraciones();
    }
  }, [idUsuario]);

  // LÓGICA DE ORDENAMIENTO (Del más viejo al más nuevo)
  const reseniasOrdenadas = [...resenias].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));

  // Función para alternar el despliegue
  const toggleRespuestas = async (idResenia) => {
    const estaExpandido = respuestasExpandidas[idResenia];

    // Si vamos a expandir y todavía no hemos cargado las respuestas, hacemos la petición HTTP
    if (!estaExpandido && !respuestasPorResenia[idResenia]) {
      try {
        setCargandoRespuestas((prev) => ({ ...prev, [idResenia]: true }));
        const data = await getRespuestasPorReseniaFront(idResenia);
        
        // En caso de que el backend devuelva un objeto en vez de un array, lo convertimos en array
        const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
        
        setRespuestasPorResenia((prev) => ({ ...prev, [idResenia]: dataArray }));
      } catch (err) {
        console.error("Error al cargar respuestas para la reseña", idResenia, err);
        setRespuestasPorResenia((prev) => ({ ...prev, [idResenia]: [] }));
      } finally {
        setCargandoRespuestas((prev) => ({ ...prev, [idResenia]: false }));
      }
    }

    setRespuestasExpandidas((prev) => ({
      ...prev,
      [idResenia]: !estaExpandido
    }));
  };

  // Función para manejar el clic en "Crear Reseña"
  const handleCrearResenia = () => {
    if (!usuario) {
      alert("Debe iniciar sesión o crear una cuenta para crear una reseña.");
      navigate('/iniciar-sesion');
      return;
    }
    navigate(`/crear-resenia/${idUsuario}`);
  };

  return (
    <div className="valoraciones-contenedor">
      <button className="btn-volver-flotante" onClick={() => navigate(-1)}>&#10094;</button>
      <div className="encabezado-valoraciones">
        <h1 className="titulo-pantalla-valoraciones">Todas las Reseñas</h1>
        <button className="btn-crear-resenia" onClick={handleCrearResenia}>Crear Reseña</button>
      </div>

      {cargando && <p>Cargando valoraciones...</p>}
      {error && <p className="error-mensaje">{error}</p>}
      {!cargando && !error && reseniasOrdenadas.length === 0 && <p>Este usuario no tiene valoraciones aún.</p>}

      <div className="lista-tarjetas-valoraciones">
        {reseniasOrdenadas.map((resenia) => {
          
          const estaExpandido = respuestasExpandidas[resenia.reseniaId];
          const isLoadingResp = cargandoRespuestas[resenia.reseniaId];
          const respuestasDeEstaResenia = respuestasPorResenia[resenia.reseniaId] || [];

          return (
            <div key={resenia.reseniaId} className="hilo-valoracion-contenedor">
              {/* Tarjeta Principal */}
              <ValoracionCard 
                autor={resenia.nombreAutor}
                foto={resenia.fotoUsuarioAutor}
                calificacion={resenia.calificacion}
                texto={resenia.textoResenia}
                fecha={resenia.fechaCreacion}
                usuarioReseniado={resenia.nombreUsuarioReseniado}
              />

              {/* Botón de despliegue (Siempre visible ahora para permitir buscar respuestas) */}
              <button 
                className="btn-desplegar-respuestas"
                onClick={() => toggleRespuestas(resenia.reseniaId)}
              >
                {estaExpandido ? `Ocultar respuestas` : `Ver respuestas`}
              </button>

              {/* Contenedor anidado de respuestas (Se muestra si está expandido) */}
              {estaExpandido && (
                <div className="respuestas-anidadas-contenedor">
                  {isLoadingResp ? (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginLeft: '10px' }}>Cargando respuestas...</p>
                  ) : respuestasDeEstaResenia.length > 0 ? (
                    respuestasDeEstaResenia.map((respuesta) => (
                      <RespuestaValoracionCard 
                        key={respuesta.idRespuestaResenia}
                        nombreDelAutor={respuesta.nombreDelAutor}
                        fotoAutor={respuesta.fotoAutor}
                        textoRespuestaResenia={respuesta.textoRespuestaResenia}
                        fechaCreacion={respuesta.fechaCreacion}
                      />
                    ))
                  ) : (
                    <p style={{ fontSize: '0.9rem', color: '#666', marginLeft: '10px' }}>No hay respuestas para esta reseña.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ValoracionesPantalla;
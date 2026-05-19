import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ValoracionCard from '../assets/ValoracionCard'; // Ruta corregida según tu proyecto
import RespuestaValoracionCard from '../assets/RespuestaValoracionCard'; // Ajusta la ruta
import { listarReseniasPorUsuario } from '../servicios/reseniasService';
import { getRespuestasPorReseniaFront, createRespuestaResenia } from '../servicios/respuestasReseniasService';
import { AuthContext } from '../context/AuthContext';
import '../style/ValoracionPantalla.css'; // Asegúrate de tener este archivo CSS para los estilos
import '../style/CajaComentario.css'; // Estilos para la caja de comentarios

const ValoracionesPantalla = () => {
  const navigate = useNavigate();
  const { idUsuario } = useParams(); // Rescata el idUsuario de la URL
  const { usuario, token } = useContext(AuthContext); // Extraemos el usuario logueado y el token

  // ESTADO: Controla qué reseñas tienen sus respuestas visibles (Ej: { 1: true, 2: false })
  const [respuestasExpandidas, setRespuestasExpandidas] = useState({});
  
  // ESTADOS para la caja de comentarios
  const [respondiendoResenia, setRespondiendoResenia] = useState({});
  const [textosRespuesta, setTextosRespuesta] = useState({});

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

  // Funciones para manejar la respuesta
  const handleResponderClic = (idResenia) => {
    if (!usuario) {
      alert("Debe iniciar sesión para responder a una reseña.");
      return;
    }
    setRespondiendoResenia((prev) => ({ ...prev, [idResenia]: true }));
  };

  const handleCancelarRespuesta = (idResenia) => {
    setRespondiendoResenia((prev) => ({ ...prev, [idResenia]: false }));
    setTextosRespuesta((prev) => ({ ...prev, [idResenia]: '' }));
  };

  const handleEnviarRespuesta = async (idResenia) => {
    const texto = textosRespuesta[idResenia];
    if (!texto || !texto.trim()) {
      alert("El comentario no puede estar vacío.");
      return;
    }

    try {
      const respuestaData = {
        idResenia: idResenia,
        idAutorRes: usuario.idUsuario,
        textoRespuestaResenia: texto.trim()
      };
      
      await createRespuestaResenia(respuestaData, token);
      alert("¡Respuesta enviada!");
      
      handleCancelarRespuesta(idResenia); // Cerramos y limpiamos la caja
      
      // Recargamos las respuestas para mostrar la nueva sin recargar la página entera
      const data = await getRespuestasPorReseniaFront(idResenia);
      const dataArray = Array.isArray(data) ? data : (data ? [data] : []);
      setRespuestasPorResenia((prev) => ({ ...prev, [idResenia]: dataArray }));
      setRespuestasExpandidas((prev) => ({ ...prev, [idResenia]: true })); // Aseguramos que se expanda para verla
    } catch (error) {
      alert("Ocurrió un error al enviar la respuesta.");
    }
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
          const estaRespondiendo = respondiendoResenia[resenia.reseniaId];

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

              {/* Contenedor de botones de acción */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* Botón de despliegue */}
                <button 
                  className="btn-desplegar-respuestas"
                  onClick={() => toggleRespuestas(resenia.reseniaId)}
                >
                  {estaExpandido ? `Ocultar respuestas` : `Ver respuestas`}
                </button>

                {/* Botón para abrir la caja de comentario (desaparece si la caja está abierta) */}
                {!estaRespondiendo && (
                  <button 
                    className="btn-responder-resenia"
                    onClick={() => handleResponderClic(resenia.reseniaId)}
                  >
                    Responder reseña
                  </button>
                )}
              </div>

              {/* Caja de comentario que aparece cuando el usuario hace clic en "Responder" */}
              {estaRespondiendo && (
                <div className="caja-comentario-card">
                  <textarea
                    className="caja-comentario-textarea"
                    placeholder="Escribe tu respuesta aquí..."
                    value={textosRespuesta[resenia.reseniaId] || ''}
                    onChange={(e) => setTextosRespuesta((prev) => ({ ...prev, [resenia.reseniaId]: e.target.value }))}
                  />
                  <div className="caja-comentario-acciones">
                    <button className="btn-cancelar-comentario" onClick={() => handleCancelarRespuesta(resenia.reseniaId)}>Cancelar</button>
                    <button className="btn-enviar-comentario" onClick={() => handleEnviarRespuesta(resenia.reseniaId)}>Enviar</button>
                  </div>
                </div>
              )}

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
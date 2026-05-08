import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ValoracionCard from '../assets/ValoracionCard'; // Ruta corregida según tu proyecto
import RespuestaValoracionCard from '../assets/RespuestaValoracionCard'; // Ajusta la ruta
import { listarReseniasPorUsuario } from '../servicios/reseniasService';
import '../style/ValoracionPantalla.css'; // Asegúrate de tener este archivo CSS para los estilos

const ValoracionesPantalla = () => {
  const navigate = useNavigate();
  const { idUsuario } = useParams(); // Rescata el idUsuario de la URL

  // ESTADO: Controla qué reseñas tienen sus respuestas visibles (Ej: { 1: true, 2: false })
  const [respuestasExpandidas, setRespuestasExpandidas] = useState({});
  
  // ESTADO: Guardamos las reseñas traídas de la API
  const [resenias, setResenias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const mockRespuestas = [
    { idRespuestaResenia: 2, idResenia: 1, nombreDelAutor: "Juan Gasfíter", fotoAutor: "", textoRespuestaResenia: "¡Gracias por la confianza!", fechaCreacion: "2026-05-07T19:30:00" },
    { idRespuestaResenia: 1, idResenia: 1, nombreDelAutor: "Soporte Plataforma", fotoAutor: "", textoRespuestaResenia: "Super weno tu comentario", fechaCreacion: "2026-05-07T19:20:00" },
    { idRespuestaResenia: 3, idResenia: 2, nombreDelAutor: "Juan Gasfíter", fotoAutor: "", textoRespuestaResenia: "Se hace lo que se puede, saludos.", fechaCreacion: "2026-05-08T11:00:00" }
  ];

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
  const respuestasOrdenadas = [...mockRespuestas].sort((a, b) => new Date(a.fechaCreacion) - new Date(b.fechaCreacion));

  // Función para alternar el despliegue
  const toggleRespuestas = (idResenia) => {
    setRespuestasExpandidas((prev) => ({
      ...prev,
      [idResenia]: !prev[idResenia]
    }));
  };

  return (
    <div className="valoraciones-contenedor">
      <button className="btn-volver-flotante" onClick={() => navigate(-1)}>&#10094;</button>
      <h1 className="titulo-pantalla-valoraciones">Todas las Reseñas</h1>

      {cargando && <p>Cargando valoraciones...</p>}
      {error && <p className="error-mensaje">{error}</p>}
      {!cargando && !error && reseniasOrdenadas.length === 0 && <p>Este usuario no tiene valoraciones aún.</p>}

      <div className="lista-tarjetas-valoraciones">
        {reseniasOrdenadas.map((resenia) => {
          
          // Filtramos las respuestas que pertenecen SÓLO a esta reseña
          const respuestasDeEstaResenia = respuestasOrdenadas.filter(
            (resp) => resp.idResenia === resenia.ReseniaId
          );

          const estaExpandido = respuestasExpandidas[resenia.ReseniaId];

          return (
            <div key={resenia.ReseniaId} className="hilo-valoracion-contenedor">
              {/* Tarjeta Principal */}
              <ValoracionCard 
                autor={resenia.nombreAutor}
                foto={resenia.fotoUsuarioAutor}
                calificacion={resenia.calificacion}
                texto={resenia.textoResenia}
                fecha={resenia.fechaCreacion}
                usuarioReseniado={resenia.nombreUsuarioReseniado}
              />

              {/* Botón de despliegue (Solo aparece si hay respuestas) */}
              {respuestasDeEstaResenia.length > 0 && (
                <button 
                  className="btn-desplegar-respuestas"
                  onClick={() => toggleRespuestas(resenia.ReseniaId)}
                >
                  {estaExpandido 
                    ? `Ocultar respuestas` 
                    : `Ver respuestas (${respuestasDeEstaResenia.length})`}
                </button>
              )}

              {/* Contenedor anidado de respuestas (Se muestra si está expandido) */}
              {estaExpandido && (
                <div className="respuestas-anidadas-contenedor">
                  {respuestasDeEstaResenia.map((respuesta) => (
                    <RespuestaValoracionCard 
                      key={respuesta.idRespuestaResenia}
                      nombreDelAutor={respuesta.nombreDelAutor}
                      fotoAutor={respuesta.fotoAutor}
                      textoRespuestaResenia={respuesta.textoRespuestaResenia}
                      fechaCreacion={respuesta.fechaCreacion}
                    />
                  ))}
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
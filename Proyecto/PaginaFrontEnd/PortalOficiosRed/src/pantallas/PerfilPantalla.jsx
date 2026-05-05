import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Importamos useParams y useNavigate
import { AuthContext } from '../context/AuthContext'; // Importamos el contexto de autenticación
import { getPerfilFrontByUsuarioId } from '../servicios/perfilesUsuarioService'; // Asegúrate de que la ruta sea correcta
import { listarReseniasPorUsuario } from '../servicios/reseniasService'; // Importamos el servicio de reseñas
import '../style/PerfilPantalla.css';
import ValoracionCard from '../assets/ValoracionCard'; // Importamos el componente de valoración

const PerfilPantalla = () => {
  const { idDelPerfil } = useParams(); // 2. Obtenemos el ID del perfil a visualizar desde la URL
  const navigate = useNavigate();
  const { usuario: usuarioLogueado } = useContext(AuthContext); // 3. Obtenemos el usuario que ha iniciado sesión

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reseñas, setReseñas] = useState([]); // Estado para guardar las reseñas

  useEffect(() => {
    const cargarDatos = async () => {
      if (!idDelPerfil) {
        setError("No se ha especificado un perfil para cargar.");
        setCargando(false);
        return;
      }
      try {
        setCargando(true);
        setError(null);

        // Cargamos el perfil y las reseñas en paralelo para mayor eficiencia
        const [datosPerfil, datosReseñas] = await Promise.all([
          getPerfilFrontByUsuarioId(idDelPerfil),
          listarReseniasPorUsuario(idDelPerfil)
        ]);

        if (!datosPerfil) {
          setError("No se encontró el perfil para este usuario.");
        } else {
          setPerfil(datosPerfil);
        }

        // El servicio devuelve un array vacío si no hay reseñas, lo cual es perfecto.
        setReseñas(datosReseñas);

      } catch (err) {
        setError("Ocurrió un error al intentar cargar los datos del perfil o las reseñas.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [idDelPerfil]); // 5. El efecto se ejecuta cada vez que el ID en la URL cambia

  // 6. Comprobamos si el perfil que se está viendo pertenece al usuario logueado.
  const esMiPerfil = usuarioLogueado && usuarioLogueado.idUsuario === parseInt(idDelPerfil);

  // Manejo de los distintos estados de la carga
  if (cargando) return <div className="estado-mensaje">Cargando perfil...</div>;
  if (error) return <div className="estado-mensaje error">{error}</div>;
  if (!perfil) return <div className="estado-mensaje">No se encontró el perfil.</div>;


  // Destructuramos TODOS los atributos del JSON como pediste
  const {
    idPerfilUsuario,
    idUsuario,
    correoElec,
    nombreApodo,
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    numeroTelef,
    foto,
    fotografiaBanner,
    descripcion,
    nombreRegion,
    nombreComuna,
    nombreOficio,
    nombreSexo,
    calificacion,
    fechaCreacion
  } = perfil;

  // Armamos el nombre completo (manejando si no hay segundo nombre/apellido)
  const nombreCompleto = `${primerNombre} ${segundoNombre || ''} ${primerApellido} ${segundoApellido || ''}`.trim();

  return (
    <div className="perfil-pantalla-contenedor">
      
      {/* 1. SECCIÓN BANNER */}
      <div className="perfil-banner">
        <img 
          src={fotografiaBanner || 'https://via.placeholder.com/1200x300?text=Banner'} 
          alt="Banner del usuario" 
        />
      </div>

      {/* 2. CABECERA (Foto, Nombres y Botones) */}
      <div className="perfil-cabecera">
        <div className="perfil-foto-wrapper">
          <img 
            src={foto || 'https://via.placeholder.com/150'} 
            alt={`Foto de ${nombreApodo}`} 
          />
        </div>
        
        <div className="perfil-nombres">
          <h1 className="apodo-texto">{nombreApodo}</h1>
          <p className="nombre-real-texto">{nombreCompleto}</p>
        </div>

        <div className="perfil-acciones">
          {/* 7. Mostramos el botón "Reportar" solo si NO es el perfil del usuario logueado */}
          {!esMiPerfil && (
            <button className="btn-maqueta btn-reportar">
               Reportar 🚨
            </button>
          )}
          {/* 8. Mostramos el botón "Configurar" solo si SÍ es el perfil del usuario logueado */}
          {esMiPerfil && (
            <button className="btn-maqueta btn-configurar" onClick={() => navigate('/perfil/modificar')}>
               Configurar ⚙️
            </button>
          )}
        </div>
      </div>

      {/* 3. CONTENIDO INFERIOR (Cajas de Info y Descripción) */}
      <div className="perfil-contenido-inferior">
        
        {/* Caja Izquierda: Info Gris Claro */}
        <div className="caja-info-basica">
          <div className="info-item">
            <span className="info-label">Oficio:</span>
            <span className="info-valor destacado">{nombreOficio}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Comuna:</span>
            <span className="info-valor">{nombreComuna}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Región:</span>
            <span className="info-valor">{nombreRegion}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Calificación:</span>
            <span className="info-valor estrellas">
              {/* Simulamos estrellas según la calificación */}
              {calificacion > 0 ? `⭐ ${calificacion}` : 'Sin calificación'}
            </span>
          </div>
        </div>

        {/* Caja Derecha: Descripción (Vertical) */}
        <div className="caja-descripcion">
          <h3>Descripción</h3>
          <div className="descripcion-texto">
            <p>{descripcion || 'Sin descripción disponible por el momento. Aquí irá el texto sobre la experiencia y habilidades del profesional.'}</p>
          </div>
        </div>

      </div>

      {/* 4. SECCIÓN VALORACIONES (Maqueta) */}
      <div className="perfil-seccion-valoraciones">
        <h3>Valoraciones y Reseñas</h3>
        <div className="lista-valoraciones">
          {reseñas.length > 0 ? (
            reseñas.map((reseña) => (
              <ValoracionCard
                key={reseña.reseniaId}
                autor={reseña.nombreAutor}
                foto={reseña.fotoUsuarioAutor}
                calificacion={reseña.calificacion}
                texto={reseña.textoResenia}
              />
            ))
          ) : (
            <p className="sin-reseñas-texto">Este usuario aún no tiene reseñas.</p>
          )}
        </div>

        {/* Mostramos el botón solo si hay reseñas */}
        {reseñas.length > 0 && (
            <div className="contenedor-boton-ver-mas">
                <button className="btn-ver-mas">Ver más reseñas</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PerfilPantalla;
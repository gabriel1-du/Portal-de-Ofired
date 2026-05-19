import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { getPerfilFrontByUsuarioId } from '../servicios/perfilesUsuarioService'; 
import { listarReseniasPorUsuario } from '../servicios/reseniasService'; 
// --- AÑADIDO: Importamos el servicio y el componente de la tarjeta ---
import { getPublicacionesByAutor } from '../servicios/publicacionesService';
import PublicacionCard from '../assets/PublicacionesCard'; 
import { crearChat } from '../servicios/chatService';
import { leerTodosLosParticipantesFront } from '../servicios/participantesChatService';
import '../style/PerfilPantalla.css';
import ValoracionCard from '../assets/ValoracionCard'; 

const PerfilPantalla = () => {
  const { idDelPerfil } = useParams(); 
  const navigate = useNavigate();
  const { usuario: usuarioLogueado, token } = useContext(AuthContext); 

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reseñas, setReseñas] = useState([]); 
  
  // --- AÑADIDO: Estado para guardar las publicaciones y evitar el error "is not defined" ---
  const [publicacionesDelUsuario, setPublicacionesDelUsuario] = useState([]); 
  const [iniciandoChat, setIniciandoChat] = useState(false);

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

        // --- AÑADIDO: Cargamos el perfil, las reseñas y las PUBLICACIONES en paralelo ---
        const [datosPerfil, datosReseñas, datosPublicaciones] = await Promise.all([
          getPerfilFrontByUsuarioId(idDelPerfil),
          listarReseniasPorUsuario(idDelPerfil),
          getPublicacionesByAutor(idDelPerfil) // Llamada a tu API de publicaciones
        ]);

        if (!datosPerfil) {
          setError("No se encontró el perfil para este usuario.");
        } else {
          setPerfil(datosPerfil);
        }

        setReseñas(datosReseñas);
        
        // --- AÑADIDO: Guardamos las publicaciones en el estado (si viene nulo, ponemos un array vacío) ---
        setPublicacionesDelUsuario(datosPublicaciones || []);

      } catch (err) {
        setError("Ocurrió un error al intentar cargar los datos del perfil, reseñas o publicaciones.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [idDelPerfil]); 

  const esMiPerfil = usuarioLogueado && usuarioLogueado.idUsuario === parseInt(idDelPerfil);

  // Lógica para enviar mensaje: Corrobora si existe el chat o lo crea
  const handleMensajeClick = async () => {
    if (!usuarioLogueado) {
      alert("Debes iniciar sesión para enviar un mensaje.");
      navigate('/iniciar-sesion');
      return;
    }
    try {
      setIniciandoChat(true);
      // 1. Obtener todos los participantes de chat para corroborar existencia
      const participantes = await leerTodosLosParticipantesFront(token);
      
      // 2. Extraer los chats donde tú estás y los chats donde la otra persona está
      const misChatsIds = participantes.filter(p => p.idUsuario === usuarioLogueado.idUsuario).map(p => p.idChat);
      const destChatsIds = participantes.filter(p => p.idUsuario === parseInt(idDelPerfil)).map(p => p.idChat);
      
      // 3. Buscar intersección (El chat que tienen en común)
      const chatComunId = misChatsIds.find(id => destChatsIds.includes(id));

      if (chatComunId) {
        // ¡Ya existe! Navegamos directo a ese chat
        navigate(`/chat/${chatComunId}`);
      } else {
        // No existe, creamos uno nuevo usando la estructura DTO
        const dto = { idUsuario_uno: usuarioLogueado.idUsuario, idUsuario_dos: parseInt(idDelPerfil) };
        const nuevoChat = await crearChat(dto, token);
        const nuevoChatId = nuevoChat.idChat || nuevoChat.id; // Nos aseguramos de sacar el ID correctamente
        navigate(`/chat/${nuevoChatId}`);
      }
    } catch (err) {
      console.error("Error al buscar o crear el chat:", err);
      alert("No se pudo iniciar el chat. Intenta más tarde.");
    } finally {
      setIniciandoChat(false);
    }
  };

  if (cargando) return <div className="estado-mensaje">Cargando perfil...</div>;
  if (error) return <div className="estado-mensaje error">{error}</div>;
  if (!perfil) return <div className="estado-mensaje">No se encontró el perfil.</div>;

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
          {!esMiPerfil && (
            <>
              {/* Icono / Botón de mensaje, estilizado levemente en línea para no romper tus CSS base */}
              <button className="btn-maqueta btn-mensaje" onClick={handleMensajeClick} disabled={iniciandoChat} style={{ marginRight: '10px', backgroundColor: '#03a9f4', color: 'white', borderColor: '#03a9f4' }}>
                {iniciandoChat ? 'Cargando...' : 'Mensaje 💬'}
              </button>
              <button className="btn-maqueta btn-reportar">
                 Reportar 🚨
              </button>
            </>
          )}
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
            <button 
              className="btn-ver-mas" 
              onClick={() => navigate(`/valoraciones/${idDelPerfil}`)}
            >
              Ver más reseñas
            </button>
          </div>
        )}
      </div>

      {/* --- INSERCIÓN SOLICITADA: MIS TRABAJOS --- */}
      <div className="mis-publicaciones-container">
        <h2 className="titulo-seccion">Mis Trabajos Publicados</h2>
        <div className="publicaciones-grid">
          {/* Usamos un condicional && por seguridad por si el array viene null o vacío */}
          {publicacionesDelUsuario && publicacionesDelUsuario.length > 0 ? (
            publicacionesDelUsuario.map(pub => (
              <PublicacionCard key={pub.idPublicacion || pub.id} publicacion={pub} />
            ))
          ) : (
            <p className="sin-reseñas-texto">Este profesional aún no ha publicado trabajos.</p>
          )}
        </div>
      </div>
      {/* --- FIN DE LA INSERCIÓN --- */}

    </div> 
  );
};

export default PerfilPantalla;
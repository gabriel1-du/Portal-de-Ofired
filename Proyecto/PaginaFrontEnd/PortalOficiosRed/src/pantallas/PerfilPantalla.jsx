import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { getPerfilFrontByUsuarioId } from '../servicios/ApiUsuarios/perfilesUsuarioService'; 
import { listarReseniasPorUsuario } from '../servicios/ApiPublicaciones/SeccionResenias/reseniasService'; 
// --- AÑADIDO: Importamos el servicio y el componente de la tarjeta ---
import { getPublicacionesByAutor } from '../servicios/ApiPublicaciones/publicacionesService';
import PublicacionCard from '../assets/cards/PublicacionesCard'; 
import { crearChat } from '../servicios/ApiUsuarios/SeccionChats/chatService';
import { leerTodosLosParticipantesFront } from '../servicios/ApiUsuarios/SeccionChats/participantesChatService';
import '../style/seccionPantallas/PerfilPantalla.css';
import ValoracionCard from '../assets/cards/ValoracionCard'; 

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
    valoracion,
    calificacion,
    usuario,
    fechaCreacion
  } = perfil;

  const nombreCompleto = `${primerNombre} ${segundoNombre || ''} ${primerApellido} ${segundoApellido || ''}`.trim();

  // Buscamos el valor donde sea que venga para evitar el "undefined"
  const ratingMostrar = valoracion ?? calificacion ?? usuario?.valoracion ?? usuario?.calificacion;

  return (
    //primera seccion de la pantalla, el banner, la foto, los nombres y los botones
    <div className="container my-5 perfil-pantalla-contenedor p-0">
      
      {/* --- CAJA PRINCIPAL DEL PERFIL (Fondo oscuro/gris para destacar) --- */}
      <div className="bg-light rounded-4 shadow-sm border overflow-hidden mb-5">
        
        {/* 1. SECCIÓN BANNER */}
        <div className="perfil-banner w-100 bg-light" style={{ height: '280px' }}>
        <img 
          src={fotografiaBanner || 'https://via.placeholder.com/1200x300?text=Banner'} 
          alt="Banner del usuario" 
          className="w-100 h-100 object-fit-cover"
        />
      </div>

      {/* 2. CABECERA (Foto, Nombres y Botones) */}
      <div className="d-flex flex-wrap align-items-end px-4 pb-3 border-bottom position-relative">
        <div className="perfil-foto-wrapper bg-white border border-5 border-white rounded-circle shadow-sm flex-shrink-0 overflow-hidden" style={{ width: '130px', height: '130px', marginTop: '-65px' }}>
          <img 
            src={foto || 'https://via.placeholder.com/150'} 
            alt={`Foto de ${nombreApodo}`} 
            className="w-100 h-100 object-fit-cover"
          />
        </div>
        
        <div className="ms-3 pb-1">
          <h1 className="fw-bolder text-dark m-0 fs-3">{nombreApodo}</h1>
          <p className="text-secondary m-0 mt-1">{nombreCompleto}</p>
        </div>

        <div className="ms-auto d-flex gap-2 pb-2 mt-3 mt-md-0 w-100 w-md-auto justify-content-end">
          {!esMiPerfil && (
            <>
              <button className="btn btn-info text-white rounded-pill fw-bold px-4 shadow-sm" onClick={handleMensajeClick} disabled={iniciandoChat} style={{ backgroundColor: '#03a9f4', borderColor: '#03a9f4' }}>
                {iniciandoChat ? 'Cargando...' : 'Mensaje 💬'}
              </button>
              <button className="btn btn-light text-danger border rounded-pill fw-bold px-4 shadow-sm">
                 Reportar 🚨
              </button>
            </>
          )}
          {esMiPerfil && (
            <button className="btn text-white rounded-pill fw-bold px-4 shadow-sm" onClick={() => navigate('/perfil/modificar')} style={{ backgroundColor: '#f3961c' }}>
               Configurar ⚙️
            </button>
          )}
        </div>
      </div>

      {/* 3. CONTENIDO INFERIOR (Cajas de Info y Descripción) */}
      <div className="row g-4 px-4 py-4 m-0">
        
        {/* Caja Izquierda: Info Blanca para contrastar */}
        <div className="col-12 col-md-5">
          <div className="card bg-white border shadow-sm rounded-4 p-4 h-100 d-flex flex-column gap-3">
            <div>
              <span className="text-uppercase text-secondary fw-semibold d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Oficio:</span>
              <span className="fw-bold fs-5" style={{ color: '#f3961c' }}>{nombreOficio}</span>
            </div>
            <div>
              <span className="text-uppercase text-secondary fw-semibold d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Comuna:</span>
              <span className="fw-medium fs-6 text-dark">{nombreComuna}</span>
            </div>
            <div>
              <span className="text-uppercase text-secondary fw-semibold d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Región:</span>
              <span className="fw-medium fs-6 text-dark">{nombreRegion}</span>
            </div>
            <div>
              <span className="text-uppercase text-secondary fw-semibold d-block" style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>Calificación:</span>
              <span className="fw-bold fs-5" style={{ color: '#f3961c' }}>
                {ratingMostrar !== undefined && ratingMostrar !== null && ratingMostrar > 0 ? `⭐ ${ratingMostrar}` : 'Sin calificación'}
              </span>
            </div>
          </div>
        </div>

        {/* Caja Derecha: Descripción (Vertical) */}
        <div className="col-12 col-md-7">
          <div className="card border shadow-sm rounded-4 p-4 h-100 bg-white">
            <h3 className="fs-5 text-dark fw-bold border-bottom pb-2 mb-3 d-inline-block" style={{ borderBottomColor: '#f3961c !important' }}>Descripción</h3>
            <div className="text-secondary" style={{ lineHeight: '1.6' }}>
              <p className="mb-0">{descripcion || 'Sin descripción disponible por el momento. Aquí irá el texto sobre la experiencia y habilidades del profesional.'}</p>
            </div>
          </div>
        </div>

      </div>
      
      </div>
      {/* --- FIN CAJA PRINCIPAL --- */}

      {/* 4. SECCIÓN VALORACIONES (Maqueta) */}
      <div className="perfil-seccion-valoraciones px-4 pb-4">
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
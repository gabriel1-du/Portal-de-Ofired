import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import { AuthContext } from '../context/AuthContext'; 
import { getPerfilFrontByUsuarioId } from '../servicios/ApiUsuarios/perfilesUsuarioService'; 
import { listarReseniasPorUsuario } from '../servicios/ApiPublicaciones/SeccionResenias/reseniasService'; 
import { getPublicacionesByAutor, deletePublicacion } from '../servicios/ApiPublicaciones/publicacionesService';
import PublicacionCard from '../assets/cards/PublicacionesCard'; 
import { crearChat } from '../servicios/ApiUsuarios/SeccionChats/chatService';
import { leerTodosLosParticipantesFront } from '../servicios/ApiUsuarios/SeccionChats/participantesChatService';
import '../style/seccionPantallas/PerfilPantalla.css';
import ValoracionCard from '../assets/cards/ValoracionCard'; 
import BarraBusqueda from '../assets/barraBusqueda.jsx';
import { getUsuarioById} from '../servicios/usuariosService.js';

// --- IMPORTAMOS EL COMPONENTE ---
import FormularioDenuncia from './Formularios/FormularioDenuncia/FormularioDenuncia'; 


const PerfilPantalla = () => {
  const { idDelPerfil } = useParams(); 
  const navigate = useNavigate();
  const { usuario: usuarioLogueado, token } = useContext(AuthContext); 

  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [reseñas, setReseñas] = useState([]); 
  
  const [publicacionesDelUsuario, setPublicacionesDelUsuario] = useState([]); 
  const [valoracionUsuario, setValoracionUsuario] = useState(null);
  const [iniciandoChat, setIniciandoChat] = useState(false);
  const [eliminandoPublicacionId, setEliminandoPublicacionId] = useState(null);
  const [cantidadPublicacionesVisibles, setCantidadPublicacionesVisibles] = useState(3);
 
  // --- ESTADO PARA CONTROLAR EL MODAL ---
  const [mostrarModalDenuncia, setMostrarModalDenuncia] = useState(false);

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

        const [datosPerfil, datosReseñas, datosPublicaciones, datosUsuario] = await Promise.all([
          getPerfilFrontByUsuarioId(idDelPerfil),
          listarReseniasPorUsuario(idDelPerfil),
          getPublicacionesByAutor(idDelPerfil),
          getUsuarioById(idDelPerfil)
        ]);

        if (!datosPerfil) {
          setError("No se encontró el perfil para este usuario.");
        } else {
          setPerfil(datosPerfil);
        }

        const publicacionesRaw = Array.isArray(datosPublicaciones)
          ? datosPublicaciones
          : (datosPublicaciones?.content || []);

        setReseñas(datosReseñas);
        setPublicacionesDelUsuario(publicacionesRaw);
        setValoracionUsuario(datosUsuario?.valoracion ?? null);
        setCantidadPublicacionesVisibles(3);

      } catch (err) {
        setError("Ocurrió un error al intentar cargar los datos del perfil, reseñas o publicaciones.");
        console.error(err);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [idDelPerfil]); 

  const idUsuarioLogueado = Number(usuarioLogueado?.idUsuario ?? usuarioLogueado?.id_usuario ?? usuarioLogueado?.userId ?? usuarioLogueado?.id);
  const esMiPerfil = usuarioLogueado && idUsuarioLogueado === parseInt(idDelPerfil);

  const handleEliminarPublicacion = async (publicacion) => {
    const idPublicacion = publicacion?.idPublicacion || publicacion?.id;
    const idAutorPublicacion = Number(publicacion?.idAutor);

    if (!usuarioLogueado || !token) {
      alert('Debes iniciar sesión para eliminar una publicación.');
      navigate('/iniciar-sesion');
      return;
    }

    if (idAutorPublicacion !== idUsuarioLogueado) {
      alert('No tienes permisos para eliminar esta publicación.');
      return;
    }

    const confirmar = window.confirm('¿Deseas eliminar esta publicación?');
    if (!confirmar) return;

    try {
      setEliminandoPublicacionId(idPublicacion);
      await deletePublicacion(idPublicacion, token);
      setPublicacionesDelUsuario((prev) => prev.filter((pub) => (pub.idPublicacion || pub.id) !== idPublicacion));
      alert('Publicación eliminada exitosamente.');
    } catch (err) {
      console.error('Error al eliminar la publicación:', err);
      alert(err.message || 'No se pudo eliminar la publicación.');
    } finally {
      setEliminandoPublicacionId(null);
    }
  };

  const handleMensajeClick = async () => {
    if (!usuarioLogueado) {
      alert("Debes iniciar sesión para enviar un mensaje.");
      navigate('/iniciar-sesion');
      return;
    }
    try {
      setIniciandoChat(true);
      const participantes = await leerTodosLosParticipantesFront(token);
      
      const misChatsIds = participantes.filter(p => p.idUsuario === usuarioLogueado.idUsuario).map(p => p.idChat);
      const destChatsIds = participantes.filter(p => p.idUsuario === parseInt(idDelPerfil)).map(p => p.idChat);
      
      const chatComunId = misChatsIds.find(id => destChatsIds.includes(id));

      if (chatComunId) {
        navigate(`/chat/${chatComunId}`);
      } else {
        const dto = { idUsuario_uno: usuarioLogueado.idUsuario, idUsuario_dos: parseInt(idDelPerfil) };
        const nuevoChat = await crearChat(dto, token);
        const nuevoChatId = nuevoChat.idChat || nuevoChat.id; 
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
    primerNombre,
    segundoNombre,
    primerApellido,
    segundoApellido,
    nombreApodo,
    fotografiaBanner,
    foto,
    nombreOficio,
    nombreComuna,
    nombreRegion,
    descripcion,
    valoracion,
    calificacion,

  } = perfil;

  const nombreCompleto = `${primerNombre} ${segundoNombre || ''} ${primerApellido} ${segundoApellido || ''}`.trim();
  const ratingMostrar = valoracionUsuario ?? valoracion ?? calificacion ?? usuario?.valoracion ?? usuario?.calificacion;
  const publicacionesVisibles = publicacionesDelUsuario.slice(0, cantidadPublicacionesVisibles);
  const hayMasPublicaciones = publicacionesDelUsuario.length > cantidadPublicacionesVisibles;

  return (
    <>
      <BarraBusqueda />
      
      <div className="container my-5 perfil-pantalla-contenedor p-0">
        <div className="bg-light rounded-4 shadow-sm border overflow-hidden mb-5">
          
          <div className="perfil-banner w-100 bg-light" style={{ height: '280px' }}>
            <img 
              src={fotografiaBanner || 'https://via.placeholder.com/1200x300?text=Banner'} 
              alt="Banner del usuario" 
              className="w-100 h-100 object-fit-cover"
            />
          </div>

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
                  
                  {/* --- CORREGIDO Y SEGURO --- */}
                  <button 
                    className="btn btn-light text-danger border rounded-pill fw-bold px-4 shadow-sm"
                    onClick={() => setMostrarModalDenuncia(true)}
                  >
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

          <div className="row g-4 px-4 py-4 m-0">
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

            <div className="col-12 col-md-7">
              <div className="card border shadow-sm rounded-4 p-4 h-100 bg-white">
                <h3 className="fs-5 text-dark fw-bold border-bottom pb-2 mb-3 d-inline-block" style={{ borderBottomColor: '#f3961c !important' }}>Descripción</h3>
                <div className="text-secondary" style={{ lineHeight: '1.6' }}>
                  <p className="mb-0">{descripcion || 'Sin descripción disponible por el momento.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-4 shadow-sm border overflow-hidden mb-5" style={{ backgroundColor: '#2c3e50' }}>
          <div className="px-4 py-4 m-0">
            <h3 className="fs-5 text-white fw-bold border-bottom pb-3 mb-4" style={{ borderColor: '#34495e !important' }}>Valoraciones y Reseñas</h3>
            <div className="d-flex flex-column gap-3">
              {reseñas.length > 0 ? (
                reseñas.slice(0, 3).map((reseña) => (
                  <ValoracionCard
                    key={reseña.reseniaId}
                    autor={reseña.nombreAutor}
                    foto={reseña.fotoUsuarioAutor}
                    calificacion={reseña.calificacion}
                    texto={reseña.textoResenia}
                  />
                ))
              ) : (
                <p className="text-center fst-italic py-3 mb-0" style={{ color: '#bdc3c7' }}>Este usuario aún no tiene reseñas.</p>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-4 mb-5">
          <button 
            className="btn text-white rounded-pill px-4 py-2 fw-bold shadow-sm" 
            onClick={() => navigate(`/valoraciones/${idDelPerfil}`)}
            style={{ backgroundColor: '#f3961c' }}
          >
            Ver más reseñas
          </button>
        </div>

        <div className="mis-publicaciones-container">
          <h2 className="titulo-seccion">Mis Trabajos Publicados</h2>
          {publicacionesDelUsuario && publicacionesDelUsuario.length > 0 ? (
            <div className="publicaciones-feed" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '25px', maxWidth: '680px', margin: '0 auto' }}>
              {publicacionesVisibles.map((pub) => {
                const idAutorPublicacion = Number(pub.idAutor);
                const idPublicacion = pub.idPublicacion || pub.id;
                const esAutorDeLaPublicacion = usuarioLogueado && idAutorPublicacion === idUsuarioLogueado;

                return (
                  <div key={idPublicacion} style={{ width: '100%' }}>
                    <PublicacionCard
                      publicacion={pub}
                      mostrarBotonEliminar={esAutorDeLaPublicacion}
                      eliminando={eliminandoPublicacionId === idPublicacion}
                      onEliminar={handleEliminarPublicacion}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="sin-reseñas-texto">Este profesional aún no ha publicado trabajos.</p>
          )}

          {hayMasPublicaciones && (
            <div className="text-center mt-4">
              <button
                className="btn btn-outline-primary rounded-pill px-4 py-2 fw-bold shadow-sm"
                onClick={() => setCantidadPublicacionesVisibles((prev) => prev + 3)}
              >
                Ver más publicaciones
              </button>
            </div>
          )}
        </div>
      </div> 

      {/* --- EL MODAL QUEDA EN ESPERA --- */}
      <FormularioDenuncia
        isOpen={mostrarModalDenuncia}
        onClose={() => setMostrarModalDenuncia(false)}
        idUsuarioDenunciado={parseInt(idDelPerfil)}
        idUsuarioDenunciante={usuarioLogueado?.idUsuario}
        token={token}
      />
    </>
  );
};

export default PerfilPantalla;
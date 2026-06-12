import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import { getPublicacionById } from '../servicios/ApiPublicaciones/publicacionesService';
import { obtenerComentarios, crearComentario } from '../servicios/comentariosService';
import { getFotosPorPublicacion } from '../servicios/ApiPublicaciones/fotosPubli';
import '../style/publicaciones/DetallePublicacion.css';

const DetallePublicacionPantalla = () => {
    const { idPublicacion } = useParams(); 
    const [publicacion, setPublicacion] = useState(null);
    const [fotos, setFotos] = useState([]);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [cargandoPublicacion, setCargandoPublicacion] = useState(true);
    const [fotoActiva, setFotoActiva] = useState(0); // Controla qué foto se ve en el carrusel

    const { token, usuario: user } = useContext(AuthContext);
    const idUsuarioActual = user?.idUsuario || user?.id_usuario || user?.userId || user?.id || 1; 

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoPublicacion(true);
            
            try {
                // Obtenemos la publicación
                const pubData = await getPublicacionById(idPublicacion);
                setPublicacion(pubData);

                // Obtenemos el arreglo de fotos asociado a esta publicación
                const fotosData = await getFotosPorPublicacion(idPublicacion);
                setFotos(fotosData || []);
            } catch (error) {
                console.error("Error cargando publicación");
            }

            // Obtenemos los comentarios con nuestro nuevo SERVICIO
            const dataComentarios = await obtenerComentarios(idPublicacion, token);
            setComentarios(dataComentarios);
            
            setCargandoPublicacion(false);
        };

        cargarDatos();
    }, [idPublicacion, token]); 

    const handleEnviarComentario = async (e) => {
    const handleEnviarComentario = async (e) => {
        e.preventDefault(); 
        if (!nuevoComentario.trim()) return;

        const comentarioPayload = {
            idPublicacion: parseInt(idPublicacion),
            idUsuario: idUsuarioActual,
            contenido: nuevoComentario
        };

        try {
            const nuevoComit = await crearComentario(comentarioPayload, token);
            // 👇 AQUÍ ESTÁ LA MAGIA: Toma tu nombre real de la sesión de inmediato
            const comentarioParaMostrar = {
                ...nuevoComit,
                usuario: {
                    pNombre: user?.primerNombre || user?.p_nombre || user?.pNombre || "Yo",
                    pApellido: user?.primerApellido || user?.p_apellido || user?.pApellido || ""
                }
            };
            setComentarios([...comentarios, comentarioParaMostrar]); 
        try {
            const nuevoComit = await crearComentario(comentarioPayload, token);
            // 👇 AQUÍ ESTÁ LA MAGIA: Toma tu nombre real de la sesión de inmediato
            const comentarioParaMostrar = {
                ...nuevoComit,
                usuario: {
                    pNombre: user?.primerNombre || user?.p_nombre || user?.pNombre || "Yo",
                    pApellido: user?.primerApellido || user?.p_apellido || user?.pApellido || ""
                }
            };
            setComentarios([...comentarios, comentarioParaMostrar]); 
            setNuevoComentario(""); 
        } catch (err) {
            console.error("Error al publicar:", err);
        }
    };

    // Funciones manuales para el carrusel en React
    const handlePrevFoto = () => {
        // Si estamos en la primera (0), vamos a la última. Si no, restamos 1.
        setFotoActiva((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
    };

    const handleNextFoto = () => {
        // Si estamos en la última, volvemos a la primera (0). Si no, sumamos 1.
        setFotoActiva((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
    };

    if (cargandoPublicacion) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666' }}>Cargando información del servicio...</div>;
    if (!publicacion) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#dc3545', fontWeight: 'bold' }}>No se encontró la publicación solicitada.</div>;
    if (cargandoPublicacion) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666' }}>Cargando información del servicio...</div>;
    if (!publicacion) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#dc3545', fontWeight: 'bold' }}>No se encontró la publicación solicitada.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            
            {/* SECCIÓN PRINCIPAL: Carrusel de Fotos y Detalles */}
            <div className="shadow-sm border rounded-4 overflow-hidden mb-5 bg-white">
                
                {/* Contenedor del Carrusel de Bootstrap */}
                <div className="position-relative">
                    {fotos.length > 0 ? (
                        <div id="carruselPublicacion" className="carousel slide">
                            <div className="carousel-inner">
                                {fotos.map((foto, index) => (
                                    <div key={foto.idFotoPubli || index} className={`carousel-item ${index === fotoActiva ? 'active' : ''}`}>
                                        <img src={foto.urlFoto} className="d-block w-100 detalle-pub-img" alt={`Foto ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                            {/* Mostramos los controles del carrusel solo si hay más de 1 foto */}
                            {fotos.length > 1 && (
                                <>
                                    <button className="carousel-control-prev" type="button" onClick={handlePrevFoto}>
                                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Anterior</span>
                                    </button>
                                    <button className="carousel-control-next" type="button" onClick={handleNextFoto}>
                                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                        <span className="visually-hidden">Siguiente</span>
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        /* Placeholder si no hay fotos en el arreglo */
                        <img src="https://via.placeholder.com/1200x500?text=Sin+Fotos+Disponibles" className="d-block w-100 detalle-pub-img" alt="Placeholder" />
                    )}
                    
                    {/* Etiqueta de Precio Flotante (Opcional) */}
                    {publicacion.precioServicio && (
                        <span className="badge bg-success position-absolute top-0 end-0 m-3 fs-5 shadow-sm">
                            ${publicacion.precioServicio}
                        </span>
                    )}

                    {/* Botones explícitos debajo de la imagen */}
                    {fotos.length > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', padding: '15px 0', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
                            <button 
                                type="button"
                                onClick={handlePrevFoto}
                                style={{ background: '#f3961c', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '18px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                &#10094;
                            </button>
                            <span style={{ fontWeight: 'bold', color: '#495057', fontSize: '1.1rem' }}>
                                {fotoActiva + 1} de {fotos.length}
                            </span>
                            <button 
                                type="button"
                                onClick={handleNextFoto}
                                style={{ background: '#f3961c', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', fontSize: '18px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                            >
                                &#10095;
                            </button>
                        </div>
                    )}
                </div>

                {/* Información de la Publicación */}
                <div className="p-4 p-md-5">
                    <h1 className="fw-bolder text-dark mb-2">{publicacion.tituloPublicacion || "Servicio sin título"}</h1>
                    <p className="text-muted fs-5 mb-4">
                        <i className="fas fa-map-marker-alt me-2 text-danger"></i> 
                        {publicacion.nombreRegion}, {publicacion.nombreComuna}
                    </p>
                    
                    <h4 className="fw-bold mb-3 border-bottom pb-2">Descripción del Servicio</h4>
                    <p className="fs-5 text-secondary" style={{ lineHeight: '1.7', whiteSpace: 'pre-line' }}>
                        {publicacion.descripcionPublicacion}
                    </p>

                    <div className="d-flex align-items-center mt-5 pt-3 border-top">
                        <div className="fs-5 fw-semibold text-danger">
                            <span role="img" aria-label="like" className="me-2 fs-4">❤️</span> 
                            {publicacion.cantidadLikes || 0} Me gusta
                        </div>
                    </div>
                </div>
            </div>

            {/* SECCIÓN DE COMENTARIOS */}
            <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e0e0e0', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ borderBottom: '2px solid #f0f2f5', paddingBottom: '15px', marginBottom: '25px', color: '#1c1e21', fontSize: '1.4rem' }}>
                    Preguntas y Comentarios <span style={{ color: '#65676B', fontSize: '1.1rem', fontWeight: 'normal' }}>({comentarios.length})</span>
                </h3>

                <form onSubmit={handleEnviarComentario} style={{ display: 'flex', gap: '15px', marginBottom: '35px', alignItems: 'flex-start' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '1.1rem' }}>
                        TÚ
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea 
                            rows="2"
                            placeholder="Escribe una pregunta al técnico..." 
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ccd0d5', resize: 'vertical', fontSize: '16px', backgroundColor: '#f5f6f7' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* 👇 AQUÍ CAMBIAMOS EL TEXTO A "Comentar" */}
                            <button type="submit" disabled={!nuevoComentario.trim()} style={{ padding: '10px 28px', backgroundColor: nuevoComentario.trim() ? '#1877f2' : '#e4e6eb', color: nuevoComentario.trim() ? 'white' : '#bcc0c4', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: nuevoComentario.trim() ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                                Comentar
                            </button>
                        </div>
                    </div>
                <form onSubmit={handleEnviarComentario} style={{ display: 'flex', gap: '15px', marginBottom: '35px', alignItems: 'flex-start' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#007bff', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '1.1rem' }}>
                        TÚ
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <textarea 
                            rows="2"
                            placeholder="Escribe una pregunta al técnico..." 
                            value={nuevoComentario}
                            onChange={(e) => setNuevoComentario(e.target.value)}
                            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ccd0d5', resize: 'vertical', fontSize: '16px', backgroundColor: '#f5f6f7' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            {/* 👇 AQUÍ CAMBIAMOS EL TEXTO A "Comentar" */}
                            <button type="submit" disabled={!nuevoComentario.trim()} style={{ padding: '10px 28px', backgroundColor: nuevoComentario.trim() ? '#1877f2' : '#e4e6eb', color: nuevoComentario.trim() ? 'white' : '#bcc0c4', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: nuevoComentario.trim() ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                                Comentar
                            </button>
                        </div>
                    </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {comentarios.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#65676b', backgroundColor: '#f0f2f5', borderRadius: '8px', fontSize: '1.1rem' }}>
                            Aún no hay comentarios. ¡Sé el primero en hacer una consulta!
                        </div>
                        <div style={{ textAlign: 'center', padding: '30px', color: '#65676b', backgroundColor: '#f0f2f5', borderRadius: '8px', fontSize: '1.1rem' }}>
                            Aún no hay comentarios. ¡Sé el primero en hacer una consulta!
                        </div>
                    ) : (
                        comentarios.map((com, index) => {
                            const idReal = com.usuario?.idUsuario || com.idUsuario || 'X';
                            let nombreMostrar = com.usuario?.pNombre || `Usuario #${idReal}`;
                            let apellidoMostrar = com.usuario?.pApellido || "";

                        // Damos un formato legible a la fecha (ej: 4 de junio de 2026, 17:40)
                        const fechaFormateada = com.fechaComentario 
                            ? new Date(com.fechaComentario).toLocaleDateString('es-CL', {
                                year: 'numeric', month: 'long', day: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                              })
                            : "Hace un momento";

                            return (
                                <div key={com.idComentario || index} style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e4e6eb', color: '#1c1e21', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '1.1rem' }}>
                                        {nombreMostrar.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ backgroundColor: '#f0f2f5', padding: '14px 18px', borderRadius: '18px', width: 'fit-content', maxWidth: '85%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '6px' }}>
                                        <span style={{ fontWeight: '700', fontSize: '15px', color: '#1c1e21', textTransform: 'capitalize' }}>
                                            {nombreMostrar} {apellidoMostrar}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#65676b', fontWeight: 'normal' }}>
                                            {fechaFormateada}
                                        </span>
                                        </div>
                                        <div style={{ fontSize: '16px', color: '#1c1e21', lineHeight: '1.5' }}>
                                            {com.contenido}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetallePublicacionPantalla
export default DetallePublicacionPantalla
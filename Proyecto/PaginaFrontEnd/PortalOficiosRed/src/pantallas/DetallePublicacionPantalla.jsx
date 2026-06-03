import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
// 👇 AQUÍ ESTÁ LA RUTA CORREGIDA DIRECTO A LA CARPETA CARDS
import PublicacionCard from '../assets/cards/PublicacionesCard'; 
import { AuthContext } from '../context/AuthContext'; 
import { obtenerComentarios, crearComentario } from '../servicios/comentariosService';

const DetallePublicacionPantalla = () => {
    const { idPublicacion } = useParams(); 
    const [publicacion, setPublicacion] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [cargandoPublicacion, setCargandoPublicacion] = useState(true);

    const { token, usuario: user } = useContext(AuthContext);
    const idUsuarioActual = user?.idUsuario || user?.id_usuario || user?.userId || user?.id || 1; 

    useEffect(() => {
        const cargarDatos = async () => {
            setCargandoPublicacion(true);
            
            try {
                // Obtenemos la publicación
                const resPub = await fetch(`${import.meta.env.VITE_PUBLICACIONES_API_URL}/${idPublicacion}`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (resPub.ok) {
                    setPublicacion(await resPub.json());
                }
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
        e.preventDefault(); 
        if (!nuevoComentario.trim()) return;

        const comentarioPayload = {
            idPublicacion: parseInt(idPublicacion),
            idUsuario: idUsuarioActual,
            contenido: nuevoComentario
        };

        try {
            const nuevoComit = await crearComentario(comentarioPayload, token);
            const comentarioParaMostrar = {
                ...nuevoComit,
                usuario: {
                    pNombre: user?.p_nombre || user?.pNombre || "Yo",
                    pApellido: user?.p_apellido || user?.pApellido || ""
                }
            };
            setComentarios([...comentarios, comentarioParaMostrar]); 
            setNuevoComentario(""); 
        } catch (err) {
            console.error("Error al publicar:", err);
        }
    };

    if (cargandoPublicacion) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666' }}>Cargando información del servicio...</div>;
    if (!publicacion) return <div style={{ textAlign: 'center', marginTop: '50px', color: '#dc3545', fontWeight: 'bold' }}>No se encontró la publicación solicitada.</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}>
            
            {/* SECCIÓN PRINCIPAL: Tarjeta Gigante y Estable */}
            <div style={{ marginBottom: '50px', backgroundColor: '#fff', width: '100%' }}>
                <PublicacionCard publicacion={publicacion} />
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
                            <button type="submit" disabled={!nuevoComentario.trim()} style={{ padding: '10px 28px', backgroundColor: nuevoComentario.trim() ? '#1877f2' : '#e4e6eb', color: nuevoComentario.trim() ? 'white' : '#bcc0c4', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '15px', cursor: nuevoComentario.trim() ? 'pointer' : 'not-allowed', transition: 'background-color 0.2s' }}>
                                Publicar
                            </button>
                        </div>
                    </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {comentarios.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#65676b', backgroundColor: '#f0f2f5', borderRadius: '8px', fontSize: '1.1rem' }}>
                            Aún no hay comentarios. ¡Sé el primero en hacer una consulta!
                        </div>
                    ) : (
                        comentarios.map((com, index) => {
                            const idReal = com.usuario?.idUsuario || com.idUsuario || 'X';
                            // Intentamos mostrar el nombre, si no, mostramos Usuario y el ID
                            let nombreMostrar = com.usuario?.pNombre || `Usuario #${idReal}`;
                            let apellidoMostrar = com.usuario?.pApellido || "";

                            return (
                                <div key={com.idComentario || index} style={{ display: 'flex', gap: '15px' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: '#e4e6eb', color: '#1c1e21', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0, fontSize: '1.1rem' }}>
                                        {nombreMostrar.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ backgroundColor: '#f0f2f5', padding: '14px 18px', borderRadius: '18px', width: 'fit-content', maxWidth: '85%' }}>
                                        <div style={{ fontWeight: '700', fontSize: '15px', color: '#1c1e21', marginBottom: '6px', textTransform: 'capitalize' }}>
                                            {nombreMostrar} {apellidoMostrar}
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

export default DetallePublicacionPantalla;
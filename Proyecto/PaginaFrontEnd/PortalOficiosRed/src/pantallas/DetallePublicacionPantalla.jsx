import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import PublicacionCard from '../assets/cards/PublicacionesCard'; 
import { AuthContext } from '../context/AuthContext'; 

const DetallePublicacionPantalla = () => {
    const { idPublicacion } = useParams(); 
    const [publicacion, setPublicacion] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [cargandoPublicacion, setCargandoPublicacion] = useState(true);

    const { token, user } = useContext(AuthContext); 
    const idUsuarioActual = user?.idUsuario || 1; 

    useEffect(() => {
        setCargandoPublicacion(true);

        // 1. Traer la publicación (Funciona Correctamente)
        fetch(`${import.meta.env.VITE_PUBLICACIONES_API_URL}/${idPublicacion}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("No se pudo obtener la publicación");
                return res.json();
            })
            .then(data => {
                setPublicacion(data);
                setCargandoPublicacion(false);
            })
            .catch(err => {
                console.error("Error cargando detalle de publicación:", err);
                setCargandoPublicacion(false);
            });

        // 2. Traer comentarios - Ruta Sanitizada
        const urlGetComentarios = `http://localhost:8888/api/proxy/comentariosApi/idPublicacion=${idPublicacion}`;
        console.log("Intentando GET comentarios a:", urlGetComentarios);

        fetch(urlGetComentarios, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    console.warn(`Respuesta GET comentarios no OK (Status: ${res.status})`);
                    return [];
                }
                return res.json();
            })
            .then(data => setComentarios(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("Error crítico cargando comentarios:", err);
                setComentarios([]); 
            });
    }, [idPublicacion, token]); 

    const handleEnviarComentario = (e) => {
        e.preventDefault();
        if (!nuevoComentario.trim()) return;

        const comentarioPayload = {
            idPublicacion: parseInt(idPublicacion),
            idUsuario: idUsuarioActual,
            contenido: nuevoComentario
        };

        // 3. Guardar comentario - Ruta Sanitizada
        const urlPostComentario = `http://localhost:8888/api/proxy/comentariosApi`;
        console.log("Payload que se va al backend:", comentarioPayload);
        fetch(urlPostComentario, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(comentarioPayload)
        })
        .then(res => {
            if (!res.ok) throw new Error(`Payload que se va al backend: ${JSON.stringify(comentarioPayload)}`);
            return res.json();
        })
        .then(nuevoComit => {
            setComentarios([...comentarios, nuevoComit]); 
            setNuevoComentario(""); 
        })
        .catch(err => console.error("Error al guardar comentario:", err));
    };

    if (cargandoPublicacion) {
        return <p style={{ textAlign: 'center', marginTop: '40px', fontStyle: 'italic' }}>Cargando detalles de la publicación...</p>;
    }

    if (!publicacion) {
        return <p style={{ textAlign: 'center', marginTop: '40px', color: 'red' }}>No se encontró la publicación solicitada.</p>;
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <PublicacionCard publicacion={publicacion} />

            <hr style={{ margin: '30px 0', borderColor: '#ccc' }} />

            <div className="comentarios-section">
                <h3>Comentarios ({comentarios.length})</h3>

                <form onSubmit={handleEnviarComentario} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <input 
                        type="text" 
                        placeholder="Escribe un comentario o pregunta sobre el servicio..." 
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                        style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Comentar
                    </button>
                </form>

                <div className="comentarios-lista" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {comentarios.length === 0 ? (
                        <p style={{ color: '#777', fontStyle: 'italic' }}>No hay comentarios aún. ¡Sé el primero en preguntar!</p>
                    ) : (
                        comentarios.map((com, index) => (
                            <div key={com.idComentario || index} style={{ backgroundColor: '#f9f9f9', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #007bff' }}>
                                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#555' }}>
                                    <strong>Usuario #{com.idUsuario}</strong>
                                </p>
                                <p style={{ margin: 0, color: '#333' }}>{com.contenido}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetallePublicacionPantalla;
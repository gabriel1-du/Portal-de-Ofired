import { getUsuarioById } from './usuariosService';

const URL_BASE = "http://localhost:8888/api/proxy/comentariosApi";

export const obtenerComentarios = async (idPublicacion, token) => {
    try {
        const res = await fetch(`${URL_BASE}/publicacion/${idPublicacion}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });
        if (!res.ok) return [];
        const data = await res.json();
        
        const comentariosBrutos = Array.isArray(data) ? data : [];

        const comentariosConNombres = await Promise.all(
            comentariosBrutos.map(async (com) => {
                try {
                    const infoUsuario = await getUsuarioById(com.idUsuario);
                    
                    return {
                        ...com,
                        usuario: {
                            // 👇 AQUÍ PUSIMOS LAS VARIABLES DE TU GUÍA
                            pNombre: infoUsuario.p_nombre || infoUsuario.pNombre || infoUsuario.nombreUsuario || "Usuario",
                            pApellido: infoUsuario.p_apellido || infoUsuario.pApellido || ""
                        }
                    };
                } catch (error) {
                    console.warn(`No se pudo cargar el nombre del usuario ${com.idUsuario}`);
                    return com; 
                }
            })
        );
        
        return comentariosConNombres;
    } catch (error) {
        console.error("Error obteniendo comentarios:", error);
        return [];
    }
};

export const crearComentario = async (payload, token) => {
    const res = await fetch(URL_BASE, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Error al guardar comentario");
    return await res.json();
};
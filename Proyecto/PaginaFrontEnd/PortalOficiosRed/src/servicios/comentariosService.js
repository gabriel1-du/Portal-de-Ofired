import { getUsuarioById } from './usuariosService';

const URL_BASE = import.meta.env.VITE_COMENTARIOS_API_URL;

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
                    const idParaBuscar = com.idUsuario || com.id_usuario || com.usuarioId; 
                    
                    if (!idParaBuscar) return com;

                    const infoUsuario = await getUsuarioById(idParaBuscar);
                    
                    return {
                        ...com,
                        usuario: {
                            // 👇 AQUÍ ESTÁ LA MAGIA: Conectamos con lo que dice tu consola
                            pNombre: infoUsuario?.primerNombre || "Usuario",
                            pApellido: infoUsuario?.primerApellido || ""
                        }
                    };
                } catch (error) {
                    console.warn(`No se pudo cargar el nombre del usuario`, error);
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
const API_URL_FOTOS = import.meta.env.VITE_FOTOS_PUBLI_API_URL;

// Función para obtener las fotos de una publicación
export const getFotosPorPublicacion = async (idPublicacion) => {
    try {
        const response = await fetch(`${API_URL_FOTOS}/publicacion/${idPublicacion}`);
        if (!response.ok) {
            throw new Error(`Error al obtener fotos para la publicación ${idPublicacion}`);
        }
        const data = await response.json();
        console.log(`Cantidad de imágenes encontradas para la publicación ${idPublicacion}: ${data.length}`);
        return data;
    } catch (error) {
        console.error("Error en getFotosPorPublicacion:", error);
        return []; // Retornamos array vacío para no romper la UI en caso de error
    }
};

// Función para agregar una nueva foto (MULTIPART)
export const agregarFotoPublicacion = async (idPublicacion, archivoFoto, token) => {
    try {
        const formData = new FormData();
        
        // 1. Agregamos el DTO como un Blob JSON
        const datosDTO = { idPublicacion: parseInt(idPublicacion) };
        formData.append('datos', new Blob([JSON.stringify(datosDTO)], { type: 'application/json' }));
        
        // 2. Agregamos el archivo físico
        if (archivoFoto) {
            formData.append('foto', archivoFoto);
        }

        const response = await fetch(`${API_URL_FOTOS}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
                // Nota: NO seteamos Content-Type aquí para que el navegador genere el boundary de multipart automáticamente.
            },
            body: formData
        });

        if (!response.ok) throw new Error("Error al subir la foto al servidor.");
        
        return await response.json();
    } catch (error) {
        console.error("Error en agregarFotoPublicacion:", error);
        throw error;
    }
};

// Función para eliminar una foto por su ID
export const eliminarFoto = async (idFoto, token) => {
    const response = await fetch(`${API_URL_FOTOS}/${idFoto}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Error al eliminar la foto");
    return true;
};
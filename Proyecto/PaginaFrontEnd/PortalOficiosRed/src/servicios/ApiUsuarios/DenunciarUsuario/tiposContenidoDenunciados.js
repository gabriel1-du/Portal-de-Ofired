const API_URL = import.meta.env.VITE_TIPO_CONTENIDO_DENUNCIADO_API_URL;

// Función para obtener todos los tipos de contenido que se pueden denunciar
export const obtenerTodosTiposContenido = async (token) => {
    try {
        console.log("Llamando a la API de Tipos de Contenido Denunciado (GET ALL):", API_URL);
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!response.ok) {
            throw new Error(`Error al obtener los tipos de contenido denunciado. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtenerTodosTiposContenido:", error);
        throw error;
    }
};

// Función para obtener un tipo de contenido denunciado específico por su ID
export const obtenerTipoContenidoPorId = async (idTipoContenido, token) => {
    try {
        const response = await fetch(`${API_URL}/${idTipoContenido}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error(`Error al obtener el tipo de contenido con ID ${idTipoContenido}`);
        return await response.json();
    } catch (error) {
        console.error(`Error en obtenerTipoContenidoPorId (${idTipoContenido}):`, error);
        throw error;
    }
};
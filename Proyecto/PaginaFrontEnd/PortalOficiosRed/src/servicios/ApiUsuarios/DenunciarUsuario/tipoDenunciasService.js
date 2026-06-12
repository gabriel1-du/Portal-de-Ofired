const API_URL = import.meta.env.VITE_TIPO_DENUNCIAS_API_URL;

// Función para obtener todos los tipos de denuncia
export const obtenerTodosTiposDenuncia = async (token) => {
    try {
        console.log("Llamando a la API de Tipos de Denuncia (GET ALL):", API_URL);
        const response = await fetch(`${API_URL}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!response.ok) {
            throw new Error(`Error al obtener los tipos de denuncia. Status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en obtenerTodosTiposDenuncia:", error);
        throw error;
    }
};

// Función para obtener un tipo de denuncia específico por su ID
export const obtenerTipoDenunciaPorId = async (idTipoDenuncia, token) => {
    try {
        const response = await fetch(`${API_URL}/${idTipoDenuncia}`, {
            method: 'GET',
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (!response.ok) throw new Error(`Error al obtener el tipo de denuncia con ID ${idTipoDenuncia}`);
        return await response.json();
    } catch (error) {
        console.error(`Error en obtenerTipoDenunciaPorId (${idTipoDenuncia}):`, error);
        throw error;
    }
};
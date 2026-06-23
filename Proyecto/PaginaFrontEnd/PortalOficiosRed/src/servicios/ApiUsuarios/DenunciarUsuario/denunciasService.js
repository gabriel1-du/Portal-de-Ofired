// src/servicios/ApiUsuarios/DenunciarUsuario/denunciasService.js

const URL_BASE = import.meta.env.VITE_DENUNCIAS_API_URL;

export const crearDenuncia = async (datosDenuncia, token) => {
    try {
        console.log("Llamando a la API de Denuncias (POST):", `${URL_BASE}/crear`);
        const res = await fetch(`${URL_BASE}/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(datosDenuncia)
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || 'Error al registrar la denuncia en el servidor');
        }

        return await res.json();
    } catch (error) {
        console.error("Error en denunciasService:", error);
        throw error;
    }
};

export const listarDenuncias = async () => {
    try {
        const res = await fetch(`${URL_BASE}/listar`);
        if (!res.ok) {
            throw new Error('Error al obtener las denuncias.');
        }
        return await res.json();
    } catch (error) {
        console.error("Error al listar denuncias:", error);
        throw error;
    }
};

export const obtenerDenunciaPorId = async (idDenuncia) => {
    try {
        const res = await fetch(`${URL_BASE}/${idDenuncia}`);
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || `Error al obtener la denuncia con ID ${idDenuncia}.`);
        }
        return await res.json();
    } catch (error) {
        console.error(`Error al obtener la denuncia con ID ${idDenuncia}:`, error);
        throw error;
    }
};

export const eliminarDenuncia = async (idDenuncia, token) => {
    try {
        const res = await fetch(`${URL_BASE}/eliminar/${idDenuncia}`, {
            method: 'DELETE',
            headers: {
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        });
        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || `Error al eliminar la denuncia con ID ${idDenuncia}.`);
        }
        return true;
    } catch (error) {
        console.error(`Error al eliminar la denuncia con ID ${idDenuncia}:`, error);
        throw error;
    }
};
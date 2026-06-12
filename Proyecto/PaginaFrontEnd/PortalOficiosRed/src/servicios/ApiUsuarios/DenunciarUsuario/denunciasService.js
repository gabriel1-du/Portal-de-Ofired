// src/servicios/ApiUsuarios/DenunciarUsuario/denunciasService.js

const URL_BASE = import.meta.env.VITE_DENUNCIAS_API_URL;

export const crearDenuncia = async (datosDenuncia, token) => {
    try {
        console.log("Llamando a la API de Denuncias (POST):", `${URL_BASE}/crear`);
        const res = await fetch(`${URL_BASE}/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(datosDenuncia)
        });

        if (!res.ok) {
            throw new Error('Error al registrar la denuncia en el servidor');
        }

        return await res.json();
    } catch (error) {
        console.error("Error en denunciasService:", error);
        throw error;
    }
};
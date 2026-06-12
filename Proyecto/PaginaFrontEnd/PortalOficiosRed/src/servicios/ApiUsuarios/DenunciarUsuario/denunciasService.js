// src/servicios/ApiUsuarios/DenunciarUsuario/denunciasService.js

const URL_BASE = 'http://localhost:8888/api/proxy/denunciasApi';

export const crearDenuncia = async (idUsuarioDenunciante, datosDenuncia, token) => {
    try {
        const res = await fetch(`${URL_BASE}/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'X-Usuario-Id': idUsuarioDenunciante
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
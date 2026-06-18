const API_URL = import.meta.env.VITE_RECUPERACION_CONTRASENAS_API_URL;

/**
 * Envía una solicitud al backend para generar un token de recuperación y enviar el correo.
 * @param {string} email - El correo electrónico del usuario.
 * @returns {Promise<Object>} - La respuesta del backend (opcionalmente contiene el token generado).
 */
export const solicitarRecuperacionPassword = async (email) => {
    try {
        const response = await fetch(`${API_URL}/generar-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        if (!response.ok) {
            throw new Error('Error al solicitar la recuperación de contraseña. Verifica si el correo es correcto o inténtalo más tarde.');
        }

        return await response.json();
    } catch (error) {
        console.error('Error en solicitarRecuperacionPassword:', error);
        throw error;
    }
};
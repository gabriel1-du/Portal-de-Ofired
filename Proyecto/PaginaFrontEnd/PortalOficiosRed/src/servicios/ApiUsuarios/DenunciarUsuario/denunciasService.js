// src/servicios/ApiUsuarios/DenunciarUsuario/denunciasService.js

const URL_BASE = 'http://localhost:8888/api/proxy/denunciasApi';

// 1. TU FUNCIÓN ORIGINAL (La usan los clientes/oficios)
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

// ---------------------------------------------------------
// NUEVAS FUNCIONES PARA EL PANEL DE ADMINISTRADOR
// ---------------------------------------------------------

// 2. FUNCIÓN PARA LLENAR LA TABLA DEL ADMIN
export const leerTodasLasDenuncias = async (token) => {
    try {
        // AHORA APUNTA A /listar (COMO ESTÁ EN TU SPRING BOOT)
        const res = await fetch(`${URL_BASE}/listar`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Error al obtener las denuncias');
        return await res.json();
    } catch (error) {
        console.error("Error en leerTodasLasDenuncias:", error);
        throw error;
    }
};

// 3. FUNCIÓN PARA ELIMINAR DENUNCIA
export const eliminarDenuncia = async (idDenuncia, token) => {
    try {
        const res = await fetch(`${URL_BASE}/eliminar/${idDenuncia}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Error al eliminar la denuncia');
        return await res.text(); 
    } catch (error) {
        console.error("Error en eliminarDenuncia:", error);
        throw error;
    }
};

// 4. FUNCIÓN PARA APROBAR / RECHAZAR DENUNCIA
export const cambiarEstadoDenuncia = async (idDenuncia, accion, token) => {
    try {
        const res = await fetch(`${URL_BASE}/estado/${idDenuncia}?accion=${accion}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Error al cambiar el estado de la denuncia');
        return await res.text();
    } catch (error) {
        console.error("Error en cambiarEstadoDenuncia:", error);
        throw error;
    }
};
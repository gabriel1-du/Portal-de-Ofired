const API_URL_BLOQUEOS = import.meta.env.VITE_USUARIOS_BLOQUEADOS_URL; // Asegúrate de agregar esta variable a tu archivo .env


// Función para crear un nuevo bloqueo
export const crearBloqueo = async (bloqueoData, token) => {
  try {
    const url = `${API_URL_BLOQUEOS}/crear`;
    console.log("Llamando a la API de Usuarios Bloqueados (POST):", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(bloqueoData),
    });

    if (response.ok) {
      console.log("Bloqueo creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el bloqueo. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el bloqueo: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el bloqueo:", error);
    throw error;
  }
};

// Función para actualizar un bloqueo existente
export const actualizarBloqueo = async (id, bloqueoData, token) => {
  try {
    const url = `${API_URL_BLOQUEOS}/actualizar/${id}`;
    console.log("Llamando a la API de Usuarios Bloqueados (PUT):", url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(bloqueoData),
    });

    if (response.ok) {
      console.log(`Bloqueo con ID ${id} actualizado exitosamente.`);
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar el bloqueo con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar el bloqueo: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el bloqueo con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar un bloqueo por su ID
export const eliminarBloqueo = async (id, token) => {
  try {
    const url = `${API_URL_BLOQUEOS}/eliminar/${id}`;
    console.log("Llamando a la API de Usuarios Bloqueados (DELETE):", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) {
      console.log(`Bloqueo con ID ${id} eliminado exitosamente.`);
      return true; // Devuelve true si fue exitoso (204 No Content)
    } else {
      const errorText = await response.text();
      console.error(`Error al eliminar el bloqueo con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al eliminar el bloqueo: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para eliminar el bloqueo con ID ${id}:`, error);
    throw error;
  }
};

// Función para leer un bloqueo específico por su ID
export const leerBloqueoPorId = async (id, token) => {
  try {
    const url = `${API_URL_BLOQUEOS}/leer/${id}`;
    console.log("Llamando a la API de Usuarios Bloqueados (GET by ID):", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`Error al obtener el bloqueo con ID ${id}.`);
    }
    const textBody = await response.text();
    return textBody ? JSON.parse(textBody) : null;
  } catch (error) {
    console.error(`Error al intentar obtener el bloqueo con ID ${id}:`, error);
    throw error;
  }
};

// Función para buscar bloqueos donde esté involucrado un usuario específico
export const buscarPorUsuarioInvolucrado = async (idUsuario, token) => {
  try {
    const url = `${API_URL_BLOQUEOS}/buscar-por-usuario/${idUsuario}`;
    console.log(`Llamando a la API de Usuarios Bloqueados (GET por Usuario ${idUsuario}):`, url);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) throw new Error(`Error al obtener bloqueos del usuario con ID ${idUsuario}.`);
    const textBody = await response.text();
    return textBody ? JSON.parse(textBody) : [];
  } catch (error) {
    console.error(`Error al intentar obtener bloqueos del usuario con ID ${idUsuario}:`, error);
    throw error;
  }
};

// Función para buscar si existe una relación de bloqueo específica entre dos usuarios (usando Query Params)
export const buscarRelacionSimultanea = async (idUsuarioQueBloquea, idUsuarioBloqueado, token) => {
  try {
    const url = `${API_URL_BLOQUEOS}/buscar-relacion?idUsuarioQueBloquea=${idUsuarioQueBloquea}&idUsuarioBloqueado=${idUsuarioBloqueado}`;
    console.log("Llamando a la API de Usuarios Bloqueados (GET Relación Simultánea):", url);
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      if (response.status === 404) return null; // No hay bloqueo entre ellos
      throw new Error("Error al obtener la relación de bloqueo.");
    }
    const textBody = await response.text();
    return textBody ? JSON.parse(textBody) : null;
  } catch (error) {
    console.error("Error al intentar obtener la relación de bloqueo:", error);
    throw error;
  }
};

// Función para leer absolutamente todos los bloqueos registrados
export const leerTodosLosBloqueos = async (token) => {
  try {
    console.log("Llamando a la API de Usuarios Bloqueados (GET ALL):", API_URL_BLOQUEOS);
    const response = await fetch(API_URL_BLOQUEOS, { headers: { 'Authorization': `Bearer ${token}` } });
    if (!response.ok) throw new Error("Error al obtener todos los bloqueos.");
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todos los bloqueos:", error);
    throw error;
  }
};

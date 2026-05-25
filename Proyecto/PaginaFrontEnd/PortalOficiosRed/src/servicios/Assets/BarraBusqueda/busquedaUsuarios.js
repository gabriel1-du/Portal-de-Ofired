const API_URL_USUARIOS = import.meta.env.VITE_API_URL_USUARIOS; //url de acceso a la api de usuarios

// --- FUNCIONES DE BÚSQUEDA ---

// Función para buscar usuarios con filtros combinados (región, comuna, fecha)
export const buscarUsuariosConFiltros = async (filtros) => {
  // Construir la cadena de consulta (query string) dinámicamente
  const params = new URLSearchParams();
  if (filtros.idRegion) params.append('idRegion', filtros.idRegion);
  if (filtros.idComuna) params.append('idComuna', filtros.idComuna);
  if (filtros.fecha) params.append('fecha', filtros.fecha);
  const queryString = params.toString();

  try {
    const url = `${API_URL_USUARIOS}/buscar/filtrado${queryString ? `?${queryString}` : ''}`;
    console.log("Llamando a la API de Usuarios (GET con filtros):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET Usuarios con filtros):", response.status, response.statusText);
      throw new Error("Error al buscar usuarios con filtros.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar buscar usuarios con filtros:", error);
    throw error;
  }
};

// Función para buscar usuarios por comuna
export const buscarUsuariosPorComuna = async (idComuna) => {
  try {
    const url = `${API_URL_USUARIOS}/buscar/por-comuna/${idComuna}`;
    console.log("Llamando a la API de Usuarios (GET por comuna):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET por comuna ${idComuna}):`, response.status, response.statusText);
      throw new Error(`Error al buscar usuarios por comuna.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al buscar usuarios por comuna ${idComuna}:`, error);
    throw error;
  }
};

// Función para buscar usuarios por región
export const buscarUsuariosPorRegion = async (idRegion) => {
  try {
    const url = `${API_URL_USUARIOS}/buscar/por-region/${idRegion}`;
    console.log("Llamando a la API de Usuarios (GET por región):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET por región ${idRegion}):`, response.status, response.statusText);
      throw new Error(`Error al buscar usuarios por región.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al buscar usuarios por región ${idRegion}:`, error);
    throw error;
  }
};

// Función para buscar usuarios por nombre
export const buscarUsuariosPorNombre = async (nombre) => {
  try {
    const url = `${API_URL_USUARIOS}/buscar/por-nombre/${encodeURIComponent(nombre)}`;
    console.log("Llamando a la API de Usuarios (GET por nombre):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET por nombre ${nombre}):`, response.status, response.statusText);
      throw new Error(`Error al buscar usuarios por nombre.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al buscar usuarios por nombre ${nombre}:`, error);
    throw error;
  }
};

// Función para buscar usuarios por valoración
export const buscarUsuariosPorValoracion = async (valoracion) => {
  try {
    const url = `${API_URL_USUARIOS}/buscar/por-valoracion/${valoracion}`;
    console.log("Llamando a la API de Usuarios (GET por valoración):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET por valoración ${valoracion}):`, response.status, response.statusText);
      throw new Error(`Error al buscar usuarios por valoración.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al buscar usuarios por valoración ${valoracion}:`, error);
    throw error;
  }
};

// Función para buscar usuarios creados después de una fecha
export const buscarUsuariosDespuesDeFecha = async (fecha) => {
  try {
    // La fecha debe estar en formato YYYY-MM-DD o YYYY-MM-DD HH:MM:SS
    const url = `${API_URL_USUARIOS}/buscar/por-fecha-creacion/despues?fecha=${encodeURIComponent(fecha)}`;
    console.log("Llamando a la API de Usuarios (GET después de fecha):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET después de fecha):`, response.status, response.statusText);
      throw new Error(`Error al buscar usuarios después de una fecha.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al buscar usuarios después de una fecha:`, error);
    throw error;
  }
};
const API_URL_PERFILES = import.meta.env.VITE_PERFILES_API_URL ; //url de acceso a la api de usuarios



// Función para obtener un perfil por su ID
export const getPerfilById = async (id) => {
  try {
    console.log("Llamando a la API de Perfiles (GET by ID):", `${API_URL_PERFILES}/${id}`);
    const response = await fetch(`${API_URL_PERFILES}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Perfil by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el perfil con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener el perfil con ID ${id}:`, error);
    throw error;
  }
};


// Función para obtener un perfil por el ID del Usuario (Cuenta base)
export const getPerfilByUsuarioId = async (idUsuario) => {
  try {
    console.log("Llamando a la API de Perfiles (GET by Usuario ID):", `${API_URL_PERFILES}/usuario/${idUsuario}`);
    
    
    const response = await fetch(`${API_URL_PERFILES}/usuario/${idUsuario}`);
    
    if (!response.ok) {
      // Manejo específico si el usuario aún no tiene un perfil creado (Error 404 o 500 dependiendo de tu backend)
      if (response.status === 404) {
         console.warn(`El usuario con ID ${idUsuario} aún no tiene un perfil creado.`);
         return null; // Retornamos null para que el frontend sepa que debe mostrar la pantalla de "Crear Perfil"
      }
      
      console.error(`Error en la respuesta de la red (GET Perfil by Usuario ID ${idUsuario}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el perfil del usuario con ID ${idUsuario}.`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Error al intentar obtener el perfil del usuario con ID ${idUsuario}:`, error);
    throw error;
  }
};


/**
 * Obtiene los datos optimizados del perfil (incluyendo nombres de región, comuna, etc.)
 * utilizando el ID de la cuenta del usuario.
 * @param {number} idUsuario - El ID de la cuenta del usuario autenticado.
 * @returns {object|null} - Los datos del perfil, o null si no existe.
 */
export const getPerfilFrontByUsuarioId = async (idUsuario) => {
  try {
    const url = `${API_URL_PERFILES}/front/usuario/${idUsuario}`;
    console.log("Llamando a la API de Perfiles (GET Front by Usuario ID):", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      // Si el backend devuelve un 404, significa que el usuario no ha creado su perfil
      if (response.status === 404) {
         console.warn(`Aviso: El usuario con ID ${idUsuario} no tiene un perfil configurado.`);
         return null; 
      }
      
      console.error(`Error de red (GET Perfil Front):`, response.status, response.statusText);
      throw new Error(`Error al obtener el perfil del usuario con ID ${idUsuario}.`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Error en getPerfilFrontByUsuarioId para el ID ${idUsuario}:`, error);
    throw error;
  }
};
const API_URL_PUBLICACIONES = import.meta.env.VITE_PUBLICACIONES_API_URL; // URL base para la API de publicaciones


// Función para buscar publicaciones con filtros combinados (región, comuna, fecha)
export const buscarPublicacionesConFiltros = async (filtros) => {
  // Construir la cadena de consulta (query string) dinámicamente
  const params = new URLSearchParams();
  if (filtros.idRegion) params.append('idRegion', filtros.idRegion);
  if (filtros.idComuna) params.append('idComuna', filtros.idComuna);
  if (filtros.fecha) params.append('fechaPublicacion', filtros.fecha); // La fecha se envía como string 'YYYY-MM-DD'
  const queryString = params.toString();

  try {
    // Asumimos que el endpoint de publicaciones es similar al de usuarios
    const url = `${API_URL_PUBLICACIONES}/buscar${queryString ? `?${queryString}` : ''}`;
    console.log("Llamando a la API de Publicaciones (GET con filtros):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET Publicaciones con filtros):", response.status, response.statusText);
      throw new Error("Error al buscar publicaciones con filtros.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar buscar publicaciones con filtros:", error);
    throw error;
  };
};
const API_URL_RESENIAS = import.meta.env.VITE_RESENIAS_API_URL; // URL de acceso a la API de reseñas


export const listarTodasReseniasFront = async () => {
  try {
    // Asumo que el endpoint para "listarTodasParaFront" es la raíz del controlador de reseñas.
    const url = `${API_URL_RESENIAS}`;
    console.log("Llamando a la API de Reseñas (Listar todas para Front):", url);
    const response = await fetch(url);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (Listar Reseñas Front):", response.status, response.statusText);
      throw new Error("Error al obtener todas las reseñas.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todas las reseñas:", error);
    throw error;
  }
};


export const listarReseniasPorUsuario = async (idUsuarioReseniado) => {
  try {
    const url = `${API_URL_RESENIAS}/usuario/${idUsuarioReseniado}`;
    console.log("Llamando a la API de Reseñas (Listar por Usuario Reseñado ID):", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`El usuario con ID ${idUsuarioReseniado} no tiene reseñas.`);
         return []; // Es buena práctica devolver un array vacío si no hay resultados.
      }
      
      console.error(`Error en la respuesta de la red (GET Reseñas by Usuario ID ${idUsuarioReseniado}):`, response.status, response.statusText);
      throw new Error(`Error al obtener las reseñas del usuario con ID ${idUsuarioReseniado}.`);
    }
    
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error(`Error al intentar obtener las reseñas del usuario con ID ${idUsuarioReseniado}:`, error);
    throw error;
  }
};



export const createResenia = async (reseniaData, token) => {
    // Esta función está lista para ser implementada con la lógica de POST
    // similar a createPerfilUsuario, incluyendo el token en las cabeceras.
    // Por ahora, es un placeholder funcional.
    console.log("Función createResenia llamada con:", reseniaData);
    return Promise.resolve({ success: true, data: reseniaData });
};

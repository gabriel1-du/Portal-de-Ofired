const API_URL_RESPUESTAS_RESENIAS = import.meta.env.VITE_RESPUESTAS_RESENIAS_API_URL; // URL de acceso a la API de respuestas de reseñas

export const listarTodasRespuestasResenias = async () => {
  try {
    const url = `${API_URL_RESPUESTAS_RESENIAS}`;
    console.log("Llamando a la API de Respuestas de Reseñas (GET ALL):", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener todas las respuestas de reseñas.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todas las respuestas de reseñas:", error);
    throw error;
  }
};

export const listarTodasRespuestasReseniasFront = async () => {
  try {
    const url = `${API_URL_RESPUESTAS_RESENIAS}/front`;
    console.log("Llamando a la API de Respuestas de Reseñas (GET ALL FRONT):", url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener todas las respuestas de reseñas para front.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todas las respuestas de reseñas para front:", error);
    throw error;
  }
};

export const getRespuestasPorReseniaFront = async (idResenia) => {
  try {
    const url = `${API_URL_RESPUESTAS_RESENIAS}/front/resenia/${idResenia}`;
    console.log("Llamando a la API de Respuestas de Reseñas (GET por ID de Reseña):", url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`La reseña con ID ${idResenia} no tiene respuestas configuradas.`);
         return []; // Es una buena práctica devolver un array vacío (o null) si no se encuentran resultados
      }
      
      console.error(`Error en la respuesta de la red (GET Respuestas by Reseña ID ${idResenia}):`, response.status, response.statusText);
      throw new Error(`Error al obtener las respuestas de la reseña con ID ${idResenia}.`);
    }
    
    const data = await response.json();
    return data; // Aquí recibirás el JSON con idRespuestaResenia, idResenia, nombreDelAutor, etc.
    
  } catch (error) {
    console.error(`Error al intentar obtener las respuestas de la reseña con ID ${idResenia}:`, error);
    throw error;
  }
};

export const deleteRespuestaResenia = async (idRespuestaResenia, token) => {
  try {
    const url = `${API_URL_RESPUESTAS_RESENIAS}/${idRespuestaResenia}`;
    console.log("Llamando a la API de Respuestas de Reseñas (DELETE):", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar la respuesta de reseña con ID ${idRespuestaResenia}.`);
    }
    return true;
  } catch (error) {
    console.error(`Error al intentar eliminar la respuesta de reseña con ID ${idRespuestaResenia}:`, error);
    throw error;
  }
};

export const createRespuestaResenia = async (respuestaData, token) => {
  try {
    const url = `${API_URL_RESPUESTAS_RESENIAS}`;
    console.log("Llamando a la API de Respuestas de Reseñas (POST):", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(respuestaData)
    });
    if (!response.ok) {
      console.error("Error al crear la respuesta de reseña:", response.status, response.statusText);
      throw new Error("Error al crear la respuesta de reseña.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error en createRespuestaResenia:", error);
    throw error;
  }
};
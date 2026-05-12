const API_URL_PARTICIPANTES = import.meta.env.VITE_PARTICIPANTES_CHAT_API_URL; // Asegúrate de agregar esta variable a tu archivo .env

// Función para crear un nuevo participante en un chat
export const crearParticipante = async (participanteData, token) => {
  try {
    const url = `${API_URL_PARTICIPANTES}/crear`;
    console.log("Llamando a la API de Participantes Chat (POST):", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(participanteData),
    });

    if (response.ok) {
      console.log("Participante creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el participante. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el participante: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el participante:", error);
    throw error;
  }
};

// Función para leer un participante específico por su ID (Datos base)
export const leerParticipantePorId = async (id, token) => {
  try {
    const url = `${API_URL_PARTICIPANTES}/leer-id/${id}`;
    console.log("Llamando a la API de Participantes Chat (GET by ID):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`Aviso: El participante con ID ${id} no existe.`);
         return null; 
      }
      console.error(`Error en la respuesta de la red (GET Participante by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el participante con ID ${id}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el participante con ID ${id}:`, error);
    throw error;
  }
};

// Función para leer un participante específico por su ID optimizado para Front
export const leerParticipanteFrontPorId = async (id, token) => {
  try {
    const url = `${API_URL_PARTICIPANTES}/leer-front/${id}`;
    console.log("Llamando a la API de Participantes Chat (GET Front by ID):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
         return null; 
      }
      console.error(`Error de red (GET Participante Front by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el participante (front) con ID ${id}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el participante (front) con ID ${id}:`, error);
    throw error;
  }
};

// Función para obtener únicamente los datos base/IDs de todos los participantes
export const leerTodosLosParticipantesId = async (token) => {
  try {
    console.log("Llamando a la API de Participantes Chat (GET ALL IDs):", `${API_URL_PARTICIPANTES}`);
    const response = await fetch(`${API_URL_PARTICIPANTES}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Error al obtener los datos base de los participantes.");
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener los datos base de los participantes:", error);
    throw error;
  }
};

// Función para leer la información completa de todos los participantes para el Front
export const leerTodosLosParticipantesFront = async (token) => {
  try {
    console.log("Llamando a la API de Participantes Chat (GET ALL Front):", `${API_URL_PARTICIPANTES}/leer-todos`);
    const response = await fetch(`${API_URL_PARTICIPANTES}/leer-todos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Error al obtener todos los participantes para front.");
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todos los participantes para front:", error);
    throw error;
  }
};

// Función para eliminar un participante de un chat por su ID
export const eliminarParticipante = async (id, token) => {
  try {
    const url = `${API_URL_PARTICIPANTES}/eliminar/${id}`;
    console.log("Llamando a la API de Participantes Chat (DELETE):", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) return true;
    throw new Error(`Error al eliminar el participante con ID ${id}`);
  } catch (error) {
    console.error(`Algo falló en la petición para eliminar el participante con ID ${id}:`, error);
    throw error;
  }
};

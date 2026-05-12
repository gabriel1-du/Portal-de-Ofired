const API_URL_MENSAJES = import.meta.env.VITE_MENSAJES_CHAT_API_URL; // Asegúrate de agregar esta variable a tu archivo .env

// Función para crear un nuevo mensaje
export const crearMensaje = async (mensajeData, token) => {
  try {
    const url = `${API_URL_MENSAJES}/crear`;
    console.log("Llamando a la API de Mensajes Chat (POST):", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(mensajeData),
    });

    if (response.ok) {
      console.log("Mensaje creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el mensaje. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el mensaje: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el mensaje:", error);
    throw error;
  }
};

// Función para leer un mensaje específico por su ID (Datos base)
export const leerMensajePorId = async (id, token) => {
  try {
    const url = `${API_URL_MENSAJES}/leer-id/${id}`;
    console.log("Llamando a la API de Mensajes Chat (GET by ID):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`Aviso: El mensaje con ID ${id} no existe.`);
         return null; 
      }
      console.error(`Error en la respuesta de la red (GET Mensaje by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el mensaje con ID ${id}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el mensaje con ID ${id}:`, error);
    throw error;
  }
};

// Función para leer un mensaje específico por su ID optimizado para Front
export const leerMensajeFrontPorId = async (id, token) => {
  try {
    const url = `${API_URL_MENSAJES}/leer-front/${id}`;
    console.log("Llamando a la API de Mensajes Chat (GET Front by ID):", url);
    
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
      console.error(`Error de red (GET Mensaje Front by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el mensaje (front) con ID ${id}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el mensaje (front) con ID ${id}:`, error);
    throw error;
  }
};

// Función para leer todos los mensajes pertenecientes a un chat específico
export const leerMensajesPorChat = async (idChat, token) => {
  try {
    const url = `${API_URL_MENSAJES}/chat/${idChat}`;
    console.log(`Llamando a la API de Mensajes Chat (GET por Chat ID ${idChat}):`, url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`Aviso: El chat con ID ${idChat} aún no tiene mensajes.`);
         return []; // Devolvemos un arreglo vacío si no hay mensajes
      }
      console.error(`Error de red (GET Mensajes by Chat ID ${idChat}):`, response.status, response.statusText);
      throw new Error(`Error al obtener los mensajes del chat con ID ${idChat}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener los mensajes del chat con ID ${idChat}:`, error);
    throw error;
  }
};

// Función para eliminar un mensaje por su ID
export const eliminarMensaje = async (id, token) => {
  try {
    const url = `${API_URL_MENSAJES}/eliminar/${id}`;
    console.log("Llamando a la API de Mensajes Chat (DELETE):", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (response.ok) return true;
    throw new Error(`Error al eliminar el mensaje con ID ${id}`);
  } catch (error) {
    console.error(`Algo falló en la petición para eliminar el mensaje con ID ${id}:`, error);
    throw error;
  }
};
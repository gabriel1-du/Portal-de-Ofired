const API_URL_CHAT = import.meta.env.VITE_CHAT_API_URL; // URL de acceso a la API de Chat (Asegúrate de agregarla a tu archivo .env)

// Función para crear un nuevo chat
export const crearChat = async (chatData, token) => {
  try {
    const url = `${API_URL_CHAT}/crear`;
    console.log("Llamando a la API de Chat (POST):", url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Incluimos el token por seguridad
      },
      body: JSON.stringify(chatData),
    });

    if (response.ok) {
      console.log("Chat creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el chat. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el chat: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el chat:", error);
    throw error;
  }
};

// Función para leer un chat específico por su ID
export const leerChatPorId = async (id, token) => {
  try {
    const url = `${API_URL_CHAT}/leer/${id}`;
    console.log("Llamando a la API de Chat (GET by ID):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`Aviso: El chat con ID ${id} no existe.`);
         return null; 
      }
      console.error(`Error en la respuesta de la red (GET Chat by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el chat con ID ${id}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el chat con ID ${id}:`, error);
    throw error;
  }
};

// Función para buscar los chats de un usuario por su ID
export const buscarChatPorUsuario = async (idUsuario, token) => {
  try {
    const url = `${API_URL_CHAT}/usuario/${idUsuario}`;
    console.log("Llamando a la API de Chat (GET por Usuario):", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
         console.warn(`Aviso: El usuario con ID ${idUsuario} no tiene chats.`);
         return []; 
      }
      console.error(`Error en la respuesta de la red (GET Chats by Usuario ID ${idUsuario}):`, response.status, response.statusText);
      throw new Error(`Error al obtener los chats del usuario con ID ${idUsuario}.`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener los chats del usuario con ID ${idUsuario}:`, error);
    throw error;
  }
};

// Función para obtener únicamente los IDs de todos los chats
export const leerTodosLosChatsId = async (token) => {
  try {
    console.log("Llamando a la API de Chat (GET ALL IDs):", `${API_URL_CHAT}`);
    const response = await fetch(`${API_URL_CHAT}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET All Chats IDs):", response.status, response.statusText);
      throw new Error("Error al obtener los IDs de los chats.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener los IDs de los chats:", error);
    throw error;
  }
};

// Función para leer la información completa de todos los chats para el Front
export const leerTodosLosChatsFront = async (token) => {
  try {
    console.log("Llamando a la API de Chat (GET ALL Front):", `${API_URL_CHAT}/leer-todos`);
    const response = await fetch(`${API_URL_CHAT}/leer-todos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET All Chats Front):", response.status, response.statusText);
      throw new Error("Error al obtener todos los chats para front.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todos los chats para front:", error);
    throw error;
  }
};

// Función para eliminar un chat por su ID
export const eliminarChat = async (id, token) => {
  try {
    const url = `${API_URL_CHAT}/eliminar/${id}`;
    console.log("Llamando a la API de Chat (DELETE):", url);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}` 
      }
    });

    if (response.ok) {
      console.log(`Chat con ID ${id} eliminado exitosamente.`);
      return true; // ResponseEntity<>(HttpStatus.NO_CONTENT) no devuelve body
    } else {
      const errorText = await response.text();
      console.error(`Error al eliminar el chat con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al eliminar el chat: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para eliminar el chat con ID ${id}:`, error);
    throw error;
  }
};

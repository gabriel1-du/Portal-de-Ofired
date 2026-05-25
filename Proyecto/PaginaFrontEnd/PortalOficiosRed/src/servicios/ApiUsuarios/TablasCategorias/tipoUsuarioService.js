const API_URL_TIPOS_USUARIOS = import.meta.env.VITE_TIPOS_USUARIOS_API_URL; // URL base para la API de tipos de usuario

// Función para obtener todos los tipos de usuario
export const getAllTiposUsuarios = async () => {
  try {
    console.log("Llamando a la API de Tipos de Usuario (GET ALL):", `${API_URL_TIPOS_USUARIOS}`);
    const response = await fetch(`${API_URL_TIPOS_USUARIOS}`);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET ALL Tipos de Usuario):", response.status, response.statusText);
      throw new Error("Error al obtener todos los tipos de usuario.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todos los tipos de usuario:", error);
    throw error;
  }
};

// Función para obtener un tipo de usuario por su ID
export const getTipoUsuarioById = async (id) => {
  try {
    console.log("Llamando a la API de Tipos de Usuario (GET by ID):", `${API_URL_TIPOS_USUARIOS}/${id}`);
    const response = await fetch(`${API_URL_TIPOS_USUARIOS}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Tipo de Usuario by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el tipo de usuario con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener el tipo de usuario con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear un nuevo tipo de usuario
export const createTipoUsuario = async (tipoUsuarioData) => {
  try {
    console.log("Llamando a la API de Tipos de Usuario (POST):", `${API_URL_TIPOS_USUARIOS}`);
    const response = await fetch(`${API_URL_TIPOS_USUARIOS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipoUsuarioData),
    });

    if (response.ok) {
      console.log("Tipo de usuario creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el tipo de usuario. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el tipo de usuario: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el tipo de usuario:", error);
    throw error;
  }
};

// Función para actualizar un tipo de usuario existente por su ID
export const updateTipoUsuario = async (id, tipoUsuarioData) => {
  try {
    console.log("Llamando a la API de Tipos de Usuario (PUT):", `${API_URL_TIPOS_USUARIOS}/${id}`);
    const response = await fetch(`${API_URL_TIPOS_USUARIOS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tipoUsuarioData),
    });

    if (response.ok) {
      console.log(`Tipo de usuario con ID ${id} actualizado exitosamente.`);
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : { message: `Tipo de usuario con ID ${id} actualizado.` };
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar el tipo de usuario con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar el tipo de usuario: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el tipo de usuario con ID ${id}:`, error);
    throw error;
  }
};

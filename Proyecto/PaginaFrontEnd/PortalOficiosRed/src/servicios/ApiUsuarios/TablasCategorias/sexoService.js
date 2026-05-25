const API_URL_SEXOS = import.meta.env.VITE_SEXOS_API_URL; // URL base para la API de sexos

// Función para obtener todos los sexos
export const getAllSexos = async () => {
  try {
    console.log("Llamando a la API de Sexos (GET ALL):", `${API_URL_SEXOS}`);
    const response = await fetch(`${API_URL_SEXOS}`);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET ALL Sexos):", response.status, response.statusText);
      throw new Error("Error al obtener todos los sexos.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todos los sexos:", error);
    throw error;
  }
};

// Función para obtener un sexo por su ID
export const getSexoById = async (id) => {
  try {
    console.log("Llamando a la API de Sexos (GET by ID):", `${API_URL_SEXOS}/${id}`);
    const response = await fetch(`${API_URL_SEXOS}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Sexo by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el sexo con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener el sexo con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear un nuevo sexo
export const createSexo = async (sexoData) => {
  try {
    console.log("Llamando a la API de Sexos (POST):", `${API_URL_SEXOS}`);
    const response = await fetch(`${API_URL_SEXOS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sexoData),
    });

    if (response.ok) {
      console.log("Sexo creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el sexo. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el sexo: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el sexo:", error);
    throw error;
  }
};

// Función para actualizar un sexo existente por su ID
export const updateSexo = async (id, sexoData) => {
  try {
    console.log("Llamando a la API de Sexos (PUT):", `${API_URL_SEXOS}/${id}`);
    const response = await fetch(`${API_URL_SEXOS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sexoData),
    });

    if (response.ok) {
      console.log(`Sexo con ID ${id} actualizado exitosamente.`);
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : { message: `Sexo con ID ${id} actualizado.` };
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar el sexo con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar el sexo: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el sexo con ID ${id}:`, error);
    throw error;
  }
};

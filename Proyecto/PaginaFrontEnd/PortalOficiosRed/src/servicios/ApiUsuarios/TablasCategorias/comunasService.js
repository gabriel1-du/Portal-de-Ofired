const API_URL_COMUNAS = import.meta.env.VITE_API_URL_COMUNAS; // URL base para la API de comunas

// Función para obtener todas las comunas
export const getAllComunas = async () => {
  try {
    console.log("Llamando a la API de Comunas (GET ALL):", `${API_URL_COMUNAS}`);
    const response = await fetch(`${API_URL_COMUNAS}`);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET ALL Comunas):", response.status, response.statusText);
      throw new Error("Error al obtener todas las comunas.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todas las comunas:", error);
    throw error; // Propagar el error para que el componente que llama pueda manejarlo
  }
};

// Función para obtener una comuna por su ID
export const getComunaById = async (id) => {
  try {
    console.log("Llamando a la API de Comunas (GET by ID):", `${API_URL_COMUNAS}/${id}`);
    const response = await fetch(`${API_URL_COMUNAS}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Comuna by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener la comuna con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener la comuna con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear una nueva comuna
export const createComuna = async (comunaData) => {
  try {
    console.log("Llamando a la API de Comunas (POST):", `${API_URL_COMUNAS}`);
    const response = await fetch(`${API_URL_COMUNAS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunaData),
    });

    if (response.ok) {
      console.log("Comuna creada exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear la comuna. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear la comuna: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear la comuna:", error);
    throw error;
  }
};

// Función para actualizar una comuna existente por su ID
export const updateComuna = async (id, comunaData) => {
  try {
    console.log("Llamando a la API de Comunas (PUT):", `${API_URL_COMUNAS}/${id}`);
    const response = await fetch(`${API_URL_COMUNAS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comunaData),
    });

    if (response.ok) {
      console.log(`Comuna con ID ${id} actualizada exitosamente.`);
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : { message: `Comuna con ID ${id} actualizada.` };
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar la comuna con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar la comuna: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar la comuna con ID ${id}:`, error);
    throw error;
  }
};
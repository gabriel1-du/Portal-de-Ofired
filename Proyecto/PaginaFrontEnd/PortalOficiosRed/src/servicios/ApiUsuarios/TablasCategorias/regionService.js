const API_URL_REGIONES = import.meta.env.VITE_API_URL_REGIONES; // URL base para la API de regiones

// Función para obtener todas las regiones
export const getAllRegions = async () => {
  try {
    console.log("Llamando a la API de Regiones (GET ALL):", `${API_URL_REGIONES}`);
    const response = await fetch(`${API_URL_REGIONES}`);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET ALL Regiones):", response.status, response.statusText);
      throw new Error("Error al obtener todas las regiones.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todas las regiones:", error);
    throw error; // Propagar el error para que el componente que llama pueda manejarlo
  }
};

// Función para obtener una región por su ID
export const getRegionById = async (id) => {
  try {
    console.log("Llamando a la API de Regiones (GET by ID):", `${API_URL_REGIONES}/${id}`);
    const response = await fetch(`${API_URL_REGIONES}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Region by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener la región con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener la región con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear una nueva región
export const createRegion = async (regionData) => {
  try {
    console.log("Llamando a la API de Regiones (POST):", `${API_URL_REGIONES}`);
    const response = await fetch(`${API_URL_REGIONES}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regionData),
    });

    if (response.ok) {
      console.log("Región creada exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear la región. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear la región: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear la región:", error);
    throw error;
  }
};

// Función para actualizar una región existente por su ID
export const updateRegion = async (id, regionData) => {
  try {
    console.log("Llamando a la API de Regiones (PUT):", `${API_URL_REGIONES}/${id}`);
    const response = await fetch(`${API_URL_REGIONES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(regionData),
    });

    if (response.ok) {
      console.log(`Región con ID ${id} actualizada exitosamente.`);
      // Algunas APIs PUT devuelven el objeto actualizado, otras solo un status 200/204
      // Si tu API devuelve el objeto, puedes hacer: return await response.json();
      // Si solo devuelve éxito, puedes retornar true o un mensaje.
      const responseBody = await response.text(); // Intenta leer el cuerpo
      return responseBody ? JSON.parse(responseBody) : { message: `Región con ID ${id} actualizada.` };
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar la región con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar la región: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar la región con ID ${id}:`, error);
    throw error;
  }
};

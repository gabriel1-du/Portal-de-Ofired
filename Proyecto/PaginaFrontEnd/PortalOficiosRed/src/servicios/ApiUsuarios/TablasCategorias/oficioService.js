const API_URL_OFICIOS = import.meta.env.VITE_API_URL_OFICIOS; // URL base para la API de oficios

// Función para obtener todos los oficios
export const getAllOficios = async () => {
  try {
    console.log("Llamando a la API de Oficios (GET ALL):", `${API_URL_OFICIOS}`);
    const response = await fetch(`${API_URL_OFICIOS}`);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET ALL Oficios):", response.status, response.statusText);
      throw new Error("Error al obtener todos los oficios.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todos los oficios:", error);
    throw error;
  }
};

// Función para obtener un oficio por su ID
export const getOficioById = async (id) => {
  try {
    console.log("Llamando a la API de Oficios (GET by ID):", `${API_URL_OFICIOS}/${id}`);
    const response = await fetch(`${API_URL_OFICIOS}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Oficio by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el oficio con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener el oficio con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear un nuevo oficio
export const createOficio = async (oficioData) => {
  try {
    console.log("Llamando a la API de Oficios (POST):", `${API_URL_OFICIOS}`);
    const response = await fetch(`${API_URL_OFICIOS}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(oficioData),
    });

    if (response.ok) {
      console.log("Oficio creado exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear el oficio. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear el oficio: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el oficio:", error);
    throw error;
  }
};

// Función para actualizar un oficio existente por su ID
export const updateOficio = async (id, oficioData) => {
  try {
    console.log("Llamando a la API de Oficios (PUT):", `${API_URL_OFICIOS}/${id}`);
    const response = await fetch(`${API_URL_OFICIOS}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(oficioData),
    });

    if (response.ok) {
      console.log(`Oficio con ID ${id} actualizado exitosamente.`);
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : { message: `Oficio con ID ${id} actualizado.` };
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar el oficio con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar el oficio: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el oficio con ID ${id}:`, error);
    throw error;
  }
};

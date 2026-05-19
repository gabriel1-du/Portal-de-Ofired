const API_URL = import.meta.env.VITE_TIPOS_TRABAJO_API_URL;

// Función para crear un nuevo tipo de trabajo (POST /crear)
export const crearTipoDeTrabajo = async (dto) => {
  try {
    console.log("Llamando a la API de Tipo de Trabajo (POST):", `${API_URL}/crear`);
    const response = await fetch(`${API_URL}/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear el tipo de trabajo: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Algo falló en la petición para crear el tipo de trabajo:", error);
    throw error;
  }
};

// Función para obtener un tipo de trabajo por ID (GET /{id})
export const leerTipoDeTrabajoPorId = async (id) => {
  try {
    console.log("Llamando a la API de Tipo de Trabajo (GET by ID):", `${API_URL}/${id}`);
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el tipo de trabajo con ID ${id}.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el tipo de trabajo con ID ${id}:`, error);
    throw error;
  }
};

// Función para obtener todos los tipos de trabajo (GET /)
export const leerTodosLosTiposDeTrabajo = async () => {
  try {
    console.log("Llamando a la API de Tipo de Trabajo (GET ALL):", API_URL);
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener todos los tipos de trabajo.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todos los tipos de trabajo:", error);
    throw error;
  }
};

// Función para actualizar un tipo de trabajo (PUT /{id})
export const actualizarTipoDeTrabajo = async (id, dto) => {
  try {
    console.log("Llamando a la API de Tipo de Trabajo (PUT):", `${API_URL}/${id}`);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar el tipo de trabajo: ${errorText}`);
    }
    const responseBody = await response.text();
    return responseBody ? JSON.parse(responseBody) : { message: `Tipo de trabajo con ID ${id} actualizado.` };
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el tipo de trabajo con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar un tipo de trabajo (DELETE /{id})
export const eliminarTipoDeTrabajo = async (id) => {
  try {
    console.log("Llamando a la API de Tipo de Trabajo (DELETE):", `${API_URL}/${id}`);
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar el tipo de trabajo con ID ${id}.`);
    return true;
  } catch (error) {
    console.error(`Error al intentar eliminar el tipo de trabajo con ID ${id}:`, error);
    throw error;
  }
};

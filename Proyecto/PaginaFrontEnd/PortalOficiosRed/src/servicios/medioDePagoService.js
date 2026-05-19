const API_URL = import.meta.env.VITE_MEDIOS_PAGO_API_URL;

// Función para crear un nuevo medio de pago (POST /crear)
export const crearMedioDePago = async (dto) => {
  try {
    console.log("Llamando a la API de Medio de Pago (POST):", `${API_URL}/crear`);
    const response = await fetch(`${API_URL}/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear el medio de pago: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Algo falló en la petición para crear el medio de pago:", error);
    throw error;
  }
};

// Función para obtener un medio de pago por ID (GET /{id})
export const leerMedioDePagoPorId = async (id) => {
  try {
    console.log("Llamando a la API de Medio de Pago (GET by ID):", `${API_URL}/${id}`);
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Error al obtener el medio de pago con ID ${id}.`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener el medio de pago con ID ${id}:`, error);
    throw error;
  }
};

// Función para obtener todos los medios de pago (GET /)
export const leerTodosLosMediosDePago = async () => {
  try {
    console.log("Llamando a la API de Medio de Pago (GET ALL):", API_URL);
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Error al obtener todos los medios de pago.");
    }
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todos los medios de pago:", error);
    throw error;
  }
};

// Función para actualizar un medio de pago (PUT /actualizar/{id})
export const actualizarMedioDePago = async (id, dto) => {
  try {
    console.log("Llamando a la API de Medio de Pago (PUT):", `${API_URL}/actualizar/${id}`);
    const response = await fetch(`${API_URL}/actualizar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar el medio de pago: ${errorText}`);
    }
    const responseBody = await response.text();
    return responseBody ? JSON.parse(responseBody) : { message: `Medio de pago con ID ${id} actualizado.` };
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el medio de pago con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar un medio de pago (DELETE /eliminar/{id})
export const eliminarMedioDePago = async (id) => {
  try {
    console.log("Llamando a la API de Medio de Pago (DELETE):", `${API_URL}/eliminar/${id}`);
    const response = await fetch(`${API_URL}/eliminar/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Error al eliminar el medio de pago con ID ${id}.`);
    return true;
  } catch (error) {
    console.error(`Error al intentar eliminar el medio de pago con ID ${id}:`, error);
    throw error;
  }
};

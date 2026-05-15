const API_URL = import.meta.env.VITE_CONFIRMACION_TRANSACCIONES_API_URL;

// Función para crear una nueva confirmación de transacción (POST /crear)
export const crearTransaccion = async (dto, token) => {
  try {
    console.log("Llamando a la API de Transacciones (POST):", `${API_URL}/crear`);
    const response = await fetch(`${API_URL}/crear`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al crear la transacción: ${errorText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Algo falló en la petición para crear la transacción:", error);
    throw error;
  }
};

// Función para obtener una transacción por ID (GET /leer/{id})
export const leerTransaccionPorId = async (id) => {
  try {
    console.log("Llamando a la API de Transacciones (GET by ID):", `${API_URL}/leer/${id}`);
    const response = await fetch(`${API_URL}/leer/${id}`);
    if (!response.ok) throw new Error(`Error al obtener la transacción con ID ${id}.`);
    return await response.json();
  } catch (error) {
    console.error(`Error al intentar obtener la transacción con ID ${id}:`, error);
    throw error;
  }
};

// Función para obtener todas las transacciones (Formato Front) (GET /leer-todos-front)
export const leerTodasLasTransaccionesFront = async () => {
  try {
    console.log("Llamando a la API de Transacciones (GET ALL FRONT):", `${API_URL}/leer-todos-front`);
    const response = await fetch(`${API_URL}/leer-todos-front`);
    if (!response.ok) throw new Error("Error al obtener todas las transacciones (front).");
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todas las transacciones (front):", error);
    throw error;
  }
};

// Función para obtener todas las transacciones (Formato ID) (GET /leer-todos-id)
export const leerTodasLasTransaccionesId = async () => {
  try {
    console.log("Llamando a la API de Transacciones (GET ALL ID):", `${API_URL}/leer-todos-id`);
    const response = await fetch(`${API_URL}/leer-todos-id`);
    if (!response.ok) throw new Error("Error al obtener todas las transacciones (id).");
    return await response.json();
  } catch (error) {
    console.error("Error al intentar obtener todas las transacciones (id):", error);
    throw error;
  }
};

// Función para actualizar el estado de una transacción (PUT /actualizar-estado/{id})
export const actualizarEstadoTransaccion = async (id, dto) => {
  try {
    console.log("Llamando a la API de Transacciones (PUT Estado):", `${API_URL}/actualizar-estado/${id}`);
    const response = await fetch(`${API_URL}/actualizar-estado/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar el estado: ${errorText}`);
    }
    
    // El backend devuelve HttpStatus.OK y un LeerConfirmacionTransaccionFrontDTO
    const responseBody = await response.text();
    return responseBody ? JSON.parse(responseBody) : { message: `Estado actualizado exitosamente.` };
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar el estado de la transacción con ID ${id}:`, error);
    throw error;
  }
};

// Función para eliminar una transacción (DELETE /eliminar/{id})
export const eliminarTransaccion = async (id) => {
  try {
    console.log("Llamando a la API de Transacciones (DELETE):", `${API_URL}/eliminar/${id}`);
    const response = await fetch(`${API_URL}/eliminar/${id}`, {
      method: 'DELETE',
    });
    
    // El backend devuelve HttpStatus.NO_CONTENT
    if (!response.ok) throw new Error(`Error al eliminar la transacción con ID ${id}.`);
    return true;
  } catch (error) {
    console.error(`Error al intentar eliminar la transacción con ID ${id}:`, error);
    throw error;
  }
};

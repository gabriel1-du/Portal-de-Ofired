const API_URL_USUARIOS = import.meta.env.VITE_API_URL_USUARIOS; //url de acceso a la api de usuarios



// Función para obtener un usuario por su ID
export const getUsuarioById = async (id) => {
  try {
    console.log("Llamando a la API de Usuarios (GET by ID):", `${API_URL_USUARIOS}/${id}`);
    const response = await fetch(`${API_URL_USUARIOS}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Usuario by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener el usuario con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};


// Función para leer todos los usuarios desde la API Gateway
export const leerTodosLosUsuarios = async () => {
  try {
    console.log("Llamando a:", `${API_URL_USUARIOS}`); // Ajusta según tu método
    const response = await fetch(`${API_URL_USUARIOS}`);
    if (!response.ok) {
      // Agregamos un log para ver el status y el texto del error en la consola del NAVEGADOR.
      console.error("Error en la respuesta de la red:", response.status, response.statusText);
      return "Error trayendo a todos los usuarios";
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // Agregamos un log para ver el error de fetch en la consola del NAVEGADOR.
    console.error("Error al intentar hacer fetch:", error);
    return "Error trayendo a todos los usuarios";
  }
};

//funcion para crear un nuevo usuario cliente en la base de datos a través de la API Gateway
export const crearUsuarioCliente = async (datosUsuario) => {
  try {
    const response = await fetch(`${API_URL_USUARIOS}/crearUsuarioLVL1`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosUsuario),
    });

    if (response.ok) {
      console.log("usuario exitosamenre creado");
      return await response.json();
    } else {
      const errorTexto = await response.text();
      console.error("Erroneo, no se pudo crear el usuario. Respuesta del servidor:", errorTexto);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el usuario:", error);
  }
};

// Función para actualizar un usuario existente
export const updateUsuario = async (idUsuario, usuarioData, token) => {
  try {
    const url = `${API_URL_USUARIOS}/${idUsuario}`;
    console.log("Llamando a la API de Usuarios (PUT):", url);
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(usuarioData),
    });

    if (response.ok) {
      console.log("Usuario actualizado exitosamente.");
      const responseBody = await response.text();
      return responseBody ? JSON.parse(responseBody) : { success: true };
    } else {
      const errorText = await response.text();
      console.error("Error al actualizar el usuario. Respuesta del servidor:", errorText);
      throw new Error(`Error al actualizar el usuario: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para actualizar el usuario:", error);
    throw error;
  }
};


//
export const crearUsuarioOficio= async (datosUsuario) => {
  try {
    const response = await fetch(`${API_URL_USUARIOS}/crearUsuarioLVL2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosUsuario),
    });

    if (response.ok) {
      console.log("usuario exitosamenre creado");
      return await response.json();
    } else {
      const errorTexto = await response.text();
      console.error("Erroneo, no se pudo crear el usuario. Respuesta del servidor:", errorTexto);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear el usuario:", error);
  }
};
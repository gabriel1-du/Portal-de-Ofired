const API_URL_PUBLICACIONES = import.meta.env.VITE_PUBLICACIONES_API_URL; // URL base para la API de publicaciones

// Función para obtener todas las publicaciones
export const getAllPublicaciones = async () => {
  try {
    console.log("Llamando a la API de Publicaciones (GET ALL):", `${API_URL_PUBLICACIONES}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}`);
    if (!response.ok) {
      console.error("Error en la respuesta de la red (GET ALL Publicaciones):", response.status, response.statusText);
      throw new Error("Error al obtener todas las publicaciones.");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al intentar obtener todas las publicaciones:", error);
    throw error; // Propagar el error para que el componente que llama pueda manejarlo
  }
};

// Función para obtener una publicación por su ID
export const getPublicacionById = async (id) => {
  try {
    console.log("Llamando a la API de Publicaciones (GET by ID):", `${API_URL_PUBLICACIONES}/${id}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/${id}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Publicacion by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al obtener la publicación con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener la publicación con ID ${id}:`, error);
    throw error;
  }
};

// Función para crear una nueva publicación
export const createPublicacion = async (publicacionData) => {
  try {
    console.log("Llamando a la API de Publicaciones (POST):", `${API_URL_PUBLICACIONES}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publicacionData),
    });

    if (response.ok) {
      console.log("Publicación creada exitosamente.");
      return await response.json();
    } else {
      const errorText = await response.text();
      console.error("Error al crear la publicación. Respuesta del servidor:", errorText);
      throw new Error(`Error al crear la publicación: ${errorText}`);
    }
  } catch (error) {
    console.error("Algo falló en la petición para crear la publicación:", error);
    throw error;
  }
};

// Función para actualizar una publicación existente por su ID
export const updatePublicacion = async (id, publicacionData) => {
  try {
    console.log("Llamando a la API de Publicaciones (PUT):", `${API_URL_PUBLICACIONES}/${id}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(publicacionData),
    });

    if (response.ok) {
      console.log(`Publicación con ID ${id} actualizada exitosamente.`);
      const responseBody = await response.text(); 
      return responseBody ? JSON.parse(responseBody) : { message: `Publicación con ID ${id} actualizada.` };
    } else {
      const errorText = await response.text();
      console.error(`Error al actualizar la publicación con ID ${id}. Respuesta del servidor:`, errorText);
      throw new Error(`Error al actualizar la publicación: ${errorText}`);
    }
  } catch (error) {
    console.error(`Algo falló en la petición para actualizar la publicación con ID ${id}:`, error);
    throw error;
  }
};

// Función para obtener las publicaciones filtradas por nombre de publicación
export const getPublicacionesByNombre = async (nombrePublicacion) => {
  try {
    console.log("Llamando a la API de Publicaciones (GET by Nombre):", `${API_URL_PUBLICACIONES}/nombre/${nombrePublicacion}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/nombre/${nombrePublicacion}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Publicaciones by Nombre ${nombrePublicacion}):`, response.status, response.statusText);
      throw new Error(`Error al obtener las publicaciones con el nombre ${nombrePublicacion}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener las publicaciones con el nombre ${nombrePublicacion}:`, error);
    throw error;
  }
};

// Función para eliminar una publicación por su ID
export const deletePublicacion = async (id) => {
  try {
    console.log("Llamando a la API de Publicaciones (DELETE):", `${API_URL_PUBLICACIONES}/${id}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (DELETE Publicacion by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al eliminar la publicación con ID ${id}.`);
    }
    return true; // ResponseEntity.noContent() retorna un 204 sin cuerpo
  } catch (error) {
    console.error(`Error al intentar eliminar la publicación con ID ${id}:`, error);
    throw error;
  }
};

// Función para obtener las publicaciones por ID de autor
export const getPublicacionesByAutor = async (idAutor) => {
  try {
    console.log("Llamando a la API de Publicaciones (GET by Autor):", `${API_URL_PUBLICACIONES}/autor/${idAutor}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/autor/${idAutor}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Publicaciones by Autor ${idAutor}):`, response.status, response.statusText);
      throw new Error(`Error al obtener las publicaciones del autor con ID ${idAutor}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener las publicaciones del autor con ID ${idAutor}:`, error);
    throw error;
  }
};

// Función para obtener las publicaciones filtradas por región
export const getPublicacionesByRegion = async (idRegion) => {
  try {
    console.log("Llamando a la API de Publicaciones (GET by Region):", `${API_URL_PUBLICACIONES}/region/${idRegion}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/region/${idRegion}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Publicaciones by Region ${idRegion}):`, response.status, response.statusText);
      throw new Error(`Error al obtener las publicaciones de la región con ID ${idRegion}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener las publicaciones de la región con ID ${idRegion}:`, error);
    throw error;
  }
};

// Función para obtener las publicaciones filtradas por comuna
export const getPublicacionesByComuna = async (idComuna) => {
  try {
    console.log("Llamando a la API de Publicaciones (GET by Comuna):", `${API_URL_PUBLICACIONES}/comuna/${idComuna}`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/comuna/${idComuna}`);
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (GET Publicaciones by Comuna ${idComuna}):`, response.status, response.statusText);
      throw new Error(`Error al obtener las publicaciones de la comuna con ID ${idComuna}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar obtener las publicaciones de la comuna con ID ${idComuna}:`, error);
    throw error;
  }
};

// Función para dar un "like" a una publicación
export const darLikePublicacion = async (id) => {
  try {
    console.log("Llamando a la API de Publicaciones (PATCH Like):", `${API_URL_PUBLICACIONES}/${id}/like`);
    const response = await fetch(`${API_URL_PUBLICACIONES}/${id}/like`, {
      method: 'PATCH',
    });
    if (!response.ok) {
      console.error(`Error en la respuesta de la red (PATCH Like Publicacion by ID ${id}):`, response.status, response.statusText);
      throw new Error(`Error al dar like a la publicación con ID ${id}.`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error al intentar dar like a la publicación con ID ${id}:`, error);
    throw error;
  }

  
};



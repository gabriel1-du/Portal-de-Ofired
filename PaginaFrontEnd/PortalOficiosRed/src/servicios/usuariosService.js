const API_URL_USUARIOS = import.meta.env.VITE_API_URL_USUARIOS; //url de acceso a la api de usuarios

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
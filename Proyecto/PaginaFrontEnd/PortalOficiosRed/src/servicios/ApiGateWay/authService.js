const API_URL = import.meta.env.VITE_API_GATEWAY_URL; 

export const login = async (credenciales) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
    });
    if (!response.ok) throw new Error("Credenciales inválidas");
    return await response.json(); // Aquí viene tu JSON con el token
};
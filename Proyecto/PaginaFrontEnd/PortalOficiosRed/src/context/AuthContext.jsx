import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Al iniciar, intentamos leer tanto el token como los datos del usuario desde localStorage.
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = localStorage.getItem('usuario');
        try {
            // Solución Defensiva: Solo parseamos si el dato guardado es válido y no es la cadena "undefined".
            if (usuarioGuardado && usuarioGuardado !== 'undefined') {
                return JSON.parse(usuarioGuardado);
            }
            return null;
        } catch (error) {
            console.error("Error al parsear datos de usuario desde localStorage", error);
            return null;
        }
    });

    // Función para iniciar sesión
    const iniciarSesion = (nuevoToken, datosUsuario) => {
        setToken(nuevoToken);
        setUsuario(datosUsuario);
        // Guardamos tanto el token como el objeto de usuario (convertido a string)
        localStorage.setItem('token', nuevoToken);
        // Solución Preventiva: Nos aseguramos de no guardar 'undefined' en localStorage.
        if (datosUsuario) {
            localStorage.setItem('usuario', JSON.stringify(datosUsuario));
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        setToken(null);
        setUsuario(null);
        // Limpiamos ambos datos del localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
    };

    return (
        <AuthContext.Provider value={{ token, usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};
import { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Al iniciar, intentamos leer tanto el token como los datos del usuario desde las cookies.
    const [token, setToken] = useState(() => {
        const tokenGuardado = Cookies.get('token');
        return (tokenGuardado && tokenGuardado !== 'undefined') ? tokenGuardado : null;
    });
    const [usuario, setUsuario] = useState(() => {
        const usuarioGuardado = Cookies.get('usuario');
        try {
            // Solución Defensiva: Solo parseamos si el dato guardado es válido y no es la cadena "undefined".
            if (usuarioGuardado && usuarioGuardado !== 'undefined') {
                return JSON.parse(usuarioGuardado);
            }
            return null;
        } catch (error) {
            console.error("Error al parsear datos de usuario desde las cookies", error);
            return null;
        }
    });

    // Función para iniciar sesión
    const iniciarSesion = (nuevoToken, datosUsuario) => {
        setToken(nuevoToken);
        setUsuario(datosUsuario);
        // Guardamos tanto el token como el objeto de usuario en cookies, con expiración de 2 días
        if (nuevoToken && nuevoToken !== 'undefined') {
            Cookies.set('token', nuevoToken, { expires: 2 });
        }
        // Solución Preventiva: Nos aseguramos de no guardar 'undefined' en las cookies.
        if (datosUsuario) {
            Cookies.set('usuario', JSON.stringify(datosUsuario), { expires: 2 });
        }
    };

    // Función para cerrar sesión
    const cerrarSesion = () => {
        setToken(null);
        setUsuario(null);
        // Limpiamos ambos datos de las cookies
        Cookies.remove('token');
        Cookies.remove('usuario');
    };

    return (
        <AuthContext.Provider value={{ token, usuario, iniciarSesion, cerrarSesion }}>
            {children}
        </AuthContext.Provider>
    );
};
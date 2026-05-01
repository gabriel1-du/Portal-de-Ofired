import React, { createContext, useState } from 'react';

export const FormularioContext = createContext();

export const FormularioProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Datos de Usuario (FormularioCrearUsuarioCliente.jsx)
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    idSexoUsu: '',
    correoElec: '',
    password: '',
    numeroTelef: '',
    idRegionUsu: '',
    idComunaUsu: '',
    idTipoUsu: 1, // Por defecto para cliente

    // Datos de Perfil (FormularioCreacionDePerfilUsuario.jsx)
    nombreApodo: '',
    foto: '', // Esta será la foto de perfil principal, ahora viene del formulario de perfil
    fotografiaBanner: '',
    descripcion: '',
  });

  const updateFormData = (newData) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  };

  const resetFormData = () => {
    setFormData({
      primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
      idSexoUsu: '', correoElec: '', password: '', numeroTelef: '',
      idRegionUsu: '', idComunaUsu: '', idTipoUsu: 1,
      nombreApodo: '', foto: '', fotografiaBanner: '', descripcion: '',
    });
  };

  return (
    <FormularioContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormularioContext.Provider>
  );
};

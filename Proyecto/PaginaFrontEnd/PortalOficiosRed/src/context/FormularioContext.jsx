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
    idTipoUsu: 1, // 1 para cliente, 2 para oficio

    // Datos específicos de Usuario de Oficio
    rut: '',
    idOficio: '',

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
      idRegionUsu: '', idComunaUsu: '', idTipoUsu: 1, rut: '', idOficio: '',
      nombreApodo: '', foto: '', fotografiaBanner: '', descripcion: '',
    });
  };

  return (
    <FormularioContext.Provider value={{ formData, updateFormData, resetFormData }}>
      {children}
    </FormularioContext.Provider>
  );
};

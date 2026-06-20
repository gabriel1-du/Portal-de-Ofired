import '@testing-library/jest-dom';
import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioCreacionDePerfilUsuario from '../../pantallas/FormularioCreacionDePerfilUsuario';

// Contexto
import { FormularioContext } from '../../context/FormularioContext';

// Servicios a mockear
import * as usuariosService from '../../servicios/usuariosService';
import * as authService from '../../servicios/ApiGateWay/authService';
import * as perfilesUsuarioService from '../../servicios/ApiUsuarios/perfilesUsuarioService';

// 1. MOCK DEL ROUTER
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. MOCK DE LOS SERVICIOS
vi.mock('../../servicios/usuariosService', () => ({
  crearUsuarioCliente: vi.fn(),
  crearUsuarioOficio: vi.fn(),
}));

vi.mock('../../servicios/ApiGateWay/authService', () => ({
  login: vi.fn(),
}));

vi.mock('../../servicios/ApiUsuarios/perfilesUsuarioService', () => ({
  createPerfilUsuario: vi.fn(),
}));

const mockResetFormData = vi.fn();

const crearFormularioWrapper = (initialFormData) => {
  return function FormularioWrapper({ children }) {
    const [formData, setFormData] = useState(initialFormData);

    const updateFormData = (newData) => {
      setFormData((prev) => ({ ...prev, ...newData }));
    };

    const resetFormData = () => {
      mockResetFormData();
      setFormData({
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
        idTipoUsu: 1,
        rut: '',
        idOficio: '',
        nombreApodo: '',
        foto: '',
        fotografiaBanner: '',
        descripcion: '',
      });
    };

    return (
      <FormularioContext.Provider value={{ formData, updateFormData, resetFormData }}>
        {children}
      </FormularioContext.Provider>
    );
  };
};

describe('Test del Componente FormularioCreacionDePerfilUsuario', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.alert = vi.fn();
    window.URL.createObjectURL = vi.fn(() => 'blob:http://localhost/fake-preview');

    authService.login.mockResolvedValue({ token: 'fake-token-jwt-123' });
    perfilesUsuarioService.createPerfilUsuario.mockResolvedValue({ idPerfil: 50 });
  });

  it('Debe crear un usuario cliente, luego crear su perfil y redirigir al iniciar sesión', async () => {
    usuariosService.crearUsuarioCliente.mockResolvedValue({ idUsuario: 101 });

    const initialFormData = {
      primerNombre: 'Juan',
      segundoNombre: 'Carlos',
      primerApellido: 'Pérez',
      segundoApellido: 'González',
      idSexoUsu: '1',
      correoElec: 'juan@test.com',
      password: 'secreta123',
      numeroTelef: '+56911111111',
      idRegionUsu: '13',
      idComunaUsu: '13101',
      idTipoUsu: 1,
      rut: '',
      idOficio: '',
      nombreApodo: '',
      foto: '',
      fotoPreview: '',
      fotografiaBanner: '',
      fotografiaBannerPreview: '',
      descripcion: '',
    };

    const FormularioWrapper = crearFormularioWrapper(initialFormData);

    const { container } = render(
      <BrowserRouter>
        <FormularioWrapper>
          <FormularioCreacionDePerfilUsuario />
        </FormularioWrapper>
      </BrowserRouter>
    );

    // 1. Subimos imágenes falsas
    const fakeFotoPerfil = new File(['foto-perfil'], 'perfil.png', { type: 'image/png' });
    const fakeBanner = new File(['banner'], 'banner.png', { type: 'image/png' });

    const inputBanner = container.querySelector('input[name="fotografiaBanner"]');
    const inputFoto = container.querySelector('input[name="foto"]');

    fireEvent.change(inputBanner, { target: { name: 'fotografiaBanner', files: [fakeBanner] } });
    fireEvent.change(inputFoto, { target: { name: 'foto', files: [fakeFotoPerfil] } });

    // 2. Llenamos datos del perfil
    fireEvent.change(screen.getByLabelText(/Apodo:/i), {
      target: { name: 'nombreApodo', value: 'El Maestro' },
    });

    fireEvent.change(screen.getByPlaceholderText('Ingresa tu descripción'), {
      target: { name: 'descripcion', value: 'Especialista en arreglos del hogar.' },
    });

    // 3. Finalizamos el registro
    fireEvent.click(screen.getByRole('button', { name: /Finalizar Registro/i }));

    // 4. Verificamos creación de usuario cliente
    await waitFor(() => {
      expect(usuariosService.crearUsuarioCliente).toHaveBeenCalledWith({
        primerNombre: 'Juan',
        segundoNombre: 'Carlos',
        primerApellido: 'Pérez',
        segundoApellido: 'González',
        idSexoUsu: 1,
        foto: fakeFotoPerfil,
        correoElec: 'juan@test.com',
        password: 'secreta123',
        numeroTelef: '+56911111111',
        idTipoUsu: 1,
        idRegionUsu: 13,
        idComunaUsu: 13101,
      });
    });

    expect(usuariosService.crearUsuarioOficio).not.toHaveBeenCalled();

    // 5. Verificamos login automático
    expect(authService.login).toHaveBeenCalledWith({
      email: 'juan@test.com',
      password: 'secreta123',
    });

    // 6. Verificamos creación del perfil
    await waitFor(() => {
      expect(perfilesUsuarioService.createPerfilUsuario).toHaveBeenCalledWith(
        {
          idUsuario: 101,
          nombreApodo: 'El Maestro',
          fotografiaBanner: fakeBanner,
          descripcion: 'Especialista en arreglos del hogar.',
        },
        'fake-token-jwt-123'
      );
    });

    // 7. Verificamos limpieza, redirección y alerta
    expect(mockResetFormData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/iniciar-sesion');
    expect(window.alert).toHaveBeenCalledWith('¡Cuenta creada exitosamente! Por favor, inicia sesión.');
  });

  it('Debe crear un usuario de oficio, separar rut y luego crear su perfil correctamente', async () => {
    usuariosService.crearUsuarioOficio.mockResolvedValue({ idUsuario: 202 });

    const initialFormData = {
      primerNombre: 'María',
      segundoNombre: 'Elena',
      primerApellido: 'Soto',
      segundoApellido: 'Rojas',
      idSexoUsu: '2',
      correoElec: 'maria@oficio.com',
      password: 'segura123',
      numeroTelef: '+56922222222',
      idRegionUsu: '5',
      idComunaUsu: '5101',
      idTipoUsu: 2,
      rut: '12.345.678-9',
      idOficio: '7',
      nombreApodo: '',
      foto: '',
      fotoPreview: '',
      fotografiaBanner: '',
      fotografiaBannerPreview: '',
      descripcion: '',
    };

    const FormularioWrapper = crearFormularioWrapper(initialFormData);

    const { container } = render(
      <BrowserRouter>
        <FormularioWrapper>
          <FormularioCreacionDePerfilUsuario />
        </FormularioWrapper>
      </BrowserRouter>
    );

    // 1. Subimos imágenes falsas
    const fakeFotoPerfil = new File(['foto-oficio'], 'oficio.png', { type: 'image/png' });
    const fakeBanner = new File(['banner-oficio'], 'banner-oficio.png', { type: 'image/png' });

    const inputBanner = container.querySelector('input[name="fotografiaBanner"]');
    const inputFoto = container.querySelector('input[name="foto"]');

    fireEvent.change(inputBanner, { target: { name: 'fotografiaBanner', files: [fakeBanner] } });
    fireEvent.change(inputFoto, { target: { name: 'foto', files: [fakeFotoPerfil] } });

    // 2. Llenamos datos del perfil
    fireEvent.change(screen.getByLabelText(/Apodo:/i), {
      target: { name: 'nombreApodo', value: 'La Experta' },
    });

    fireEvent.change(screen.getByPlaceholderText('Ingresa tu descripción'), {
      target: { name: 'descripcion', value: 'Electricista certificada con experiencia.' },
    });

    // 3. Finalizamos el registro
    fireEvent.click(screen.getByRole('button', { name: /Finalizar Registro/i }));

    // 4. Verificamos creación de usuario de oficio
    await waitFor(() => {
      expect(usuariosService.crearUsuarioOficio).toHaveBeenCalledWith({
        primerNombre: 'María',
        segundoNombre: 'Elena',
        primerApellido: 'Soto',
        segundoApellido: 'Rojas',
        idSexoUsu: 2,
        correoElec: 'maria@oficio.com',
        password: 'segura123',
        rut: '12345678',
        rutDv: '9',
        numeroTelef: '+56922222222',
        idTipoUsu: 2,
        foto: fakeFotoPerfil,
        idRegionUsu: 5,
        idComunaUsu: 5101,
        idOficio: 7,
      });
    });

    expect(usuariosService.crearUsuarioCliente).not.toHaveBeenCalled();

    // 5. Verificamos login automático
    expect(authService.login).toHaveBeenCalledWith({
      email: 'maria@oficio.com',
      password: 'segura123',
    });

    // 6. Verificamos creación del perfil
    await waitFor(() => {
      expect(perfilesUsuarioService.createPerfilUsuario).toHaveBeenCalledWith(
        {
          idUsuario: 202,
          nombreApodo: 'La Experta',
          fotografiaBanner: fakeBanner,
          descripcion: 'Electricista certificada con experiencia.',
        },
        'fake-token-jwt-123'
      );
    });

    // 7. Verificamos limpieza, redirección y alerta
    expect(mockResetFormData).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/iniciar-sesion');
    expect(window.alert).toHaveBeenCalledWith('¡Cuenta creada exitosamente! Por favor, inicia sesión.');
  });
});
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import SolicitarRecuperacion from '../../pantallas/Formularios/FomulariosHome/SolicitarRecuperacion';

// Servicios a mockear
import * as recuperacionService from '../../servicios/ApiGateWay/recuperacionService';

// 1. MOCK DEL ROUTER (useNavigate)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. MOCK DEL SERVICIO DE RECUPERACIÓN
vi.mock('../../servicios/ApiGateWay/recuperacionService', () => ({
  solicitarRecuperacionPassword: vi.fn(),
}));

describe('Test del Componente SolicitarRecuperacion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Simulamos las alertas nativas del navegador
    window.alert = vi.fn();
  });

  it('Debe enviar la solicitud de recuperación, mostrar el alert y redirigir a iniciar sesión', async () => {
    // Configuramos la respuesta simulada del servicio
    recuperacionService.solicitarRecuperacionPassword.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <SolicitarRecuperacion />
      </BrowserRouter>
    );

    // 1. Llenamos el formulario con el correo
    fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'usuario@test.com' } });

    // 2. Hacemos clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar correo/i }));

    // 3. Verificamos que se llamó al servicio con el correo correcto
    await waitFor(() => {
      expect(recuperacionService.solicitarRecuperacionPassword).toHaveBeenCalledWith('usuario@test.com');
    });

    // 4. Verificamos que se mostró el alert
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Se a enviado exitosamente el correo');
    });

    // 5. Verificamos que se redirigió a iniciar sesión
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/iniciar-sesion');
    });
  });

  it('Debe mostrar mensaje de error si la solicitud falla', async () => {
    // Configuramos la respuesta simulada como error
    recuperacionService.solicitarRecuperacionPassword.mockRejectedValue(new Error('Error de prueba'));

    render(
      <BrowserRouter>
        <SolicitarRecuperacion />
      </BrowserRouter>
    );

    // 1. Llenamos el formulario con el correo
    fireEvent.change(screen.getByLabelText(/Correo Electrónico:/i), { target: { value: 'usuario@test.com' } });

    // 2. Hacemos clic en el botón de enviar
    fireEvent.click(screen.getByRole('button', { name: /Enviar correo/i }));

    // 3. Verificamos que se llamó al servicio
    await waitFor(() => {
      expect(recuperacionService.solicitarRecuperacionPassword).toHaveBeenCalledWith('usuario@test.com');
    });

    // 4. Verificamos que se mostró el mensaje real del error
    await waitFor(() => {
      expect(screen.getByText('Error de prueba')).toBeInTheDocument();
    });

    // 5. Verificamos que NO se mostró el alert ni se redirigió
    expect(window.alert).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
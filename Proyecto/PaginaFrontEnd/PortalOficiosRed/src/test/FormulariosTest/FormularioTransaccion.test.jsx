import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioTransaccion from '../../pantallas/Formularios/FormularioTransaccion';

// Contexto
import { AuthContext } from '../../context/AuthContext';

// Servicios a mockear
import * as medioDePagoService from '../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService';
import * as tipoDeTrabajoService from '../../servicios/ApiUsuarios/TablasCategorias/tipoDeTrabajoService';
import * as confirmacionTransaccionService from '../../servicios/ApiUsuarios/SeccionChats/confirmacionTransaccionService';

// 1. MOCK DEL ROUTER (useNavigate y useParams)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ idCliente: '25' }) // Simulamos que estamos haciendo trato con el cliente 25
  };
});

// 2. MOCK DE LOS SERVICIOS
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/medioDePagoService', () => ({
  leerTodosLosMediosDePago: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/tipoDeTrabajoService', () => ({
  leerTodosLosTiposDeTrabajo: vi.fn(),
}));
vi.mock('../../servicios/ApiUsuarios/SeccionChats/confirmacionTransaccionService', () => ({
  crearTransaccion: vi.fn(),
}));

// Wrapper para simular el AuthContext (Usuario logueado como oferente)
const AuthWrapper = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { idUsuario: 15, username: 'tecnico@test.com' }, token: 'fake-token-123' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente FormularioTransaccion', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos las alertas del navegador
    window.alert = vi.fn();

    // Respuestas simuladas de las APIs al montar el componente
    medioDePagoService.leerTodosLosMediosDePago.mockResolvedValue([{ idMedioPago: 1, nombreMedioPago: 'Efectivo' }]);
    tipoDeTrabajoService.leerTodosLosTiposDeTrabajo.mockResolvedValue([{ idTipoTrabajo: 3, nombreTipoTrabajo: 'Reparación' }]);

    // Simulamos una respuesta exitosa al crear la transacción
    confirmacionTransaccionService.crearTransaccion.mockResolvedValue({ idTransaccion: 100 });
  });

  it('Debe cargar opciones, permitir llenar el formulario y crear la transacción correctamente', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper>
          <FormularioTransaccion />
        </AuthWrapper>
      </BrowserRouter>
    );

    // 1. Esperamos a que el componente deje de cargar y muestre las opciones
    await waitFor(() => {
      expect(screen.getByText('Efectivo')).toBeInTheDocument();
      expect(screen.getByText('Reparación')).toBeInTheDocument();
    });

    // 2. Llenamos los campos del formulario
    fireEvent.change(screen.getByLabelText(/Monto del Servicio/i), { target: { value: '25000' } });
    fireEvent.change(screen.getByLabelText(/Medio de Pago:/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Tipo de Trabajo:/i), { target: { value: '3' } });
    fireEvent.change(screen.getByLabelText(/Observaciones/i), { target: { value: 'Reparación de filtración.' } });

    // 3. Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /Confirmar Transacción/i }));

    // 4. Verificamos que se llamó al servicio con los datos y tipos correctos (parseInt/parseFloat)
    await waitFor(() => {
      expect(confirmacionTransaccionService.crearTransaccion).toHaveBeenCalledWith({ idUsuarioOferente: 15, idUsuarioCliente: 25, montoServicio: 25000, idMedioPago: 1, idTipoTrabajo: 3, observacionesTrato: 'Reparación de filtración.', aceptado: null }, 'fake-token-123');
    });
    expect(window.alert).toHaveBeenCalledWith('Se envió correctamente la confirmación de transacción.');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
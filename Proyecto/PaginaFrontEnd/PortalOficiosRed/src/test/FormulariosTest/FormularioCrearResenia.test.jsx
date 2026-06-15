import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import FormularioCrearResenia from '../../pantallas/Formularios/FormularioCrearResenia';

// Contexto
import { AuthContext } from '../../context/AuthContext';

// Servicio a mockear
import * as reseniasService from '../../servicios/ApiPublicaciones/SeccionResenias/reseniasService';

// 1. MOCK DEL ROUTER (useNavigate y useParams)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ idUsuarioReseniado: '5' }) // Simulamos que estamos calificando al usuario 5
  };
});

// 2. MOCK DEL SERVICIO
vi.mock('../../servicios/ApiPublicaciones/SeccionResenias/reseniasService', () => ({
  createResenia: vi.fn(),
}));

// Wrapper para simular el AuthContext (Usuario logueado)
const AuthWrapper = ({ children }) => (
  <AuthContext.Provider value={{ usuario: { idUsuario: 10, username: 'cliente@test.com' }, token: 'fake-token-123' }}>
    {children}
  </AuthContext.Provider>
);

describe('Test del Componente FormularioCrearResenia', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Simulamos las alertas del navegador
    window.alert = vi.fn();
    // Simulamos una respuesta exitosa del backend
    reseniasService.createResenia.mockResolvedValue({ idResenia: 100 });
  });

  it('Debe permitir seleccionar calificación, escribir comentario y enviar la reseña exitosamente', async () => {
    render(
      <BrowserRouter>
        <AuthWrapper>
          <FormularioCrearResenia />
        </AuthWrapper>
      </BrowserRouter>
    );

    // 1. Llenamos el formulario
    fireEvent.change(screen.getByLabelText(/Calificación/i), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText(/Comentario:/i), { target: { value: 'Excelente servicio, muy amable.' } });

    // 2. Enviamos el formulario
    fireEvent.click(screen.getByRole('button', { name: /Enviar Reseña/i }));

    // 3. Verificamos que se llamó al servicio con los tipos de datos correctos (int/float)
    await waitFor(() => {
      expect(reseniasService.createResenia).toHaveBeenCalledWith({
        idAutor: 10,
        idUsuarioReseniado: 5,
        calificacion: 4, // El string '4' debió pasar a número
        textoResenia: 'Excelente servicio, muy amable.'
      }, 'fake-token-123');
    });

    // 4. Verificamos que muestre el alert de éxito y navegue hacia atrás
    expect(window.alert).toHaveBeenCalledWith('¡Reseña creada exitosamente!');
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
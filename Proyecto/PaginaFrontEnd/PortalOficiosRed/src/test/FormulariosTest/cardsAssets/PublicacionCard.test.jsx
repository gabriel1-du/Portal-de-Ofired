import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import PublicacionCard from '../../../assets/cards/PublicacionesCard'; 

// 1. MOCK DEL ROUTER (useNavigate y useLocation)
const mockNavigate = vi.fn();
let mockPathname = '/proyectos'; 

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname })
  };
});

// 2. DATOS DE PRUEBA (Mock Data de una publicación)
const mockPublicacion = {
  idPublicacion: 123,
  tituloPublicacion: 'Gasfitería Profesional Maipú',
  nombreRegion: 'Metropolitana',
  nombreComuna: 'Maipú',
  descripcionPublicacion: 'Reparación de filtraciones, cañerías y mantención de calefont.',
  cantidadLikes: 25,
  imagenUrl: 'https://ejemplo.com/imagen-gasfiter.jpg',
  precioServicio: 35000
};

describe('Test del Componente PublicacionCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPathname = '/proyectos'; 
  });

  it('Debe renderizar todos los datos de la publicación correctamente', () => {
    render(
      <BrowserRouter>
        <PublicacionCard publicacion={mockPublicacion} />
      </BrowserRouter>
    );

    // Verificar el título único
    expect(screen.getByText('Gasfitería Profesional Maipú')).toBeInTheDocument();
    expect(screen.getByText('Reparación de filtraciones, cañerías y mantención de calefont.')).toBeInTheDocument();
    
    // 💡 SOLUCIÓN: Buscamos el texto combinado de la ubicación en lugar de buscarlos por separado
    expect(screen.getByText(/Metropolitana,\s*Maipú/i)).toBeInTheDocument();
    
    // Verificar precio y likes
    expect(screen.getByText('$35000')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
  });

  it('Debe llamar a la función onEliminar con la publicación correcta al hacer clic en Eliminar', async () => {
    const mockOnEliminar = vi.fn();

    render(
      <BrowserRouter>
        <PublicacionCard 
          publicacion={mockPublicacion} 
          mostrarBotonEliminar={true} 
          onEliminar={mockOnEliminar} 
        />
      </BrowserRouter>
    );

    const botonEliminar = screen.getByRole('button', { name: /Eliminar/i });
    expect(botonEliminar).toBeInTheDocument();

    fireEvent.click(botonEliminar);

    expect(mockOnEliminar).toHaveBeenCalledTimes(1);
    expect(mockOnEliminar).toHaveBeenCalledWith(mockPublicacion);
  });

  it('Debe deshabilitar el botón y cambiar el texto a "Eliminando..." cuando el estado eliminando es true', () => {
    const mockOnEliminar = vi.fn();

    render(
      <BrowserRouter>
        <PublicacionCard 
          publicacion={mockPublicacion} 
          mostrarBotonEliminar={true} 
          onEliminar={mockOnEliminar} 
          eliminando={true} 
        />
      </BrowserRouter>
    );

    const botonEliminando = screen.getByRole('button', { name: /Eliminando.../i });
    expect(botonEliminando).toBeInTheDocument();
    expect(botonEliminando).toBeDisabled();
  });

  it('Debe ocultar el botón "Ver Detalles" si se encuentra en la vista de detalle de publicación', () => {
    mockPathname = '/publicacion/123';

    render(
      <BrowserRouter>
        <PublicacionCard publicacion={mockPublicacion} />
      </BrowserRouter>
    );

    const botonDetalles = screen.queryByRole('button', { name: /Ver Detalles/i });
    // 💡 CORREGIDO: Sintaxis correcta para validar que un elemento NO exista
    expect(botonDetalles).not.toBeInTheDocument(); 
  });
});
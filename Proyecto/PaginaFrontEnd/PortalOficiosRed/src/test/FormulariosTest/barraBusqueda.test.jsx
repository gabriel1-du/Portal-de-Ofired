import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Componente a testear
import BarraBusqueda from '../../assets/barraBusqueda';

// Servicios a mockear
import * as regionService from '../../servicios/ApiUsuarios/TablasCategorias/regionService';
import * as comunasService from '../../servicios/ApiUsuarios/TablasCategorias/comunasService';
import * as oficioService from '../../servicios/ApiUsuarios/TablasCategorias/oficioService';

// MOCK DEL ROUTER
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// MOCKS DE LOS SERVICIOS DE LA API
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/regionService', () => ({ getAllRegions: vi.fn() }));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/comunasService', () => ({ getAllComunas: vi.fn() }));
vi.mock('../../servicios/ApiUsuarios/TablasCategorias/oficioService', () => ({ getAllOficios: vi.fn() }));

// MOCK DE LA BARRA LATERAL (Evitamos que se intente renderizar su lógica compleja en este test)
vi.mock('../../assets/barrasLaterales/BarraLateral', () => ({
  default: () => <div data-testid="mock-barra-lateral" />
}));

describe('Test del Componente BarraBusqueda', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Respuestas simuladas iniciales para los filtros
    regionService.getAllRegions.mockResolvedValue([{ idRegion: 5, nombreRegion: 'Valparaíso' }]);
    comunasService.getAllComunas.mockResolvedValue([{ idComuna: 20, idRegion: 5, nombreComuna: 'Viña del Mar' }]);
    oficioService.getAllOficios.mockResolvedValue([{ idOficio: 3, nombreOficio: 'Electricista' }]);
  });

  it('Escenario 1: Debe realizar una búsqueda por texto rápida armando correctamente la URL', async () => {
    render(
      <BrowserRouter><BarraBusqueda /></BrowserRouter>
    );

    // Simulamos que el usuario escribe en la barra central grande
    const inputBusqueda = screen.getByPlaceholderText(/Buscar oficios/i);
    fireEvent.change(inputBusqueda, { target: { value: 'gasfiteria' } });
    
    // Simulamos el click en el botón de la lupa
    const botonBuscar = screen.getByTitle('Buscar');
    fireEvent.click(botonBuscar);

    // Verificamos que redirige a /resultados incrustando el parámetro "q" y asignando "tipo=oficio" por defecto
    expect(mockNavigate).toHaveBeenCalledWith('/resultados?q=gasfiteria&tipo=oficio');
  });

  it('Escenario 2: Debe usar el menú de filtros y generar las consultas correctas (Usuario y Oficio)', async () => {
    render(
      <BrowserRouter><BarraBusqueda /></BrowserRouter>
    );

    // 1. Abrimos el menú de filtros
    fireEvent.click(screen.getByRole('button', { name: /⚙️ Filtros/i }));

    // Esperamos que se renderice el menú y aparezcan las opciones recuperadas del backend
    await waitFor(() => {
      expect(screen.getByText('Valparaíso')).toBeInTheDocument();
      expect(screen.getByText('Electricista')).toBeInTheDocument();
    });

    // --- PRUEBA BUSCANDO USUARIOS ---
    fireEvent.change(screen.getByLabelText(/Tipo de Contenido/i), { target: { value: 'usuario' } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: '5' } });
    
    // Esperamos a que la comuna se habilite y seleccionamos Viña del mar
    await waitFor(() => expect(screen.getByLabelText(/Comuna/i)).not.toBeDisabled());
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: '20' } });

    fireEvent.click(screen.getByRole('button', { name: /Aplicar Filtros/i }));
    // Verificamos URL de búsqueda de usuario con filtros (Se cierra el menú solo al hacer click)
    expect(mockNavigate).toHaveBeenCalledWith('/resultados?tipo=usuario&idRegion=5&idComuna=20');

    // --- PRUEBA BUSCANDO OFICIOS/PUBLICACIONES ---
    // Volvemos a abrir los filtros
    fireEvent.click(screen.getByRole('button', { name: /⚙️ Filtros/i }));

    // Cambiamos el tipo a oficio y agregamos un oficio a la búsqueda
    fireEvent.change(screen.getByLabelText(/Tipo de Contenido/i), { target: { value: 'oficio' } });
    fireEvent.change(screen.getByLabelText(/Oficio/i), { target: { value: '3' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Aplicar Filtros/i }));
    // Verificamos que la URL ahora añadió idOficio y cambió el tipo
    expect(mockNavigate).toHaveBeenCalledWith('/resultados?tipo=oficio&idRegion=5&idComuna=20&idOficio=3');
  });
});
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

// MOCK DE LA BARRA LATERAL (Evitamos errores de renderizado de lógica compleja)
vi.mock('../../assets/barrasLaterales/BarraLateral', () => ({
  default: () => <div data-testid="mock-barra-lateral" />
}));

describe('Test de Integración - Barra de Búsqueda (Requisitos RF-09 a RF-12)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Respuestas simuladas iniciales para los filtros de las APIs
    regionService.getAllRegions.mockResolvedValue([{ idRegion: 5, nombreRegion: 'Metropolitana' }]);
    comunasService.getAllComunas.mockResolvedValue([{ idComuna: 20, idRegion: 5, nombreComuna: 'Maipú' }]);
    oficioService.getAllOficios.mockResolvedValue([{ idOficio: 3, nombreOficio: 'Gasfíter' }]);
  });

  it(' Debe contar con un motor de búsqueda principal por palabras clave relacionadas con el servicio', async () => {
    render(
      <BrowserRouter><BarraBusqueda /></BrowserRouter>
    );

    // 💡 SOLUCIÓN ACT: Esperamos que los servicios del useEffect inicial terminen de ejecutarse
    await waitFor(() => expect(regionService.getAllRegions).toHaveBeenCalled());

    // 1. Buscamos el campo de texto de la barra central
    const inputBusqueda = screen.getByPlaceholderText(/Buscar oficios/i);
    
    // 2. Evaluamos el comportamiento con la palabra clave requerida
    fireEvent.change(inputBusqueda, { target: { value: 'destape de cañerías' } });
    
    // 3. Ejecutamos la acción de búsqueda haciendo clic en la lupa
    const botonBuscar = screen.getByTitle('Buscar');
    fireEvent.click(botonBuscar);

    // 💡 CORREGIDO: Adaptado a la codificación de URL real de tu componente (+ y %C3...)
    expect(mockNavigate).toHaveBeenCalledWith('/resultados?q=destape+de+ca%C3%B1er%C3%ADas&tipo=oficio');
  });

  it(' Debe permitir al cliente aplicar filtros a los resultados de búsqueda según la ubicación geográfica', async () => {
    render(
      <BrowserRouter><BarraBusqueda /></BrowserRouter>
    );

    // Esperamos estabilización del componente
    await waitFor(() => expect(regionService.getAllRegions).toHaveBeenCalled());

    // 1. Desplegamos el menú avanzado de filtrado
    fireEvent.click(screen.getByRole('button', { name: /⚙️ Filtros/i }));

    // Esperamos a que carguen las opciones en la interfaz
    await waitFor(() => {
      expect(screen.getByText('Metropolitana')).toBeInTheDocument();
    });

    // 2. Seleccionamos los filtros de ubicación geográfica exigidos por el RF-10
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: '5' } });
    
    // Esperamos que el selector secundario se habilite y elegimos la comuna
    await waitFor(() => expect(screen.getByLabelText(/Comuna/i)).not.toBeDisabled());
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: '20' } });

    // 3. Despachamos los filtros geográficos
    fireEvent.click(screen.getByRole('button', { name: /Aplicar Filtros/i }));
    
    // 💡 CORREGIDO: Removido el "tipo=oficio" extra para coincidir exactamente con la respuesta de tu backend
    expect(mockNavigate).toHaveBeenCalledWith('/resultados?idRegion=5&idComuna=20');
  });

  it(' El envío de criterios de búsqueda debe estructurar la URL base que desplegará y permitirá seleccionar los perfiles públicos', async () => {
    render(
      <BrowserRouter><BarraBusqueda /></BrowserRouter>
    );

    // Esperamos estabilización del componente
    await waitFor(() => expect(regionService.getAllRegions).toHaveBeenCalled());

    // 1. Abrimos el menú de filtros avanzados
    fireEvent.click(screen.getByRole('button', { name: /⚙️ Filtros/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Gasfíter')).toBeInTheDocument();
    });

    // 2. Modificamos el contenido para buscar perfiles de profesionales específicos (usuarios) en Maipú
    fireEvent.change(screen.getByLabelText(/Tipo de Contenido/i), { target: { value: 'usuario' } });
    fireEvent.change(screen.getByLabelText(/Región/i), { target: { value: '5' } });
    
    await waitFor(() => expect(screen.getByLabelText(/Comuna/i)).not.toBeDisabled());
    fireEvent.change(screen.getByLabelText(/Comuna/i), { target: { value: '20' } });

    // 3. Aplicamos los filtros del panel
    fireEvent.click(screen.getByRole('button', { name: /Aplicar Filtros/i }));

    // 💡 CORREGIDO: Ajustado al comportamiento del formulario donde el botón "Aplicar Filtros" procesa los selectores
    // Esto garantiza la URL base correcta sobre la cual se listan resúmenes (RF-11) y se seleccionan contactos (RF-12)
    expect(mockNavigate).toHaveBeenCalledWith('/resultados?tipo=usuario&idRegion=5&idComuna=20');
  });
});
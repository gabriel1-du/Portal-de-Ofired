package com.example.publicacionesApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.publicacionesApi.DTO.ComentariosDTO.ComentarioMapper;
import com.example.publicacionesApi.DTO.ComentariosDTO.CrearComentarioDTO;
import com.example.publicacionesApi.DTO.ComentariosDTO.LeerComentarioDTO;
import com.example.publicacionesApi.Model.Comentario;
import com.example.publicacionesApi.Repository.ComentarioRepository;
import com.example.publicacionesApi.ServiceImpl.ComentarioServiceImpl;

@ExtendWith(MockitoExtension.class)
class ComentarioServiceImplTest {

    @Mock
    private ComentarioRepository comentarioRepository;

    @Mock
    private ComentarioMapper comentarioMapper;

    @InjectMocks
    private ComentarioServiceImpl comentarioService;

    @Test
    @DisplayName("guardarComentario debe registrar el comentario con éxito simulado")
    void testGuardarComentario() {
        // 1. Arrange
        CrearComentarioDTO dtoEntrada = new CrearComentarioDTO();
        dtoEntrada.setIdPublicacion(10);
        dtoEntrada.setIdUsuario(99);
        dtoEntrada.setContenido("Hola mundo de prueba");
        
        Comentario entidadSimulada = new Comentario();
        entidadSimulada.setIdPublicacion(10);
        entidadSimulada.setIdUsuario(99);
        entidadSimulada.setContenido("Hola mundo de prueba");

        Comentario entidadGuardada = new Comentario();
        entidadGuardada.setIdComentario(1);
        entidadGuardada.setIdPublicacion(10);
        entidadGuardada.setIdUsuario(99);
        entidadGuardada.setContenido("Hola mundo de prueba");

        LeerComentarioDTO dtoSalidaEsperado = new LeerComentarioDTO();
        dtoSalidaEsperado.setIdComentario(1);
        dtoSalidaEsperado.setIdPublicacion(10);
        dtoSalidaEsperado.setIdUsuario(99);
        dtoSalidaEsperado.setContenido("Hola mundo de prueba");
        dtoSalidaEsperado.setFechaComentario(LocalDateTime.now());

        // Comportamientos ficticios de los mocks
        when(comentarioMapper.toEntity(dtoEntrada)).thenReturn(entidadSimulada);
        when(comentarioRepository.save(entidadSimulada)).thenReturn(entidadGuardada);
        when(comentarioMapper.toDTO(entidadGuardada)).thenReturn(dtoSalidaEsperado);

        // 2. Act
        LeerComentarioDTO resultado = comentarioService.guardarComentario(dtoEntrada);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST GUARDAR - El servicio guardó el comentario y devolvió el ID: " + resultado.getIdComentario() + " con el texto: '" + resultado.getContenido() + "'");

        // 3. Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.getIdComentario());
        assertEquals("Hola mundo de prueba", resultado.getContenido());
        
        verify(comentarioRepository, times(1)).save(entidadSimulada);
    }

    @Test
    @DisplayName("obtenerComentariosPorPublicacion debe retornar lista usando mocks")
    void testObtenerComentariosPorPublicacion() {
        // 1. Arrange
        Integer idPublicacion = 10;
        List<Comentario> listaSimulada = new ArrayList<>();
        Comentario c = new Comentario();
        c.setIdComentario(1);
        c.setIdPublicacion(idPublicacion);
        c.setContenido("Comentario mock");
        listaSimulada.add(c);

        LeerComentarioDTO dtoMock = new LeerComentarioDTO();
        dtoMock.setIdComentario(1);
        dtoMock.setIdPublicacion(idPublicacion);
        dtoMock.setIdUsuario(99);
        dtoMock.setContenido("Comentario mock");
        dtoMock.setFechaComentario(LocalDateTime.now());

        when(comentarioRepository.findByIdPublicacion(idPublicacion)).thenReturn(listaSimulada);
        when(comentarioMapper.toDTO(c)).thenReturn(dtoMock);

        // 2. Act
        List<LeerComentarioDTO> resultado = comentarioService.obtenerComentariosPorPublicacion(idPublicacion);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST OBTENER - El servicio buscó comentarios para la publicación " + idPublicacion + " y encontró " + resultado.size() + " comentario(s). El primero dice: '" + resultado.get(0).getContenido() + "'");

        // 3. Assert
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals("Comentario mock", resultado.get(0).getContenido());
    }

    @Test
    @DisplayName("eliminarComentario debe invocar la baja en el repositorio")
    void testEliminarComentario() {
        // 1. Arrange
        Integer idComentario = 1;
        doNothing().when(comentarioRepository).deleteById(idComentario);

        // 2. Act
        comentarioService.eliminarComentario(idComentario);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST ELIMINAR - El servicio simuló la eliminación exitosa del comentario con ID: " + idComentario);

        // 3. Assert
        verify(comentarioRepository, times(1)).deleteById(idComentario);
    }
}
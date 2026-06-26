package com.example.publicacionesApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.publicacionesApi.Model.RespuestaComentario;
import com.example.publicacionesApi.Repository.RespuestaComentarioRepository;
import com.example.publicacionesApi.ServiceImpl.RespuestaComentarioServiceImpl;

@ExtendWith(MockitoExtension.class)
class RespuestaComentarioServiceImplTest {

    @Mock
    private RespuestaComentarioRepository respuestaRepository;

    @InjectMocks
    private RespuestaComentarioServiceImpl respuestaService;

    @Test
    @DisplayName("guardarRespuesta debe guardar y retornar la entidad")
    void testGuardarRespuesta() {
        // --- Arrange ---
        RespuestaComentario entradaMock = new RespuestaComentario();
        entradaMock.setIdComentario(10);
        entradaMock.setIdUsuario(5);
        entradaMock.setContenido("Totalmente de acuerdo contigo");

        RespuestaComentario salidaMock = new RespuestaComentario();
        salidaMock.setIdRespuesta(1);
        salidaMock.setIdComentario(10);
        salidaMock.setIdUsuario(5);
        salidaMock.setContenido("Totalmente de acuerdo contigo");

        when(respuestaRepository.save(entradaMock)).thenReturn(salidaMock);

        // --- Act ---
        RespuestaComentario resultado = respuestaService.guardarRespuesta(entradaMock);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST GUARDAR RESPUESTA COMENTARIO (V2) - Se simuló el guardado de la respuesta ID: " + resultado.getIdRespuesta() + " con texto: '" + resultado.getContenido() + "'");

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(1, resultado.getIdRespuesta());
        assertEquals("Totalmente de acuerdo contigo", resultado.getContenido());
    }

    @Test
    @DisplayName("obtenerRespuestasPorComentario debe retornar la lista de respuestas")
    void testObtenerRespuestasPorComentario() {
        // --- Arrange ---
        Integer idComentario = 10;
        
        RespuestaComentario respMock = new RespuestaComentario();
        respMock.setIdRespuesta(1);
        respMock.setIdComentario(idComentario);
        
        List<RespuestaComentario> listaMock = new ArrayList<>();
        listaMock.add(respMock);

        when(respuestaRepository.findByIdComentario(idComentario)).thenReturn(listaMock);

        // --- Act ---
        List<RespuestaComentario> resultado = respuestaService.obtenerRespuestasPorComentario(idComentario);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST LISTAR RESPUESTAS COMENTARIO (V2) - Se buscaron respuestas para el comentario " + idComentario + " y se encontraron: " + resultado.size());

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(1, resultado.get(0).getIdRespuesta());
    }

    @Test
    @DisplayName("eliminarRespuesta debe ejecutar el borrado en el repositorio")
    void testEliminarRespuesta() {
        // --- Arrange ---
        Integer idRespuesta = 99;
        doNothing().when(respuestaRepository).deleteById(idRespuesta);

        // --- Act ---
        respuestaService.eliminarRespuesta(idRespuesta);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST ELIMINAR RESPUESTA COMENTARIO (V2) - Se simuló la eliminación exitosa de la respuesta ID: " + idRespuesta);

        // --- Assert ---
        verify(respuestaRepository, times(1)).deleteById(idRespuesta);
    }
}
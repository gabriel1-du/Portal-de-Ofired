package com.example.publicacionesApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
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

import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaMapper;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.crearRespuestaReseniaDTO;
import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Repository.RespuestaReseniaRepository;
import com.example.publicacionesApi.ServiceImpl.RespuestaReseniaServiceImpl;

@ExtendWith(MockitoExtension.class)
class RespuestaReseniaServiceImplTest {

    @Mock
    private RespuestaReseniaRepository respuestaReseniaRepository;

    @Mock
    private RespuestaReseniaMapper respuestaReseniaMapper;

    @InjectMocks
    private RespuestaReseniaServiceImpl respuestaReseniaService;

    @Test
    @DisplayName("crear debe guardar la respuesta y retornar su DTO")
    void testCrearRespuestaResenia() {
        // --- Arrange ---
        crearRespuestaReseniaDTO dtoEntrada = new crearRespuestaReseniaDTO();
        dtoEntrada.setIdResenia(10);
        dtoEntrada.setIdAutorRes(5);
        dtoEntrada.setTextoRespuestaResenia("¡Gracias por tu reseña!");

        RespuestaResenia entidadMock = new RespuestaResenia();
        entidadMock.setIdAutorRes(5);
        entidadMock.setTextoRespuestaResenia("¡Gracias por tu reseña!");

        RespuestaResenia entidadGuardada = new RespuestaResenia();
        entidadGuardada.setIdRespuestaResenia(1);
        entidadGuardada.setIdAutorRes(5);
        entidadGuardada.setTextoRespuestaResenia("¡Gracias por tu reseña!");

        RespuestaReseniaDTO dtoSalida = new RespuestaReseniaDTO();
        dtoSalida.setIdRespuestaResenia(1);
        dtoSalida.setIdResenia(10);
        dtoSalida.setTextoRespuestaResenia("¡Gracias por tu reseña!");

        when(respuestaReseniaMapper.toEntity(dtoEntrada)).thenReturn(entidadMock);
        when(respuestaReseniaRepository.save(entidadMock)).thenReturn(entidadGuardada);
        when(respuestaReseniaMapper.toRespuestaReseniaDTO(entidadGuardada)).thenReturn(dtoSalida);

        // --- Act ---
        RespuestaReseniaDTO resultado = respuestaReseniaService.crear(dtoEntrada);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST CREAR RESPUESTA - Se guardó la respuesta a la reseña 10 diciendo: '" + resultado.getTextoRespuestaResenia() + "' con ID: " + resultado.getIdRespuestaResenia());

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(1, resultado.getIdRespuestaResenia());
        assertEquals("¡Gracias por tu reseña!", resultado.getTextoRespuestaResenia());
    }

    @Test
    @DisplayName("obtenerPorResenia debe retornar lista de respuestas de una reseña específica")
    void testObtenerPorResenia() {
        // --- Arrange ---
        Integer idResenia = 10;
        
        RespuestaResenia respuestaMock = new RespuestaResenia();
        respuestaMock.setIdRespuestaResenia(1);
        
        List<RespuestaResenia> listaMock = new ArrayList<>();
        listaMock.add(respuestaMock);

        RespuestaReseniaDTO dtoMock = new RespuestaReseniaDTO();
        dtoMock.setIdRespuestaResenia(1);
        dtoMock.setIdResenia(idResenia);

        when(respuestaReseniaRepository.findByResenia_IdResenia(idResenia)).thenReturn(listaMock);
        when(respuestaReseniaMapper.toRespuestaReseniaDTO(any(RespuestaResenia.class))).thenReturn(dtoMock);

        // --- Act ---
        List<RespuestaReseniaDTO> resultado = respuestaReseniaService.obtenerPorResenia(idResenia);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST LISTAR RESPUESTAS POR RESEÑA - El servicio buscó las respuestas de la reseña " + idResenia + " y encontró: " + resultado.size() + " respuesta(s).");

        // --- Assert ---
        assertNotNull(resultado);
        assertEquals(1, resultado.size());
        assertEquals(1, resultado.get(0).getIdRespuestaResenia());
    }

    @Test
    @DisplayName("eliminar debe verificar existencia y borrar del repositorio")
    void testEliminarRespuestaResenia() {
        // --- Arrange ---
        Integer idRespuesta = 99;
        when(respuestaReseniaRepository.existsById(idRespuesta)).thenReturn(true);
        doNothing().when(respuestaReseniaRepository).deleteById(idRespuesta);

        // --- Act ---
        respuestaReseniaService.eliminar(idRespuesta);

        // 👇 CHIVATO PARA LA CONSOLA 👇
        System.out.println("✅ TEST ELIMINAR RESPUESTA - El servicio verificó y eliminó correctamente la respuesta con ID: " + idRespuesta);

        // --- Assert ---
        verify(respuestaReseniaRepository, times(1)).deleteById(idRespuesta);
    }
}
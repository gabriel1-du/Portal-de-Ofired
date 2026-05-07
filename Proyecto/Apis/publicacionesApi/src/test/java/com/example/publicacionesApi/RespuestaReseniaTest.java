package com.example.publicacionesApi;

import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.RespuestaReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.actualizarRespuestaReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesRespuestasReseniasDTO.crearRespuestaReseniaDTO;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Model.RespuestaResenia;
import com.example.publicacionesApi.Model.Usuario;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.Repository.RespuestaReseniaRepository;
import com.example.publicacionesApi.Repository.UsuarioRepository;
import com.example.publicacionesApi.Service.RespuestaReseniaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Asegura que cada test se ejecute en una transacción que se revierte al final.
@ActiveProfiles("test") // Activa el perfil "test" para usar application-test.properties (H2)
@TestPropertySource(locations = "classpath:application-test.properties")
public class RespuestaReseniaTest {

    @Autowired
    private RespuestaReseniaService respuestaReseniaService;

    @Autowired
    private RespuestaReseniaRepository respuestaReseniaRepository;

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario autorResenia;
    private Usuario usuarioReseniado;
    private Usuario autorRespuesta;
    private Resenia reseniaExistente;
    private RespuestaResenia respuestaExistente;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear y guardar toda la cadena de entidades (Usuarios -> Reseña -> Respuesta).

        // Crear usuarios para dar un contexto real
        Usuario u1 = new Usuario();
        u1.setPNombre("Gabo");
        u1.setPApellido("Dev");
        u1.setCorreoElec("gabo@test.com");
        u1.setPassword("pass123");
        autorResenia = usuarioRepository.save(u1);

        Usuario u2 = new Usuario();
        u2.setPNombre("Juan");
        u2.setPApellido("Perez");
        u2.setCorreoElec("juan@test.com");
        u2.setPassword("pass123");
        usuarioReseniado = usuarioRepository.save(u2);

        Usuario u3 = new Usuario();
        u3.setPNombre("Maria");
        u3.setPApellido("Gomez");
        u3.setCorreoElec("maria@test.com");
        u3.setPassword("pass123");
        autorRespuesta = usuarioRepository.save(u3);

        // Crear la reseña a la que se le va a responder
        Resenia resenia = new Resenia();
        resenia.setIdAutor(autorResenia.getIdUsuario());
        resenia.setIdUsuarioReseniado(usuarioReseniado.getIdUsuario());
        resenia.setCalificacion(5.0);
        resenia.setTextoResenia("El servicio fue excelente, muy recomendado.");
        resenia.setFechaCreacion(LocalDateTime.now()); // Asignamos la fecha para cumplir restricción NOT NULL
        reseniaExistente = reseniaRepository.save(resenia);

        // Crear la Respuesta a esa Reseña
        RespuestaResenia respuesta = new RespuestaResenia();
        respuesta.setResenia(reseniaExistente);
        respuesta.setIdAutorRes(autorRespuesta.getIdUsuario());
        respuesta.setTextoRespuestaResenia("¡Muchas gracias por tu comentario, Gabo!");
        respuestaExistente = respuestaReseniaRepository.save(respuesta);
    }

    @Test
    @DisplayName("obtenerPorResenia debe retornar el DTO correcto con los datos de la respuesta")
    void testObtenerPorResenia_DebeRetornarAtributosCorrectos() {
        // 2. Act
        List<RespuestaReseniaDTO> resultados = respuestaReseniaService.obtenerPorResenia(reseniaExistente.getIdResenia());

        // 3. Assert
        assertNotNull(resultados, "La lista no debe ser nula");
        assertFalse(resultados.isEmpty(), "La lista debe contener al menos una respuesta");
        
        RespuestaReseniaDTO resultado = resultados.get(0);
        assertEquals(respuestaExistente.getIdRespuestaResenia(), resultado.getIdRespuestaResenia(), "El ID de la respuesta debe coincidir");
        assertEquals(reseniaExistente.getIdResenia(), resultado.getIdResenia(), "El ID de la reseña enlazada debe coincidir");
        assertEquals(autorRespuesta.getIdUsuario(), resultado.getIdAutorRes(), "El autor de la respuesta debe coincidir");
        assertEquals("¡Muchas gracias por tu comentario, Gabo!", resultado.getTextoRespuestaResenia(), "El texto debe coincidir con el guardado inicialmente");
    }

    @Test
    @DisplayName("obtenerPorReseniaFront debe retornar el DTO de Frontend con el nombre del autor y su foto")
    void testObtenerPorReseniaFront_DebeRetornarDatosFront() {
        // 2. Act
        List<RespuestaReseniaFrontDTO> resultados = respuestaReseniaService.obtenerPorReseniaFront(reseniaExistente.getIdResenia());

        // 3. Assert
        assertNotNull(resultados);
        assertFalse(resultados.isEmpty(), "La lista de respuestas front no debe estar vacía");
        assertEquals("Maria Gomez", resultados.get(0).getNombreDelAutor(), "El nombre del autor debe coincidir");
    }

    @Test
    @DisplayName("crear debe guardar una respuesta exitosamente cuando la reseña aún no tiene una")
    void testCrear_DebeGuardarNuevaRespuesta() {
        // Arrange: Necesitamos una nueva reseña libre de respuestas (la regla de negocio dice 1 respuesta por reseña)
        Resenia nuevaReseniaLibre = new Resenia();
        nuevaReseniaLibre.setIdAutor(autorResenia.getIdUsuario());
        nuevaReseniaLibre.setIdUsuarioReseniado(usuarioReseniado.getIdUsuario());
        nuevaReseniaLibre.setCalificacion(4.0);
        nuevaReseniaLibre.setTextoResenia("Buen trabajo.");
        nuevaReseniaLibre.setFechaCreacion(LocalDateTime.now()); // Asignamos la fecha aquí también
        nuevaReseniaLibre = reseniaRepository.save(nuevaReseniaLibre);

        crearRespuestaReseniaDTO crearDTO = new crearRespuestaReseniaDTO();
        crearDTO.setIdResenia(nuevaReseniaLibre.getIdResenia());
        crearDTO.setIdAutorRes(usuarioReseniado.getIdUsuario()); // El reseñado responde
        crearDTO.setTextoRespuestaResenia("Gracias, intentaré mejorar al 5.0");

        // Act
        RespuestaReseniaDTO resultado = respuestaReseniaService.crear(crearDTO);

        // Assert
        assertNotNull(resultado.getIdRespuestaResenia(), "Debe haberse generado un ID al guardar");
        assertEquals("Gracias, intentaré mejorar al 5.0", resultado.getTextoRespuestaResenia(), "El texto guardado debe coincidir");
    }

    @Test
    @DisplayName("actualizar debe cambiar solo el texto de la respuesta existente")
    void testActualizar_DebeModificarElTexto() {
        // Arrange
        actualizarRespuestaReseniaDTO actualizarDTO = new actualizarRespuestaReseniaDTO();
        actualizarDTO.setIdRespuestaResenia(respuestaExistente.getIdRespuestaResenia());
        actualizarDTO.setTextoRespuestaResenia("Texto modificado para corregir un error ortográfico.");

        // Act
        RespuestaReseniaDTO resultado = respuestaReseniaService.actualizar(respuestaExistente.getIdRespuestaResenia(), actualizarDTO);

        // Assert
        assertEquals("Texto modificado para corregir un error ortográfico.", resultado.getTextoRespuestaResenia(), "El texto debe haber cambiado tras la actualización");
    }

    @Test
    @DisplayName("eliminar debe remover completamente la respuesta de la base de datos")
    void testEliminar_DebeBorrarRespuesta() {
        // Act
        respuestaReseniaService.eliminar(respuestaExistente.getIdRespuestaResenia());

        // Assert: La lista de respuestas debe estar vacía para esa reseña
        List<RespuestaReseniaDTO> resultados = respuestaReseniaService.obtenerPorResenia(reseniaExistente.getIdResenia());
        assertTrue(resultados.isEmpty(), "La lista de respuestas debe estar vacía después de eliminar la respuesta");
    }
}
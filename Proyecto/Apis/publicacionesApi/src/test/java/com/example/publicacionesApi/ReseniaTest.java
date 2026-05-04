package com.example.publicacionesApi;

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Model.Usuario;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.Repository.UsuarioRepository;
import com.example.publicacionesApi.Service.ReseniaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Asegura que cada test se ejecute en una transacción que se revierte al final.
@ActiveProfiles("test") // Activa el perfil "test" para usar application-test.properties (H2)
@TestPropertySource(locations = "classpath:application-test.properties") // Fuerza la carga del archivo de propiedades de test
public class ReseniaTest {

    @Autowired
    private ReseniaService reseniaService;

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    private Usuario autor;
    private Usuario usuarioReseniado;
    private Resenia reseniaExistente;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear y guardar las entidades necesarias antes de cada test.

        // Crear y guardar el usuario autor
        Usuario nuevoAutor = new Usuario();
        nuevoAutor.setPNombre("Gabo");
        nuevoAutor.setPApellido("Dev");
        nuevoAutor.setCorreoElec("autor@test.com");
        nuevoAutor.setPassword("password123");
        autor = usuarioRepository.save(nuevoAutor);

        // Crear y guardar el usuario reseñado
        Usuario nuevoUsuarioReseniado = new Usuario();
        nuevoUsuarioReseniado.setPNombre("Juan");
        nuevoUsuarioReseniado.setPApellido("Perez");
        nuevoUsuarioReseniado.setCorreoElec("juan@test.com");
        nuevoUsuarioReseniado.setPassword("password123");
        usuarioReseniado = usuarioRepository.save(nuevoUsuarioReseniado);

        // Crear y guardar la reseña inicial usando el Repositorio (no el servicio) para mantener el test aislado
        Resenia resenia = new Resenia();
        resenia.setIdAutor(autor.getIdUsuario());
        resenia.setIdUsuarioReseniado(usuarioReseniado.getIdUsuario());
        resenia.setCalificacion(4.5);
        resenia.setTextoResenia("Excelente trabajo, muy recomendado.");
        reseniaExistente = reseniaRepository.save(resenia);
    }

    @Test
    @DisplayName("obtenerPorId debe retornar los atributos correctos de la reseña")
    void testObtenerPorId_DebeRetornarLosAtributosIngresados() {
        // 2. Act: Ejecutar el método a probar
        LeerReseniaDTO resultado = reseniaService.obtenerPorId(reseniaExistente.getIdResenia());

        // 3. Assert: Verificar que los datos coincidan con los ingresados
        assertNotNull(resultado, "El DTO de respuesta no debería ser nulo.");
        assertEquals(autor.getIdUsuario(), resultado.getIdAutor(), "El ID del autor debe coincidir.");
        assertEquals(usuarioReseniado.getIdUsuario(), resultado.getIdUsuarioReseniado(), "El ID del usuario reseñado debe coincidir.");
        assertEquals(4.5, resultado.getCalificacion(), "La calificación debe coincidir.");
        assertEquals("Excelente trabajo, muy recomendado.", resultado.getTextoResenia(), "El texto de la reseña debe coincidir.");
    }

    @Test
    @DisplayName("listarTodas debe retornar una lista que contenga la reseña creada")
    void testListarTodas_DebeContenerLaReseniaCreada() {
        // 2. Act
        List<LeerReseniaDTO> resultados = reseniaService.listarTodas();

        // 3. Assert
        assertFalse(resultados.isEmpty(), "La lista de reseñas no debe estar vacía.");
        assertTrue(resultados.stream().anyMatch(r -> r.getIdResenia().equals(reseniaExistente.getIdResenia())), "La lista debe contener la reseña creada en el setup.");
    }

    @Test
    @DisplayName("listarTodasParaFront debe retornar nombres completos y atributos correctos")
    void testListarTodasParaFront_DebeRetornarNombresYAtributosCorrectos() {
        // 2. Act
        List<LeerReseniaFrontDTO> resultados = reseniaService.listarTodasParaFront();

        // 3. Assert
        assertFalse(resultados.isEmpty(), "La lista de reseñas front no debe estar vacía.");
        
        LeerReseniaFrontDTO reseniaFront = resultados.stream()
                .filter(r -> r.getReseniaId().equals(reseniaExistente.getIdResenia()))
                .findFirst()
                .orElse(null);

        assertNotNull(reseniaFront, "Debe existir la reseña en la lista.");
        assertEquals("Gabo Dev", reseniaFront.getNombreAutor(), "El nombre del autor debe estar concatenado correctamente.");
        assertEquals("Juan Perez", reseniaFront.getNombreUsuarioReseniado(), "El nombre del usuario reseñado debe estar concatenado correctamente.");
        assertEquals(4.5, reseniaFront.getCalificacion(), "La calificación debe coincidir.");
        assertEquals("Excelente trabajo, muy recomendado.", reseniaFront.getTextoResenia(), "El texto debe coincidir.");
    }

    @Test
    @DisplayName("listarPorAutor debe encontrar la reseña correspondiente al autor")
    void testListarPorAutor_DebeEncontrarSuResenia() {
        // 2. Act
        List<LeerReseniaFrontDTO> resultados = reseniaService.listarPorAutor(autor.getIdUsuario());

        // 3. Assert
        assertFalse(resultados.isEmpty(), "Debe retornar al menos una reseña.");
        assertEquals("Gabo Dev", resultados.get(0).getNombreAutor(), "El nombre del autor debe ser el esperado.");
    }

    @Test
    @DisplayName("listarPorUsuarioReseniado debe encontrar la reseña correspondiente al usuario")
    void testListarPorUsuarioReseniado_DebeEncontrarSuResenia() {
        // 2. Act
        List<LeerReseniaFrontDTO> resultados = reseniaService.listarPorUsuarioReseniado(usuarioReseniado.getIdUsuario());

        // 3. Assert
        assertFalse(resultados.isEmpty(), "Debe retornar al menos una reseña.");
        assertEquals("Juan Perez", resultados.get(0).getNombreUsuarioReseniado(), "El nombre del usuario reseñado debe ser el esperado.");
    }
}
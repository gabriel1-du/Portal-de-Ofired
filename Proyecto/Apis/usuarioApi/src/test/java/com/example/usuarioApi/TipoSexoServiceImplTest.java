package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesSexoTIpoDTO.leerSexoTipoDTO;
import com.example.usuarioApi.Minio.MinioStorageService;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Service.TipoSexoService;

@SpringBootTest
@Transactional // Asegura que cada test se ejecute en una transacción que se revierte al final.
@ActiveProfiles("test") // Activa el perfil "test" para usar application-test.properties (H2)
@TestPropertySource(locations = "classpath:application-test.properties")
public class TipoSexoServiceImplTest {

    @Autowired
    private TipoSexoService tipoSexoService;

    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;

    @MockBean
    private MinioStorageService minioStorageService;

    private SexoUsuario sexoMasculino;
    private SexoUsuario sexoFemenino;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear y guardar las entidades necesarias antes de cada test.
        sexoMasculino = sexoUsuarioRepository.save(new SexoUsuario(null, "Masculino"));
        sexoFemenino = sexoUsuarioRepository.save(new SexoUsuario(null, "Femenino"));
    }

    @Test
    @DisplayName("leerTodosLosSexos debe retornar una lista con todos los sexos registrados")
    void testLeerTodosLosSexos() {
        // 2. Act: Llamar al método del servicio
        List<leerSexoTipoDTO> resultados = tipoSexoService.leerTodosLosSexos();

        // 3. Assert: Verificar los resultados
        assertNotNull(resultados, "La lista de resultados no debe ser nula");
        assertTrue(resultados.size() >= 2, "La lista debe contener al menos los 2 sexos registrados en setUp");
        
        // Verificar que los datos mapeados son correctos
        assertTrue(resultados.stream().anyMatch(dto -> dto.getNombreSexo().equals("Masculino")), "La lista debe contener el sexo 'Masculino'");
        assertTrue(resultados.stream().anyMatch(dto -> dto.getNombreSexo().equals("Femenino")), "La lista debe contener el sexo 'Femenino'");
    }

    @Test
    @DisplayName("leerSexoPorId debe retornar el DTO correcto para un ID existente")
    void testLeerSexoPorId() {
        leerSexoTipoDTO resultado = tipoSexoService.leerSexoPorId(sexoMasculino.getIdSexo());

        assertNotNull(resultado, "El resultado no debe ser nulo");
        assertEquals(sexoMasculino.getIdSexo(), resultado.getIdSexo(), "El ID devuelto debe coincidir con el solicitado");
        assertEquals("Masculino", resultado.getNombreSexo(), "El nombre del sexo devuelto debe coincidir");
    }

    @Test
    @DisplayName("leerSexoPorId debe lanzar una excepción si el ID no existe")
    void testLeerSexoPorId_NoExistente() {
        Integer idInexistente = 99999; // Un ID que sabemos que no existe
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            tipoSexoService.leerSexoPorId(idInexistente);
        });

        assertEquals("Sexo no encontrado con id: " + idInexistente, exception.getMessage(), "El mensaje de error de la excepción debe ser el esperado");
    }
}
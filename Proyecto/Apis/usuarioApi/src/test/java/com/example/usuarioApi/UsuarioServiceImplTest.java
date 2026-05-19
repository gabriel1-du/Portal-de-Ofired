package com.example.usuarioApi;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;
import com.example.usuarioApi.Model.*;
import com.example.usuarioApi.Repository.*;
import com.example.usuarioApi.Service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional // Asegura que cada test se ejecute en una transacción que se revierte al final.
@ActiveProfiles("test") // Activa el perfil "test" para usar application-test.properties (H2)
@TestPropertySource(locations = "classpath:application-test.properties") // Fuerza la carga del archivo de propiedades de test
public class UsuarioServiceImplTest {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PerfilUsuarioRepository perfilUsuarioRepository;

    @Autowired
    private RegionRepository regionRepository;

    @Autowired
    private ComunaRepository comunaRepository;

    @Autowired
    private OficioRepository oficioRepository;

    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Region regionInicial, regionNueva;
    private Comuna comunaInicial, comunaNueva;
    private Oficio oficioInicial, oficioNuevo;
    private SexoUsuario sexo;
    private TipoUsuario tipoUsuario;
    private Usuario usuarioExistente;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear y guardar las entidades necesarias antes de cada test.

        // Entidades geográficas y de oficio
        regionInicial = regionRepository.save(new Region(null, "Región Metropolitana (Inicial)"));
        regionNueva = regionRepository.save(new Region(null, "Valparaíso (Nueva)"));
        comunaInicial = comunaRepository.save(new Comuna(null, regionInicial, "Santiago (Inicial)"));
        comunaNueva = comunaRepository.save(new Comuna(null, regionNueva, "Viña del Mar (Nueva)"));
        oficioInicial = oficioRepository.save(new Oficio(null, "Carpintero"));
        oficioNuevo = oficioRepository.save(new Oficio(null, "Programador"));

        // Entidades de tipo y sexo
        sexo = sexoUsuarioRepository.save(new SexoUsuario(null, "Masculino"));
        tipoUsuario = tipoUsuarioRepository.save(new TipoUsuario(null, "Trabajador"));

        // Crear el usuario inicial
        Usuario usuario = new Usuario();
        usuario.setPNombre("Juan");
        usuario.setPApellido("Perez");
        usuario.setCorreoElec("juan.perez@inicial.com");
        usuario.setPassword(passwordEncoder.encode("password123"));
        usuario.setRegion(regionInicial);
        usuario.setComuna(comunaInicial);
        usuario.setOficio(oficioInicial);
        usuario.setSexo(sexo);
        usuario.setTipoUsuario(tipoUsuario);
        usuario.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioExistente = usuarioRepository.save(usuario);

        // Crear su perfil asociado
        PerfilUsuario perfil = new PerfilUsuario();
        perfil.setUsuario(usuarioExistente);
        perfil.setPNombre(usuarioExistente.getPNombre());
        perfil.setPApellido(usuarioExistente.getPApellido());
        perfil.setRegion(usuarioExistente.getRegion());
        perfil.setComuna(usuarioExistente.getComuna());
        perfil.setOficio(usuarioExistente.getOficio());
        perfil.setSexoUsuario(usuarioExistente.getSexo());
        perfilUsuarioRepository.save(perfil);
    }

    @Test
    @DisplayName("actualizarUsuario debe sincronizar los datos del usuario y su perfil asociado")
    void testActualizarUsuario_SincronizaConPerfil() {
        // 2. Act: Preparar el DTO con los nuevos datos y ejecutar el método a probar.

        actualizarUserDTO datosParaActualizar = new actualizarUserDTO();
        datosParaActualizar.setPrimerNombre("Pedro");
        datosParaActualizar.setNumeroTelef("987654321");
        datosParaActualizar.setIdRegionUsu(regionNueva.getIdRegion());
        datosParaActualizar.setIdComunaUsu(comunaNueva.getIdComuna()); // Aquí está la clave de tu pregunta
        datosParaActualizar.setIdOficio(oficioNuevo.getIdOficio());

        // Llamamos al método del servicio
        leerUsuarioDTO resultadoDTO = usuarioService.actualizarUsuario(usuarioExistente.getIdUsuario(), datosParaActualizar);

        // 3. Assert: Verificar que los cambios se aplicaron correctamente.

        // Verificación #1: El DTO de respuesta contiene los datos nuevos.
        assertNotNull(resultadoDTO, "El DTO de respuesta no debería ser nulo.");
        assertEquals("Pedro", resultadoDTO.getPrimerNombre(), "El primer nombre en el DTO de respuesta debe ser el actualizado.");
        assertEquals("Viña del Mar (Nueva)", resultadoDTO.getNombreComuna(), "El nombre de la comuna en el DTO debe ser el nuevo.");
        assertEquals("Valparaíso (Nueva)", resultadoDTO.getNombreRegion(), "El nombre de la región en el DTO debe ser el nuevo.");

        // Verificación #2: La entidad Usuario en la BD está actualizada.
        Usuario usuarioActualizado = usuarioRepository.findById(usuarioExistente.getIdUsuario()).orElseThrow();
        assertEquals("Pedro", usuarioActualizado.getPNombre(), "El nombre en la entidad Usuario debe estar actualizado.");
        assertEquals(comunaNueva.getIdComuna(), usuarioActualizado.getComuna().getIdComuna(), "El ID de comuna en la entidad Usuario debe ser el nuevo.");

        // Verificación #3: La entidad PerfilUsuario en la BD está sincronizada. ¡Esta es la más importante!
        PerfilUsuario perfilActualizado = perfilUsuarioRepository.findByUsuario_IdUsuario(usuarioExistente.getIdUsuario()).orElseThrow();
        assertEquals("Pedro", perfilActualizado.getPNombre(), "El nombre en el perfil debe sincronizarse.");
        assertEquals("987654321", perfilActualizado.getNumeroTelefono(), "El teléfono en el perfil debe sincronizarse.");

        // Verificamos que la entidad completa de la comuna fue asignada al perfil.
        assertNotNull(perfilActualizado.getComuna(), "La comuna en el perfil no debe ser nula.");
        assertEquals(comunaNueva.getIdComuna(), perfilActualizado.getComuna().getIdComuna(), "El ID de la comuna en el perfil debe ser el nuevo.");
        assertEquals("Viña del Mar (Nueva)", perfilActualizado.getComuna().getNombreComuna(), "El nombre de la comuna en el perfil debe ser el extraído de la nueva entidad.");

        assertNotNull(perfilActualizado.getRegion(), "La región en el perfil no debe ser nula.");
        assertEquals(regionNueva.getIdRegion(), perfilActualizado.getRegion().getIdRegion(), "El ID de la región en el perfil debe ser el nuevo.");

        assertNotNull(perfilActualizado.getOficio(), "El oficio en el perfil no debe ser nulo.");
        assertEquals(oficioNuevo.getIdOficio(), perfilActualizado.getOficio().getIdOficio(), "El ID del oficio en el perfil debe ser el nuevo.");
    }
}

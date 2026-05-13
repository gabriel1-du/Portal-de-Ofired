package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.ActualizarUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.CrearUsuariosBloqueadosDTO;
import com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO.LeerUsuariosBloqueadosIdDTO;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Model.TipoUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.BloqueoUsuarioRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.UsuariosBloqueadosService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class UsuariosBloqueadosServiceImplTest {

    @Autowired
    private UsuariosBloqueadosService bloqueoService;


    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    private Usuario usuarioQueBloquea;
    private Usuario usuarioBloqueado;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear los requisitos previos para que la base de datos no arroje errores
        SexoUsuario sexo = sexoUsuarioRepository.save(new SexoUsuario(null, "Masculino"));
        TipoUsuario tipoUsuario = tipoUsuarioRepository.save(new TipoUsuario(null, "Cliente"));

        // Creamos el Usuario 1 (El que realizará el bloqueo)
        Usuario u1 = new Usuario();
        u1.setPNombre("Carlos");
        u1.setPApellido("Santana");
        u1.setCorreoElec("carlos.bloqueador@test.com");
        u1.setPassword("123");
        u1.setSexo(sexo);
        u1.setTipoUsuario(tipoUsuario);
        u1.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioQueBloquea = usuarioRepository.save(u1);

        // Creamos el Usuario 2 (El que será bloqueado)
        Usuario u2 = new Usuario();
        u2.setPNombre("Luis");
        u2.setPApellido("Martinez");
        u2.setCorreoElec("luis.bloqueado@test.com");
        u2.setPassword("123");
        u2.setSexo(sexo);
        u2.setTipoUsuario(tipoUsuario);
        u2.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioBloqueado = usuarioRepository.save(u2);
    }

    // --- Helper Method ---
    // Método privado para generar un bloqueo rápido que sirva de base para los tests de lectura/actualización
    private LeerUsuariosBloqueadosIdDTO crearBloqueoPrueba() {
        CrearUsuariosBloqueadosDTO dto = new CrearUsuariosBloqueadosDTO();
        dto.setIdUsuarioQueBloquea(usuarioQueBloquea.getIdUsuario());
        dto.setIdUsuarioBloqueado(usuarioBloqueado.getIdUsuario());
        return bloqueoService.crearBloqueo(dto);
    }

    @Test
    @DisplayName("crearBloqueo debe guardar el bloqueo, habilitarlo por defecto y retornar el DTO")
    void testCrearBloqueo() {
        LeerUsuariosBloqueadosIdDTO resultado = crearBloqueoPrueba();

        assertNotNull(resultado, "El resultado no debe ser nulo");
        assertNotNull(resultado.getIdBloqueo(), "El ID del bloqueo debió generarse en la base de datos");
        assertTrue(resultado.getHabilitador(), "El habilitador debe estar en TRUE por defecto al crear");
        assertNotNull(resultado.getFechaRegistro(), "La fecha de registro debió establecerse automáticamente");
        assertEquals(usuarioQueBloquea.getIdUsuario(), resultado.getIdUsuarioQueBloquea(), "El ID del usuario bloqueador debe coincidir");
        assertEquals(usuarioBloqueado.getIdUsuario(), resultado.getIdUsuarioBloqueado(), "El ID del usuario bloqueado debe coincidir");
    }

    @Test
    @DisplayName("actualizarBloqueo debe modificar el estado del habilitador")
    void testActualizarBloqueo() {
        LeerUsuariosBloqueadosIdDTO bloqueoInicial = crearBloqueoPrueba();

        ActualizarUsuariosBloqueadosDTO dtoActualizacion = new ActualizarUsuariosBloqueadosDTO();
        dtoActualizacion.setHabilitador(false); // Simulamos "desbloquear" al usuario

        LeerUsuariosBloqueadosIdDTO resultado = bloqueoService.actualizarBloqueo(bloqueoInicial.getIdBloqueo(), dtoActualizacion);

        assertNotNull(resultado);
        assertFalse(resultado.getHabilitador(), "El habilitador debió cambiar a FALSE");
    }

    @Test
    @DisplayName("leerBloqueoPorId debe retornar el DTO correcto")
    void testLeerBloqueoPorId() {
        LeerUsuariosBloqueadosIdDTO bloqueoInicial = crearBloqueoPrueba();
        LeerUsuariosBloqueadosIdDTO resultado = bloqueoService.leerBloqueoPorId(bloqueoInicial.getIdBloqueo());

        assertNotNull(resultado);
        assertEquals(bloqueoInicial.getIdBloqueo(), resultado.getIdBloqueo());
    }

    @Test
    @DisplayName("buscarPorUsuarioInvolucrado debe listar los bloqueos donde participe el usuario")
    void testBuscarPorUsuarioInvolucrado() {
        crearBloqueoPrueba();
        List<LeerUsuariosBloqueadosIdDTO> resultados = bloqueoService.buscarPorUsuarioInvolucrado(usuarioQueBloquea.getIdUsuario());

        assertNotNull(resultados);
        assertEquals(1, resultados.size(), "Debería encontrar 1 registro donde el usuario participa");
        assertEquals(usuarioQueBloquea.getIdUsuario(), resultados.get(0).getIdUsuarioQueBloquea());
    }

    @Test
    @DisplayName("buscarRelacionSimultanea debe encontrar la relación exacta entre los dos usuarios enviados")
    void testBuscarRelacionSimultanea() {
        crearBloqueoPrueba();
        LeerUsuariosBloqueadosIdDTO resultado = bloqueoService.buscarRelacionSimultanea(usuarioQueBloquea.getIdUsuario(), usuarioBloqueado.getIdUsuario());

        assertNotNull(resultado, "Debería encontrar el bloqueo simultáneo entre ambos");
        assertEquals(usuarioQueBloquea.getIdUsuario(), resultado.getIdUsuarioQueBloquea());
        assertEquals(usuarioBloqueado.getIdUsuario(), resultado.getIdUsuarioBloqueado());
    }

    @Test
    @DisplayName("eliminarBloqueo debe borrar el registro de la base de datos")
    void testEliminarBloqueo() {
        LeerUsuariosBloqueadosIdDTO bloqueoInicial = crearBloqueoPrueba();
        
        bloqueoService.eliminarBloqueo(bloqueoInicial.getIdBloqueo());

        // Comprobamos que el registro ya no exista
        LeerUsuariosBloqueadosIdDTO resultado = bloqueoService.leerBloqueoPorId(bloqueoInicial.getIdBloqueo());
        assertNull(resultado, "El bloqueo debería ser nulo tras haber sido eliminado de la base de datos");
    }
}

package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.Timestamp;
import java.time.Instant;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesChatDTO.crearChatDTO;
import com.example.usuarioApi.DTO.ClasesChatDTO.leerFrontChatDTO;
import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Model.TipoUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ChatRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.ChatService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class ChatServiceImplTest {

    @Autowired
    private ChatService chatService;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    private Usuario usuarioIniciador;
    private Usuario usuarioDestino;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear los requisitos previos para que la BBDD no lance errores de Constraint
        SexoUsuario sexo = sexoUsuarioRepository.save(new SexoUsuario(null, "Masculino"));
        TipoUsuario tipoUsuario = tipoUsuarioRepository.save(new TipoUsuario(null, "Cliente"));

        // Crear el usuario 1
        Usuario u1 = new Usuario();
        u1.setPNombre("Carlos");
        u1.setPApellido("Santana");
        u1.setCorreoElec("carlos@test.com");
        u1.setPassword("123");
        u1.setSexo(sexo);
        u1.setTipoUsuario(tipoUsuario);
        u1.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioIniciador = usuarioRepository.save(u1);

        // Crear el usuario 2
        Usuario u2 = new Usuario();
        u2.setPNombre("Ana");
        u2.setPApellido("Belen");
        u2.setCorreoElec("ana@test.com");
        u2.setPassword("123");
        u2.setSexo(sexo);
        u2.setTipoUsuario(tipoUsuario);
        u2.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioDestino = usuarioRepository.save(u2);
    }

    @Test
    @DisplayName("crearChat debe crear un chat con 2 participantes, asignar fecha de creación y devolver un DTO válido")
    void testCrearChat() {
        // 2. Act: Preparamos la carga y ejecutamos
        crearChatDTO dto = new crearChatDTO();
        dto.setIdUsuario_uno(usuarioIniciador.getIdUsuario());
        dto.setIdUsuario_dos(usuarioDestino.getIdUsuario());

        leerFrontChatDTO resultado = chatService.crearChat(dto);

        // 3. Assert: Comprobar el resultado
        assertNotNull(resultado, "El DTO de respuesta no debe ser nulo");
        assertNotNull(resultado.getIdChat(), "El ID del chat debe estar generado (Base de datos)");
        assertNotNull(resultado.getFechaCreacion(), "La fecha de creación debió asignarse automáticamente (Hibernate @CreationTimestamp)");

        // Comprobar que los datos en el DTO vienen concatenados según la lógica del Mapper
        assertEquals(usuarioIniciador.getIdUsuario(), resultado.getIdUsuario1(), "El ID del Usuario 1 debe coincidir");
        assertEquals("Carlos Santana", resultado.getNombreUsuario1(), "El nombre del Usuario 1 debe estar concatenado");

        assertEquals(usuarioDestino.getIdUsuario(), resultado.getIdUsuario2(), "El ID del Usuario 2 debe coincidir");
        assertEquals("Ana Belen", resultado.getNombreUsuario2(), "El nombre del Usuario 2 debe estar concatenado");

        // Comprobar la integridad de la base de datos
        Chat chatEnBD = chatRepository.findById(resultado.getIdChat()).orElse(null);
        assertNotNull(chatEnBD, "El chat debe haberse persistido en la base de datos de pruebas");
        assertEquals(2, chatEnBD.getParticipantes().size(), "El chat debe poseer exactamente dos registros de ParticipanteChat");
        
        assertTrue(chatEnBD.getParticipantes().stream().anyMatch(p -> p.getUsuario().getIdUsuario().equals(usuarioIniciador.getIdUsuario())), "El usuario iniciador debe estar en los participantes");
        assertTrue(chatEnBD.getParticipantes().stream().anyMatch(p -> p.getUsuario().getIdUsuario().equals(usuarioDestino.getIdUsuario())), "El usuario destino debe estar en los participantes");
    }
}

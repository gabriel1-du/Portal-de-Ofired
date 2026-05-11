package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

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

import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.CrearParticipanteChatDTO;
import com.example.usuarioApi.DTO.ClasesParticicipantesChatDTO.LeerParticipanteChatFrontDTO;
import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.ParticipanteChat;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Model.TipoUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ChatRepository;
import com.example.usuarioApi.Repository.ParticipanteChatRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.ParticipanteChatService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class ParticipanteChatServiceImplTest {

    @Autowired
    private ParticipanteChatService participanteChatService;

    @Autowired
    private ParticipanteChatRepository participanteChatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    private Usuario usuarioPrueba;
    private Chat chatPrueba;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear los requisitos previos (Para evitar errores de Constraints en BD)
        SexoUsuario sexo = sexoUsuarioRepository.save(new SexoUsuario(null, "Femenino"));
        TipoUsuario tipoUsuario = tipoUsuarioRepository.save(new TipoUsuario(null, "Profesional"));

        Usuario u = new Usuario();
        u.setPNombre("Maria");
        u.setPApellido("Gomez");
        u.setCorreoElec("maria.gomez@test.com");
        u.setPassword("12345");
        u.setSexo(sexo);
        u.setTipoUsuario(tipoUsuario);
        u.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioPrueba = usuarioRepository.save(u);

        // Se guarda un Chat vacío (la fecha de creación se asigna automáticamente por @CreationTimestamp)
        chatPrueba = chatRepository.save(new Chat());
    }

    @Test
    @DisplayName("crearParticipante debe enlazar a un Usuario existente con un Chat existente y devolver el DTO Front mapeado")
    void testCrearParticipante() {
        // 2. Act: Preparar el DTO y llamar al servicio
        CrearParticipanteChatDTO dto = new CrearParticipanteChatDTO();
        dto.setIdUsuario(usuarioPrueba.getIdUsuario());
        dto.setIdChat(chatPrueba.getIdChat());

        LeerParticipanteChatFrontDTO resultado = participanteChatService.crearParticipante(dto);

        // 3. Assert: Comprobar el resultado retornado por el servicio
        assertNotNull(resultado, "El DTO de respuesta no debe ser nulo");
        assertNotNull(resultado.getIdParticipantesChat(), "El ID del participante debe estar generado (Base de datos)");
        assertEquals(usuarioPrueba.getIdUsuario(), resultado.getIdUsuario(), "El ID del Usuario debe coincidir");
        assertEquals(chatPrueba.getIdChat(), resultado.getIdChat(), "El ID del Chat debe coincidir");
        assertEquals("Maria Gomez", resultado.getNombreUsuario(), "El nombre del usuario debe estar correctamente concatenado por el Mapper");
        
        // 4. Assert: Comprobar que realmente se guardó en la base de datos
        ParticipanteChat participanteEnBD = participanteChatRepository.findById(resultado.getIdParticipantesChat()).orElse(null);
        assertNotNull(participanteEnBD, "El registro de participación debe existir en la base de datos de pruebas");
        assertEquals(usuarioPrueba.getIdUsuario(), participanteEnBD.getUsuario().getIdUsuario(), "El usuario asociado en BD debe ser el correcto");
        assertEquals(chatPrueba.getIdChat(), participanteEnBD.getChat().getIdChat(), "El chat asociado en BD debe ser el correcto");
    }
}
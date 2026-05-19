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

import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.CrearMensajeChatDTO;
import com.example.usuarioApi.DTO.ClasesMensajesChatDTO.LeerMensajeChatFrontDTO;
import com.example.usuarioApi.Model.Chat;
import com.example.usuarioApi.Model.MensajeChat;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Model.TipoUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ChatRepository;
import com.example.usuarioApi.Repository.MensajeChatRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.MensajeChatService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class MensajeChatServiceImplTest {

    @Autowired
    private MensajeChatService mensajeChatService;

    @Autowired
    private MensajeChatRepository mensajeChatRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;

    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    private Usuario usuarioAutor;
    private Chat chatPrueba;

    @BeforeEach
    void setUp() {
        // 1. Arrange: Crear los requisitos previos
        SexoUsuario sexo = sexoUsuarioRepository.save(new SexoUsuario(null, "Femenino"));
        TipoUsuario tipoUsuario = tipoUsuarioRepository.save(new TipoUsuario(null, "Cliente"));

        Usuario u = new Usuario();
        u.setPNombre("Laura");
        u.setPApellido("Perez");
        u.setCorreoElec("laura.perez@test.com");
        u.setPassword("segura123");
        u.setSexo(sexo);
        u.setTipoUsuario(tipoUsuario);
        u.setFechaCreacion(Timestamp.from(Instant.now()));
        usuarioAutor = usuarioRepository.save(u);

        // Guardamos un Chat vacío
        chatPrueba = chatRepository.save(new Chat());
    }

    @Test
    @DisplayName("crearMensaje debe guardar un mensaje asociado a un chat y un autor, y retornar el DTO Front mapeado")
    void testCrearMensaje() {
        // 2. Act: Preparar el DTO y llamar al servicio
        CrearMensajeChatDTO dto = new CrearMensajeChatDTO();
        dto.setMensajeTexto("Hola, me gustaría solicitar tus servicios.");
        dto.setIdChat(chatPrueba.getIdChat());
        dto.setIdAutor(usuarioAutor.getIdUsuario());

        LeerMensajeChatFrontDTO resultado = mensajeChatService.crearMensaje(dto);

        // 3. Assert: Comprobar el DTO retornado por el servicio
        assertNotNull(resultado, "El DTO de respuesta no debe ser nulo");
        assertNotNull(resultado.getIdMensajeChat(), "El ID del mensaje debe estar generado (Base de datos)");
        assertNotNull(resultado.getFechaHoraEnvio(), "La fecha y hora de envío debió asignarse automáticamente");
        assertEquals("Hola, me gustaría solicitar tus servicios.", resultado.getMensajeTexto(), "El contenido del mensaje debe coincidir");
        assertEquals(chatPrueba.getIdChat(), resultado.getIdChat(), "El ID del Chat debe coincidir");
        assertEquals(usuarioAutor.getIdUsuario(), resultado.getIdAutor(), "El ID del autor debe coincidir");
        assertEquals("Laura Perez", resultado.getNombreAutor(), "El nombre del autor debe estar correctamente concatenado por el Mapper");
        
        // 4. Assert: Comprobar que realmente se persistió en la base de datos
        MensajeChat mensajeEnBD = mensajeChatRepository.findById(resultado.getIdMensajeChat()).orElse(null);
        assertNotNull(mensajeEnBD, "El mensaje debe existir en la base de datos de pruebas");
        assertEquals("Hola, me gustaría solicitar tus servicios.", mensajeEnBD.getMensajeTexto(), "El texto en base de datos debe ser el correcto");
        assertEquals(usuarioAutor.getIdUsuario(), mensajeEnBD.getAutor().getIdUsuario(), "El autor asociado en BD debe ser el correcto");
        assertEquals(chatPrueba.getIdChat(), mensajeEnBD.getChat().getIdChat(), "El chat asociado en BD debe ser el correcto");
    }
}
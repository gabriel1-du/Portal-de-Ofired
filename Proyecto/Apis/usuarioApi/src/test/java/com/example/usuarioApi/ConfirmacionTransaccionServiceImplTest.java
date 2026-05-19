package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.*;

import java.math.BigDecimal;
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

import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.ActualizarConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.CrearConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionFrontDTO;
import com.example.usuarioApi.Model.MedioDePago;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Model.TipoDeTrabajo;
import com.example.usuarioApi.Model.TipoUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.MedioDePagoRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoDeTrabajoRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import com.example.usuarioApi.Service.ConfirmacionTransaccionService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class ConfirmacionTransaccionServiceImplTest {

    @Autowired
    private ConfirmacionTransaccionService service;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private MedioDePagoRepository medioPagoRepository;
    @Autowired
    private TipoDeTrabajoRepository tipoTrabajoRepository;
    @Autowired
    private SexoUsuarioRepository sexoUsuarioRepository;
    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;

    private Usuario oferente, cliente;
    private MedioDePago medioPago;
    private TipoDeTrabajo tipoTrabajo;

    @BeforeEach
    void setUp() {
        SexoUsuario sexo = sexoUsuarioRepository.save(new SexoUsuario(null, "Masculino"));
        TipoUsuario tipoUsu = tipoUsuarioRepository.save(new TipoUsuario(null, "Cliente"));
        
        oferente = usuarioRepository.save(new Usuario(null, "Pedro", null, "Gomez", null, sexo, "pedro@test.com", "123", tipoUsu, null, null, null, Timestamp.from(Instant.now()), null, null, null, null, null, null));
        cliente = usuarioRepository.save(new Usuario(null, "Juan", null, "Perez", null, sexo, "juan@test.com", "123", tipoUsu, null, null, null, Timestamp.from(Instant.now()), null, null, null, null, null, null));
        medioPago = medioPagoRepository.save(new MedioDePago(null, "Transferencia"));
        tipoTrabajo = tipoTrabajoRepository.save(new TipoDeTrabajo(null, "Remoto"));
    }

    @Test
    @DisplayName("Debe crear, leer, actualizar estado y eliminar transacciones correctamente")
    void testCrudCompletoTransaccion() {
        // 1. Crear
        CrearConfirmacionTransaccionDTO crearDto = new CrearConfirmacionTransaccionDTO();
        crearDto.setIdUsuarioOferente(oferente.getIdUsuario());
        crearDto.setIdUsuarioCliente(cliente.getIdUsuario());
        crearDto.setMontoServicio(new BigDecimal("15000.50"));
        crearDto.setIdMedioPago(medioPago.getIdMedioPago());
        crearDto.setIdTipoTrabajo(tipoTrabajo.getIdTipoTrabajo());
        crearDto.setObservacionesTrato("Trato inicial de prueba");

        LeerConfirmacionTransaccionFrontDTO creado = service.crearTransaccion(crearDto);
        assertNotNull(creado.getIdTransaccion(), "ID generado automáticamente");
        assertEquals("Pedro Gomez", creado.getNombreUsuarioOferente());
        assertFalse(creado.getAceptado(), "Por defecto debe ser aceptado = false al crear");
        assertNotNull(creado.getFechaRegistro());

        // 2. Leer
        LeerConfirmacionTransaccionFrontDTO leidoFront = service.leerTransaccionPorId(creado.getIdTransaccion());
        assertEquals(creado.getIdTransaccion(), leidoFront.getIdTransaccion());

        // 3. Actualizar (solo estado)
        ActualizarConfirmacionTransaccionDTO actualizarDto = new ActualizarConfirmacionTransaccionDTO();
        actualizarDto.setAceptado(true);
        
        LeerConfirmacionTransaccionFrontDTO actualizado = service.actualizarEstado(creado.getIdTransaccion(), actualizarDto);
        assertTrue(actualizado.getAceptado(), "El estado debe haber cambiado a true");

        // 4. Leer Todos
        List<LeerConfirmacionTransaccionFrontDTO> todosFront = service.leerTodasLasTransaccionesFront();
        List<LeerConfirmacionTransaccionDTO> todosId = service.leerTodasLasTransaccionesId();
        assertEquals(1, todosFront.size());
        assertEquals(1, todosId.size());

        // 5. Eliminar
        service.eliminarTransaccion(creado.getIdTransaccion());
        assertThrows(RuntimeException.class, () -> service.leerTransaccionPorId(creado.getIdTransaccion()));
    }
}

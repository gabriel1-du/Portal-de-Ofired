package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.ActualizarTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.CrearTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.LeerTipoDeTrabajoDTO;
import com.example.usuarioApi.Service.TipoDeTrabajoService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class TipoDeTrabajoServiceImplTest {

    @Autowired
    private TipoDeTrabajoService service;

    @Test
    @DisplayName("Debe crear, leer, actualizar y eliminar Tipo de Trabajo correctamente")
    void testCrudTipoDeTrabajo() {
        // 1. Crear
        CrearTipoDeTrabajoDTO crearDto = new CrearTipoDeTrabajoDTO();
        crearDto.setNombreTipoTrabajo("Remoto");
        LeerTipoDeTrabajoDTO creado = service.crearTipoDeTrabajo(crearDto);
        assertNotNull(creado.getIdTipoTrabajo(), "El ID debió generarse");
        assertEquals("Remoto", creado.getNombreTipoTrabajo());

        // 2. Leer
        LeerTipoDeTrabajoDTO leido = service.leerTipoDeTrabajoPorId(creado.getIdTipoTrabajo());
        assertNotNull(leido, "Debe encontrar el registro");

        // 3. Actualizar
        ActualizarTipoDeTrabajoDTO actualizarDto = new ActualizarTipoDeTrabajoDTO();
        actualizarDto.setNombreTipoTrabajo("Presencial");
        LeerTipoDeTrabajoDTO actualizado = service.actualizarTipoDeTrabajo(creado.getIdTipoTrabajo(), actualizarDto);
        assertEquals("Presencial", actualizado.getNombreTipoTrabajo(), "El nombre debió actualizarse");

        // 4. Eliminar
        service.eliminarTipoDeTrabajo(creado.getIdTipoTrabajo());
        LeerTipoDeTrabajoDTO leidoEliminado = service.leerTipoDeTrabajoPorId(creado.getIdTipoTrabajo());
        assertNull(leidoEliminado, "El registro debió ser eliminado");
    }
}

package com.example.usuarioApi;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.ActualizarMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.CrearMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.LeerMedioDePagoDTO;
import com.example.usuarioApi.Service.MedioDePagoService;

@SpringBootTest
@Transactional
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
public class MedioDePagoServiceImplTest {

    @Autowired
    private MedioDePagoService service;

    @Test
    @DisplayName("Debe crear, leer, actualizar y eliminar Medio de Pago correctamente")
    void testCrudMedioDePago() {
        // 1. Crear
        CrearMedioDePagoDTO crearDto = new CrearMedioDePagoDTO();
        crearDto.setNombreMedioPago("Efectivo");
        LeerMedioDePagoDTO creado = service.crearMedioDePago(crearDto);
        assertNotNull(creado.getIdMedioPago(), "El ID debió generarse");
        assertEquals("Efectivo", creado.getNombreMedioPago());

        // 2. Leer
        LeerMedioDePagoDTO leido = service.leerMedioDePagoPorId(creado.getIdMedioPago());
        assertNotNull(leido, "Debe encontrar el registro");

        // 3. Actualizar
        ActualizarMedioDePagoDTO actualizarDto = new ActualizarMedioDePagoDTO();
        actualizarDto.setNombreMedioPago("Tarjeta de Credito");
        LeerMedioDePagoDTO actualizado = service.actualizarMedioDePago(creado.getIdMedioPago(), actualizarDto);
        assertEquals("Tarjeta de Credito", actualizado.getNombreMedioPago(), "El nombre debió actualizarse");

        // 4. Eliminar
        service.eliminarMedioDePago(creado.getIdMedioPago());
        LeerMedioDePagoDTO leidoEliminado = service.leerMedioDePagoPorId(creado.getIdMedioPago());
        assertNull(leidoEliminado, "El registro debió ser eliminado");
    }
}

package com.example.usuarioApi.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.ActualizarMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.CrearMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.LeerMedioDePagoDTO;
import com.example.usuarioApi.Service.MedioDePagoService;

@RestController
@RequestMapping("/api/medios-pagoApi")
public class MedioDePagoController {

    @Autowired
    private MedioDePagoService service;

    @PostMapping("/crear")
    public LeerMedioDePagoDTO crear(@RequestBody CrearMedioDePagoDTO dto) {
        return service.crearMedioDePago(dto);
    }

    @GetMapping("/{id}")
    public LeerMedioDePagoDTO leerPorId(@PathVariable Integer id) {
        return service.leerMedioDePagoPorId(id);
    }

    @GetMapping
    public List<LeerMedioDePagoDTO> leerTodos() {
        return service.leerTodosLosMediosDePago();
    }

    @PutMapping("/actualizar/{id}")
    public LeerMedioDePagoDTO actualizar(@PathVariable Integer id, @RequestBody ActualizarMedioDePagoDTO dto) {
        return service.actualizarMedioDePago(id, dto);
    }

    @DeleteMapping("/eliminar/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminarMedioDePago(id);
    }
}

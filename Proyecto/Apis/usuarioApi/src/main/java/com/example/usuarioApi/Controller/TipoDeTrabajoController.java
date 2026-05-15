package com.example.usuarioApi.Controller;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.ActualizarTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.CrearTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.LeerTipoDeTrabajoDTO;
import com.example.usuarioApi.Service.TipoDeTrabajoService;

@RestController
@RequestMapping("/api/tipos-trabajoApi")
public class TipoDeTrabajoController {

    @Autowired
    private TipoDeTrabajoService service;

    @PostMapping("/crear")
    public LeerTipoDeTrabajoDTO crear(@RequestBody CrearTipoDeTrabajoDTO dto) {
        return service.crearTipoDeTrabajo(dto);
    }

    @GetMapping("/{id}")
    public LeerTipoDeTrabajoDTO leerPorId(@PathVariable Integer id) {
        return service.leerTipoDeTrabajoPorId(id);
    }

    @GetMapping
    public List<LeerTipoDeTrabajoDTO> leerTodos() {
        return service.leerTodosLosTiposDeTrabajo();
    }

    @PutMapping("/{id}")
    public LeerTipoDeTrabajoDTO actualizar(@PathVariable Integer id, @RequestBody ActualizarTipoDeTrabajoDTO dto) {
        return service.actualizarTipoDeTrabajo(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Integer id) {
        service.eliminarTipoDeTrabajo(id);
    }
}

package com.example.publicacionesApi.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.publicacionesApi.ServiceImpl.LimpiezaDatosServiceImpl;

//Entidad para las operaciones internas de las publicaciones y eliminacion en cascada
@RestController
@RequestMapping("/api/publicacionesApi/interno")
public class InternoPublicacionesController {

    @Autowired
    private LimpiezaDatosServiceImpl limpiezaDatosService;

    @DeleteMapping("/limpiar-usuario/{idUsuario}")
    public ResponseEntity<?> limpiarDatosUsuario(@PathVariable Integer idUsuario) {
        try {
            limpiezaDatosService.purgarDatosDeUsuario(idUsuario);
            return ResponseEntity.ok("Datos del usuario " + idUsuario + " purgados en cascada.");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error al purgar datos: " + e.getMessage());
        }
    }

}

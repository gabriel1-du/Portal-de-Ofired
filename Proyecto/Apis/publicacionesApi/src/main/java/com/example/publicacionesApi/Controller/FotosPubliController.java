package com.example.publicacionesApi.Controller;

import com.example.publicacionesApi.Service.FotosPubliService;
import com.example.publicacionesApi.DTO.FotosPubliDTO.FotosPubliDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/fotos")
public class FotosPubliController {

    @Autowired
    private FotosPubliService fotosPubliService;

    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<List<FotosPubliDTO>> listarPorPublicacion(@PathVariable Integer idPublicacion) {
        return ResponseEntity.ok(fotosPubliService.listarPorPublicacion(idPublicacion));
    }

    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<FotosPubliDTO> agregar(
            @RequestPart("datos") FotosPubliDTO fotosPubliDTO,
            @RequestPart(value = "foto", required = false) MultipartFile archivoFoto) {
        FotosPubliDTO nuevaFoto = fotosPubliService.agregar(fotosPubliDTO, archivoFoto);
        return new ResponseEntity<>(nuevaFoto, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        fotosPubliService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
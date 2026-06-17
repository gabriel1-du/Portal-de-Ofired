package com.gateway.recuperacionContrasena;

import com.gateway.recuperacionContrasena.RecuperacionRequest;
import com.gateway.recuperacionContrasena.RecuperacionResponse;
import com.gateway.recuperacionContrasena.RecuperacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/recuperacion")
@RequiredArgsConstructor
public class RecuperacionController {

    private final RecuperacionService recuperacionService;

    @PostMapping("/generar-token")
    public RecuperacionResponse generarToken(@RequestBody RecuperacionRequest request) {
        return recuperacionService.generarTokenPorCorreo(request);
    }
}
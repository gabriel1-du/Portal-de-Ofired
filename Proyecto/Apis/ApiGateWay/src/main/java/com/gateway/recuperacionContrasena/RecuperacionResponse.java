package com.gateway.recuperacionContrasena;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RecuperacionResponse {
    private String token;
}
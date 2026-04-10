package com.example.usuarioApi.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class authRequest {

    private String email;
    private String password;

}

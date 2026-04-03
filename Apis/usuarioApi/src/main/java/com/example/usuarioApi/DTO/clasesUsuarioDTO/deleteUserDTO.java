package com.example.usuarioApi.DTO.clasesUsuarioDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class deleteUserDTO {

    private String passwordConfirmacion;  //El usuario debe ingresar su contraseña para confirmar la eliminación de su cuenta

}

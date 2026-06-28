package com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTOAdmin;
import com.example.usuarioApi.Model.Usuario;


@Component
public class UsuarioMapLeer {

   
    //Metodo para convertir ususario a lectura
    public leerUsuarioDTO mapUsuarioToLeerUsuarioDTO(Usuario usuario) {
        leerUsuarioDTO dto = new leerUsuarioDTO();
    
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setPrimerNombre(usuario.getPNombre());
        dto.setSegundoNombre(usuario.getSNombre());
        dto.setPrimerApellido(usuario.getPApellido());
        dto.setSegundoApellido(usuario.getSApellido());
        dto.setCorreoElec(usuario.getCorreoElec());
        dto.setRut(usuario.getRut());
        dto.setRutDv(usuario.getRutDv());
        dto.setNumeroTelef(usuario.getNumeroTelef());
        dto.setFoto(usuario.getFoto());
        dto.setValoracion(usuario.getValoracion());
        dto.setFechaCreacion(usuario.getFechaCreacion());

        
        if (usuario.getSexo() != null) dto.setNombreSexo(usuario.getSexo().getNombreSexo());
        if (usuario.getTipoUsuario() != null) dto.setNombreTipoUsu(usuario.getTipoUsuario().getNombreRol());
        if (usuario.getRegion() != null) dto.setNombreRegion(usuario.getRegion().getNombreRegion());
        if (usuario.getComuna() != null) dto.setNombreComuna(usuario.getComuna().getNombreComuna());
        if (usuario.getOficio() != null) dto.setNombreOficio(usuario.getOficio().getNombreOficio());

        return dto;
    }

    public leerUsuarioDTOAdmin mapUsuarioToLeerUsuarioDTOAdmin(Usuario usuario) {
        leerUsuarioDTOAdmin dto = new leerUsuarioDTOAdmin();
    
        dto.setIdUsuario(usuario.getIdUsuario());
        dto.setPrimerNombre(usuario.getPNombre());
        dto.setSegundoNombre(usuario.getSNombre());
        dto.setPrimerApellido(usuario.getPApellido());
        dto.setSegundoApellido(usuario.getSApellido());
        dto.setCorreoElec(usuario.getCorreoElec());
        dto.setRut(usuario.getRut());
        dto.setRutDv(usuario.getRutDv());
        dto.setNumeroTelef(usuario.getNumeroTelef());
        dto.setFoto(usuario.getFoto());
        dto.setValoracion(usuario.getValoracion());
        dto.setFechaCreacion(usuario.getFechaCreacion());

        
        if (usuario.getSexo() != null) {
            dto.setIdSexo(usuario.getSexo().getIdSexo());
            dto.setNombreSexo(usuario.getSexo().getNombreSexo());
        }
        if (usuario.getTipoUsuario() != null) {
            dto.setIdTipoUsu(usuario.getTipoUsuario().getIdTipoUsuario());
            dto.setNombreTipoUsu(usuario.getTipoUsuario().getNombreRol());
        }
        if (usuario.getRegion() != null) {
            dto.setIdRegion(usuario.getRegion().getIdRegion());
            dto.setNombreRegion(usuario.getRegion().getNombreRegion());
        }
        if (usuario.getComuna() != null) {
            dto.setIdComuna(usuario.getComuna().getIdComuna());
            dto.setNombreComuna(usuario.getComuna().getNombreComuna());
        }
        if (usuario.getOficio() != null) {
            dto.setIdOficio(usuario.getOficio().getIdOficio());
            dto.setNombreOficio(usuario.getOficio().getNombreOficio());
        }
        return dto;
    }


}

package com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;

import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ComunaRepository;
import com.example.usuarioApi.Repository.OficioRepository;
import com.example.usuarioApi.Repository.RegionRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;

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


   
    //metodo que devuelve un valor por defecto si el string es nulo o está vacío, de lo contrario devuelve el string original
    private String defaultIfBlank(String input, String defaultValue) {
        return (input == null || input.trim().isEmpty()) ? defaultValue : input;
    }


}

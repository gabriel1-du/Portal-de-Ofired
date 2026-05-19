package com.example.usuarioApi.DTO.ClasesUsuariosBloqueadosDTO;

import java.time.LocalDateTime;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Model.UsuariosBloqueados;

@Component
public class UsuariosBloqueadosMapper {

    // --- MAP TO ENTITY CREAR ---
    public UsuariosBloqueados mapToEntityCrear(CrearUsuariosBloqueadosDTO dto, Usuario usuarioQueBloquea, Usuario usuarioBloqueado) {
        UsuariosBloqueados entidad = new UsuariosBloqueados();
        
        entidad.setUsuarioQueBloquea(usuarioQueBloquea);
        entidad.setUsuarioBloqueado(usuarioBloqueado);
        
        // Seteo automático de campos por requerimiento
        entidad.setHabilitador(true);
        entidad.setFechaRegistro(LocalDateTime.now());
        
        return entidad;
    }

    // --- MAP TO LEER ID DTO ---
    public LeerUsuariosBloqueadosIdDTO mapToLeerIdDTO(UsuariosBloqueados entidad) {
        if (entidad == null) return null;
        LeerUsuariosBloqueadosIdDTO dto = new LeerUsuariosBloqueadosIdDTO();
        dto.setIdBloqueo(entidad.getIdBloqueo());
        dto.setHabilitador(entidad.getHabilitador());
        dto.setFechaRegistro(entidad.getFechaRegistro());
        if (entidad.getUsuarioQueBloquea() != null) dto.setIdUsuarioQueBloquea(entidad.getUsuarioQueBloquea().getIdUsuario());
        if (entidad.getUsuarioBloqueado() != null) dto.setIdUsuarioBloqueado(entidad.getUsuarioBloqueado().getIdUsuario());
        return dto;
    }
}

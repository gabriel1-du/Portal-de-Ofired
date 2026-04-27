package com.example.usuarioApi.DTO.PerfilUsuarioDTO.MapToPerfilUsuarioDTO;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.Model.PerfilUsuario;
import com.example.usuarioApi.Model.Usuario;

@Component
public class PerfilUsuarioMapper {

   // --- MAP TO LEER DTO ---
    public PerfilUsuarioLeerDTO mapToLeerDTO(PerfilUsuario entidad) {
        if (entidad == null) return null;

        PerfilUsuarioLeerDTO dto = new PerfilUsuarioLeerDTO();
        dto.setIdPerfilUsuario(entidad.getIdPerfilUsuario());
        
        if (entidad.getUsuario() != null) {
            dto.setIdUsuario(entidad.getUsuario().getIdUsuario());
            dto.setCorreoElec(entidad.getUsuario().getCorreoElec()); 
        }
        
        dto.setNombreApodo(entidad.getNombreApodo());
        
        // Mapeamos los nombres cortos de la Entidad a los nombres largos del DTO
        dto.setPrimerNombre(entidad.getPNombre());
        dto.setSegundoNombre(entidad.getSNombre());
        dto.setPrimerApellido(entidad.getPApellido());
        dto.setSegundoApellido(entidad.getSApellido());
        dto.setNumeroTelef(entidad.getNumeroTelefono());
        dto.setFoto(entidad.getFotoPerfil());
        dto.setFotografiaBanner(entidad.getFotografiaBanner());
        
        dto.setIdRegionUsu(entidad.getRegion() != null ? entidad.getRegion().getIdRegion() : null);
        dto.setIdComunaUsu(entidad.getComuna() != null ? entidad.getComuna().getIdComuna() : null);
        dto.setIdOficio(entidad.getOficio() != null ? entidad.getOficio().getIdOficio() : null);
        dto.setIdSexoUsu(entidad.getSexoUsuario() != null ? entidad.getSexoUsuario().getIdSexo() : null);
        
        // Atributos con nombres específicos en la entidad
        dto.setCalificacion(entidad.getCalificacionPUsuario());
        dto.setFechaCreacion(entidad.getFechaCreacion());
        
        return dto;
    }

    // --- MAP TO ENTITY CREAR (AUTOMATIZADO) ---
    public PerfilUsuario mapToEntityCrear(PerfilUsuarioCrearDTO dto, Usuario usuario) {
        PerfilUsuario entidad = new PerfilUsuario();

        // 1. Vínculo principal
        entidad.setUsuario(usuario);

        // 2. Datos exclusivos del Perfil (Vienen del JSON/DTO)
        entidad.setNombreApodo(dto.getNombreApodo());
        entidad.setFotografiaBanner(dto.getFotografiaBanner());

        // 3. Auto-completado: Copiamos los datos básicos desde Usuario a PerfilUsuario
        // Nota cómo extraemos de Usuario y seteamos usando los nombres de PerfilUsuario
        entidad.setPNombre(usuario.getPNombre());
        entidad.setSNombre(usuario.getSNombre());
        entidad.setPApellido(usuario.getPApellido());
        entidad.setSApellido(usuario.getSApellido());
        entidad.setNumeroTelefono(usuario.getNumeroTelef()); // En Usuario es numeroTelef, en Perfil es numeroTelefono
        entidad.setFotoPerfil(usuario.getFoto()); // En Usuario es foto, en Perfil es fotoPerfil

        // 4. Auto-completado: Copiamos las Relaciones
        entidad.setRegion(usuario.getRegion());
        entidad.setComuna(usuario.getComuna());
        entidad.setOficio(usuario.getOficio());
        entidad.setSexoUsuario(usuario.getSexo()); 

        // 5. Valores por defecto
        entidad.setCalificacionPUsuario(BigDecimal.ZERO);

        return entidad;
    }

    // --- MAP TO ENTITY ACTUALIZAR (SOLO DATOS DE PERFIL) ---
    // Quitamos los parámetros extra (Region, Comuna, Oficio, Sexo) porque ya no se actualizan por aquí
    public void mapToEntityActualizar(PerfilUsuarioActualizarDTO dto, PerfilUsuario entidad) {
        
        if (dto.getNombreApodo() != null) {
            entidad.setNombreApodo(dto.getNombreApodo());
        }
        
        if (dto.getFotografiaBanner() != null) {
            entidad.setFotografiaBanner(dto.getFotografiaBanner());
        }
        
        // Todo lo demás (nombres, teléfonos, foto de perfil, etc.) 
        // se ignora aquí porque se debe actualizar mediante la API de Usuario.
    }
    

}

package com.example.usuarioApi.DTO.PerfilUsuarioDTO.MapToPerfilUsuarioDTO;

import java.math.BigDecimal;

import org.springframework.stereotype.Component;

import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioActualizarDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioCrearDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerDTO;
import com.example.usuarioApi.DTO.PerfilUsuarioDTO.PerfilUsuarioLeerFrontDTO;
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
        dto.setFoto(entidad.getUsuario() != null ? entidad.getUsuario().getFoto() : entidad.getFotoPerfil());
        dto.setFotografiaBanner(entidad.getFotografiaBanner());
        
        // --- NUEVO: Mapeo de la descripción ---
        dto.setDescripcion(entidad.getDescripcion());
        
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
        
        // --- NUEVO: Lógica de la descripción por defecto ---
        if (dto.getDescripcion() == null || dto.getDescripcion().trim().isEmpty()) {
            entidad.setDescripcion("Sin descripción aún...");
        } else {
            entidad.setDescripcion(dto.getDescripcion());
        }

        // 3. Auto-completado: Copiamos los datos básicos desde Usuario a PerfilUsuario
        entidad.setPNombre(usuario.getPNombre());
        entidad.setSNombre(usuario.getSNombre());
        entidad.setPApellido(usuario.getPApellido());
        entidad.setSApellido(usuario.getSApellido());
        entidad.setNumeroTelefono(usuario.getNumeroTelef()); 
        entidad.setFotoPerfil(usuario.getFoto()); 

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
    public void mapToEntityActualizar(PerfilUsuarioActualizarDTO dto, PerfilUsuario entidad) {
        
        if (dto.getNombreApodo() != null) {
            entidad.setNombreApodo(dto.getNombreApodo());
        }
        
        if (dto.getFotografiaBanner() != null) {
            entidad.setFotografiaBanner(dto.getFotografiaBanner());
        }
        
        // --- NUEVO: Actualización de la descripción ---
        if (dto.getDescripcion() != null) {
            // Aquí puedes decidir si permites que la actualicen a un texto vacío
            // o si solo aplicas el cambio. Lo estándar es aplicar lo que mande el JSON.
            entidad.setDescripcion(dto.getDescripcion());
        }
    }
    

    // --- MAP TO LEER FRONT DTO (OPTIMIZADO PARA REACT) ---
    public PerfilUsuarioLeerFrontDTO mapToLeerFrontDTO(PerfilUsuario entidad) {
        if (entidad == null) return null;

        PerfilUsuarioLeerFrontDTO dto = new PerfilUsuarioLeerFrontDTO();
        
        dto.setIdPerfilUsuario(entidad.getIdPerfilUsuario());
        
        // Datos del Usuario base
        if (entidad.getUsuario() != null) {
            dto.setIdUsuario(entidad.getUsuario().getIdUsuario());
            dto.setCorreoElec(entidad.getUsuario().getCorreoElec()); 
        }
        
        dto.setNombreApodo(entidad.getNombreApodo());
        dto.setPrimerNombre(entidad.getPNombre());
        dto.setSegundoNombre(entidad.getSNombre());
        dto.setPrimerApellido(entidad.getPApellido());
        dto.setSegundoApellido(entidad.getSApellido());
        dto.setNumeroTelef(entidad.getNumeroTelefono());
        dto.setFoto(entidad.getUsuario() != null ? entidad.getUsuario().getFoto() : entidad.getFotoPerfil());
        dto.setFotografiaBanner(entidad.getFotografiaBanner());
        
        // --- NUEVO: Enviamos la descripción al Front ---
        dto.setDescripcion(entidad.getDescripcion());
        
        // INTER-CONSULTAS EN EL BACKEND: 
        dto.setNombreRegion(
            entidad.getRegion() != null ? entidad.getRegion().getNombreRegion() : "Sin región"
        );
        
        dto.setNombreComuna(
            entidad.getComuna() != null ? entidad.getComuna().getNombreComuna() : "Sin comuna"
        );
        
        dto.setNombreOficio(
            entidad.getOficio() != null ? entidad.getOficio().getNombreOficio() : "Sin oficio"
        );
        
        dto.setNombreSexo(
            entidad.getSexoUsuario() != null ? entidad.getSexoUsuario().getNombreSexo() : "No especificado"
        );
        
        dto.setCalificacion(entidad.getCalificacionPUsuario());
        dto.setFechaCreacion(entidad.getFechaCreacion());
        
        return dto;
    }
}

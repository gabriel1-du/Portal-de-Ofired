package com.example.publicacionesApi.DTO.ClasesReseniasDTO.MapperRenia;

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.ActualizarReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.CrearReniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Model.Usuario;
import com.example.publicacionesApi.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class UsuarioMapperReseniaDTO {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Convierte un CrearReniaDTO a una entidad Resenia.
     * @param dto El DTO para crear la reseña.
     * @return La entidad Resenia.
     */
    public Resenia toEntity(CrearReniaDTO dto) {
        if (dto == null) {
            return null;
        }
        Resenia resenia = new Resenia();
        resenia.setIdAutor(dto.getIdAutor());
        resenia.setIdUsuarioReseniado(dto.getIdUsuarioReseniado());
        resenia.setCalificacion(dto.getCalificacion());
        resenia.setTextoResenia(dto.getTextoResenia());
        return resenia;
    }

    /**
     * Convierte una entidad Resenia a un LeerReseniaDTO.
     * @param resenia La entidad Resenia.
     * @return El DTO de lectura.
     */
    public LeerReseniaDTO toLeerReseniaDTO(Resenia resenia) {
        if (resenia == null) {
            return null;
        }
        LeerReseniaDTO dto = new LeerReseniaDTO();
        dto.setIdResenia(resenia.getIdResenia());
        dto.setIdAutor(resenia.getIdAutor());
        dto.setIdUsuarioReseniado(resenia.getIdUsuarioReseniado());
        dto.setCalificacion(resenia.getCalificacion());
        dto.setTextoResenia(resenia.getTextoResenia());
        
        // Seteo con fallback a LocalDateTime.now() si no viene en el registro
        dto.setFechaCreacion(resenia.getFechaCreacion() != null ? resenia.getFechaCreacion() : LocalDateTime.now());
        
        return dto;
    }

    public LeerReseniaFrontDTO toLeerReseniaFrontDTO(Resenia resenia) {
        if (resenia == null) return null;
        LeerReseniaFrontDTO dto = new LeerReseniaFrontDTO();
        dto.setReseniaId(resenia.getIdResenia());

        // Buscar el nombre del autor
        Usuario autor = usuarioRepository.findById(resenia.getIdAutor()).orElse(null);
        if (autor != null) {
            dto.setNombreAutor(autor.getPNombre() + " " + autor.getPApellido());
            dto.setFotoUsuarioAutor(autor.getFoto());
        } else {
            dto.setNombreAutor("Usuario no encontrado");
        }

        // Buscar el nombre del usuario reseñado
        Usuario usuarioReseniado = usuarioRepository.findById(resenia.getIdUsuarioReseniado()).orElse(null);
        dto.setNombreUsuarioReseniado(usuarioReseniado != null ? usuarioReseniado.getPNombre() + " " + usuarioReseniado.getPApellido() : "Usuario no encontrado");

        dto.setCalificacion(resenia.getCalificacion());
        dto.setTextoResenia(resenia.getTextoResenia());
        
        // Seteo con fallback a LocalDateTime.now() si no viene en el registro
        dto.setFechaCreacion(resenia.getFechaCreacion() != null ? resenia.getFechaCreacion() : LocalDateTime.now());
        
        return dto;
    }

    public void updateFromDTO(ActualizarReseniaDTO dto, Resenia resenia) {
        if (dto == null || resenia == null) return;
        resenia.setCalificacion(dto.getCalificacion());
        resenia.setTextoResenia(dto.getTextoResenia());
    }
}

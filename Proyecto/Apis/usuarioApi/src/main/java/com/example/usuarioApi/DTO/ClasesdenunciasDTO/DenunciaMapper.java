package com.example.usuarioApi.DTO.ClasesdenunciasDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.usuarioApi.Model.Denuncia;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.UsuarioRepository;

@Component
public class DenunciaMapper {

    @Autowired
    private UsuarioRepository usuarioRepository; 

    public DenunciaDTO mapToDTO(Denuncia denuncia) {
        if (denuncia == null) {
            return null;
        }

        DenunciaDTO dto = new DenunciaDTO();
        dto.setIdDenuncia(denuncia.getIdDenuncia());
        dto.setIdUsuarioDenunciante(denuncia.getIdUsuarioDenunciante());
        dto.setDescripcionDenuncia(denuncia.getDescripcionDenuncia());
        dto.setFechaDenuncia(denuncia.getFechaDenuncia());
        dto.setIdPublicacionDenunciada(denuncia.getIdPublicacionDenunciada());
        dto.setIdReseniaDenunciada(denuncia.getIdReseniaDenunciada());
        dto.setIdRespuestaDenunciada(denuncia.getIdRespuestaDenunciada());

        // Extracción segura del Tipo de Denuncia (Evita el Proxy de Hibernate)
        if (denuncia.getTipoDenuncia() != null) {
            dto.setIdTipoDenuncia(denuncia.getTipoDenuncia().getIdTipoDenuncia());
            dto.setNombreTipoDenuncia(denuncia.getTipoDenuncia().getNombreTipoDenuncia());
        }

        // Extracción segura del Tipo de Contenido Denunciado
        if (denuncia.getTipoContenido() != null) {
            dto.setIdTipoContenido(denuncia.getTipoContenido().getIdTipoContenido());
            dto.setNombreContenido(denuncia.getTipoContenido().getNombreContenido());
        }

        // Extracción segura del Usuario Denunciado
        if (denuncia.getUsuarioDenunciado() != null) {
            // Modifica 'getIdUsuario()' si el getter de la Clave Primaria en tu clase Usuario se llama distinto
            dto.setIdUsuarioDenunciado(denuncia.getUsuarioDenunciado().getIdUsuario()); 
        }

        return dto;
    }


    //Metodo usando para get usando nombres dinamicos
    public DenunciaDetalleDTO mapToDetalleDTO(Denuncia denuncia) {
        if (denuncia == null) {
            return null;
        }

        DenunciaDetalleDTO dto = new DenunciaDetalleDTO();
        dto.setIdDenuncia(denuncia.getIdDenuncia());
        dto.setDescripcionDenuncia(denuncia.getDescripcionDenuncia());
        dto.setFechaDenuncia(denuncia.getFechaDenuncia());
        dto.setIdPublicacionDenunciada(denuncia.getIdPublicacionDenunciada());
        dto.setIdReseniaDenunciada(denuncia.getIdReseniaDenunciada());
        dto.setIdRespuestaDenunciada(denuncia.getIdRespuestaDenunciada());

        // 1. Resolver el Nombre del Denunciante de forma dinámica
        if (denuncia.getIdUsuarioDenunciante() != null) {
            usuarioRepository.findById(denuncia.getIdUsuarioDenunciante())
                .ifPresentOrElse(
                    u -> dto.setNombreUsuarioDenunciante(u.getPNombre() + " " + u.getPApellido()),
                    () -> dto.setNombreUsuarioDenunciante("Usuario no encontrado")
                );
        }

        // 2. Obtener el nombre del Tipo de Denuncia
        if (denuncia.getTipoDenuncia() != null) {
            dto.setNombreTipoDenuncia(denuncia.getTipoDenuncia().getNombreTipoDenuncia());
        }

        // 3. Obtener el nombre del Contenido Denunciado
        if (denuncia.getTipoContenido() != null) {
            dto.setNombreTipoContenido(denuncia.getTipoContenido().getNombreContenido());
        }

        // 4. Obtener el nombre completo del Usuario Reportado
        if (denuncia.getUsuarioDenunciado() != null) {
            Usuario respondido = denuncia.getUsuarioDenunciado();
            dto.setNombreUsuarioDenunciado(respondido.getPNombre() + " " + respondido.getPApellido());
        }

        return dto;
    }
    
    // (Conserva aquí abajo tu método anterior mapToDTO si lo necesitas para otros flujos)


}

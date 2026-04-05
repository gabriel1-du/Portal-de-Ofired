package com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUsuarioDTOAdmin;
import com.example.usuarioApi.Model.Comuna;
import com.example.usuarioApi.Model.Oficio;
import com.example.usuarioApi.Model.Region;
import com.example.usuarioApi.Model.SexoUsuario;
import com.example.usuarioApi.Model.TipoUsuario;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.ComunaRepository;
import com.example.usuarioApi.Repository.OficioRepository;
import com.example.usuarioApi.Repository.RegionRepository;
import com.example.usuarioApi.Repository.SexoUsuarioRepository;
import com.example.usuarioApi.Repository.TipoUsuarioRepository;

@Component
public class UsuarioMapActualizar {


    @Autowired
    private SexoUsuarioRepository sexoRepository;
    @Autowired
    private TipoUsuarioRepository tipoUsuarioRepository;
    @Autowired
    private RegionRepository regionRepository;
    @Autowired
    private ComunaRepository comunaRepository;
    @Autowired
    private OficioRepository oficioRepository;
    //metodo que devuelve un valor por defecto si el string es nulo o está vacío, de lo contrario devuelve el string original
    private String defaultIfBlank(String input, String defaultValue) {
        return (input == null || input.trim().isEmpty()) ? defaultValue : input;
    }


    public void mapActualizarDTOToUsuario(actualizarUserDTO dto, Usuario usuario) {
        // Mapeo de datos personales, solo si no son nulos en el DTO.
        if (dto.getPrimerNombre() != null) {
            usuario.setPNombre(defaultIfBlank(dto.getPrimerNombre(), "N"));
        }
        if (dto.getSegundoNombre() != null) {
            usuario.setSNombre(defaultIfBlank(dto.getSegundoNombre(), "N"));
        }
        if (dto.getPrimerApellido() != null) {
            usuario.setPApellido(defaultIfBlank(dto.getPrimerApellido(), "N"));
        }
        if (dto.getSegundoApellido() != null) {
            usuario.setSApellido(defaultIfBlank(dto.getSegundoApellido(), "N"));
        }

        // Mapeo de otros datos, solo si no son nulos.
        if (dto.getCorreoElec() != null) {
            usuario.setCorreoElec(dto.getCorreoElec());
        }
        if (dto.getNumeroTelef() != null) {
            usuario.setNumeroTelef(defaultIfBlank(dto.getNumeroTelef(), "N"));
        }
        if (dto.getFoto() != null) {
            usuario.setFoto(dto.getFoto());
        }

        // Mapeo de relaciones (IDs a Entidades).
        if (dto.getIdSexoUsu() != null) {
            SexoUsuario sexo = sexoRepository.findById(dto.getIdSexoUsu())
                    .orElseThrow(() -> new RuntimeException("Sexo no encontrado con id: " + dto.getIdSexoUsu()));
            usuario.setSexo(sexo);
        }
        if (dto.getIdRegionUsu() != null) {
            Region region = regionRepository.findById(dto.getIdRegionUsu())
                    .orElseThrow(() -> new RuntimeException("Región no encontrada con id: " + dto.getIdRegionUsu()));
            usuario.setRegion(region);
        }
        if (dto.getIdComunaUsu() != null) {
            Comuna comuna = comunaRepository.findById(dto.getIdComunaUsu())
                    .orElseThrow(() -> new RuntimeException("Comuna no encontrada con id: " + dto.getIdComunaUsu()));
            usuario.setComuna(comuna);
        }
        if (dto.getIdOficio() != null) {
            Oficio oficio = oficioRepository.findById(dto.getIdOficio())
                    .orElseThrow(() -> new RuntimeException("Oficio no encontrado con id: " + dto.getIdOficio()));
            usuario.setOficio(oficio);
        }

    }

    public void mapActualizarDTOToUsuarioAdmin(actualizarUsuarioDTOAdmin dto, Usuario usuario) {
        // Mapeo de datos personales, solo si no son nulos en el DTO.
        if (dto.getPrimerNombre() != null) {
            usuario.setPNombre(defaultIfBlank(dto.getPrimerNombre(), "N"));
        }
        if (dto.getSegundoNombre() != null) {
            usuario.setSNombre(defaultIfBlank(dto.getSegundoNombre(), "N"));
        }
        if (dto.getPrimerApellido() != null) {
            usuario.setPApellido(defaultIfBlank(dto.getPrimerApellido(), "N"));
        }
        if (dto.getSegundoApellido() != null) {
            usuario.setSApellido(defaultIfBlank(dto.getSegundoApellido(), "N"));
        }

        // Mapeo de otros datos, solo si no son nulos.
        if (dto.getCorreoElec() != null) {
            usuario.setCorreoElec(dto.getCorreoElec());
        }
        if (dto.getNumeroTelef() != null) {
            usuario.setNumeroTelef(defaultIfBlank(dto.getNumeroTelef(), "N"));
        }
        if (dto.getFoto() != null) {
            usuario.setFoto(dto.getFoto());
        }
        if (dto.getRut() != null) {
            usuario.setRut(defaultIfBlank(dto.getRut(), "N"));
        }
        if (dto.getRutDv() != null) {
            usuario.setRutDv(defaultIfBlank(dto.getRutDv(), "N"));
        }
        if (dto.getHabilitadorAdministrador() != null) {
            usuario.setHabilitadorAdministrador(dto.getHabilitadorAdministrador());
        }

        // Mapeo de relaciones (IDs a Entidades).
        if (dto.getIdSexoUsu() != null) {
            SexoUsuario sexo = sexoRepository.findById(dto.getIdSexoUsu())
                    .orElseThrow(() -> new RuntimeException("Sexo no encontrado con id: " + dto.getIdSexoUsu()));
            usuario.setSexo(sexo);
        }
        if (dto.getIdTipoUsu() != null) {
            TipoUsuario tipoUsuario = tipoUsuarioRepository.findById(dto.getIdTipoUsu())
                    .orElseThrow(() -> new RuntimeException("Tipo de Usuario no encontrado con id: " + dto.getIdTipoUsu()));
            usuario.setTipoUsuario(tipoUsuario);
        }
        if (dto.getIdRegionUsu() != null) {
            Region region = regionRepository.findById(dto.getIdRegionUsu())
                    .orElseThrow(() -> new RuntimeException("Región no encontrada con id: " + dto.getIdRegionUsu()));
            usuario.setRegion(region);
        }
        if (dto.getIdComunaUsu() != null) {
            Comuna comuna = comunaRepository.findById(dto.getIdComunaUsu())
                    .orElseThrow(() -> new RuntimeException("Comuna no encontrada con id: " + dto.getIdComunaUsu()));
            usuario.setComuna(comuna);
        }
        if (dto.getIdOficio() != null) {
            Oficio oficio = oficioRepository.findById(dto.getIdOficio())
                    .orElseThrow(() -> new RuntimeException("Oficio no encontrado con id: " + dto.getIdOficio()));
            usuario.setOficio(oficio);
        }

    }

}

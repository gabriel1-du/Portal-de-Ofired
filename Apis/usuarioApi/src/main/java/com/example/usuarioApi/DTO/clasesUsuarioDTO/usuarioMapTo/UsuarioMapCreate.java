package com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL1DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL2DTO;
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
public class UsuarioMapCreate {

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


    //Metodo para convertir ususario a crear
     public Usuario mapCrearUsuarioDTOToUsuario(crearUsuarioDTO dto) {
        Usuario usuario = new Usuario();

        // Mapeo de datos personales, con "N" como valor por defecto para strings vacíos o nulos.
        usuario.setPNombre(defaultIfBlank(dto.getPrimerNombre(), "N"));
        usuario.setSNombre(defaultIfBlank(dto.getSegundoNombre(), "N"));
        usuario.setPApellido(defaultIfBlank(dto.getPrimerApellido(), "N"));
        usuario.setSApellido(defaultIfBlank(dto.getSegundoApellido(), "N"));

        // Mapeo de credenciales y datos de identificación.
        usuario.setCorreoElec(dto.getCorreoElec());
        usuario.setPassword(dto.getPassword()); // La contraseña DEBE ser hasheada en el servicio.
        usuario.setRut(defaultIfBlank(dto.getRut(), "N"));
        usuario.setRutDv(defaultIfBlank(dto.getRutDv(), "N"));
        usuario.setNumeroTelef(defaultIfBlank(dto.getNumeroTelef(), "N"));
        usuario.setValoracion(dto.getValoracion() != null ? java.math.BigDecimal.valueOf(dto.getValoracion()) : java.math.BigDecimal.ZERO); // Valor por defecto de 0.0 si no se proporciona

        // Mapeo de relaciones (IDs a Entidades).
        // Si el ID es null, la relación no se establece.
        // Si el ID no es null pero no se encuentra la entidad, se lanza una excepción para detener la creación.
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
        return usuario;
    }


    public Usuario mapCrearUsuarioLVL1DTOtoUsuario(crearUsuarioLVL1DTO dto) {
        Usuario usuario = new Usuario();

        // Mapeo de datos personales, con "N" como valor por defecto para strings vacíos o nulos.
        usuario.setPNombre(defaultIfBlank(dto.getPrimerNombre(), "N"));
        usuario.setSNombre(defaultIfBlank(dto.getSegundoNombre(), "N"));
        usuario.setPApellido(defaultIfBlank(dto.getPrimerApellido(), "N"));
        usuario.setSApellido(defaultIfBlank(dto.getSegundoApellido(), "N"));

        // Mapeo de credenciales y datos de identificación.
        usuario.setCorreoElec(dto.getCorreoElec());
        usuario.setPassword(dto.getPassword()); // La contraseña DEBE ser hasheada en el servicio.
        usuario.setRut(null);
        usuario.setRutDv(null);
        usuario.setNumeroTelef(defaultIfBlank(dto.getNumeroTelef(), "N"));
        usuario.setFoto(defaultIfBlank(dto.getFoto(), "N"));
        usuario.setTipoUsuario(tipoUsuarioRepository.findById(1) // Asumiendo que el ID 1 corresponde a "Usuario Nivel 1"
                .orElseThrow(() -> new RuntimeException("Tipo de Usuario no encontrado con id: 1")));
        usuario.setHabilitadorAdministrador(null);
        // Valor por defecto de 0.0 si no se proporciona
        usuario.setValoracion( java.math.BigDecimal.ZERO); 
        

        //Espacios geograficos
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

        // Para usuarios de nivel 1, se asignan valores por defecto a las relaciones.
        SexoUsuario sexo = sexoRepository.findById(dto.getIdSexoUsu())
                .orElseThrow(() -> new RuntimeException("Sexo no encontrado con id: " + dto.getIdSexoUsu()));
        usuario.setSexo(sexo);
        return usuario;
    }

     public Usuario mapCrearUsuarioLVL2DTOtoUsuario(crearUsuarioLVL2DTO dto) {
        Usuario usuario = new Usuario();

        // Mapeo de datos personales, con "N" como valor por defecto para strings vacíos o nulos.
        usuario.setPNombre(defaultIfBlank(dto.getPrimerNombre(), "N"));
        usuario.setSNombre(defaultIfBlank(dto.getSegundoNombre(), "N"));
        usuario.setPApellido(defaultIfBlank(dto.getPrimerApellido(), "N"));
        usuario.setSApellido(defaultIfBlank(dto.getSegundoApellido(), "N"));

        // Mapeo de credenciales y datos de identificación.
        usuario.setCorreoElec(dto.getCorreoElec());
        usuario.setPassword(dto.getPassword()); // La contraseña DEBE ser hasheada en el servicio.
        usuario.setRut(dto.getRut());
        usuario.setRutDv(dto.getRutDv());
        usuario.setNumeroTelef(defaultIfBlank(dto.getNumeroTelef(), "N"));
        usuario.setFoto(defaultIfBlank(dto.getFoto(), "N"));
        usuario.setTipoUsuario(tipoUsuarioRepository.findById(1) // Asumiendo que el ID 1 corresponde a "Usuario Nivel 1"
                .orElseThrow(() -> new RuntimeException("Tipo de Usuario no encontrado con id: 1")));
        usuario.setHabilitadorAdministrador(false);
        // Valor por defecto de 0.0 si no se proporciona
        usuario.setValoracion(dto.getValoracion() != null ? java.math.BigDecimal.valueOf(dto.getValoracion()) : java.math.BigDecimal.ZERO); 
        
        
        
        //Espacios geograficos
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

        // Para usuarios de nivel 1, se asignan valores por defecto a las relaciones.
        SexoUsuario sexo = sexoRepository.findById(dto.getIdSexoUsu())
                .orElseThrow(() -> new RuntimeException("Sexo no encontrado con id: " + dto.getIdSexoUsu()));
        usuario.setSexo(sexo);
        return usuario;
    }

}

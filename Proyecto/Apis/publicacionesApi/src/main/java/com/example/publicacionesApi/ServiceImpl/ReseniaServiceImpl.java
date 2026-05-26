package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.ActualizarReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.CrearReniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.calificacionReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.MapperRenia.UsuarioMapperReseniaDTO;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.RestClient.PerfilRestClient;
import com.example.publicacionesApi.RestClient.UsuarioRestClient;
import com.example.publicacionesApi.RestClientDTO.PerfilExternoDTO;
import com.example.publicacionesApi.RestClientDTO.actualizarPerfilDTO;
import com.example.publicacionesApi.RestClientDTO.actualizarUserDTO;
import com.example.publicacionesApi.Service.ReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReseniaServiceImpl implements ReseniaService {

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Autowired
    private UsuarioMapperReseniaDTO reseniaMapper;

    @Autowired
    private UsuarioRestClient usuarioRestClient;

    @Autowired
    private PerfilRestClient perfilRestClient;

    @Override
    public List<LeerReseniaDTO> listarTodas() {
        return reseniaRepository.findAll().stream()
                .map(reseniaMapper::toLeerReseniaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeerReseniaFrontDTO> listarTodasParaFront() {
        return reseniaRepository.findAll().stream()
                .map(reseniaMapper::toLeerReseniaFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LeerReseniaDTO obtenerPorId(Integer id) {
        Resenia resenia = reseniaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada con id: " + id));
        return reseniaMapper.toLeerReseniaDTO(resenia);
    }

    @Override
    public LeerReseniaDTO crear(CrearReniaDTO reseniaDTO) {
        Resenia resenia = reseniaMapper.toEntity(reseniaDTO);
        
        // Asignamos la fecha actual en el momento de la creación de la reseña
        resenia.setFechaCreacion(LocalDateTime.now());
        
        Resenia reseniaGuardada = reseniaRepository.save(resenia);

        // 1. Obtener el ID del usuario reseñado
        Integer idUsuarioReseniado = reseniaDTO.getIdUsuarioReseniado();
        
        // 2. Calcular el nuevo promedio de calificación
        calificacionReseniaDTO promedioDTO = promedioCalificacionPorUsuario(idUsuarioReseniado);
        
        // 3. Crear el DTO de actualización con solo la calificación
        actualizarUserDTO usuarioUpdate = new actualizarUserDTO();
        
        usuarioUpdate.setCalificacion(BigDecimal.valueOf(promedioDTO.getPromedioCalificacion()));
        
        // 4. Hacer la actualización mediante el RestClient
        usuarioRestClient.actualizarUsuario(idUsuarioReseniado, usuarioUpdate);

        // 5. Obtener el Perfil usando el ID del usuario, y actualizar si existe
        try {
            PerfilExternoDTO perfil = perfilRestClient.obtenerPerfilPorUsuario(idUsuarioReseniado);
            
            if (perfil != null && perfil.getIdPerfilUsuario() != null) {
                actualizarPerfilDTO perfilUpdate = new actualizarPerfilDTO();
                perfilUpdate.setCalificacion(BigDecimal.valueOf(promedioDTO.getPromedioCalificacion()));
                
                // 6. Hacer la actualización del Perfil usando el ID DEL PERFIL real
                perfilRestClient.actualizarPerfil(perfil.getIdPerfilUsuario(), perfilUpdate);
            }
        } catch (Exception e) {
            // Ignoramos el error si el usuario no tiene un perfil creado u ocurre un fallo en la API externa
            System.err.println("Aviso: No se pudo actualizar el perfil. " + e.getMessage());
        }
        
        return reseniaMapper.toLeerReseniaDTO(reseniaGuardada);
    }

    @Override
    public LeerReseniaDTO actualizar(Integer id, ActualizarReseniaDTO reseniaDTO) {
        Resenia reseniaExistente = reseniaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada con id: " + id));
        
        reseniaMapper.updateFromDTO(reseniaDTO, reseniaExistente);
        
        Resenia reseniaActualizada = reseniaRepository.save(reseniaExistente);
        return reseniaMapper.toLeerReseniaDTO(reseniaActualizada);
    }

    @Override
    public void eliminar(Integer id) {
        if (!reseniaRepository.existsById(id)) {
            throw new RuntimeException("Reseña no encontrada con id: " + id);
        }
        reseniaRepository.deleteById(id);
    }

    @Override
    public List<LeerReseniaFrontDTO> listarPorAutor(Integer idAutor) {
        return reseniaRepository.findByIdAutor(idAutor).stream()
                .map(reseniaMapper::toLeerReseniaFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<LeerReseniaFrontDTO> listarPorUsuarioReseniado(Integer idUsuarioReseniado) {
        return reseniaRepository.findByIdUsuarioReseniado(idUsuarioReseniado).stream()
                .map(reseniaMapper::toLeerReseniaFrontDTO)
                .collect(Collectors.toList());
    }

    @Override
    public calificacionReseniaDTO promedioCalificacionPorUsuario(Integer idUsuario) {
        List<LeerReseniaFrontDTO> resenias = listarPorUsuarioReseniado(idUsuario);
        
        double sumaCalificaciones = 0.0;
        int cantidadResenias = 0;
        
        for (LeerReseniaFrontDTO resenia : resenias) {
            if (resenia.getCalificacion() != null) {
                sumaCalificaciones += resenia.getCalificacion();
                cantidadResenias++;
            }
        }
        
        double promedio = 0.0;
        if (cantidadResenias > 0) {
            promedio = Math.floor(sumaCalificaciones / cantidadResenias);
        }
        
        calificacionReseniaDTO dto = new calificacionReseniaDTO();
        dto.setIdUsuario(idUsuario);
        dto.setPromedioCalificacion(promedio);
        
        return dto;
    }
}
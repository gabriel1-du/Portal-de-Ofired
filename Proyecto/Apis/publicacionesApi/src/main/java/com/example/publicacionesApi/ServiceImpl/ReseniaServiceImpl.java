package com.example.publicacionesApi.ServiceImpl;

import com.example.publicacionesApi.DTO.ClasesReseniasDTO.ActualizarReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.CrearReniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.LeerReseniaFrontDTO;
import com.example.publicacionesApi.DTO.ClasesReseniasDTO.MapperRenia.UsuarioMapperReseniaDTO;
import com.example.publicacionesApi.Model.Resenia;
import com.example.publicacionesApi.Repository.ReseniaRepository;
import com.example.publicacionesApi.Service.ReseniaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReseniaServiceImpl implements ReseniaService {

    @Autowired
    private ReseniaRepository reseniaRepository;

    @Autowired
    private UsuarioMapperReseniaDTO reseniaMapper;

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
}
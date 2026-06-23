package com.example.usuarioApi.ServiceImpl; // <-- Apunta a tu carpeta actual


import com.example.usuarioApi.Service.DenunciaService;
import com.example.usuarioApi.DTO.ClasesdenunciasDTO.CrearDenunciaDTO;
import com.example.usuarioApi.DTO.ClasesdenunciasDTO.DenunciaDetalleDTO;
import com.example.usuarioApi.DTO.ClasesdenunciasDTO.DenunciaMapper;
import com.example.usuarioApi.Model.Denuncia;
import com.example.usuarioApi.Model.TipoContenidoDenunciado;
import com.example.usuarioApi.Model.TipoDenuncia;
import com.example.usuarioApi.Model.Usuario;
import com.example.usuarioApi.Repository.DenunciaRepository;
import com.example.usuarioApi.Repository.TipoContenidoDenunciadoRepository;
import com.example.usuarioApi.Repository.TipoDenunciaRepository;
import com.example.usuarioApi.Repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DenunciaServiceImpl implements DenunciaService {

    @Autowired //Inyecciones
    private DenunciaRepository denunciaRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private TipoDenunciaRepository tipoDenunciaRepository;
    @Autowired
    private TipoContenidoDenunciadoRepository tipoContenidoDenunciadoRepository;

    @Autowired//Mapper
    private DenunciaMapper denunciaMapper; 

  

    @Override //Metodo post
    public Denuncia registrarDenuncia(CrearDenunciaDTO dto) {
        Denuncia denuncia = new Denuncia();
        
        Usuario usuarioDenunciado = usuarioRepository.findById(dto.getIdUsuarioDenunciado())
                .orElseThrow(() -> new RuntimeException("Usuario denunciado no encontrado"));
                
        TipoDenuncia tipoDenuncia = tipoDenunciaRepository.findById(dto.getIdTipoDenuncia())
                .orElseThrow(() -> new RuntimeException("Tipo de denuncia no encontrado"));
                
        TipoContenidoDenunciado tipoContenido = tipoContenidoDenunciadoRepository.findById(dto.getIdTipoContenido())
                .orElseThrow(() -> new RuntimeException("Tipo de contenido no encontrado"));

        denuncia.setIdUsuarioDenunciante(dto.getIdUsuarioDenunciante());
        denuncia.setUsuarioDenunciado(usuarioDenunciado);
        denuncia.setTipoDenuncia(tipoDenuncia);
        denuncia.setDescripcionDenuncia(dto.getDescripcionDenuncia());
        denuncia.setTipoContenido(tipoContenido);
        
        return denunciaRepository.save(denuncia);
    }

  
    @Override //Metodo get
    public DenunciaDetalleDTO obtenerDetallePorId(Integer id) {
        Denuncia denuncia = denunciaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Denuncia con ID " + id + " no encontrada."));
        return denunciaMapper.mapToDetalleDTO(denuncia);
    }

    @Override //Metodo get
    public List<DenunciaDetalleDTO> listarTodasDetalle() {
        List<Denuncia> denuncias = denunciaRepository.findAll();
        return denuncias.stream()
                .map(denunciaMapper::mapToDetalleDTO)
                .collect(Collectors.toList());
    }

    
    @Override//Metodo delete
    public void eliminarDenuncia(Integer id) {
        if (!denunciaRepository.existsById(id)) {
            throw new RuntimeException("La denuncia con ID " + id + " no existe.");
        }
        denunciaRepository.deleteById(id);
    }

}
package com.example.usuarioApi.Service;

import java.util.List;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.ActualizarTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.CrearTipoDeTrabajoDTO;
import com.example.usuarioApi.DTO.ClasesTipoTrabajoDTO.LeerTipoDeTrabajoDTO;

public interface TipoDeTrabajoService {
    LeerTipoDeTrabajoDTO crearTipoDeTrabajo(CrearTipoDeTrabajoDTO dto);
    LeerTipoDeTrabajoDTO leerTipoDeTrabajoPorId(Integer id);
    LeerTipoDeTrabajoDTO actualizarTipoDeTrabajo(Integer id, ActualizarTipoDeTrabajoDTO dto);
    void eliminarTipoDeTrabajo(Integer id);
    List<LeerTipoDeTrabajoDTO> leerTodosLosTiposDeTrabajo();
}

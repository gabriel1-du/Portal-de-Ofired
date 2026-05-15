package com.example.usuarioApi.Service;

import java.util.List;

import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.ActualizarConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.CrearConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionDTO;
import com.example.usuarioApi.DTO.ClasesConfirmacionTransaccionDTO.LeerConfirmacionTransaccionFrontDTO;

public interface ConfirmacionTransaccionService {
    
    LeerConfirmacionTransaccionFrontDTO crearTransaccion(CrearConfirmacionTransaccionDTO dto);
    
    LeerConfirmacionTransaccionFrontDTO leerTransaccionPorId(Integer id);
    
    LeerConfirmacionTransaccionFrontDTO actualizarEstado(Integer id, ActualizarConfirmacionTransaccionDTO dto);
    
    void eliminarTransaccion(Integer id);
    
    List<LeerConfirmacionTransaccionFrontDTO> leerTodasLasTransaccionesFront();
    
    List<LeerConfirmacionTransaccionDTO> leerTodasLasTransaccionesId();

    List<LeerConfirmacionTransaccionFrontDTO> buscarPorUsuarioInvolucrado(Integer idUsuario);
}

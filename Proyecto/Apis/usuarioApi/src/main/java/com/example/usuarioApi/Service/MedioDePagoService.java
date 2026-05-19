package com.example.usuarioApi.Service;

import java.util.List;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.ActualizarMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.CrearMedioDePagoDTO;
import com.example.usuarioApi.DTO.ClasesMedioDePagoDTO.LeerMedioDePagoDTO;

public interface MedioDePagoService {
    LeerMedioDePagoDTO crearMedioDePago(CrearMedioDePagoDTO dto);
    LeerMedioDePagoDTO leerMedioDePagoPorId(Integer id);
    LeerMedioDePagoDTO actualizarMedioDePago(Integer id, ActualizarMedioDePagoDTO dto);
    void eliminarMedioDePago(Integer id);
    List<LeerMedioDePagoDTO> leerTodosLosMediosDePago();
}

package com.example.usuarioApi.ServiceImpl;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUsuarioDTOAdmin;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.eliminarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo;
import com.example.usuarioApi.Model.*; // Importar todos los modelos para las relaciones
import com.example.usuarioApi.Repository.*; // Importar todos los repositorios necesarios
import org.springframework.stereotype.Service;

import com.example.usuarioApi.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;




@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
   
    //instacnia de mapper
    @Autowired
    private usuarioMapTo mapper; 

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public leerUsuarioDTO crearUsuario(crearUsuarioDTO usuarioDTO) {
    
        // 1. Mapear el DTO de creación a la entidad Usuario, aplicando la lógica de valores por defecto.
        Usuario usuario = mapper.mapCrearUsuarioDTOToUsuario(usuarioDTO);

        // 2. Hashear la contraseña obtenida del DTO usando el PasswordEncoder.
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
 
        // 2. Guardar la nueva entidad de usuario en la base de datos.
        // El método save() de JPARepository devuelve la entidad guardada, que ahora incluye el ID generado.
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        // 3. Mapear la entidad recién guardada a un DTO de lectura para la respuesta.
        // Esto asegura que el cliente reciba el estado final del objeto, incluyendo el ID.
        return mapper.mapUsuarioToLeerUsuarioDTO(nuevoUsuario);
    }

    @Override
    public leerUsuarioDTO leerUsuario(Integer id) {
    

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id)); 

        return mapper.mapUsuarioToLeerUsuarioDTO(usuario);
    }

    @Override
    public leerUsuarioDTO actualizarUsuario(Integer id, actualizarUserDTO usuarioDTO) {
    
        // 1. Buscar el usuario existente en la base de datos.
        // Si no se encuentra, se lanzará la excepción.
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        // 2. Usar el mapper para aplicar los cambios del DTO a la entidad existente.
        mapper.mapEditarActualizarDTOToUsuario(usuarioDTO, usuarioExistente);

        // 3. Guardar la entidad que fue modificada.
        Usuario usuarioGuardado = usuarioRepository.save(usuarioExistente);

        // 4. Mapear la entidad ya guardada (con posibles cambios de la BD) al DTO de respuesta final.
        return mapper.mapUsuarioToLeerUsuarioDTO(usuarioGuardado);
    }

    @Override
    public void eliminarUsuario(Integer id, eliminarUserDTO deleteDTO) {

        Usuario usuarioExitente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        usuarioRepository.delete(usuarioExitente);

    }
        

    @Override
    public leerUsuarioDTO actualizarUsuarioAdmin(Integer id, actualizarUsuarioDTOAdmin usuarioDTO) {
        // TODO: Implementar la lógica para actualizar un usuario como administrador.
        throw new UnsupportedOperationException("El método 'actualizarUsuarioAdmin' aún no ha sido implementado.");
    }

   

   
}

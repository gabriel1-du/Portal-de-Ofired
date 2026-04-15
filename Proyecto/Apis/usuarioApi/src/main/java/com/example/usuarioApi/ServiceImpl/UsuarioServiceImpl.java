package com.example.usuarioApi.ServiceImpl;

import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.actualizarUsuarioDTOAdmin;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL1DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.crearUsuarioLVL2DTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.eliminarUserDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.leerUsuarioDTO;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo.UsuarioMapActualizar;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo.UsuarioMapCreate;
import com.example.usuarioApi.DTO.clasesUsuarioDTO.usuarioMapTo.UsuarioMapLeer;
import com.example.usuarioApi.Model.*; // Importar todos los modelos para las relaciones
import com.example.usuarioApi.Repository.*; // Importar todos los repositorios necesarios
import org.springframework.stereotype.Service;

import com.example.usuarioApi.Service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.stream.Collectors;




@Service
public class UsuarioServiceImpl implements UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
   
    //instancia de mappers
    @Autowired
    private UsuarioMapLeer readMapper; 

    @Autowired
    private UsuarioMapCreate createMapper;

    @Autowired
    private UsuarioMapActualizar updateMapper;
    
    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public leerUsuarioDTO crearUsuario(crearUsuarioDTO usuarioDTO) {
    
        // 1. Mapear el DTO de creación a la entidad Usuario, aplicando la lógica de valores por defecto.
        Usuario usuario = createMapper.mapCrearUsuarioDTOToUsuario(usuarioDTO);

        // 2. Hashear la contraseña obtenida del DTO usando el PasswordEncoder.
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
 
        // 2. Guardar la nueva entidad de usuario en la base de datos.
        // El método save() de JPARepository devuelve la entidad guardada, que ahora incluye el ID generado.
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        // 3. Mapear la entidad recién guardada a un DTO de lectura para la respuesta.
        // Esto asegura que el cliente reciba el estado final del objeto, incluyendo el ID.
        return readMapper.mapUsuarioToLeerUsuarioDTO(nuevoUsuario);
    }

    @Override
    public leerUsuarioDTO crearUsuarioLVL1(crearUsuarioLVL1DTO usuarioDTO) {
        // 1. Mapear el DTO de creación específico para nivel 1 a la entidad Usuario, aplicando reglas de negocio particulares.
        Usuario usuario = createMapper.mapCrearUsuarioLVL1DTOtoUsuario(usuarioDTO);

        // 2. Hashear la contraseña obtenida del DTO usando el PasswordEncoder.
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 3. Guardar la nueva entidad de usuario en la base de datos.
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        // 4. Mapear la entidad recién guardada a un DTO de lectura para la respuesta.
        return readMapper.mapUsuarioToLeerUsuarioDTO(nuevoUsuario);
    }

     @Override
    public leerUsuarioDTO crearUsuarioLVL2(crearUsuarioLVL2DTO usuarioDTO) {
        // 1. Mapear el DTO de creación específico para nivel 1 a la entidad Usuario, aplicando reglas de negocio particulares.
        Usuario usuario = createMapper.mapCrearUsuarioLVL2DTOtoUsuario(usuarioDTO);

        // 2. Hashear la contraseña obtenida del DTO usando el PasswordEncoder.
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));

        // 3. Guardar la nueva entidad de usuario en la base de datos.
        Usuario nuevoUsuario = usuarioRepository.save(usuario);

        // 4. Mapear la entidad recién guardada a un DTO de lectura para la respuesta.
        return readMapper.mapUsuarioToLeerUsuarioDTO(nuevoUsuario);
    }


    @Override
    public leerUsuarioDTO leerUsuario(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id)); 

        return readMapper.mapUsuarioToLeerUsuarioDTO(usuario);
    }

    @Override
    public leerUsuarioDTO actualizarUsuario(Integer id, actualizarUserDTO usuarioDTO) {
    
        // 1. Buscar el usuario existente en la base de datos.
        // Si no se encuentra, se lanzará la excepción.
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        // 2. Usar el mapper para aplicar los cambios del DTO a la entidad existente.
        updateMapper.mapActualizarDTOToUsuario(usuarioDTO, usuarioExistente);

        // 3. Guardar la entidad que fue modificada.
        Usuario usuarioGuardado = usuarioRepository.save(usuarioExistente);

        // 4. Mapear la entidad ya guardada (con posibles cambios de la BD) al DTO de respuesta final.
        return readMapper.mapUsuarioToLeerUsuarioDTO(usuarioGuardado);
    }

    @Override
    public void eliminarUsuario(Integer id) {
        Usuario usuarioExitente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));
        usuarioRepository.delete(usuarioExitente);

    }
        
    @Override
    public void eliminarUsuarioConIngresoContraseña(Integer id, eliminarUserDTO deleteDTO) {
    
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

    
        if (deleteDTO == null || deleteDTO.getPasswordConfirmacion() == null || deleteDTO.getPasswordConfirmacion().trim().isEmpty()) {
            throw new RuntimeException("La contraseña de confirmación es requerida para eliminar la cuenta.");
        }

        // Se corrabora si es la contraseña ingresada coincide con la contraseña almacenada del usuario, utilizando el PasswordEncoder para comparar el hash.
        boolean contrasenasCoinciden = passwordEncoder.matches(deleteDTO.getPasswordConfirmacion(), usuarioExistente.getPassword());

        // Si las contraseñas no coinciden, lanzar una excepción.
        if (!contrasenasCoinciden) {
            throw new RuntimeException("La contraseña es incorrecta. No se puede eliminar la cuenta.");
        }

        
        usuarioRepository.delete(usuarioExistente);
    }

    @Override
    public leerUsuarioDTO actualizarUsuarioAdmin(Integer id, actualizarUsuarioDTOAdmin usuarioDTO) {
        // 1. Buscar el usuario existente en la base de datos.
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con id: " + id));

        // 2. Usar el mapper para aplicar los cambios del DTO de admin a la entidad existente.
        // El objeto 'usuarioExistente' se modifica por referencia dentro de este método.
        updateMapper.mapActualizarDTOToUsuarioAdmin(usuarioDTO, usuarioExistente);

        // 3. Guardar la entidad que fue modificada.
        Usuario usuarioGuardado = usuarioRepository.save(usuarioExistente);

        // 4. Mapear la entidad ya guardada al DTO de respuesta final.
        // Es una buena práctica mapear la entidad que resulta de la operación de guardado.
        return readMapper.mapUsuarioToLeerUsuarioDTO(usuarioGuardado);
    }

    @Override // Método para leer todos los usuarios y mapearlos a DTOs de lectura
    public List<leerUsuarioDTO> leertTodosLosUsuariosDto() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }


    //metodo para iniciar sesion 
    @Override
    public leerUsuarioDTO iniciarSesion(String correoElec, String password) {
        Usuario usuario = usuarioRepository.findByCorreoElec(correoElec)
                .orElseThrow(() -> new RuntimeException("Credenciales no validas"));

        if (!passwordEncoder.matches(password, usuario.getPassword())) {
            throw new RuntimeException("Credenciales no validas");
        }

        return readMapper.mapUsuarioToLeerUsuarioDTO(usuario);
    }


    //Metodos de busqueda personalizados
    @Override
    public List<leerUsuarioDTO> buscarPorComuna(Integer idComuna) {
        List<Usuario> usuarios = usuarioRepository.findByComunaIdComuna(idComuna);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerUsuarioDTO> buscarPorRegion(Integer idRegion) {
        List<Usuario> usuarios = usuarioRepository.findByRegionIdRegion(idRegion);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerUsuarioDTO> buscarPorNombre(String nombre) {
        List<Usuario> usuarios = usuarioRepository.findByNombre(nombre);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerUsuarioDTO> buscarPorValoracion(BigDecimal valoracion) {
        List<Usuario> usuarios = usuarioRepository.findByValoracion(valoracion);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerUsuarioDTO> buscarPorFechaDeCreacion(Timestamp fecha) {
        List<Usuario> usuarios = usuarioRepository.findByFechaCreacion(fecha);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerUsuarioDTO> buscarPorFechaCreacionDespuesDe(Timestamp fecha) {
        List<Usuario> usuarios = usuarioRepository.findByFechaCreacionGreaterThan(fecha);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<leerUsuarioDTO> buscarPorFechaCreacionAntesDe(Timestamp fecha) {
        List<Usuario> usuarios = usuarioRepository.findByFechaCreacionLessThan(fecha);
        return usuarios.stream()
                .map(readMapper::mapUsuarioToLeerUsuarioDTO)
                .collect(Collectors.toList());
    }

   
}

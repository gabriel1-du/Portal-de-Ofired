package com.gateway.jwt.security;

import com.gateway.jwt.model.Usuario;
import lombok.AllArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.List;

@AllArgsConstructor
public class UserDetailsImpl implements UserDetails {

    private final Usuario usuario;

    public Integer getId() {
        return usuario.getId();
    }

    // Ahora este método informa a Spring Security sobre el rol del usuario.
    // Esto es crucial para que el proceso de autenticación pueda continuar.
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String role = Boolean.TRUE.equals(usuario.getAdmin()) ? "ROLE_ADMIN" : "ROLE_USER";
        return List.of(new SimpleGrantedAuthority(role));
    }

    @Override
    public String getPassword() {
        return usuario.getContrasena();
    }

    @Override
    public String getUsername() {
        return usuario.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() { return true; }

    @Override
    public boolean isAccountNonLocked() { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return true; }
}

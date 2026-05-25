package com.coinly.api.security;

import com.coinly.api.domain.Administrador;
import com.coinly.api.domain.Aluno;
import com.coinly.api.domain.EmpresaParceira;
import com.coinly.api.domain.Professor;
import com.coinly.api.domain.StatusEmpresa;
import com.coinly.api.domain.Usuario;
import com.coinly.api.repository.UsuarioRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoinlyUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CoinlyUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado"));

        String role = roleFor(usuario);
        boolean enabled = isEnabled(usuario);

        return User.withUsername(usuario.getEmail())
                .password(usuario.getSenha())
                .authorities(List.of(new SimpleGrantedAuthority(role)))
                .disabled(!enabled)
                .build();
    }

    public static String roleFor(Usuario usuario) {
        if (usuario instanceof Administrador) return "ROLE_ADMIN";
        if (usuario instanceof Professor) return "ROLE_PROFESSOR";
        if (usuario instanceof EmpresaParceira) return "ROLE_EMPRESA";
        if (usuario instanceof Aluno) return "ROLE_ALUNO";
        throw new IllegalStateException("Tipo de usuário desconhecido: " + usuario.getClass());
    }

    private boolean isEnabled(Usuario usuario) {
        if (usuario instanceof EmpresaParceira empresa) {
            return empresa.getStatus() == StatusEmpresa.APROVADA;
        }
        if (usuario instanceof Professor professor) {
            return professor.isAtivo();
        }
        return true;
    }
}

package com.coinly.api.controller;

import com.coinly.api.domain.Administrador;
import com.coinly.api.domain.Aluno;
import com.coinly.api.domain.EmpresaParceira;
import com.coinly.api.domain.Professor;
import com.coinly.api.domain.Usuario;
import com.coinly.api.dto.auth.LoginRequest;
import com.coinly.api.dto.auth.LoginResponse;
import com.coinly.api.dto.auth.MeResponse;
import com.coinly.api.dto.auth.TrocarSenhaRequest;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.UsuarioRepository;
import com.coinly.api.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {
        Authentication auth;
        try {
            auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.senha()));
        } catch (BadCredentialsException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        JwtService.TokenPayload payload = jwtService.generate(auth);
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return new LoginResponse(payload.token(), payload.expiresAt(), auth.getName(), roles);
    }

    @GetMapping("/me")
    public LoginResponse me() {
        Authentication auth = autenticacaoAtual();
        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();
        return new LoginResponse(null, null, auth.getName(), roles);
    }
    @GetMapping("/profile")
    public MeResponse profile() {
        Authentication auth = autenticacaoAtual();
        String email = auth.getName();

        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        List<String> roles = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .toList();

        if (usuario instanceof Aluno aluno) {
            return new MeResponse(
                usuario.getId(),
                aluno.getId(),
                null,
                null,
                usuario.getNome(),
                usuario.getEmail(),
                roles,
                "ALUNO"
            );
        } 
        else if (usuario instanceof Professor professor) {
            return new MeResponse(
                usuario.getId(),
                null,
                professor.getId(),
                null,
                usuario.getNome(),
                usuario.getEmail(),
                roles,
                "PROFESSOR"
            );
        } 
        else if (usuario instanceof EmpresaParceira empresa) {
            return new MeResponse(
                usuario.getId(),
                null,
                null,
                empresa.getId(),
                usuario.getNome(),
                usuario.getEmail(),
                roles,
                "EMPRESA"
            );
        }

        if (usuario instanceof Administrador) {
            return new MeResponse(
                usuario.getId(),
                null,
                null,
                null,
                usuario.getNome(),
                usuario.getEmail(),
                roles,
                "ADMIN"
            );
        }

        throw new IllegalStateException("Tipo de usuário não reconhecido");
    }

    @PostMapping("/trocar-senha")
    public ResponseEntity<Void> trocarSenha(@Valid @RequestBody TrocarSenhaRequest request) {
        Authentication auth = autenticacaoAtual();
        Usuario usuario = usuarioRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.senhaAtual(), usuario.getSenha())) {
            throw new BusinessException("Senha atual incorreta");
        }
        if (passwordEncoder.matches(request.senhaNova(), usuario.getSenha())) {
            throw new BusinessException("A nova senha deve ser diferente da atual");
        }

        usuario.setSenha(passwordEncoder.encode(request.senhaNova()));
        usuarioRepository.save(usuario);
        return ResponseEntity.noContent().build();
    }

    private Authentication autenticacaoAtual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Não autenticado");
        }
        return auth;
    }
}

package com.coinly.api.security;

import com.coinly.api.domain.Administrador;
import com.coinly.api.repository.AdministradorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class AdminSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final AdministradorRepository administradorRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminProperties properties;

    public AdminSeeder(AdministradorRepository administradorRepository,
                       PasswordEncoder passwordEncoder,
                       AdminProperties properties) {
        this.administradorRepository = administradorRepository;
        this.passwordEncoder = passwordEncoder;
        this.properties = properties;
    }

    @Override
    @Transactional
    public void run(String... args) {
        String email = properties.email();
        String senha = properties.senha();
        String nome = properties.nome();

        if (email == null || email.isBlank() || senha == null || senha.isBlank() || nome == null || nome.isBlank()) {
            log.warn("AdminSeeder ignorado: defina coinly.admin.email/senha/nome (ou as env vars ADMIN_EMAIL/ADMIN_SENHA/ADMIN_NOME)");
            return;
        }

        if (administradorRepository.findByEmail(email).isPresent()) {
            return;
        }
        Administrador admin = new Administrador();
        admin.setNome(nome);
        admin.setEmail(email);
        admin.setSenha(passwordEncoder.encode(senha));
        administradorRepository.save(admin);
        log.info("Administrador inicial criado: {}", email);
    }
}

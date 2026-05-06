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
        if (administradorRepository.findByEmail(properties.email()).isPresent()) {
            return;
        }
        Administrador admin = new Administrador();
        admin.setNome(properties.nome());
        admin.setEmail(properties.email());
        admin.setSenha(passwordEncoder.encode(properties.senha()));
        administradorRepository.save(admin);
        log.info("Administrador inicial criado: {}", properties.email());
    }
}

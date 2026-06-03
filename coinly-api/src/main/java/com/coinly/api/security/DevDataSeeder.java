package com.coinly.api.security;

import com.coinly.api.domain.*;
import com.coinly.api.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(2)
public class DevDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DevDataSeeder.class);
    private static final String SENHA = "senha123";

    private final InstituicaoRepository instituicaoRepository;
    private final AdministradorRepository administradorRepository;
    private final ProfessorRepository professorRepository;
    private final AlunoRepository alunoRepository;
    private final EmpresaParceiraRepository empresaParceiraRepository;
    private final PasswordEncoder passwordEncoder;

    public DevDataSeeder(InstituicaoRepository instituicaoRepository,
                         AdministradorRepository administradorRepository,
                         ProfessorRepository professorRepository,
                         AlunoRepository alunoRepository,
                         EmpresaParceiraRepository empresaParceiraRepository,
                         PasswordEncoder passwordEncoder) {
        this.instituicaoRepository = instituicaoRepository;
        this.administradorRepository = administradorRepository;
        this.professorRepository = professorRepository;
        this.alunoRepository = alunoRepository;
        this.empresaParceiraRepository = empresaParceiraRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        Instituicao inst = seedInstituicao();
        seedAdmin();
        seedProfessor(inst);
        seedAluno(inst);
        seedEmpresa();
    }

    private Instituicao seedInstituicao() {
        if (instituicaoRepository.existsByCnpj("12.345.678/0001-99")) {
            return instituicaoRepository.findByCnpj("12.345.678/0001-99").orElseThrow();
        }
        Instituicao inst = new Instituicao();
        inst.setNome("Universidade Federal Coinly");
        inst.setCnpj("12.345.678/0001-99");
        inst.setAtivo(true);
        inst = instituicaoRepository.save(inst);
        log.info("[Seed] Instituição criada: {}", inst.getNome());
        return inst;
    }

    private void seedAdmin() {
        if (administradorRepository.findByEmail("admin@coinly.com").isPresent()) return;
        Administrador admin = new Administrador();
        admin.setNome("Administrador");
        admin.setEmail("admin@coinly.com");
        admin.setSenha(passwordEncoder.encode(SENHA));
        administradorRepository.save(admin);
        log.info("[Seed] Admin criado: admin@coinly.com");
    }

    private void seedProfessor(Instituicao inst) {
        if (professorRepository.findByEmail("professor@coinly.com").isPresent()) return;
        Professor prof = new Professor();
        prof.setNome("Professor Silva");
        prof.setEmail("professor@coinly.com");
        prof.setSenha(passwordEncoder.encode(SENHA));
        prof.setCpf("111.222.333-44");
        prof.setDepartamento("Ciência da Computação");
        prof.setSaldoMoedas(1000);
        prof.setAtivo(true);
        prof.setInstituicao(inst);
        professorRepository.save(prof);
        log.info("[Seed] Professor criado: professor@coinly.com (saldo: 1000 moedas)");
    }

    private void seedAluno(Instituicao inst) {
        if (alunoRepository.findByEmail("aluno@coinly.com").isPresent()) return;
        Aluno aluno = new Aluno();
        aluno.setNome("Aluno Teste");
        aluno.setEmail("aluno@coinly.com");
        aluno.setSenha(passwordEncoder.encode(SENHA));
        aluno.setCpf("999.888.777-66");
        aluno.setRg("12.345.678-9");
        aluno.setEndereco("Rua das Flores, 123, São Paulo - SP");
        aluno.setCurso("Engenharia de Software");
        aluno.setSaldoMoedas(0);
        aluno.setInstituicao(inst);
        alunoRepository.save(aluno);
        log.info("[Seed] Aluno criado: aluno@coinly.com");
    }

    private void seedEmpresa() {
        if (empresaParceiraRepository.findByEmail("empresa@coinly.com").isPresent()) return;
        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome("Empresa Parceira Ltda");
        empresa.setEmail("empresa@coinly.com");
        empresa.setSenha(passwordEncoder.encode(SENHA));
        empresa.setCnpj("98.765.432/0001-10");
        empresa.setNomeFantasia("Parceira Tech");
        empresa.setStatus(StatusEmpresa.APROVADA);
        empresaParceiraRepository.save(empresa);
        log.info("[Seed] Empresa criada: empresa@coinly.com (status: APROVADA)");
    }
}

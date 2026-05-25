package com.coinly.api.service;

import com.coinly.api.domain.Instituicao;
import com.coinly.api.domain.Professor;
import com.coinly.api.dto.professor.ProfessorCreateRequest;
import com.coinly.api.dto.professor.ProfessorResponse;
import com.coinly.api.dto.professor.ProfessorUpdateRequest;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.InstituicaoRepository;
import com.coinly.api.repository.ProfessorRepository;
import com.coinly.api.repository.UsuarioRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordGenerator passwordGenerator;
    private final NotificacaoService notificacaoService;

    public ProfessorService(ProfessorRepository professorRepository,
                            InstituicaoRepository instituicaoRepository,
                            UsuarioRepository usuarioRepository,
                            PasswordEncoder passwordEncoder,
                            PasswordGenerator passwordGenerator,
                            NotificacaoService notificacaoService) {
        this.professorRepository = professorRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordGenerator = passwordGenerator;
        this.notificacaoService = notificacaoService;
    }

    @Transactional(readOnly = true)
    public List<ProfessorResponse> listar(Long instituicaoId) {
        List<Professor> professores = instituicaoId == null
                ? professorRepository.findAll()
                : professorRepository.findAll().stream()
                        .filter(p -> p.getInstituicao().getId().equals(instituicaoId))
                        .toList();
        return professores.stream().map(ProfessorResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProfessorResponse buscarPorId(Long id) {
        return ProfessorResponse.from(buscarEntidade(id));
    }

    @Transactional
    public ProfessorResponse criar(ProfessorCreateRequest request) {
        String cpf = normalizarCpf(request.cpf());

        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }
        if (professorRepository.existsByCpf(cpf)) {
            throw new BusinessException("CPF já cadastrado no sistema");
        }

        Instituicao instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instituição não encontrada: " + request.instituicaoId()));
        if (!instituicao.isAtivo()) {
            throw new BusinessException("Instituição inativa");
        }

        String senhaTemporaria = passwordGenerator.generate();

        Professor professor = new Professor();
        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setSenha(passwordEncoder.encode(senhaTemporaria));
        professor.setCpf(cpf);
        professor.setDepartamento(request.departamento());
        professor.setInstituicao(instituicao);
        professor.setSaldoMoedas(0);
        professor.setAtivo(true);

        Professor salvo = professorRepository.save(professor);
        notificacaoService.enviarCredenciais(salvo.getEmail(), salvo.getNome(), senhaTemporaria);
        return ProfessorResponse.from(salvo);
    }

    @Transactional
    public ProfessorResponse atualizar(Long id, ProfessorUpdateRequest request) {
        Professor professor = buscarEntidade(id);

        if (!professor.getEmail().equals(request.email())
                && usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }

        Instituicao instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instituição não encontrada: " + request.instituicaoId()));
        if (!instituicao.isAtivo()) {
            throw new BusinessException("Instituição inativa");
        }

        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setDepartamento(request.departamento());
        professor.setInstituicao(instituicao);

        return ProfessorResponse.from(professor);
    }

    @Transactional
    public ProfessorResponse desativar(Long id) {
        Professor professor = buscarEntidade(id);
        professor.setAtivo(false);
        return ProfessorResponse.from(professor);
    }

    private Professor buscarEntidade(Long id) {
        return professorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado: " + id));
    }

    private String normalizarCpf(String cpf) {
        return cpf == null ? null : cpf.replaceAll("\\D", "");
    }
    
    @Transactional
    public void deduzirSaldo(Long id, int valor) {
        Professor professor = professorRepository.findById(id).orElseThrow();
        professor.setSaldoMoedas(professor.getSaldoMoedas() - valor);
        professorRepository.save(professor);
    }

    @Scheduled(cron = "0 0 0 1 1,7 *")
    @Transactional
    public void creditarMoedasSemestrais() {
        List<Professor> professores = professorRepository.findAll();
        professores.forEach(p -> p.setSaldoMoedas(p.getSaldoMoedas() + 1000));
        professorRepository.saveAll(professores);
    }
    public Professor buscarPorEmail(String email) {
    	return professorRepository.findByEmail(email)
    			.orElseThrow(() -> new ResourceNotFoundException("Professor não encontrado"));
    }
}

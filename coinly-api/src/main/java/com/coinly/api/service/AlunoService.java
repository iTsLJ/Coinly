package com.coinly.api.service;

import com.coinly.api.domain.Aluno;
import com.coinly.api.domain.Instituicao;
import com.coinly.api.dto.aluno.AlunoCreateRequest;
import com.coinly.api.dto.aluno.AlunoResponse;
import com.coinly.api.dto.aluno.AlunoUpdateRequest;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.AlunoRepository;
import com.coinly.api.repository.InstituicaoRepository;
import com.coinly.api.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final InstituicaoRepository instituicaoRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordGenerator passwordGenerator;
    private final NotificacaoService notificacaoService;

    public AlunoService(AlunoRepository alunoRepository,
                        InstituicaoRepository instituicaoRepository,
                        UsuarioRepository usuarioRepository,
                        PasswordEncoder passwordEncoder,
                        PasswordGenerator passwordGenerator,
                        NotificacaoService notificacaoService) {
        this.alunoRepository = alunoRepository;
        this.instituicaoRepository = instituicaoRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordGenerator = passwordGenerator;
        this.notificacaoService = notificacaoService;
    }

    @Transactional(readOnly = true)
    public List<AlunoResponse> listar() {
        return alunoRepository.findAll().stream()
                .map(AlunoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public AlunoResponse buscarPorId(Long id) {
        return AlunoResponse.from(buscarEntidade(id));
    }

    @Transactional
    public AlunoResponse criar(AlunoCreateRequest request) {
        String cpf = normalizarCpf(request.cpf());

        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }
        if (alunoRepository.existsByCpf(cpf)) {
            throw new BusinessException("CPF já cadastrado no sistema");
        }

        Instituicao instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instituição não encontrada: " + request.instituicaoId()));
        if (!instituicao.isAtivo()) {
            throw new BusinessException("Instituição inativa");
        }

        String senhaTemporaria = passwordGenerator.generate();

        Aluno aluno = new Aluno();
        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setSenha(passwordEncoder.encode(senhaTemporaria));
        aluno.setCpf(cpf);
        aluno.setRg(request.rg());
        aluno.setEndereco(request.endereco());
        aluno.setCurso(request.curso());
        aluno.setInstituicao(instituicao);
        aluno.setSaldoMoedas(0);

        Aluno salvo = alunoRepository.save(aluno);
        notificacaoService.enviarCredenciais(salvo.getEmail(), salvo.getNome(), senhaTemporaria);
        return AlunoResponse.from(salvo);
    }

    @Transactional
    public AlunoResponse atualizar(Long id, AlunoUpdateRequest request) {
        Aluno aluno = buscarEntidade(id);

        if (!aluno.getEmail().equals(request.email())
                && usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }

        Instituicao instituicao = instituicaoRepository.findById(request.instituicaoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Instituição não encontrada: " + request.instituicaoId()));
        if (!instituicao.isAtivo()) {
            throw new BusinessException("Instituição inativa");
        }

        aluno.setNome(request.nome());
        aluno.setEmail(request.email());
        aluno.setRg(request.rg());
        aluno.setEndereco(request.endereco());
        aluno.setCurso(request.curso());
        aluno.setInstituicao(instituicao);

        return AlunoResponse.from(aluno);
    }

    @Transactional
    public void remover(Long id) {
        Aluno aluno = buscarEntidade(id);
        alunoRepository.delete(aluno);
    }

    private Aluno buscarEntidade(Long id) {
        return alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno não encontrado: " + id));
    }

    private String normalizarCpf(String cpf) {
        return cpf == null ? null : cpf.replaceAll("\\D", "");
    }
}

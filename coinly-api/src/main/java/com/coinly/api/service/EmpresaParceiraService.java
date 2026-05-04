package com.coinly.api.service;

import com.coinly.api.domain.EmpresaParceira;
import com.coinly.api.domain.StatusEmpresa;
import com.coinly.api.dto.empresa.EmpresaParceiraCreateRequest;
import com.coinly.api.dto.empresa.EmpresaParceiraResponse;
import com.coinly.api.dto.empresa.EmpresaParceiraUpdateRequest;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.EmpresaParceiraRepository;
import com.coinly.api.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EmpresaParceiraService {

    private final EmpresaParceiraRepository empresaRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordGenerator passwordGenerator;
    private final NotificacaoService notificacaoService;

    public EmpresaParceiraService(EmpresaParceiraRepository empresaRepository,
                                  UsuarioRepository usuarioRepository,
                                  PasswordEncoder passwordEncoder,
                                  PasswordGenerator passwordGenerator,
                                  NotificacaoService notificacaoService) {
        this.empresaRepository = empresaRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordGenerator = passwordGenerator;
        this.notificacaoService = notificacaoService;
    }

    @Transactional(readOnly = true)
    public List<EmpresaParceiraResponse> listar(StatusEmpresa status) {
        return empresaRepository.findAll().stream()
                .filter(e -> status == null || e.getStatus() == status)
                .map(EmpresaParceiraResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmpresaParceiraResponse buscarPorId(Long id) {
        return EmpresaParceiraResponse.from(buscarEntidade(id));
    }

    @Transactional
    public EmpresaParceiraResponse criar(EmpresaParceiraCreateRequest request) {
        String cnpj = normalizarCnpj(request.cnpj());

        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }
        if (empresaRepository.existsByCnpj(cnpj)) {
            throw new BusinessException("CNPJ já cadastrado no sistema");
        }

        String senhaTemporaria = passwordGenerator.generate();

        EmpresaParceira empresa = new EmpresaParceira();
        empresa.setNome(request.nomeFantasia());
        empresa.setEmail(request.email());
        empresa.setSenha(passwordEncoder.encode(senhaTemporaria));
        empresa.setCnpj(cnpj);
        empresa.setNomeFantasia(request.nomeFantasia());
        empresa.setStatus(StatusEmpresa.PENDENTE);

        EmpresaParceira salva = empresaRepository.save(empresa);
        notificacaoService.enviarCredenciais(salva.getEmail(), salva.getNomeFantasia(), senhaTemporaria);
        return EmpresaParceiraResponse.from(salva);
    }

    @Transactional
    public EmpresaParceiraResponse atualizar(Long id, EmpresaParceiraUpdateRequest request) {
        EmpresaParceira empresa = buscarEntidade(id);

        if (!empresa.getEmail().equals(request.email())
                && usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessException("Email já cadastrado no sistema");
        }

        empresa.setNome(request.nomeFantasia());
        empresa.setNomeFantasia(request.nomeFantasia());
        empresa.setEmail(request.email());

        return EmpresaParceiraResponse.from(empresa);
    }

    @Transactional
    public EmpresaParceiraResponse aprovar(Long id) {
        EmpresaParceira empresa = buscarEntidade(id);
        if (empresa.getStatus() == StatusEmpresa.APROVADA) {
            throw new BusinessException("Empresa já aprovada");
        }
        empresa.setStatus(StatusEmpresa.APROVADA);
        return EmpresaParceiraResponse.from(empresa);
    }

    @Transactional
    public EmpresaParceiraResponse rejeitar(Long id) {
        EmpresaParceira empresa = buscarEntidade(id);
        if (empresa.getStatus() == StatusEmpresa.REJEITADA) {
            throw new BusinessException("Empresa já rejeitada");
        }
        empresa.setStatus(StatusEmpresa.REJEITADA);
        return EmpresaParceiraResponse.from(empresa);
    }

    @Transactional
    public void remover(Long id) {
        EmpresaParceira empresa = buscarEntidade(id);
        empresaRepository.delete(empresa);
    }

    private EmpresaParceira buscarEntidade(Long id) {
        return empresaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada: " + id));
    }

    private String normalizarCnpj(String cnpj) {
        return cnpj == null ? null : cnpj.replaceAll("\\D", "");
    }
}
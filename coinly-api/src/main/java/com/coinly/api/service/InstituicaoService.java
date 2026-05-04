package com.coinly.api.service;

import com.coinly.api.domain.Instituicao;
import com.coinly.api.dto.instituicao.InstituicaoCreateRequest;
import com.coinly.api.dto.instituicao.InstituicaoResponse;
import com.coinly.api.dto.instituicao.InstituicaoUpdateRequest;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.InstituicaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InstituicaoService {

    private final InstituicaoRepository instituicaoRepository;

    public InstituicaoService(InstituicaoRepository instituicaoRepository) {
        this.instituicaoRepository = instituicaoRepository;
    }

    @Transactional(readOnly = true)
    public List<InstituicaoResponse> listar() {
        return instituicaoRepository.findAll().stream()
                .map(InstituicaoResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public InstituicaoResponse buscarPorId(Long id) {
        return InstituicaoResponse.from(buscarEntidade(id));
    }

    @Transactional
    public InstituicaoResponse criar(InstituicaoCreateRequest request) {
        String cnpj = normalizarCnpj(request.cnpj());

        if (instituicaoRepository.existsByCnpj(cnpj)) {
            throw new BusinessException("CNPJ já cadastrado");
        }

        Instituicao instituicao = new Instituicao();
        instituicao.setNome(request.nome());
        instituicao.setCnpj(cnpj);
        instituicao.setAtivo(true);

        return InstituicaoResponse.from(instituicaoRepository.save(instituicao));
    }

    @Transactional
    public InstituicaoResponse atualizar(Long id, InstituicaoUpdateRequest request) {
        Instituicao instituicao = buscarEntidade(id);
        instituicao.setNome(request.nome());
        instituicao.setAtivo(request.ativo());
        return InstituicaoResponse.from(instituicao);
    }

    @Transactional
    public void desativar(Long id) {
        Instituicao instituicao = buscarEntidade(id);
        instituicao.setAtivo(false);
    }

    private Instituicao buscarEntidade(Long id) {
        return instituicaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instituição não encontrada: " + id));
    }

    private String normalizarCnpj(String cnpj) {
        return cnpj == null ? null : cnpj.replaceAll("\\D", "");
    }
}
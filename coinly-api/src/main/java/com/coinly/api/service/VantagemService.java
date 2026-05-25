package com.coinly.api.service;

import com.coinly.api.domain.EmpresaParceira;
import com.coinly.api.domain.Vantagem;
import com.coinly.api.dto.vantagem.VantagemRequest;
import com.coinly.api.dto.vantagem.VantagemResponse;
import com.coinly.api.exception.BusinessException;
import com.coinly.api.exception.ResourceNotFoundException;
import com.coinly.api.repository.VantagemRepository;
import com.coinly.api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VantagemService {
	@Autowired
    private  VantagemRepository vantagemRepository;
	@Autowired
    private  UsuarioRepository usuarioRepository;

    @Transactional
    public VantagemResponse criar(VantagemRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        EmpresaParceira empresa = (EmpresaParceira) usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Empresa não encontrada"));

        Vantagem vantagem = new Vantagem();
        vantagem.setNome(request.nome());
        vantagem.setDescricao(request.descricao());
        vantagem.setFotoUrl(request.fotoUrl());
        vantagem.setCustoMoedas(request.custoMoedas());
        vantagem.setEmpresa(empresa);

        return VantagemResponse.from(vantagemRepository.save(vantagem));
    }

    public List<VantagemResponse> listar() {
        return vantagemRepository.findAll().stream()
                .map(VantagemResponse::from)
                .toList();
    }
    public List<VantagemResponse> listarMinhas() {

        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        EmpresaParceira empresa = (EmpresaParceira) usuarioRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Empresa não encontrada"));

        return vantagemRepository.findAllByEmpresa(empresa)
                .stream()
                .map(VantagemResponse::from)
                .toList();
    }

    public Vantagem buscarEntidadePorId(Long id) {
        return vantagemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vantagem não encontrada"));
    }
    
    @Transactional
    public void deletar(Long id) {
        Vantagem vantagem = buscarEntidadePorId(id);
        
        String emailAtual = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!vantagem.getEmpresa().getEmail().equals(emailAtual)) {
            throw new BusinessException("Você não tem permissão para excluir esta vantagem");
        }

        vantagemRepository.delete(vantagem);
    }
}
package com.coinly.api.controller;

import com.coinly.api.dto.instituicao.InstituicaoCreateRequest;
import com.coinly.api.dto.instituicao.InstituicaoResponse;
import com.coinly.api.dto.instituicao.InstituicaoUpdateRequest;
import com.coinly.api.service.InstituicaoService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/instituicoes")
public class InstituicaoController {

    private final InstituicaoService instituicaoService;

    public InstituicaoController(InstituicaoService instituicaoService) {
        this.instituicaoService = instituicaoService;
    }

    @GetMapping
    public List<InstituicaoResponse> listar() {
        return instituicaoService.listar();
    }

    @GetMapping("/{id}")
    public InstituicaoResponse buscar(@PathVariable Long id) {
        return instituicaoService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<InstituicaoResponse> criar(@Valid @RequestBody InstituicaoCreateRequest request) {
        InstituicaoResponse criada = instituicaoService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criada.id())
                .toUri();
        return ResponseEntity.created(location).body(criada);
    }

    @PutMapping("/{id}")
    public InstituicaoResponse atualizar(@PathVariable Long id,
                                         @Valid @RequestBody InstituicaoUpdateRequest request) {
        return instituicaoService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        instituicaoService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
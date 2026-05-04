package com.coinly.api.controller;

import com.coinly.api.domain.StatusEmpresa;
import com.coinly.api.dto.empresa.EmpresaParceiraCreateRequest;
import com.coinly.api.dto.empresa.EmpresaParceiraResponse;
import com.coinly.api.dto.empresa.EmpresaParceiraUpdateRequest;
import com.coinly.api.service.EmpresaParceiraService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/empresas")
public class EmpresaParceiraController {

    private final EmpresaParceiraService empresaService;

    public EmpresaParceiraController(EmpresaParceiraService empresaService) {
        this.empresaService = empresaService;
    }

    @GetMapping
    public List<EmpresaParceiraResponse> listar(@RequestParam(required = false) StatusEmpresa status) {
        return empresaService.listar(status);
    }

    @GetMapping("/{id}")
    public EmpresaParceiraResponse buscar(@PathVariable Long id) {
        return empresaService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<EmpresaParceiraResponse> criar(@Valid @RequestBody EmpresaParceiraCreateRequest request) {
        EmpresaParceiraResponse criado = empresaService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.id())
                .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{id}")
    public EmpresaParceiraResponse atualizar(@PathVariable Long id,
                                             @Valid @RequestBody EmpresaParceiraUpdateRequest request) {
        return empresaService.atualizar(id, request);
    }

    @PatchMapping("/{id}/aprovar")
    public EmpresaParceiraResponse aprovar(@PathVariable Long id) {
        return empresaService.aprovar(id);
    }

    @PatchMapping("/{id}/rejeitar")
    public EmpresaParceiraResponse rejeitar(@PathVariable Long id) {
        return empresaService.rejeitar(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        empresaService.remover(id);
        return ResponseEntity.noContent().build();
    }
}

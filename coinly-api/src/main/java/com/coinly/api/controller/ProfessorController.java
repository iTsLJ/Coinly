package com.coinly.api.controller;

import com.coinly.api.dto.professor.ProfessorCreateRequest;
import com.coinly.api.dto.professor.ProfessorResponse;
import com.coinly.api.dto.professor.ProfessorUpdateRequest;
import com.coinly.api.service.ProfessorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/api/professores")
@PreAuthorize("hasRole('ADMIN')")
public class ProfessorController {

    private final ProfessorService professorService;

    public ProfessorController(ProfessorService professorService) {
        this.professorService = professorService;
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ProfessorResponse meuPerfil(Authentication auth) {
        return ProfessorResponse.from(professorService.buscarPorEmail(auth.getName()));
    }

    @GetMapping
    public List<ProfessorResponse> listar(@RequestParam(required = false) Long instituicaoId) {
        return professorService.listar(instituicaoId);
    }

    @GetMapping("/{id}")
    public ProfessorResponse buscar(@PathVariable Long id) {
        return professorService.buscarPorId(id);
    }

    @PostMapping
    public ResponseEntity<ProfessorResponse> criar(@Valid @RequestBody ProfessorCreateRequest request) {
        ProfessorResponse criado = professorService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(criado.id())
                .toUri();
        return ResponseEntity.created(location).body(criado);
    }

    @PutMapping("/{id}")
    public ProfessorResponse atualizar(@PathVariable Long id,
                                       @Valid @RequestBody ProfessorUpdateRequest request) {
        return professorService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ProfessorResponse> desativar(@PathVariable Long id) {
        return ResponseEntity.ok(professorService.desativar(id));
    }
}

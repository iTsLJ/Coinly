package com.coinly.api.controller;

import com.coinly.api.dto.vantagem.VantagemRequest;
import com.coinly.api.dto.vantagem.VantagemResponse;
import com.coinly.api.service.VantagemService;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vantagens")
public class VantagemController {

    private final VantagemService vantagemService;

    public VantagemController(VantagemService vantagemService) {
        this.vantagemService = vantagemService;
    }

    @GetMapping
    public List<VantagemResponse> listar() {
        return vantagemService.listar();
    }

    @PostMapping
    public VantagemResponse criar(@RequestBody VantagemRequest request) {
        return vantagemService.criar(request);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        vantagemService.deletar(id);
    }

    @GetMapping("/{id}")
    public VantagemResponse buscarPorId(@PathVariable Long id) {
        return VantagemResponse.from(vantagemService.buscarEntidadePorId(id));
    }
    @GetMapping("/minhas")
    public List<VantagemResponse> listarMinhas() {
        return vantagemService.listarMinhas();
    }
}
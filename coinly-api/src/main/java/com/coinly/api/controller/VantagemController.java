package com.coinly.api.controller;

import com.coinly.api.dto.vantagem.VantagemResponse;
import com.coinly.api.service.VantagemService;
import org.springframework.web.bind.annotation.GetMapping;
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
}
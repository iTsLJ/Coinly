package com.coinly.api.controller;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coinly.api.dto.enviarMoedas.EnviarMoedasRequest;
import com.coinly.api.dto.vantagem.ResgatarVantagemRequest;
import com.coinly.api.service.TransacaoService;

import io.swagger.v3.oas.annotations.parameters.RequestBody;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

	@Autowired
    private TransacaoService transacaoService;

    @PostMapping("/enviar-moedas")
    @PreAuthorize("hasRole('PROFESSOR')")
    public ResponseEntity<Void> enviarMoedas(@RequestBody EnviarMoedasRequest request, Authentication auth) {
        transacaoService.processarEnvioProfessor(auth.name(), request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resgatar-vantagem")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<String> resgatarVantagem(@RequestBody ResgatarVantagemRequest request, Authentication auth) {
        String cupom = transacaoService.processarResgateAluno(auth.name(), request.vantagemId());
        return ResponseEntity.ok(cupom);
    }
}
package com.coinly.api.controller;

import java.security.Principal;
import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coinly.api.dto.enviarMoedas.EnviarMoedasRequest;
import com.coinly.api.dto.transacao.TransacaoResponse;
import com.coinly.api.dto.vantagem.ResgatarVantagemRequest;
import com.coinly.api.service.TransacaoService;

import org.springframework.web.bind.annotation.RequestBody;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

	@Autowired
    private TransacaoService transacaoService;

	 @PostMapping("/enviar-moedas")
	    @PreAuthorize("hasRole('PROFESSOR')")
	    public ResponseEntity<Void> enviarMoedas(@RequestBody  @Valid EnviarMoedasRequest request,Authentication auth) {
	        transacaoService.processarEnvioProfessor(auth.getName(), request);
	        return ResponseEntity.ok().build();
	    }

    @PostMapping("/resgatar-vantagem")
    @PreAuthorize("hasRole('ALUNO')")
    public ResponseEntity<String> resgatarVantagem(@RequestBody  @Valid ResgatarVantagemRequest request, Authentication auth) {
        String cupom = transacaoService.processarResgateAluno(auth.getName(), request.vantagemId());
        return ResponseEntity.ok(cupom);
    }
    
    @GetMapping("/meu-extrato")
    public List<TransacaoResponse> meuExtrato(Principal principal) {

        return transacaoService.meuExtrato(
                principal.getName()
        );
    }
}
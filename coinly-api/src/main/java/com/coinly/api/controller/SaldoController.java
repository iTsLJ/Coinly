package com.coinly.api.controller;

import com.coinly.api.messaging.SaldoSseService;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/saldo")
public class SaldoController {

    private final SaldoSseService saldoSseService;

    public SaldoController(SaldoSseService saldoSseService) {
        this.saldoSseService = saldoSseService;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(Authentication auth) {
        return saldoSseService.subscribe(auth.getName());
    }
}

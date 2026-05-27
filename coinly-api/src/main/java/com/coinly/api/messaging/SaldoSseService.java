package com.coinly.api.messaging;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Mantem conexoes SSE abertas por usuario (email) e empurra o saldo atualizado
 * em tempo real quando uma transacao altera o saldo.
 */
@Service
public class SaldoSseService {

    private static final Logger log = LoggerFactory.getLogger(SaldoSseService.class);
    private static final long TIMEOUT = 30 * 60 * 1000L; // 30 min

    private final Map<String, List<SseEmitter>> emittersPorEmail = new ConcurrentHashMap<>();

    public SseEmitter subscribe(String email) {
        SseEmitter emitter = new SseEmitter(TIMEOUT);
        List<SseEmitter> lista = emittersPorEmail.computeIfAbsent(email, k -> new CopyOnWriteArrayList<>());
        lista.add(emitter);

        emitter.onCompletion(() -> remover(email, emitter));
        emitter.onTimeout(() -> remover(email, emitter));
        emitter.onError(e -> remover(email, emitter));

        try {
            emitter.send(SseEmitter.event().name("conectado").data("ok"));
        } catch (IOException e) {
            remover(email, emitter);
        }
        return emitter;
    }

    public void enviarSaldo(String email, int saldo) {
        List<SseEmitter> lista = emittersPorEmail.get(email);
        if (lista == null || lista.isEmpty()) {
            return;
        }
        for (SseEmitter emitter : lista) {
            try {
                emitter.send(SseEmitter.event().name("saldo").data(saldo));
            } catch (IOException e) {
                remover(email, emitter);
            }
        }
        log.info("Saldo atualizado via SSE para {}: {}", email, saldo);
    }

    private void remover(String email, SseEmitter emitter) {
        List<SseEmitter> lista = emittersPorEmail.get(email);
        if (lista != null) {
            lista.remove(emitter);
            if (lista.isEmpty()) {
                emittersPorEmail.remove(email);
            }
        }
    }
}

package com.coinly.api.dto.transacao;

import java.time.LocalDateTime;

public record TransacaoResponse(
    Long id,
    LocalDateTime data,
    int valor,
    String tipo,
    String descricao,
    String origem,
    String destino
) {}
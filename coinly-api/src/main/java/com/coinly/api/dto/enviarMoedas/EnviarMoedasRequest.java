package com.coinly.api.dto.enviarMoedas;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record EnviarMoedasRequest(
    @NotNull Long alunoId,
    @NotNull @Min(1) Integer quantidade,
    @NotBlank String mensagem
) {}
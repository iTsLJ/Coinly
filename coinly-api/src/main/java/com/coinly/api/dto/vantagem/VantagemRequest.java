package com.coinly.api.dto.vantagem;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record VantagemRequest(
    @NotBlank String nome,
    @NotBlank String descricao,
    String fotoUrl,
    @NotNull @Min(1) Integer custoMoedas
) {}
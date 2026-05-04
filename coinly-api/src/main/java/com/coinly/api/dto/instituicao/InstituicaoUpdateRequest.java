package com.coinly.api.dto.instituicao;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InstituicaoUpdateRequest(
        @NotBlank @Size(max = 160) String nome,
        boolean ativo
) {
}
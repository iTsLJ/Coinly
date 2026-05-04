package com.coinly.api.dto.instituicao;

import com.coinly.api.validation.Cnpj;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record InstituicaoCreateRequest(
        @NotBlank @Size(max = 160) String nome,
        @NotBlank @Cnpj String cnpj
) {
}
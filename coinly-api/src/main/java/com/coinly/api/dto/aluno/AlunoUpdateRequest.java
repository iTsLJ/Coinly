package com.coinly.api.dto.aluno;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AlunoUpdateRequest(
        @NotBlank @Size(max = 120) String nome,
        @NotBlank @Email @Size(max = 160) String email,
        @NotBlank @Size(max = 20) String rg,
        @NotBlank @Size(max = 255) String endereco,
        @NotBlank @Size(max = 120) String curso,
        @NotNull Long instituicaoId
) {
}

package com.coinly.api.dto.empresa;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EmpresaParceiraUpdateRequest(
        @NotBlank @Size(max = 160) String nomeFantasia,
        @NotBlank @Email @Size(max = 160) String email
) {
}

package com.coinly.api.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MeResponse {

    private Long id;
    private Long alunoId;
    private Long professorId;
    private Long empresaId;

    private String nome;
    private String email;
    private List<String> roles;
    private String tipo;
}
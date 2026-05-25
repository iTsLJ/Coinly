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
	public MeResponse() {
		super();
	}
	public MeResponse(Long id, Long alunoId, Long professorId, Long empresaId, String nome, String email,
			List<String> roles, String tipo) {
		super();
		this.id = id;
		this.alunoId = alunoId;
		this.professorId = professorId;
		this.empresaId = empresaId;
		this.nome = nome;
		this.email = email;
		this.roles = roles;
		this.tipo = tipo;
	}
    
    
}
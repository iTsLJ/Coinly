package com.coinly.api.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "transacao")
public class Transacao {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime data = LocalDateTime.now();
    private int valor;
    private String descricao;

    @ManyToOne
    @JoinColumn(name = "remetente_id")
    private Usuario remetente;

    @ManyToOne
    @JoinColumn(name = "destinatario_id")
    private Usuario destinatario;

    private String codigoCupom;
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_operacao", nullable = false, length = 20)
    private TipoOperacao tipoOperacao;

    public Transacao() {
    }

    public Transacao(Usuario remetente, Usuario destinatario, int valor, String descricao) {
        this.remetente = remetente;
        this.destinatario = destinatario;
        this.valor = valor;
        this.descricao = descricao;
        this.data = LocalDateTime.now();
    }

    public Transacao(Long id, LocalDateTime data, int valor, String descricao, Usuario remetente, Usuario destinatario,
            String codigoCupom) {
        this.id = id;
        this.data = data;
        this.valor = valor;
        this.descricao = descricao;
        this.remetente = remetente;
        this.destinatario = destinatario;
        this.codigoCupom = codigoCupom;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public LocalDateTime getData() {
		return data;
	}

	public void setData(LocalDateTime data) {
		this.data = data;
	}

	public int getValor() {
		return valor;
	}

	public void setValor(int valor) {
		this.valor = valor;
	}

	public String getDescricao() {
		return descricao;
	}

	public void setDescricao(String descricao) {
		this.descricao = descricao;
	}

	public Usuario getRemetente() {
		return remetente;
	}

	public void setRemetente(Usuario remetente) {
		this.remetente = remetente;
	}

	public Usuario getDestinatario() {
		return destinatario;
	}

	public void setDestinatario(Usuario destinatario) {
		this.destinatario = destinatario;
	}

	public String getCodigoCupom() {
		return codigoCupom;
	}

	public void setCodigoCupom(String codigoCupom) {
		this.codigoCupom = codigoCupom;
	}
	public TipoOperacao getTipoOperacao() {
	    return tipoOperacao;
	}

	public void setTipoOperacao(TipoOperacao tipoOperacao) {
	    this.tipoOperacao = tipoOperacao;
	}
    
}
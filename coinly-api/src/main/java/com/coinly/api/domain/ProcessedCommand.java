package com.coinly.api.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "processed_command",
        uniqueConstraints = @UniqueConstraint(name = "uk_processed_command_id", columnNames = "command_id")
)
public class ProcessedCommand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "command_id", nullable = false, length = 64)
    private String commandId;

    @Column(name = "tipo_comando", nullable = false, length = 50)
    private String tipoComando;

    @Column(name = "processado_em", nullable = false)
    private LocalDateTime processadoEm = LocalDateTime.now();

    public ProcessedCommand() {
    }

    public ProcessedCommand(String commandId, String tipoComando) {
        this.commandId = commandId;
        this.tipoComando = tipoComando;
        this.processadoEm = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getCommandId() {
        return commandId;
    }

    public void setCommandId(String commandId) {
        this.commandId = commandId;
    }

    public String getTipoComando() {
        return tipoComando;
    }

    public void setTipoComando(String tipoComando) {
        this.tipoComando = tipoComando;
    }

    public LocalDateTime getProcessadoEm() {
        return processadoEm;
    }

    public void setProcessadoEm(LocalDateTime processadoEm) {
        this.processadoEm = processadoEm;
    }
}

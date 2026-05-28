package com.coinly.api.repository;

import com.coinly.api.domain.ProcessedCommand;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProcessedCommandRepository extends JpaRepository<ProcessedCommand, Long> {
    boolean existsByCommandId(String commandId);
}

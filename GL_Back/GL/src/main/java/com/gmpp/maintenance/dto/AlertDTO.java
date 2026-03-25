package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertDTO {

    private Long id;
    private String message;
    private String type; // INFO, WARNING, ERROR, CRITICAL
    private String priority; // LOW, MEDIUM, HIGH, URGENT
    private LocalDateTime createdAt;
    private Boolean resolved;
    private Long relatedMachineId;
    private Long relatedInterventionId;
}

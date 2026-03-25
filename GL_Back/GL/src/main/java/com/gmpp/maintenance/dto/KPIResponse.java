package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KPIResponse {

    private Double implementationRate;
    private Long preventedFailures;
    private Integer avgInterventionTime;
    private Long overdueCount;
    private Double machineAvailability;
    private Double monthlyCost;
    private Long totalInterventions;
    private Long completedInterventions;
    private Long delayedInterventions;
}

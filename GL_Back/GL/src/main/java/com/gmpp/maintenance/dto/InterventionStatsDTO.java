package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionStatsDTO {

    private Long totalInterventions;
    private Long planifiee;
    private Long enCours;
    private Long terminee;
    private Long annulee;
    private Long enRetard;
    private Double plannedPercentage;
    private Double ongoingPercentage;
    private Double completedPercentage;
    private Double cancelledPercentage;
    private Double delayedPercentage;
    private Double completionRate;
}

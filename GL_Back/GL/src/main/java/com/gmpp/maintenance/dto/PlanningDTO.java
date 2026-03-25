package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanningDTO {

    private Long weekNumber;
    private LocalDate weekStartDate;
    private LocalDate weekEndDate;
    private Long totalPlannedInterventions;
    private Long completedInterventions;
    private Long pendingInterventions;
    private Long overdueInterventions;
    private Double completionRate;
    private Integer totalEstimatedHours;
    private Integer totalActualHours;
}

package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TechnicianWorkloadDTO {

    private Long technicianId;
    private String technicianName;
    private Long totalAssignedInterventions;
    private Long completedInterventions;
    private Long ongoingInterventions;
    private Long pendingInterventions;
    private Integer totalHoursWorked;
    private Integer averageCompletionTime;
    private Double completionRate;
    private Double workloadPercentage;
}

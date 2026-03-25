package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineStatsDTO {

    private Long totalMachines;
    private Long enService;
    private Long enMaintenance;
    private Long enReparation;
    private Long horsService;
    private Double operationalPercentage;
    private Double maintenancePercentage;
    private Double repairPercentage;
    private Double outOfServicePercentage;
}

package com.gmpp.maintenance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MachineAvailabilityDTO {

    private Long machineId;
    private String machineName;
    private String status;
    private Double availabilityPercentage;
    private Long totalOperatingHours;
    private Long plannedDowntimeHours;
    private Long unplannedDowntimeHours;
    private Long maintenancePointsCount;
    private Long overdueMaintenancePoints;
}

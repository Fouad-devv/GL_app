package com.gmpp.maintenance.dto;

import com.gmpp.maintenance.enums.EquipmentState;
import com.gmpp.maintenance.enums.InterventionStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionDTO {

    private Long id;
    private Long machineId;
    private String machineName;
    private Long maintenancePointId;
    private Long technicianId;
    private String technicianName;
    private LocalDate plannedDate;
    private LocalTime plannedTime;
    private LocalDate actualDate;
    private LocalTime actualTime;
    private Integer durationMinutes;
    private InterventionStatus status;
    private EquipmentState equipmentState;
    private String observations;
    private Double cost;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

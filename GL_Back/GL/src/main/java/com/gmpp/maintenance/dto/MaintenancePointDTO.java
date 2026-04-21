package com.gmpp.maintenance.dto;

import com.gmpp.maintenance.enums.ConsumableType;
import com.gmpp.maintenance.enums.MaintenanceFrequency;
import com.gmpp.maintenance.enums.MaintenanceOperationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenancePointDTO {

    private Long id;
    private Long machineId;
    private String machineName;
    private MaintenanceOperationType operationType;
    private String description;
    private String location;
    private MaintenanceFrequency frequency;
    private ConsumableType consumableType;
    private Integer quantity;
    private LocalDate lastPerformed;
    private LocalDate nextDue;
    private Integer estimatedDurationMinutes;
    private LocalDateTime createdAt;
    private String name;
}

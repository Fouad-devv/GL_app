package com.gmpp.maintenance.dto;

import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.MachineType;
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
public class MachineDTO {

    private Long id;
    private String name;
    private MachineType type;
    private String brand;
    private String model;
    private String serialNumber;
    private Integer yearManufactured;
    private LocalDate dateCommissioned;
    private String location;
    private MachineStatus status;
    private Double operatingHours;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

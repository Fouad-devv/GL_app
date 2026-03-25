package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.MaintenancePointDTO;
import com.gmpp.maintenance.entity.MaintenancePoint;
import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.enums.MaintenanceFrequency;
import com.gmpp.maintenance.repository.MaintenancePointRepository;
import com.gmpp.maintenance.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MaintenancePointService {

    private final MaintenancePointRepository maintenancePointRepository;
    private final MachineRepository machineRepository;

    // ===== GET ALL =====
    public List<MaintenancePointDTO> getAllMaintenancePoints() {
        return maintenancePointRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===== GET BY ID =====
    public MaintenancePointDTO getMaintenancePointById(Long id) {
        MaintenancePoint point = maintenancePointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance point not found"));
        return convertToDTO(point);
    }

    // ===== CREATE =====
    public MaintenancePointDTO createMaintenancePoint(MaintenancePointDTO pointDTO) {
        MaintenancePoint point = convertToEntity(pointDTO);
        point.setCreatedAt(LocalDateTime.now());
        MaintenancePoint savedPoint = maintenancePointRepository.save(point);
        return convertToDTO(savedPoint);
    }

    // ===== UPDATE =====
    public MaintenancePointDTO updateMaintenancePoint(Long id, MaintenancePointDTO pointDTO) {
        MaintenancePoint point = maintenancePointRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Maintenance point not found"));

        // Resolve Machine entity
        Machine machine = machineRepository.findById(pointDTO.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        point.setMachine(machine);

        point.setOperationType(pointDTO.getOperationType());
        point.setDescription(pointDTO.getDescription());
        point.setLocation(pointDTO.getLocation());
        point.setFrequency(pointDTO.getFrequency());
        point.setConsumableType(pointDTO.getConsumableType());
        point.setQuantity(pointDTO.getQuantity());
        point.setLastPerformed(pointDTO.getLastPerformed());
        point.setNextDue(pointDTO.getNextDue());
        point.setEstimatedDurationMinutes(pointDTO.getEstimatedDurationMinutes());
        point.setName(pointDTO.getName());

        MaintenancePoint updatedPoint = maintenancePointRepository.save(point);
        return convertToDTO(updatedPoint);
    }

    // ===== DELETE =====
    public void deleteMaintenancePoint(Long id) {
        if (!maintenancePointRepository.existsById(id)) {
            throw new RuntimeException("Maintenance point not found");
        }
        maintenancePointRepository.deleteById(id);
    }

    // ===== FIND BY MACHINE =====
    public List<MaintenancePointDTO> getMaintenancePointsByMachine(Long machineId) {
        return maintenancePointRepository.findByMachineId(machineId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===== OVERDUE =====
    public List<MaintenancePointDTO> getOverdueMaintenancePoints() {
        return maintenancePointRepository.findByNextDueBefore(LocalDate.now())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===== BY FREQUENCY =====
    public List<MaintenancePointDTO> getMaintenancePointsByFrequency(MaintenanceFrequency frequency) {
        return maintenancePointRepository.findByFrequency(frequency)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ===== COUNT =====
    public Long countMaintenancePointsByMachine(Long machineId) {
        return maintenancePointRepository.countByMachineId(machineId);
    }

    public Long countOverdueMaintenancePoints() {
        return maintenancePointRepository.countOverdueMaintenancePoints(LocalDate.now());
    }

    // ===== DTO CONVERSIONS =====
    private MaintenancePointDTO convertToDTO(MaintenancePoint point) {
        return MaintenancePointDTO.builder()
                .id(point.getId())
                .machineId(point.getMachine() != null ? point.getMachine().getId() : null)
                .operationType(point.getOperationType())
                .description(point.getDescription())
                .location(point.getLocation())
                .frequency(point.getFrequency())
                .consumableType(point.getConsumableType())
                .quantity(point.getQuantity())
                .lastPerformed(point.getLastPerformed())
                .nextDue(point.getNextDue())
                .estimatedDurationMinutes(point.getEstimatedDurationMinutes())
                .name(point.getName())
                .createdAt(point.getCreatedAt())
                .build();
    }

    private MaintenancePoint convertToEntity(MaintenancePointDTO dto) {
        Machine machine = machineRepository.findById(dto.getMachineId())
                .orElseThrow(() -> new RuntimeException("Machine not found"));

        return MaintenancePoint.builder()
                .machine(machine)
                .operationType(dto.getOperationType())
                .description(dto.getDescription())
                .location(dto.getLocation())
                .frequency(dto.getFrequency())
                .consumableType(dto.getConsumableType())
                .quantity(dto.getQuantity())
                .lastPerformed(dto.getLastPerformed())
                .nextDue(dto.getNextDue())
                .estimatedDurationMinutes(dto.getEstimatedDurationMinutes())
                .name(dto.getName())
                .build();
    }
}
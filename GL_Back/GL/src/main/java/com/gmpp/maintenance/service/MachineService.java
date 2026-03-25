package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.MachineDTO;
import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.MachineType;
import com.gmpp.maintenance.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MachineService {

    private final MachineRepository machineRepository;

    // ===== Non-paginated get all =====
    public List<MachineDTO> getAllMachines() {
        return machineRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MachineDTO> getMachinesByStatus(MachineStatus status) {
        return machineRepository.findByStatusOrderByNameAsc(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MachineDTO> getMachinesByType(MachineType type) {
        return machineRepository.findByType(type).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<MachineDTO> searchMachines(String search) {
        return machineRepository.findByNameContainingIgnoreCase(search).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public MachineDTO getMachineById(Long id) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found"));
        return convertToDTO(machine);
    }

    public MachineDTO createMachine(MachineDTO dto) {
        Machine machine = convertToEntity(dto);
        machine.setCreatedAt(LocalDateTime.now());
        machine.setUpdatedAt(LocalDateTime.now());
        Machine saved = machineRepository.save(machine);
        return convertToDTO(saved);
    }

    public MachineDTO updateMachine(Long id, MachineDTO dto) {
        Machine machine = machineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Machine not found"));

        machine.setName(dto.getName());
        machine.setType(dto.getType());
        machine.setBrand(dto.getBrand());
        machine.setModel(dto.getModel());
        machine.setSerialNumber(dto.getSerialNumber());
        machine.setYearManufactured(dto.getYearManufactured());
        machine.setDateCommissioned(dto.getDateCommissioned());
        machine.setLocation(dto.getLocation());
        machine.setStatus(dto.getStatus());
        machine.setOperatingHours(dto.getOperatingHours());
        machine.setUpdatedAt(LocalDateTime.now());

        Machine updated = machineRepository.save(machine);
        return convertToDTO(updated);
    }

    public void deleteMachine(Long id) {
        if (!machineRepository.existsById(id)) {
            throw new RuntimeException("Machine not found");
        }
        machineRepository.deleteById(id);
    }

    public Long countMachinesByStatus(MachineStatus status) {
        return machineRepository.countByStatus(status);
    }

    // ===== DTO conversion =====
    private MachineDTO convertToDTO(Machine machine) {
        return MachineDTO.builder()
                .id(machine.getId())
                .name(machine.getName())
                .type(machine.getType())
                .brand(machine.getBrand())
                .model(machine.getModel())
                .serialNumber(machine.getSerialNumber())
                .yearManufactured(machine.getYearManufactured())
                .dateCommissioned(machine.getDateCommissioned())
                .location(machine.getLocation())
                .status(machine.getStatus())
                .operatingHours(machine.getOperatingHours())
                .createdAt(machine.getCreatedAt())
                .updatedAt(machine.getUpdatedAt())
                .build();
    }

    private Machine convertToEntity(MachineDTO dto) {
        return Machine.builder()
                .name(dto.getName())
                .type(dto.getType())
                .brand(dto.getBrand())
                .model(dto.getModel())
                .serialNumber(dto.getSerialNumber())
                .yearManufactured(dto.getYearManufactured())
                .dateCommissioned(dto.getDateCommissioned())
                .location(dto.getLocation())
                .status(dto.getStatus())
                .operatingHours(dto.getOperatingHours())
                .build();
    }
}
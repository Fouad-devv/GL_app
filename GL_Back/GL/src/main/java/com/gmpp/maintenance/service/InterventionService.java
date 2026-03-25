package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.entity.User;
import com.gmpp.maintenance.entity.MaintenancePoint;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.repository.InterventionRepository;
import com.gmpp.maintenance.repository.MachineRepository;
import com.gmpp.maintenance.repository.UserRepository;
import com.gmpp.maintenance.repository.MaintenancePointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InterventionService {

    private final InterventionRepository interventionRepository;
    private final MachineRepository machineRepository;
    private final UserRepository userRepository;
    private final MaintenancePointRepository maintenancePointRepository;

    // ---------- GET ALL ----------
    public List<InterventionDTO> getAllInterventions() {
        return interventionRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterventionDTO> getOverdueInterventions() {
        List<Intervention> overdueInterventions = interventionRepository.findOverdueInterventions(
                InterventionStatus.PLANIFIEE, LocalDate.now());

        return overdueInterventions.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public InterventionDTO getInterventionById(Long id) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));
        return convertToDTO(intervention);
    }

    // ---------- CREATE ----------
    @Transactional
    public InterventionDTO createIntervention(InterventionDTO dto) {
        Intervention intervention = convertToEntity(dto);
        intervention.setCreatedAt(LocalDateTime.now());
        intervention.setUpdatedAt(LocalDateTime.now());
        Intervention saved = interventionRepository.save(intervention);
        return convertToDTO(saved);
    }

    // ---------- UPDATE ----------
    @Transactional
    public InterventionDTO updateIntervention(Long id, InterventionDTO dto) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));

        if (dto.getMachineId() != null) {
            Machine machine = machineRepository.findById(dto.getMachineId())
                    .orElseThrow(() -> new RuntimeException("Machine not found"));
            intervention.setMachine(machine);
        }

        if (dto.getTechnicianId() != null) {
            User technician = userRepository.findById(dto.getTechnicianId())
                    .orElseThrow(() -> new RuntimeException("Technician not found"));
            intervention.setTechnician(technician);
        }

        if (dto.getMaintenancePointId() != null) {
            MaintenancePoint mp = maintenancePointRepository.findById(dto.getMaintenancePointId())
                    .orElse(null);
            intervention.setMaintenancePoint(mp);
        }

        intervention.setPlannedDate(dto.getPlannedDate());
        intervention.setPlannedTime(dto.getPlannedTime());
        intervention.setActualDate(dto.getActualDate());
        intervention.setActualTime(dto.getActualTime());
        intervention.setDurationMinutes(dto.getDurationMinutes());
        intervention.setStatus(dto.getStatus());
        intervention.setEquipmentState(dto.getEquipmentState());
        intervention.setObservations(dto.getObservations());
        intervention.setCost(dto.getCost());
        intervention.setUpdatedAt(LocalDateTime.now());

        Intervention updated = interventionRepository.save(intervention);
        return convertToDTO(updated);
    }

    // ---------- DELETE ----------
    @Transactional
    public void deleteIntervention(Long id) {
        if (!interventionRepository.existsById(id)) {
            throw new RuntimeException("Intervention not found");
        }
        interventionRepository.deleteById(id);
    }

    // ---------- STATUS ----------
    @Transactional
    public InterventionDTO updateInterventionStatus(Long id, InterventionStatus status) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));
        intervention.setStatus(status);
        intervention.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(interventionRepository.save(intervention));
    }

    // ---------- ASSIGN TECHNICIAN ----------
    @Transactional
    public InterventionDTO assignTechnician(Long id, Long technicianId) {
        Intervention intervention = interventionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new RuntimeException("Technician not found"));
        intervention.setTechnician(technician);

        intervention.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(interventionRepository.save(intervention));
    }

    // ---------- FILTERS ----------
    public List<InterventionDTO> getInterventionsByMachine(Long machineId) {
        return interventionRepository.findAll().stream()
                .filter(i -> i.getMachine() != null && i.getMachine().getId().equals(machineId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterventionDTO> getInterventionsByTechnician(Long technicianId) {
        return interventionRepository.findAll().stream()
                .filter(i -> i.getTechnician() != null && i.getTechnician().getId().equals(technicianId))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterventionDTO> getInterventionsByStatus(InterventionStatus status) {
        return interventionRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterventionDTO> getPlannedInterventions(LocalDate startDate, LocalDate endDate) {
        return interventionRepository.findByPlannedDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // ---------- DTO CONVERSION ----------
    private InterventionDTO convertToDTO(Intervention i) {
        return InterventionDTO.builder()
                .id(i.getId())
                .machineId(i.getMachine() != null ? i.getMachine().getId() : null)
                .machineName(i.getMachine() != null ? i.getMachine().getName() : null)       // ← populated
                .maintenancePointId(i.getMaintenancePoint() != null ? i.getMaintenancePoint().getId() : null)
                .technicianId(i.getTechnician() != null ? i.getTechnician().getId() : null)
                .technicianName(i.getTechnician() != null ? i.getTechnician().getFullName() : null) // ← populated
                .plannedDate(i.getPlannedDate())
                .plannedTime(i.getPlannedTime())
                .actualDate(i.getActualDate())
                .actualTime(i.getActualTime())
                .durationMinutes(i.getDurationMinutes())
                .status(i.getStatus())
                .equipmentState(i.getEquipmentState())
                .observations(i.getObservations())
                .cost(i.getCost())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .build();
    }

    private Intervention convertToEntity(InterventionDTO dto) {
        Intervention.InterventionBuilder builder = Intervention.builder()
                .plannedDate(dto.getPlannedDate())
                .plannedTime(dto.getPlannedTime())
                .actualDate(dto.getActualDate())
                .actualTime(dto.getActualTime())
                .durationMinutes(dto.getDurationMinutes())
                .status(dto.getStatus())
                .equipmentState(dto.getEquipmentState())
                .observations(dto.getObservations())
                .cost(dto.getCost());

        if (dto.getMachineId() != null) {
            Machine machine = machineRepository.findById(dto.getMachineId())
                    .orElseThrow(() -> new RuntimeException("Machine not found"));
            builder.machine(machine);
        }

        if (dto.getTechnicianId() != null) {
            User technician = userRepository.findById(dto.getTechnicianId())
                    .orElseThrow(() -> new RuntimeException("Technician not found"));
            builder.technician(technician);
        }

        if (dto.getMaintenancePointId() != null) {
            MaintenancePoint mp = maintenancePointRepository.findById(dto.getMaintenancePointId())
                    .orElse(null);
            builder.maintenancePoint(mp);
        }

        return builder.build();
    }

    public Long countInterventionsByStatus(InterventionStatus status) {
        return interventionRepository.countByStatus(status);
    }

    public Long countInterventionsByMachine(Long machineId) {
        return interventionRepository.countByMachineId(machineId);
    }
}
package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.MaintenancePoint;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.repository.InterventionRepository;
import com.gmpp.maintenance.repository.MaintenancePointRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanningService {

    private final InterventionRepository interventionRepository;
    private final MaintenancePointRepository maintenancePointRepository;

    public List<InterventionDTO> getPlanningByDateRange(LocalDate startDate, LocalDate endDate) {
        return interventionRepository.findByPlannedDateBetween(startDate, endDate).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterventionDTO> getPlanningByMonth(YearMonth month) {
        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();
        return getPlanningByDateRange(startDate, endDate);
    }

    public List<InterventionDTO> getMonthlyPlanning(int month, int year) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return getPlanningByMonth(yearMonth);
    }

    public void generateAutomaticPlanning() {
        List<MaintenancePoint> maintenancePoints = maintenancePointRepository.findAll();
        for (MaintenancePoint point : maintenancePoints) {
            if (shouldScheduleIntervention(point)) {
                createAutomaticIntervention(point);
            }
        }
    }

    public void generatePlanningToDate(LocalDate date) {
        List<MaintenancePoint> maintenancePoints = maintenancePointRepository.findAll();
        for (MaintenancePoint point : maintenancePoints) {
            if (shouldScheduleByDate(point, date)) {
                createAutomaticIntervention(point);
            }
        }
    }

    public InterventionDTO scheduleIntervention(Long maintenancePointId, LocalDate plannedDate, LocalTime plannedTime) {
        MaintenancePoint point = maintenancePointRepository.findById(maintenancePointId)
                .orElseThrow(() -> new RuntimeException("Maintenance point not found"));

        Intervention intervention = Intervention.builder()
                .machine(point.getMachine())                 // ✅ fixed
                .maintenancePoint(point)                     // ✅ fixed
                .plannedDate(plannedDate)
                .plannedTime(plannedTime)
                .status(InterventionStatus.PLANIFIEE)
                .durationMinutes(point.getEstimatedDurationMinutes())
                .build();

        Intervention savedIntervention = interventionRepository.save(intervention);
        return convertToDTO(savedIntervention);
    }

    public InterventionDTO markInterventionAsCompleted(Long interventionId, Integer durationMinutes, String observations) {
        Intervention intervention = interventionRepository.findById(interventionId)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));

        intervention.setActualDate(LocalDate.now());
        intervention.setActualTime(LocalTime.now());
        intervention.setDurationMinutes(durationMinutes);
        intervention.setObservations(observations);
        intervention.setStatus(InterventionStatus.TERMINEE);

        Intervention savedIntervention = interventionRepository.save(intervention);
        return convertToDTO(savedIntervention);
    }

    public void rescheduleIntervention(Long interventionId, LocalDate newDate, LocalTime newTime) {
        Intervention intervention = interventionRepository.findById(interventionId)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));

        intervention.setPlannedDate(newDate);
        intervention.setPlannedTime(newTime);
        interventionRepository.save(intervention);
    }

    public void cancelIntervention(Long interventionId) {
        Intervention intervention = interventionRepository.findById(interventionId)
                .orElseThrow(() -> new RuntimeException("Intervention not found"));

        intervention.setStatus(InterventionStatus.ANNULEE);
        interventionRepository.save(intervention);
    }

    public List<InterventionDTO> getUpcomingInterventions(int days) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(days);
        return interventionRepository.findByPlannedDateBetween(today, endDate).stream()
                .filter(i -> i.getStatus() == InterventionStatus.PLANIFIEE)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<InterventionDTO> getPlanningByWeek(LocalDate weekStartDate) {
        LocalDate weekEndDate = weekStartDate.plusDays(6);
        return getPlanningByDateRange(weekStartDate, weekEndDate);
    }

    private boolean shouldScheduleIntervention(MaintenancePoint point) {
        return point.getNextDue() != null &&
                (point.getNextDue().isEqual(LocalDate.now()) || point.getNextDue().isBefore(LocalDate.now()));
    }

    private boolean shouldScheduleByDate(MaintenancePoint point, LocalDate date) {
        return point.getNextDue() != null &&
                (point.getNextDue().isEqual(date) || point.getNextDue().isBefore(date));
    }

    private void createAutomaticIntervention(MaintenancePoint point) {
        List<Intervention> existingInterventions = interventionRepository.findByMaintenancePoint(point);
        boolean alreadyScheduled = existingInterventions.stream()
                .anyMatch(i -> i.getPlannedDate().isEqual(LocalDate.now())
                        && (i.getStatus() == InterventionStatus.PLANIFIEE || i.getStatus() == InterventionStatus.EN_COURS));

        if (!alreadyScheduled) {
            Intervention intervention = Intervention.builder()
                    .machine(point.getMachine())
                    .maintenancePoint(point)
                    .plannedDate(point.getNextDue())
                    .plannedTime(LocalTime.of(8, 0))
                    .status(InterventionStatus.PLANIFIEE)
                    .durationMinutes(point.getEstimatedDurationMinutes())
                    .build();

            interventionRepository.save(intervention);
        }
    }

    private InterventionDTO convertToDTO(Intervention intervention) {
        return InterventionDTO.builder()
                .id(intervention.getId())
                .machineId(intervention.getMachine() != null ? intervention.getMachine().getId() : null)
                .maintenancePointId(intervention.getMaintenancePoint() != null ? intervention.getMaintenancePoint().getId() : null)
                .technicianId(intervention.getTechnician() != null ? intervention.getTechnician().getId() : null)
                .plannedDate(intervention.getPlannedDate())
                .plannedTime(intervention.getPlannedTime())
                .actualDate(intervention.getActualDate())
                .actualTime(intervention.getActualTime())
                .durationMinutes(intervention.getDurationMinutes())
                .status(intervention.getStatus())
                .equipmentState(intervention.getEquipmentState())
                .observations(intervention.getObservations())
                .cost(intervention.getCost())
                .createdAt(intervention.getCreatedAt())
                .updatedAt(intervention.getUpdatedAt())
                .build();
    }
}
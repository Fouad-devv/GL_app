package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.KPIResponse;
import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.UserRole;
import com.gmpp.maintenance.repository.InterventionRepository;
import com.gmpp.maintenance.repository.MachineRepository;
import com.gmpp.maintenance.repository.MaintenancePointRepository;
import com.gmpp.maintenance.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final MachineRepository machineRepository;
    private final InterventionRepository interventionRepository;
    private final MaintenancePointRepository maintenancePointRepository;
    private final UserRepository userRepository;

    // ===================== KPI METRICS =====================
    public KPIResponse getKPIMetrics() {
        Long totalMachines = machineRepository.count();
        Long operationalMachines = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
        Long completedInterventions = interventionRepository.countByStatus(InterventionStatus.TERMINEE);
        Long totalInterventions = interventionRepository.count();
        Long delayedInterventions = interventionRepository.countByStatus(InterventionStatus.EN_RETARD);
        Long overdueCount = maintenancePointRepository.countOverdueMaintenancePoints(LocalDate.now());

        Double machineAvailability = totalMachines > 0 ? (operationalMachines.doubleValue() / totalMachines) * 100 : 0.0;
        Double implementationRate = totalInterventions > 0 ? (completedInterventions.doubleValue() / totalInterventions) * 100 : 0.0;

        return KPIResponse.builder()
                .implementationRate(implementationRate)
                .preventedFailures(totalInterventions)
                .avgInterventionTime(120)
                .overdueCount(overdueCount)
                .machineAvailability(machineAvailability)
                .monthlyCost(5000.0)
                .totalInterventions(totalInterventions)
                .completedInterventions(completedInterventions)
                .delayedInterventions(delayedInterventions)
                .build();
    }

    // ===================== MACHINE COUNTS =====================
    public Long getTotalMachines() {
        return machineRepository.count();
    }

    public Long getOperationalMachines() {
        return machineRepository.countByStatus(MachineStatus.EN_SERVICE);
    }

    public Long getMaintenanceMachines() {
        return machineRepository.countByStatus(MachineStatus.EN_MAINTENANCE);
    }

    public Long getUnderRepairMachines() {
        return machineRepository.countByStatus(MachineStatus.EN_REPARATION);
    }

    public Long getOutOfServiceMachines() {
        return machineRepository.countByStatus(MachineStatus.HORS_SERVICE);
    }

    // ===================== INTERVENTION COUNTS =====================
    public Long getPlannedInterventions() {
        return interventionRepository.countByStatus(InterventionStatus.PLANIFIEE);
    }

    public Long getOngoingInterventions() {
        return interventionRepository.countByStatus(InterventionStatus.EN_COURS);
    }

    public Long getCompletedInterventions() {
        return interventionRepository.countByStatus(InterventionStatus.TERMINEE);
    }

    public Long getCancelledInterventions() {
        return interventionRepository.countByStatus(InterventionStatus.ANNULEE);
    }

    public Long getOverdueInterventions() {
        return interventionRepository.countByStatus(InterventionStatus.EN_RETARD);
    }

    // ===================== KPI CALCULATIONS =====================
    public Double getMachineAvailability() {
        Long total = getTotalMachines();
        Long operational = getOperationalMachines();
        return total > 0 ? (operational.doubleValue() / total) * 100 : 0.0;
    }

    public Double getImplementationRate() {
        Long total = interventionRepository.count();
        Long completed = getCompletedInterventions();
        return total > 0 ? (completed.doubleValue() / total) * 100 : 0.0;
    }

    public Long getOverdueMaintenancePoints() {
        return maintenancePointRepository.countOverdueMaintenancePoints(LocalDate.now());
    }

    public Double calculateMonthlyAverageCost() {
        Long interventions = interventionRepository.count();
        Double totalCost = 0.0; // replace with actual sum if you track costs
        return interventions > 0 ? totalCost / interventions : 0.0;
    }

    // ===================== INTERVENTION STATS =====================
    public Map<String, Object> getInterventionStats() {

        Map<String, Long> byStatus = new HashMap<>();
        byStatus.put("PLANIFIEE", interventionRepository.countByStatus(InterventionStatus.PLANIFIEE));
        byStatus.put("EN_COURS", interventionRepository.countByStatus(InterventionStatus.EN_COURS));
        byStatus.put("TERMINEE", interventionRepository.countByStatus(InterventionStatus.TERMINEE));
        byStatus.put("ANNULEE", interventionRepository.countByStatus(InterventionStatus.ANNULEE));
        byStatus.put("EN_RETARD", interventionRepository.countByStatus(InterventionStatus.EN_RETARD));

        Map<String, Object> stats = new HashMap<>();
        stats.put("byStatus", byStatus);
        stats.put("totalInterventions", interventionRepository.count());
        stats.put("activeMachines", machineRepository.countByStatus(MachineStatus.EN_SERVICE));
        stats.put("technicians", userRepository.countByRole(UserRole.TECHNICIEN));

        return stats;
    }

    // ===================== ALERTS =====================
    public List<Map<String, String>> getAlerts() {

        List<Map<String, String>> alerts = new ArrayList<>();

        Long overdueMaintenance = maintenancePointRepository.countOverdueMaintenancePoints(LocalDate.now());
        if (overdueMaintenance > 0) {
            Map<String, String> alert = new HashMap<>();
            alert.put("title", "Maintenance en retard");
            alert.put("message", overdueMaintenance + " points de maintenance sont en retard");
            alerts.add(alert);
        }

        Long delayedInterventions = interventionRepository.countByStatus(InterventionStatus.EN_RETARD);
        if (delayedInterventions > 0) {
            Map<String, String> alert = new HashMap<>();
            alert.put("title", "Interventions en retard");
            alert.put("message", delayedInterventions + " interventions sont en retard");
            alerts.add(alert);
        }

        return alerts;
    }

    // ===================== UPCOMING INTERVENTIONS =====================
    public List<Map<String, Object>> getUpcomingInterventions(int days) {

        LocalDate now = LocalDate.now();
        LocalDate limit = now.plusDays(days);

        return interventionRepository.findByPlannedDateBetween(now, limit)
                .stream()
                .map(intervention -> {

                    Map<String, Object> map = new HashMap<>();

                    Machine machine = intervention.getMachine(); // ✅ directly get Machine
                    map.put("machineName", machine != null ? machine.getName() : "Unknown");
                    map.put("machineId", machine != null ? machine.getId() : null);

                    if (intervention.getMaintenancePoint() != null) {
                        map.put("maintenancePointId", intervention.getMaintenancePoint().getId());
                        map.put("maintenancePointName", intervention.getMaintenancePoint().getName());
                    }

                    map.put("plannedDate", intervention.getPlannedDate());
                    map.put("plannedTime", intervention.getPlannedTime());
                    map.put("status", intervention.getStatus());

                    return map;

                }).collect(Collectors.toList());
    }

    // ===================== OTHER METRICS =====================
    public Long getPreventedFailures() {
        return interventionRepository.countByStatus(InterventionStatus.TERMINEE);
    }

    public Integer getAverageInterventionTime() {
        return 120; // placeholder
    }

    public Double getMaintenanceCosts() {
        Long interventions = interventionRepository.count();
        double averageCost = 500; // example cost per intervention
        return interventions * averageCost;
    }
}
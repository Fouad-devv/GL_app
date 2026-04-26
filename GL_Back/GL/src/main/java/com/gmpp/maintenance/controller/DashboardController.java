package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.KPIResponse;
import com.gmpp.maintenance.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
@Tag(name = "Dashboard", description = "Indicateurs clés et métriques du tableau de bord")
public class DashboardController {

    private final DashboardService dashboardService;

    @Operation(summary = "Ensemble des KPIs du tableau de bord")
    @GetMapping("/kpis")
    public ResponseEntity<KPIResponse> getKPIMetrics() {
        KPIResponse kpis = dashboardService.getKPIMetrics();
        return ResponseEntity.ok(kpis);
    }

    @Operation(summary = "Nombre total de machines")
    @GetMapping("/machines/total")
    public ResponseEntity<Long> getTotalMachines() {
        Long total = dashboardService.getTotalMachines();
        return ResponseEntity.ok(total);
    }

    @Operation(summary = "Nombre de machines en service")
    @GetMapping("/machines/operational")
    public ResponseEntity<Long> getOperationalMachines() {
        Long operational = dashboardService.getOperationalMachines();
        return ResponseEntity.ok(operational);
    }

    @Operation(summary = "Nombre de machines en maintenance")
    @GetMapping("/machines/maintenance")
    public ResponseEntity<Long> getMaintenanceMachines() {
        Long maintenance = dashboardService.getMaintenanceMachines();
        return ResponseEntity.ok(maintenance);
    }

    @Operation(summary = "Nombre de machines en réparation")
    @GetMapping("/machines/repair")
    public ResponseEntity<Long> getUnderRepairMachines() {
        Long underRepair = dashboardService.getUnderRepairMachines();
        return ResponseEntity.ok(underRepair);
    }

    @Operation(summary = "Nombre de machines hors service")
    @GetMapping("/machines/outofservice")
    public ResponseEntity<Long> getOutOfServiceMachines() {
        Long outOfService = dashboardService.getOutOfServiceMachines();
        return ResponseEntity.ok(outOfService);
    }

    @Operation(summary = "Nombre d'interventions planifiées")
    @GetMapping("/interventions/planned")
    public ResponseEntity<Long> getPlannedInterventions() {
        Long planned = dashboardService.getPlannedInterventions();
        return ResponseEntity.ok(planned);
    }

    @Operation(summary = "Nombre d'interventions en cours")
    @GetMapping("/interventions/ongoing")
    public ResponseEntity<Long> getOngoingInterventions() {
        Long ongoing = dashboardService.getOngoingInterventions();
        return ResponseEntity.ok(ongoing);
    }

    @Operation(summary = "Nombre d'interventions terminées")
    @GetMapping("/interventions/completed")
    public ResponseEntity<Long> getCompletedInterventions() {
        Long completed = dashboardService.getCompletedInterventions();
        return ResponseEntity.ok(completed);
    }

    @Operation(summary = "Nombre d'interventions annulées")
    @GetMapping("/interventions/cancelled")
    public ResponseEntity<Long> getCancelledInterventions() {
        Long cancelled = dashboardService.getCancelledInterventions();
        return ResponseEntity.ok(cancelled);
    }

    @Operation(summary = "Nombre d'interventions en retard")
    @GetMapping("/interventions/overdue")
    public ResponseEntity<Long> getOverdueInterventions() {
        Long overdue = dashboardService.getOverdueInterventions();
        return ResponseEntity.ok(overdue);
    }

    @Operation(summary = "Taux de disponibilité des machines (en %)")
    @GetMapping("/machine-availability")
    public ResponseEntity<Double> getMachineAvailability() {
        Double availability = dashboardService.getMachineAvailability();
        return ResponseEntity.ok(availability);
    }

    @Operation(summary = "Taux de réalisation des interventions (en %)")
    @GetMapping("/implementation-rate")
    public ResponseEntity<Double> getImplementationRate() {
        Double rate = dashboardService.getImplementationRate();
        return ResponseEntity.ok(rate);
    }

    @Operation(summary = "Nombre de points de maintenance en retard")
    @GetMapping("/maintenance-points/overdue")
    public ResponseEntity<Long> getOverdueMaintenancePoints() {
        Long overdue = dashboardService.getOverdueMaintenancePoints();
        return ResponseEntity.ok(overdue);
    }

    @Operation(summary = "Coût mensuel moyen de maintenance")
    @GetMapping("/monthly-cost")
    public ResponseEntity<Double> calculateMonthlyAverageCost() {
        Double cost = dashboardService.calculateMonthlyAverageCost();
        return ResponseEntity.ok(cost);
    }

    @Operation(summary = "Statistiques détaillées des interventions")
    @GetMapping("/intervention-stats")
    public ResponseEntity<Map<String, Object>> getInterventionStats() {
        return ResponseEntity.ok(dashboardService.getInterventionStats());
    }

    @Operation(summary = "Alertes actives")
    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, String>>> getAlerts() {
        return ResponseEntity.ok(dashboardService.getAlerts());
    }

    @Operation(summary = "Interventions à venir",
               description = "Retourne les interventions planifiées dans les N prochains jours (défaut : 7).")
    @GetMapping("/upcoming-interventions")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingInterventions(
            @Parameter(description = "Nombre de jours à prendre en compte") @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dashboardService.getUpcomingInterventions(days));
    }

    @Operation(summary = "Nombre de pannes préventives évitées")
    @GetMapping("/prevented-failures")
    public ResponseEntity<Long> getPreventedFailures() {
        return ResponseEntity.ok(dashboardService.getPreventedFailures());
    }

    @Operation(summary = "Durée moyenne d'une intervention (en minutes)")
    @GetMapping("/avg-intervention-time")
    public ResponseEntity<Integer> getAverageInterventionTime() {
        return ResponseEntity.ok(dashboardService.getAverageInterventionTime());
    }

    @Operation(summary = "Coûts de maintenance sur une période")
    @GetMapping("/maintenance-costs")
    public ResponseEntity<Double> getMaintenanceCosts(
            @Parameter(description = "Date de début (yyyy-MM-dd)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin (yyyy-MM-dd)") @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(dashboardService.getMaintenanceCosts());
    }
}

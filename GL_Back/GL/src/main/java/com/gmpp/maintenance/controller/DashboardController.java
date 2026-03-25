package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.KPIResponse;
import com.gmpp.maintenance.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/kpis")
    public ResponseEntity<KPIResponse> getKPIMetrics() {
        KPIResponse kpis = dashboardService.getKPIMetrics();
        return ResponseEntity.ok(kpis);
    }

    @GetMapping("/machines/total")
    public ResponseEntity<Long> getTotalMachines() {
        Long total = dashboardService.getTotalMachines();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/machines/operational")
    public ResponseEntity<Long> getOperationalMachines() {
        Long operational = dashboardService.getOperationalMachines();
        return ResponseEntity.ok(operational);
    }

    @GetMapping("/machines/maintenance")
    public ResponseEntity<Long> getMaintenanceMachines() {
        Long maintenance = dashboardService.getMaintenanceMachines();
        return ResponseEntity.ok(maintenance);
    }

    @GetMapping("/machines/repair")
    public ResponseEntity<Long> getUnderRepairMachines() {
        Long underRepair = dashboardService.getUnderRepairMachines();
        return ResponseEntity.ok(underRepair);
    }

    @GetMapping("/machines/outofservice")
    public ResponseEntity<Long> getOutOfServiceMachines() {
        Long outOfService = dashboardService.getOutOfServiceMachines();
        return ResponseEntity.ok(outOfService);
    }

    @GetMapping("/interventions/planned")
    public ResponseEntity<Long> getPlannedInterventions() {
        Long planned = dashboardService.getPlannedInterventions();
        return ResponseEntity.ok(planned);
    }

    @GetMapping("/interventions/ongoing")
    public ResponseEntity<Long> getOngoingInterventions() {
        Long ongoing = dashboardService.getOngoingInterventions();
        return ResponseEntity.ok(ongoing);
    }

    @GetMapping("/interventions/completed")
    public ResponseEntity<Long> getCompletedInterventions() {
        Long completed = dashboardService.getCompletedInterventions();
        return ResponseEntity.ok(completed);
    }

    @GetMapping("/interventions/cancelled")
    public ResponseEntity<Long> getCancelledInterventions() {
        Long cancelled = dashboardService.getCancelledInterventions();
        return ResponseEntity.ok(cancelled);
    }

    @GetMapping("/interventions/overdue")
    public ResponseEntity<Long> getOverdueInterventions() {
        Long overdue = dashboardService.getOverdueInterventions();
        return ResponseEntity.ok(overdue);
    }

    @GetMapping("/machine-availability")
    public ResponseEntity<Double> getMachineAvailability() {
        Double availability = dashboardService.getMachineAvailability();
        return ResponseEntity.ok(availability);
    }

    @GetMapping("/implementation-rate")
    public ResponseEntity<Double> getImplementationRate() {
        Double rate = dashboardService.getImplementationRate();
        return ResponseEntity.ok(rate);
    }

    @GetMapping("/maintenance-points/overdue")
    public ResponseEntity<Long> getOverdueMaintenancePoints() {
        Long overdue = dashboardService.getOverdueMaintenancePoints();
        return ResponseEntity.ok(overdue);
    }

    @GetMapping("/monthly-cost")
    public ResponseEntity<Double> calculateMonthlyAverageCost() {
        Double cost = dashboardService.calculateMonthlyAverageCost();
        return ResponseEntity.ok(cost);
    }

    @GetMapping("/intervention-stats")
    public ResponseEntity<Map<String, Object>> getInterventionStats() {

        Map<String, Object> stats = new HashMap<>();

        stats.put("PLANIFIEE", dashboardService.getPlannedInterventions());
        stats.put("EN_COURS", dashboardService.getOngoingInterventions());
        stats.put("TERMINEE", dashboardService.getCompletedInterventions());
        stats.put("ANNULEE", dashboardService.getCancelledInterventions());
        stats.put("EN_RETARD", dashboardService.getOverdueInterventions());

        stats.put("totalInterventions", dashboardService.getCompletedInterventions()
                + dashboardService.getOngoingInterventions()
                + dashboardService.getPlannedInterventions());

        return ResponseEntity.ok(stats);
    }


    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, String>>> getAlerts() {
        return ResponseEntity.ok(dashboardService.getAlerts());
    }

    @GetMapping("/upcoming-interventions")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingInterventions(
            @RequestParam(defaultValue = "7") int days) {
        return ResponseEntity.ok(dashboardService.getUpcomingInterventions(days));
    }

    @GetMapping("/prevented-failures")
    public ResponseEntity<Long> getPreventedFailures() {
        return ResponseEntity.ok(dashboardService.getPreventedFailures());
    }

    @GetMapping("/avg-intervention-time")
    public ResponseEntity<Integer> getAverageInterventionTime() {
        return ResponseEntity.ok(dashboardService.getAverageInterventionTime());
    }

    @GetMapping("/maintenance-costs")
    public ResponseEntity<Double> getMaintenanceCosts(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return ResponseEntity.ok(dashboardService.getMaintenanceCosts());
    }
}

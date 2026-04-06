package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.service.PlanningService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;

@RestController
@RequestMapping("/planning")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PlanningController {

    private final PlanningService planningService;

    @GetMapping("/date-range")
    public ResponseEntity<List<InterventionDTO>> getPlanningByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<InterventionDTO> planning = planningService.getPlanningByDateRange(startDate, endDate);
        return ResponseEntity.ok(planning);
    }

    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<InterventionDTO>> getMonthlyPlanning(@PathVariable int year, @PathVariable int month) {
        List<InterventionDTO> planning = planningService.getMonthlyPlanning(month, year);
        return ResponseEntity.ok(planning);
    }

    @PostMapping("/generate-automatic")
    public ResponseEntity<Void> generateAutomaticPlanning() {
        planningService.generateAutomaticPlanning();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/generate-to-date")
    public ResponseEntity<Void> generatePlanningToDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        planningService.generatePlanningToDate(date);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/schedule")
    public ResponseEntity<InterventionDTO> scheduleIntervention(
            @RequestParam Long maintenancePointId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate plannedDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime plannedTime) {
        InterventionDTO intervention = planningService.scheduleIntervention(maintenancePointId, plannedDate, plannedTime);
        return ResponseEntity.status(HttpStatus.CREATED).body(intervention);
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<InterventionDTO> markInterventionAsCompleted(
            @PathVariable Long id,
            @RequestParam Integer durationMinutes,
            @RequestParam(required = false) String observations) {
        InterventionDTO intervention = planningService.markInterventionAsCompleted(id, durationMinutes, observations);
        return ResponseEntity.ok(intervention);
    }

    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<Void> rescheduleIntervention(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime newTime) {
        planningService.rescheduleIntervention(id, newDate, newTime);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelIntervention(@PathVariable Long id) {
        planningService.cancelIntervention(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<InterventionDTO>> getUpcomingInterventions(@RequestParam(defaultValue = "7") int days) {
        List<InterventionDTO> upcoming = planningService.getUpcomingInterventions(days);
        return ResponseEntity.ok(upcoming);
    }

    @GetMapping("/week/{date}")
    public ResponseEntity<List<InterventionDTO>> getPlanningByWeek(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<InterventionDTO> planning = planningService.getPlanningByWeek(date);
        return ResponseEntity.ok(planning);
    }
}

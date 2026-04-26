package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.service.PlanningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Planning", description = "Planification et ordonnancement des interventions")
public class PlanningController {

    private final PlanningService planningService;

    @Operation(summary = "Planning sur une plage de dates")
    @GetMapping("/date-range")
    public ResponseEntity<List<InterventionDTO>> getPlanningByDateRange(
            @Parameter(description = "Date de début (yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "Date de fin (yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<InterventionDTO> planning = planningService.getPlanningByDateRange(startDate, endDate);
        return ResponseEntity.ok(planning);
    }

    @Operation(summary = "Planning mensuel")
    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<InterventionDTO>> getMonthlyPlanning(
            @Parameter(description = "Année (ex : 2025)") @PathVariable int year,
            @Parameter(description = "Mois (1-12)") @PathVariable int month) {
        List<InterventionDTO> planning = planningService.getMonthlyPlanning(month, year);
        return ResponseEntity.ok(planning);
    }

    @Operation(summary = "Générer le planning automatique",
               description = "Génère automatiquement les interventions à partir des points de maintenance actifs.")
    @ApiResponse(responseCode = "201", description = "Planning généré")
    @PostMapping("/generate-automatic")
    public ResponseEntity<Void> generateAutomaticPlanning() {
        planningService.generateAutomaticPlanning();
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Générer le planning jusqu'à une date donnée")
    @ApiResponse(responseCode = "201", description = "Planning généré")
    @PostMapping("/generate-to-date")
    public ResponseEntity<Void> generatePlanningToDate(
            @Parameter(description = "Date limite (yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        planningService.generatePlanningToDate(date);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Planifier manuellement une intervention")
    @ApiResponse(responseCode = "201", description = "Intervention planifiée")
    @PostMapping("/schedule")
    public ResponseEntity<InterventionDTO> scheduleIntervention(
            @Parameter(description = "ID du point de maintenance") @RequestParam Long maintenancePointId,
            @Parameter(description = "Date planifiée (yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate plannedDate,
            @Parameter(description = "Heure planifiée (HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime plannedTime) {
        InterventionDTO intervention = planningService.scheduleIntervention(maintenancePointId, plannedDate, plannedTime);
        return ResponseEntity.status(HttpStatus.CREATED).body(intervention);
    }

    @Operation(summary = "Marquer une intervention comme terminée")
    @PatchMapping("/{id}/complete")
    public ResponseEntity<InterventionDTO> markInterventionAsCompleted(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id,
            @Parameter(description = "Durée réelle en minutes") @RequestParam Integer durationMinutes,
            @Parameter(description = "Observations (optionnel)") @RequestParam(required = false) String observations) {
        InterventionDTO intervention = planningService.markInterventionAsCompleted(id, durationMinutes, observations);
        return ResponseEntity.ok(intervention);
    }

    @Operation(summary = "Reprogrammer une intervention")
    @ApiResponse(responseCode = "204", description = "Intervention reprogrammée")
    @PatchMapping("/{id}/reschedule")
    public ResponseEntity<Void> rescheduleIntervention(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id,
            @Parameter(description = "Nouvelle date (yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate newDate,
            @Parameter(description = "Nouvelle heure (HH:mm:ss)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime newTime) {
        planningService.rescheduleIntervention(id, newDate, newTime);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Annuler une intervention planifiée")
    @ApiResponse(responseCode = "204", description = "Intervention annulée")
    @DeleteMapping("/{id}/cancel")
    public ResponseEntity<Void> cancelIntervention(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id) {
        planningService.cancelIntervention(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Interventions à venir",
               description = "Retourne les interventions planifiées dans les N prochains jours (défaut : 7).")
    @GetMapping("/upcoming")
    public ResponseEntity<List<InterventionDTO>> getUpcomingInterventions(
            @Parameter(description = "Nombre de jours") @RequestParam(defaultValue = "7") int days) {
        List<InterventionDTO> upcoming = planningService.getUpcomingInterventions(days);
        return ResponseEntity.ok(upcoming);
    }

    @Operation(summary = "Planning de la semaine contenant une date donnée")
    @GetMapping("/week/{date}")
    public ResponseEntity<List<InterventionDTO>> getPlanningByWeek(
            @Parameter(description = "N'importe quelle date de la semaine (yyyy-MM-dd)")
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<InterventionDTO> planning = planningService.getPlanningByWeek(date);
        return ResponseEntity.ok(planning);
    }
}

package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.service.InterventionService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/interventions")
@RequiredArgsConstructor
public class InterventionController {

    private final InterventionService interventionService;

    @GetMapping
    public ResponseEntity<List<InterventionDTO>> getAllInterventions() {
        List<InterventionDTO> interventions = interventionService.getAllInterventions();
        return ResponseEntity.ok(interventions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterventionDTO> getInterventionById(@PathVariable Long id) {
        InterventionDTO intervention = interventionService.getInterventionById(id);
        return ResponseEntity.ok(intervention);
    }

    @PostMapping
    public ResponseEntity<InterventionDTO> createIntervention(@RequestBody InterventionDTO interventionDTO) {
        InterventionDTO createdIntervention = interventionService.createIntervention(interventionDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdIntervention);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterventionDTO> updateIntervention(@PathVariable Long id, @RequestBody InterventionDTO interventionDTO) {
        InterventionDTO updatedIntervention = interventionService.updateIntervention(id, interventionDTO);
        return ResponseEntity.ok(updatedIntervention);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(@PathVariable Long id) {
        interventionService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<InterventionDTO> updateInterventionStatus(@PathVariable Long id, @PathVariable InterventionStatus status) {
        InterventionDTO updatedIntervention = interventionService.updateInterventionStatus(id, status);
        return ResponseEntity.ok(updatedIntervention);
    }

    @PatchMapping("/{id}/assign-technician/{technicianId}")
    public ResponseEntity<InterventionDTO> assignTechnician(@PathVariable Long id, @PathVariable Long technicianId) {
        InterventionDTO updatedIntervention = interventionService.assignTechnician(id, technicianId);
        return ResponseEntity.ok(updatedIntervention);
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByMachine(@PathVariable Long machineId) {
        List<InterventionDTO> interventions = interventionService.getInterventionsByMachine(machineId);
        return ResponseEntity.ok(interventions);
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByTechnician(@PathVariable Long technicianId) {
        List<InterventionDTO> interventions = interventionService.getInterventionsByTechnician(technicianId);
        return ResponseEntity.ok(interventions);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByStatus(@PathVariable InterventionStatus status) {
        List<InterventionDTO> interventions = interventionService.getInterventionsByStatus(status);
        return ResponseEntity.ok(interventions);
    }

    @GetMapping("/planning")
    public ResponseEntity<List<InterventionDTO>> getPlannedInterventions(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<InterventionDTO> interventions = interventionService.getPlannedInterventions(startDate, endDate);
        return ResponseEntity.ok(interventions);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<InterventionDTO>> getOverdueInterventions() {
        List<InterventionDTO> interventions = interventionService.getOverdueInterventions();
        return ResponseEntity.ok(interventions);
    }

    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countInterventionsByStatus(@PathVariable InterventionStatus status) {
        Long count = interventionService.countInterventionsByStatus(status);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/machine/{machineId}")
    public ResponseEntity<Long> countInterventionsByMachine(@PathVariable Long machineId) {
        Long count = interventionService.countInterventionsByMachine(machineId);
        return ResponseEntity.ok(count);
    }
}

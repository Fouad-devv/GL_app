package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.MaintenancePointDTO;
import com.gmpp.maintenance.enums.MaintenanceFrequency;
import com.gmpp.maintenance.service.MaintenancePointService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance-points")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('admin', 'responsable de maintenance', 'technicien', 'chef d''equipe')")
@Tag(name = "Points de maintenance", description = "Gestion des points de maintenance des machines")
public class MaintenancePointController {

    private final MaintenancePointService maintenancePointService;

    @Operation(summary = "Lister tous les points de maintenance")
    @GetMapping
    public ResponseEntity<List<MaintenancePointDTO>> getAllMaintenancePoints() {
        List<MaintenancePointDTO> points = maintenancePointService.getAllMaintenancePoints();
        return ResponseEntity.ok(points);
    }

    @Operation(summary = "Récupérer un point de maintenance par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Point trouvé"),
        @ApiResponse(responseCode = "404", description = "Point introuvable")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MaintenancePointDTO> getMaintenancePointById(
            @Parameter(description = "ID du point de maintenance") @PathVariable Long id) {
        MaintenancePointDTO point = maintenancePointService.getMaintenancePointById(id);
        return ResponseEntity.ok(point);
    }

    @Operation(summary = "Créer un point de maintenance")
    @ApiResponse(responseCode = "201", description = "Point créé")
    @PostMapping
    public ResponseEntity<MaintenancePointDTO> createMaintenancePoint(@RequestBody MaintenancePointDTO pointDTO) {
        MaintenancePointDTO createdPoint = maintenancePointService.createMaintenancePoint(pointDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPoint);
    }

    @Operation(summary = "Mettre à jour un point de maintenance")
    @PutMapping("/{id}")
    public ResponseEntity<MaintenancePointDTO> updateMaintenancePoint(
            @Parameter(description = "ID du point de maintenance") @PathVariable Long id,
            @RequestBody MaintenancePointDTO pointDTO) {
        MaintenancePointDTO updatedPoint = maintenancePointService.updateMaintenancePoint(id, pointDTO);
        return ResponseEntity.ok(updatedPoint);
    }

    @Operation(summary = "Supprimer un point de maintenance")
    @ApiResponse(responseCode = "204", description = "Point supprimé")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenancePoint(
            @Parameter(description = "ID du point de maintenance") @PathVariable Long id) {
        maintenancePointService.deleteMaintenancePoint(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Points de maintenance d'une machine")
    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<MaintenancePointDTO>> getMaintenancePointsByMachine(
            @Parameter(description = "ID de la machine") @PathVariable Long machineId) {
        List<MaintenancePointDTO> points = maintenancePointService.getMaintenancePointsByMachine(machineId);
        return ResponseEntity.ok(points);
    }

    @Operation(summary = "Points de maintenance en retard")
    @GetMapping("/overdue")
    public ResponseEntity<List<MaintenancePointDTO>> getOverdueMaintenancePoints() {
        List<MaintenancePointDTO> points = maintenancePointService.getOverdueMaintenancePoints();
        return ResponseEntity.ok(points);
    }

    @Operation(summary = "Filtrer les points de maintenance par fréquence")
    @GetMapping("/frequency/{frequency}")
    public ResponseEntity<List<MaintenancePointDTO>> getMaintenancePointsByFrequency(
            @Parameter(description = "Fréquence de maintenance") @PathVariable MaintenanceFrequency frequency) {
        List<MaintenancePointDTO> points = maintenancePointService.getMaintenancePointsByFrequency(frequency);
        return ResponseEntity.ok(points);
    }

    @Operation(summary = "Compter les points de maintenance d'une machine")
    @GetMapping("/count/machine/{machineId}")
    public ResponseEntity<Long> countMaintenancePointsByMachine(
            @Parameter(description = "ID de la machine") @PathVariable Long machineId) {
        Long count = maintenancePointService.countMaintenancePointsByMachine(machineId);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Compter les points de maintenance en retard")
    @GetMapping("/count/overdue")
    public ResponseEntity<Long> countOverdueMaintenancePoints() {
        Long count = maintenancePointService.countOverdueMaintenancePoints();
        return ResponseEntity.ok(count);
    }
}

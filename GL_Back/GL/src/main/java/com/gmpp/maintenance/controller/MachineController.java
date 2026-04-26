package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.MachineDTO;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.MachineType;
import com.gmpp.maintenance.service.MachineService;
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
@RequestMapping("/machines")
@PreAuthorize("isAuthenticated()")
@RequiredArgsConstructor
@Tag(name = "Machines", description = "Gestion des machines industrielles")
public class MachineController {

    private final MachineService machineService;

    @Operation(summary = "Lister toutes les machines")
    @GetMapping
    public ResponseEntity<List<MachineDTO>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }

    @Operation(summary = "Récupérer une machine par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Machine trouvée"),
        @ApiResponse(responseCode = "404", description = "Machine introuvable")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MachineDTO> getMachineById(
            @Parameter(description = "ID de la machine") @PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    @Operation(summary = "Créer une machine")
    @ApiResponse(responseCode = "201", description = "Machine créée")
    @PostMapping
    public ResponseEntity<MachineDTO> createMachine(@RequestBody MachineDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(machineService.createMachine(dto));
    }

    @Operation(summary = "Mettre à jour une machine")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Machine mise à jour"),
        @ApiResponse(responseCode = "404", description = "Machine introuvable")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MachineDTO> updateMachine(
            @Parameter(description = "ID de la machine") @PathVariable Long id,
            @RequestBody MachineDTO dto) {
        return ResponseEntity.ok(machineService.updateMachine(id, dto));
    }

    @Operation(summary = "Supprimer une machine")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Machine supprimée"),
        @ApiResponse(responseCode = "404", description = "Machine introuvable")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(
            @Parameter(description = "ID de la machine") @PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Filtrer les machines par statut")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MachineDTO>> getMachinesByStatus(
            @Parameter(description = "Statut : EN_SERVICE, EN_MAINTENANCE, EN_REPARATION, HORS_SERVICE")
            @PathVariable MachineStatus status) {
        return ResponseEntity.ok(machineService.getMachinesByStatus(status));
    }

    @Operation(summary = "Filtrer les machines par type")
    @GetMapping("/type/{type}")
    public ResponseEntity<List<MachineDTO>> getMachinesByType(
            @Parameter(description = "Type de machine") @PathVariable MachineType type) {
        return ResponseEntity.ok(machineService.getMachinesByType(type));
    }

    @Operation(summary = "Rechercher des machines par mot-clé")
    @GetMapping("/search")
    public ResponseEntity<List<MachineDTO>> searchMachines(
            @Parameter(description = "Terme de recherche") @RequestParam("q") String search) {
        return ResponseEntity.ok(machineService.searchMachines(search));
    }

    @Operation(summary = "Compter les machines par statut")
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countMachinesByStatus(
            @Parameter(description = "Statut de la machine") @PathVariable MachineStatus status) {
        return ResponseEntity.ok(machineService.countMachinesByStatus(status));
    }
}
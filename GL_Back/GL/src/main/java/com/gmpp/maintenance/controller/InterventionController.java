package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.dto.InterventionPhotoDTO;
import com.gmpp.maintenance.entity.InterventionPhoto;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.service.InterventionPhotoService;
import com.gmpp.maintenance.service.InterventionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/interventions")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('admin', 'technicien', 'responsable de maintenance', 'chef d''equipe')")
@Tag(name = "Interventions", description = "Gestion des interventions de maintenance")
public class InterventionController {

    private final InterventionService interventionService;
    private final InterventionPhotoService photoService;

    @Operation(summary = "Lister toutes les interventions")
    @GetMapping
    public ResponseEntity<List<InterventionDTO>> getAllInterventions() {
        return ResponseEntity.ok(interventionService.getAllInterventions());
    }

    @Operation(summary = "Récupérer une intervention par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Intervention trouvée"),
        @ApiResponse(responseCode = "404", description = "Intervention introuvable")
    })
    @GetMapping("/{id}")
    public ResponseEntity<InterventionDTO> getInterventionById(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id) {
        return ResponseEntity.ok(interventionService.getInterventionById(id));
    }

    @Operation(summary = "Créer une intervention")
    @ApiResponse(responseCode = "201", description = "Intervention créée")
    @PostMapping
    public ResponseEntity<InterventionDTO> createIntervention(@RequestBody InterventionDTO interventionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interventionService.createIntervention(interventionDTO));
    }

    @Operation(summary = "Mettre à jour une intervention")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Intervention mise à jour"),
        @ApiResponse(responseCode = "404", description = "Intervention introuvable")
    })
    @PutMapping("/{id}")
    public ResponseEntity<InterventionDTO> updateIntervention(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id,
            @RequestBody InterventionDTO interventionDTO) {
        return ResponseEntity.ok(interventionService.updateIntervention(id, interventionDTO));
    }

    @Operation(summary = "Supprimer une intervention")
    @ApiResponse(responseCode = "204", description = "Intervention supprimée")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id) {
        interventionService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Changer le statut d'une intervention",
               description = "Statuts possibles : PLANIFIEE, EN_COURS, TERMINEE, ANNULEE, EN_RETARD")
    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<InterventionDTO> updateInterventionStatus(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id,
            @Parameter(description = "Nouveau statut") @PathVariable InterventionStatus status) {
        return ResponseEntity.ok(interventionService.updateInterventionStatus(id, status));
    }

    @Operation(summary = "Affecter un technicien à une intervention")
    @PatchMapping("/{id}/assign-technician/{technicianId}")
    public ResponseEntity<InterventionDTO> assignTechnician(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id,
            @Parameter(description = "ID du technicien") @PathVariable Long technicianId) {
        return ResponseEntity.ok(interventionService.assignTechnician(id, technicianId));
    }

    @Operation(summary = "Interventions d'une machine")
    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByMachine(
            @Parameter(description = "ID de la machine") @PathVariable Long machineId) {
        return ResponseEntity.ok(interventionService.getInterventionsByMachine(machineId));
    }

    @Operation(summary = "Interventions d'un point de maintenance")
    @GetMapping("/maintenance-point/{maintenancePointId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByMaintenancePoint(
            @Parameter(description = "ID du point de maintenance") @PathVariable Long maintenancePointId) {
        return ResponseEntity.ok(interventionService.getInterventionsByMaintenancePoint(maintenancePointId));
    }

    @Operation(summary = "Interventions d'un technicien")
    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByTechnician(
            @Parameter(description = "ID du technicien") @PathVariable Long technicianId) {
        return ResponseEntity.ok(interventionService.getInterventionsByTechnician(technicianId));
    }

    @Operation(summary = "Interventions filtrées par statut")
    @GetMapping("/status/{status}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByStatus(
            @Parameter(description = "Statut de l'intervention") @PathVariable InterventionStatus status) {
        return ResponseEntity.ok(interventionService.getInterventionsByStatus(status));
    }

    @Operation(summary = "Interventions planifiées sur une plage de dates")
    @GetMapping("/planning")
    public ResponseEntity<List<InterventionDTO>> getPlannedInterventions(
            @Parameter(description = "Date de début (ISO 8601 : yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @Parameter(description = "Date de fin (ISO 8601 : yyyy-MM-dd)")
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(interventionService.getPlannedInterventions(startDate, endDate));
    }

    @Operation(summary = "Interventions en retard")
    @GetMapping("/overdue")
    public ResponseEntity<List<InterventionDTO>> getOverdueInterventions() {
        return ResponseEntity.ok(interventionService.getOverdueInterventions());
    }

    @Operation(summary = "Compter les interventions par statut")
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countInterventionsByStatus(
            @Parameter(description = "Statut de l'intervention") @PathVariable InterventionStatus status) {
        return ResponseEntity.ok(interventionService.countInterventionsByStatus(status));
    }

    @Operation(summary = "Compter les interventions d'une machine")
    @GetMapping("/count/machine/{machineId}")
    public ResponseEntity<Long> countInterventionsByMachine(
            @Parameter(description = "ID de la machine") @PathVariable Long machineId) {
        return ResponseEntity.ok(interventionService.countInterventionsByMachine(machineId));
    }

    /* ── Photos ─────────────────────────────────────────────────────────── */

    @Operation(summary = "Ajouter une photo à une intervention",
               description = "Fichier multipart/form-data, champ 'file'. Taille max : 10 MB.")
    @ApiResponse(responseCode = "201", description = "Photo uploadée")
    @PostMapping("/{id}/photos")
    public ResponseEntity<InterventionPhotoDTO> uploadPhoto(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(photoService.uploadPhoto(id, file));
    }

    @Operation(summary = "Lister les photos d'une intervention")
    @GetMapping("/{id}/photos")
    public ResponseEntity<List<InterventionPhotoDTO>> getPhotos(
            @Parameter(description = "ID de l'intervention") @PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotos(id));
    }

    @Operation(summary = "Télécharger les données binaires d'une photo",
               description = "Retourne l'image en binaire avec son Content-Type d'origine.")
    @GetMapping("/photos/{photoId}/data")
    public ResponseEntity<byte[]> getPhotoData(
            @Parameter(description = "ID de la photo") @PathVariable Long photoId) {
        InterventionPhoto photo = photoService.getPhotoData(photoId);
        String safeName = photo.getFileName().replaceAll("[^a-zA-Z0-9._-]", "_");
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + safeName + "\"")
            .contentType(MediaType.parseMediaType(photo.getContentType()))
            .body(photo.getData());
    }

    @Operation(summary = "Supprimer une photo")
    @ApiResponse(responseCode = "204", description = "Photo supprimée")
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @Parameter(description = "ID de la photo") @PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }
}

package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.InterventionDTO;
import com.gmpp.maintenance.dto.InterventionPhotoDTO;
import com.gmpp.maintenance.entity.InterventionPhoto;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.service.InterventionPhotoService;
import com.gmpp.maintenance.service.InterventionService;
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
@PreAuthorize("hasAnyRole('admin', 'technicien')")
public class InterventionController {

    private final InterventionService interventionService;
    private final InterventionPhotoService photoService;

    @GetMapping
    public ResponseEntity<List<InterventionDTO>> getAllInterventions() {
        return ResponseEntity.ok(interventionService.getAllInterventions());
    }

    @GetMapping("/{id}")
    public ResponseEntity<InterventionDTO> getInterventionById(@PathVariable Long id) {
        return ResponseEntity.ok(interventionService.getInterventionById(id));
    }

    @PostMapping
    public ResponseEntity<InterventionDTO> createIntervention(@RequestBody InterventionDTO interventionDTO) {
        return ResponseEntity.status(HttpStatus.CREATED).body(interventionService.createIntervention(interventionDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InterventionDTO> updateIntervention(@PathVariable Long id, @RequestBody InterventionDTO interventionDTO) {
        return ResponseEntity.ok(interventionService.updateIntervention(id, interventionDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteIntervention(@PathVariable Long id) {
        interventionService.deleteIntervention(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status/{status}")
    public ResponseEntity<InterventionDTO> updateInterventionStatus(@PathVariable Long id, @PathVariable InterventionStatus status) {
        return ResponseEntity.ok(interventionService.updateInterventionStatus(id, status));
    }

    @PatchMapping("/{id}/assign-technician/{technicianId}")
    public ResponseEntity<InterventionDTO> assignTechnician(@PathVariable Long id, @PathVariable Long technicianId) {
        return ResponseEntity.ok(interventionService.assignTechnician(id, technicianId));
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(interventionService.getInterventionsByMachine(machineId));
    }

    @GetMapping("/maintenance-point/{maintenancePointId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByMaintenancePoint(@PathVariable Long maintenancePointId) {
        return ResponseEntity.ok(interventionService.getInterventionsByMaintenancePoint(maintenancePointId));
    }

    @GetMapping("/technician/{technicianId}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByTechnician(@PathVariable Long technicianId) {
        return ResponseEntity.ok(interventionService.getInterventionsByTechnician(technicianId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<InterventionDTO>> getInterventionsByStatus(@PathVariable InterventionStatus status) {
        return ResponseEntity.ok(interventionService.getInterventionsByStatus(status));
    }

    @GetMapping("/planning")
    public ResponseEntity<List<InterventionDTO>> getPlannedInterventions(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(interventionService.getPlannedInterventions(startDate, endDate));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<InterventionDTO>> getOverdueInterventions() {
        return ResponseEntity.ok(interventionService.getOverdueInterventions());
    }

    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countInterventionsByStatus(@PathVariable InterventionStatus status) {
        return ResponseEntity.ok(interventionService.countInterventionsByStatus(status));
    }

    @GetMapping("/count/machine/{machineId}")
    public ResponseEntity<Long> countInterventionsByMachine(@PathVariable Long machineId) {
        return ResponseEntity.ok(interventionService.countInterventionsByMachine(machineId));
    }

    /* ── Photos ─────────────────────────────────────────────────────────── */

    @PostMapping("/{id}/photos")
    public ResponseEntity<InterventionPhotoDTO> uploadPhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(photoService.uploadPhoto(id, file));
    }

    @GetMapping("/{id}/photos")
    public ResponseEntity<List<InterventionPhotoDTO>> getPhotos(@PathVariable Long id) {
        return ResponseEntity.ok(photoService.getPhotos(id));
    }

    @GetMapping("/photos/{photoId}/data")
    public ResponseEntity<byte[]> getPhotoData(@PathVariable Long photoId) {
        InterventionPhoto photo = photoService.getPhotoData(photoId);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + photo.getFileName() + "\"")
            .contentType(MediaType.parseMediaType(photo.getContentType()))
            .body(photo.getData());
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(@PathVariable Long photoId) {
        photoService.deletePhoto(photoId);
        return ResponseEntity.noContent().build();
    }
}

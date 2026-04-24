package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.MaintenancePointDTO;
import com.gmpp.maintenance.enums.MaintenanceFrequency;
import com.gmpp.maintenance.service.MaintenancePointService;
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
public class MaintenancePointController {

    private final MaintenancePointService maintenancePointService;

    @GetMapping
    public ResponseEntity<List<MaintenancePointDTO>> getAllMaintenancePoints() {
        List<MaintenancePointDTO> points = maintenancePointService.getAllMaintenancePoints();
        return ResponseEntity.ok(points);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenancePointDTO> getMaintenancePointById(@PathVariable Long id) {
        MaintenancePointDTO point = maintenancePointService.getMaintenancePointById(id);
        return ResponseEntity.ok(point);
    }

    @PostMapping
    public ResponseEntity<MaintenancePointDTO> createMaintenancePoint(@RequestBody MaintenancePointDTO pointDTO) {
        MaintenancePointDTO createdPoint = maintenancePointService.createMaintenancePoint(pointDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdPoint);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaintenancePointDTO> updateMaintenancePoint(@PathVariable Long id, @RequestBody MaintenancePointDTO pointDTO) {
        MaintenancePointDTO updatedPoint = maintenancePointService.updateMaintenancePoint(id, pointDTO);
        return ResponseEntity.ok(updatedPoint);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMaintenancePoint(@PathVariable Long id) {
        maintenancePointService.deleteMaintenancePoint(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/machine/{machineId}")
    public ResponseEntity<List<MaintenancePointDTO>> getMaintenancePointsByMachine(@PathVariable Long machineId) {
        List<MaintenancePointDTO> points = maintenancePointService.getMaintenancePointsByMachine(machineId);
        return ResponseEntity.ok(points);
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<MaintenancePointDTO>> getOverdueMaintenancePoints() {
        List<MaintenancePointDTO> points = maintenancePointService.getOverdueMaintenancePoints();
        return ResponseEntity.ok(points);
    }

    @GetMapping("/frequency/{frequency}")
    public ResponseEntity<List<MaintenancePointDTO>> getMaintenancePointsByFrequency(@PathVariable MaintenanceFrequency frequency) {
        List<MaintenancePointDTO> points = maintenancePointService.getMaintenancePointsByFrequency(frequency);
        return ResponseEntity.ok(points);
    }

    @GetMapping("/count/machine/{machineId}")
    public ResponseEntity<Long> countMaintenancePointsByMachine(@PathVariable Long machineId) {
        Long count = maintenancePointService.countMaintenancePointsByMachine(machineId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/count/overdue")
    public ResponseEntity<Long> countOverdueMaintenancePoints() {
        Long count = maintenancePointService.countOverdueMaintenancePoints();
        return ResponseEntity.ok(count);
    }
}

package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.MachineDTO;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.MachineType;
import com.gmpp.maintenance.service.MachineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    // ===== Get all machines =====
    @GetMapping
    public ResponseEntity<List<MachineDTO>> getAllMachines() {
        return ResponseEntity.ok(machineService.getAllMachines());
    }

    // ===== Get machine by ID =====
    @GetMapping("/{id}")
    public ResponseEntity<MachineDTO> getMachineById(@PathVariable Long id) {
        return ResponseEntity.ok(machineService.getMachineById(id));
    }

    // ===== Create machine =====
    @PostMapping
    public ResponseEntity<MachineDTO> createMachine(@RequestBody MachineDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(machineService.createMachine(dto));
    }

    // ===== Update machine =====
    @PutMapping("/{id}")
    public ResponseEntity<MachineDTO> updateMachine(@PathVariable Long id, @RequestBody MachineDTO dto) {
        return ResponseEntity.ok(machineService.updateMachine(id, dto));
    }

    // ===== Delete machine =====
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }

    // ===== Get machines by status =====
    @GetMapping("/status/{status}")
    public ResponseEntity<List<MachineDTO>> getMachinesByStatus(@PathVariable MachineStatus status) {
        return ResponseEntity.ok(machineService.getMachinesByStatus(status));
    }

    // ===== Get machines by type =====
    @GetMapping("/type/{type}")
    public ResponseEntity<List<MachineDTO>> getMachinesByType(@PathVariable MachineType type) {
        return ResponseEntity.ok(machineService.getMachinesByType(type));
    }

    // ===== Search machines =====
    @GetMapping("/search")
    public ResponseEntity<List<MachineDTO>> searchMachines(@RequestParam("q") String search) {
        return ResponseEntity.ok(machineService.searchMachines(search));
    }

    // ===== Count by status =====
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> countMachinesByStatus(@PathVariable MachineStatus status) {
        return ResponseEntity.ok(machineService.countMachinesByStatus(status));
    }
}
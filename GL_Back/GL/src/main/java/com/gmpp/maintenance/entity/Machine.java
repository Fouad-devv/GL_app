package com.gmpp.maintenance.entity;

import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.MachineType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "machines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    private MachineType type;

    private String brand;
    private String model;
    private String serialNumber;
    private Integer yearManufactured;
    private LocalDate dateCommissioned;
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MachineStatus status;

    private Double operatingHours;

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Intervention> interventions = new ArrayList<>();

    @OneToMany(mappedBy = "machine", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<MaintenancePoint> maintenancePoints = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void addIntervention(Intervention intervention) {
        interventions.add(intervention);
        intervention.setMachine(this);
    }

    public void removeIntervention(Intervention intervention) {
        interventions.remove(intervention);
        intervention.setMachine(null);
    }

    public void addMaintenancePoint(MaintenancePoint point) {
        maintenancePoints.add(point);
        point.setMachine(this);
    }

    public void removeMaintenancePoint(MaintenancePoint point) {
        maintenancePoints.remove(point);
        point.setMachine(null);
    }
}
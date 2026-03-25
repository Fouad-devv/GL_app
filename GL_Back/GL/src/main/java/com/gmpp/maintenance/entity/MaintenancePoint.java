package com.gmpp.maintenance.entity;

import com.gmpp.maintenance.enums.ConsumableType;
import com.gmpp.maintenance.enums.MaintenanceFrequency;
import com.gmpp.maintenance.enums.MaintenanceOperationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "maintenance_points")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenancePoint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Machine
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Enumerated(EnumType.STRING)
    private MaintenanceOperationType operationType;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Enumerated(EnumType.STRING)
    private MaintenanceFrequency frequency;

    @Enumerated(EnumType.STRING)
    private ConsumableType consumableType;

    private Integer quantity;

    private LocalDate lastPerformed;

    private LocalDate nextDue;

    private Integer estimatedDurationMinutes;

    private String name;

    @OneToMany(mappedBy = "maintenancePoint", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Intervention> interventions = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Helper methods for Interventions
    public void addIntervention(Intervention intervention) {
        interventions.add(intervention);
        intervention.setMaintenancePoint(this);
    }

    public void removeIntervention(Intervention intervention) {
        interventions.remove(intervention);
        intervention.setMaintenancePoint(null);
    }
}
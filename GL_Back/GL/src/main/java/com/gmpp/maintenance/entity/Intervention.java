package com.gmpp.maintenance.entity;

import com.gmpp.maintenance.enums.EquipmentState;
import com.gmpp.maintenance.enums.InterventionStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "interventions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Intervention {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to Machine
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    // Link to User (Technician)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "technician_id")
    private User technician;

    // Link to MaintenancePoint
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maintenance_point_id")
    private MaintenancePoint maintenancePoint;

    private LocalDate plannedDate;
    private LocalTime plannedTime;

    private LocalDate actualDate;
    private LocalTime actualTime;

    private Integer durationMinutes;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterventionStatus status;

    @Enumerated(EnumType.STRING)
    private EquipmentState equipmentState;

    @Column(columnDefinition = "TEXT")
    private String observations;

    private Double cost;

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
}
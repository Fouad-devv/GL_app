package com.gmpp.maintenance.entity;

import com.gmpp.maintenance.enums.Specialty;
import com.gmpp.maintenance.enums.UserRole;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    @ElementCollection(targetClass = Specialty.class, fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    @CollectionTable(name = "user_specialties", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "specialty")
    private Set<Specialty> specialties = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String certifications;

    @Column(nullable = false)
    private Boolean active = true;

    private String keycloakId;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Exclude from equals/hashCode/toString to avoid:
    // 1. Infinite recursion (User ↔ Intervention circular reference)
    // 2. Lazy initialization when Hibernate tries to load the collection
    //    just to compute hashCode during DTO conversion
    @OneToMany(mappedBy = "technician", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Intervention> interventions = new HashSet<>();

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
        intervention.setTechnician(this);
    }

    public void removeIntervention(Intervention intervention) {
        interventions.remove(intervention);
        intervention.setTechnician(null);
    }
}
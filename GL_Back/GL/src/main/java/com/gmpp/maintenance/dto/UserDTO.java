package com.gmpp.maintenance.dto;

import com.gmpp.maintenance.enums.Specialty;
import com.gmpp.maintenance.enums.UserRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String fullName;
    private String email;
    private String password;
    private UserRole role;
    private Set<Specialty> specialties;
    private String certifications;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String keycloakId;
}

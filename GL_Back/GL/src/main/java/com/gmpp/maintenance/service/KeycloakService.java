package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.UserDTO;
import com.gmpp.maintenance.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import org.keycloak.representations.idm.RoleRepresentation;

import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakService {

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.admin-client-id}")
    private String clientId;

    @Value("${keycloak.admin-username}")
    private String adminUsername;

    @Value("${keycloak.admin-password}")
    private String adminPassword;

    private Keycloak getAdminKeycloak() {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm("master") // Admin realm
                .grantType(OAuth2Constants.PASSWORD)
                .clientId(clientId)
                .username(adminUsername)
                .password(adminPassword)
                .build();
    }

    public String createUserInKeycloak(UserDTO dto) {
        Keycloak keycloak = getAdminKeycloak();

        UserRepresentation user = new UserRepresentation();
        user.setUsername(dto.getEmail());
        user.setEmail(dto.getEmail());
        user.setEnabled(true);
        user.setFirstName(dto.getFullName());

        // Set password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(dto.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        UsersResource usersResource = keycloak.realm(realm).users();
        Response response = usersResource.create(user);

        if (response.getStatus() != 201) {
            String body = response.hasEntity() ? response.readEntity(String.class) : "";
            log.error("Failed to create user in Keycloak. Status: {}, Body: {}", response.getStatus(), body);
            throw new RuntimeException("Failed to create user in Keycloak: HTTP " + response.getStatus() + " - " + body);
        }

        // Get the created user's ID
        String location = response.getHeaderString("Location");
        String userId = location.substring(location.lastIndexOf('/') + 1);

        // Assign the realm role (this is what actually grants access)
        if (dto.getRole() != null) {
            assignRealmRole(keycloak, userId, dto.getRole());
        }

        return userId;
    }

    public void updateUserInKeycloak(String keycloakId, UserDTO dto) {
        Keycloak keycloak = getAdminKeycloak();
        UserRepresentation user = keycloak.realm(realm).users().get(keycloakId).toRepresentation();
        user.setFirstName(dto.getFullName());
        user.setEmail(dto.getEmail());
        user.setUsername(dto.getEmail());

        keycloak.realm(realm).users().get(keycloakId).update(user);

        if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
            CredentialRepresentation credential = new CredentialRepresentation();
            credential.setType(CredentialRepresentation.PASSWORD);
            credential.setValue(dto.getPassword());
            credential.setTemporary(false);
            keycloak.realm(realm).users().get(keycloakId).resetPassword(credential);
        }

        // Update realm role if provided
        if (dto.getRole() != null) {
            updateRealmRole(keycloak, keycloakId, dto.getRole());
        }
    }

    private String toKeycloakRoleName(UserRole role) {
        switch (role) {
            case ADMIN:                    return "admin";
            case TECHNICIEN:               return "technicien";
            case CHEF_EQUIPE:              return "chef d'equipe";
            case RESPONSABLE_MAINTENANCE:  return "responsable de maintenance";
            default: return role.name().toLowerCase();
        }
    }

    private void assignRealmRole(Keycloak keycloak, String userId, UserRole role) {
        String roleName = toKeycloakRoleName(role);
        log.info("Assigning Keycloak role '{}' to user '{}'", roleName, userId);

        // Check if the role exists by listing all roles (avoids namespace issues with NotFoundException)
        boolean exists = keycloak.realm(realm).roles().list().stream()
                .anyMatch(r -> r.getName().equals(roleName));

        if (!exists) {
            log.info("Role '{}' not found in Keycloak, creating it", roleName);
            RoleRepresentation newRole = new RoleRepresentation();
            newRole.setName(roleName);
            keycloak.realm(realm).roles().create(newRole);
        }

        RoleRepresentation roleRep = keycloak.realm(realm).roles().get(roleName).toRepresentation();
        keycloak.realm(realm).users().get(userId).roles().realmLevel()
                .add(Collections.singletonList(roleRep));
        log.info("Role '{}' successfully assigned to user '{}'", roleName, userId);
    }

    private void updateRealmRole(Keycloak keycloak, String userId, UserRole newRole) {
        // Remove existing app roles
        List<RoleRepresentation> currentRoles = keycloak.realm(realm).users().get(userId)
                .roles().realmLevel().listAll();
        List<RoleRepresentation> appRolesToRemove = currentRoles.stream()
                .filter(r -> isAppRole(r.getName()))
                .collect(Collectors.toList());
        if (!appRolesToRemove.isEmpty()) {
            keycloak.realm(realm).users().get(userId).roles().realmLevel().remove(appRolesToRemove);
        }
        // Assign the new role
        assignRealmRole(keycloak, userId, newRole);
    }

    private boolean isAppRole(String roleName) {
        for (UserRole role : UserRole.values()) {
            if (toKeycloakRoleName(role).equalsIgnoreCase(roleName)) return true;
        }
        return false;
    }

    public void deleteUserInKeycloak(String keycloakId) {
        Keycloak keycloak = getAdminKeycloak();
        keycloak.realm(realm).users().get(keycloakId).remove();
    }
}
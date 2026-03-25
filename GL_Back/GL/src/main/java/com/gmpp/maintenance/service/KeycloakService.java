package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.UserDTO;
import com.gmpp.maintenance.enums.UserRole;
import lombok.RequiredArgsConstructor;
import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;


import jakarta.ws.rs.core.Response;
import java.util.Collections;

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
        user.setAttributes(Collections.singletonMap("role", Collections.singletonList(dto.getRole().name())));

        // Set password
        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(dto.getPassword());
        credential.setTemporary(false);
        user.setCredentials(Collections.singletonList(credential));

        UsersResource usersResource = keycloak.realm(realm).users();
        Response response = usersResource.create(user);

        if (response.getStatus() != 201) {
            throw new RuntimeException("Failed to create user in Keycloak: " + response.getStatus());
        }

        // Get the created user's ID
        String location = response.getHeaderString("Location");
        String userId = location.substring(location.lastIndexOf('/') + 1);
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
    }

    public void deleteUserInKeycloak(String keycloakId) {
        Keycloak keycloak = getAdminKeycloak();
        keycloak.realm(realm).users().get(keycloakId).remove();
    }
}
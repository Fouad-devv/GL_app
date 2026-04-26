package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.dto.UserDTO;
import com.gmpp.maintenance.enums.UserRole;
import com.gmpp.maintenance.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('admin')")
@Tag(name = "Utilisateurs", description = "Gestion des utilisateurs — réservé au rôle admin (sauf /me)")
public class UserController {

    private final UserService userService;

    @Operation(summary = "Profil de l'utilisateur connecté",
               description = "Accessible à tout utilisateur authentifié — ne nécessite pas le rôle admin.")
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserDTO> getCurrentUser(@AuthenticationPrincipal Jwt jwt) {
        String email = jwt.getClaimAsString("email");
        if (email == null) email = jwt.getClaimAsString("preferred_username");
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Lister tous les utilisateurs")
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Récupérer un utilisateur par ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Utilisateur trouvé"),
        @ApiResponse(responseCode = "404", description = "Utilisateur introuvable")
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Récupérer un utilisateur par email")
    @GetMapping("/email/{email}")
    public ResponseEntity<UserDTO> getUserByEmail(
            @Parameter(description = "Adresse email") @PathVariable String email) {
        UserDTO user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }

    @Operation(summary = "Créer un utilisateur")
    @ApiResponse(responseCode = "201", description = "Utilisateur créé")
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        UserDTO createdUser = userService.createUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    @Operation(summary = "Mettre à jour un utilisateur")
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id,
            @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUser(id, userDTO);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Supprimer un utilisateur")
    @ApiResponse(responseCode = "204", description = "Utilisateur supprimé")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @Parameter(description = "ID de l'utilisateur") @PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Utilisateurs filtrés par rôle")
    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserDTO>> getUsersByRole(
            @Parameter(description = "Rôle utilisateur") @PathVariable UserRole role) {
        List<UserDTO> users = userService.getUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Lister les utilisateurs actifs")
    @GetMapping("/active")
    public ResponseEntity<List<UserDTO>> getActiveUsers() {
        List<UserDTO> users = userService.getActiveUsers();
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Utilisateurs actifs filtrés par rôle")
    @GetMapping("/active/role/{role}")
    public ResponseEntity<List<UserDTO>> getActiveUsersByRole(
            @Parameter(description = "Rôle utilisateur") @PathVariable UserRole role) {
        List<UserDTO> users = userService.getActiveUsersByRole(role);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Rechercher des utilisateurs par mot-clé")
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchUsers(
            @Parameter(description = "Terme de recherche") @RequestParam("q") String search) {
        List<UserDTO> users = userService.searchUsers(search);
        return ResponseEntity.ok(users);
    }

    @Operation(summary = "Compter les utilisateurs par rôle")
    @GetMapping("/count/role/{role}")
    public ResponseEntity<Long> countUsersByRole(
            @Parameter(description = "Rôle utilisateur") @PathVariable UserRole role) {
        Long count = userService.countUsersByRole(role);
        return ResponseEntity.ok(count);
    }

    @Operation(summary = "Compter les utilisateurs actifs")
    @GetMapping("/count/active")
    public ResponseEntity<Long> countActiveUsers() {
        Long count = userService.countActiveUsers();
        return ResponseEntity.ok(count);
    }
}

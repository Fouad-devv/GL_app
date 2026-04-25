package com.gmpp.maintenance.service;

import com.gmpp.maintenance.dto.InterventionPhotoDTO;
import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.InterventionPhoto;
import com.gmpp.maintenance.repository.InterventionPhotoRepository;
import com.gmpp.maintenance.repository.InterventionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InterventionPhotoService {

    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/png", "image/webp", "image/gif"
    );

    private final InterventionPhotoRepository photoRepository;
    private final InterventionRepository interventionRepository;

    @Transactional
    public InterventionPhotoDTO uploadPhoto(Long interventionId, MultipartFile file) throws IOException {
        validateFile(file);

        Intervention intervention = interventionRepository.findById(interventionId)
            .orElseThrow(() -> new IllegalArgumentException("Intervention introuvable: " + interventionId));

        String safeName = sanitizeFilename(file.getOriginalFilename());

        InterventionPhoto photo = InterventionPhoto.builder()
            .intervention(intervention)
            .fileName(safeName)
            .contentType(file.getContentType())
            .data(file.getBytes())
            .uploadedAt(LocalDateTime.now())
            .build();

        return toDTO(photoRepository.save(photo));
    }

    public List<InterventionPhotoDTO> getPhotos(Long interventionId) {
        return photoRepository.findByInterventionIdOrderByUploadedAtDesc(interventionId)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public InterventionPhoto getPhotoData(Long photoId) {
        return photoRepository.findById(photoId)
            .orElseThrow(() -> new IllegalArgumentException("Photo introuvable: " + photoId));
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            throw new IllegalArgumentException("Photo introuvable: " + photoId);
        }
        photoRepository.deleteById(photoId);
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier est vide");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Le fichier dépasse la taille maximale autorisée (5 Mo)");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_TYPES.contains(contentType)) {
            throw new IllegalArgumentException("Type de fichier non autorisé. Formats acceptés: JPEG, PNG, WebP, GIF");
        }
    }

    private String sanitizeFilename(String original) {
        if (original == null || original.isBlank()) return "photo.jpg";
        // Keep only safe characters
        return original.replaceAll("[^a-zA-Z0-9._-]", "_").toLowerCase();
    }

    private InterventionPhotoDTO toDTO(InterventionPhoto p) {
        return InterventionPhotoDTO.builder()
            .id(p.getId())
            .interventionId(p.getIntervention().getId())
            .fileName(p.getFileName())
            .contentType(p.getContentType())
            .uploadedAt(p.getUploadedAt())
            .build();
    }
}

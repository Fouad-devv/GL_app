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
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InterventionPhotoService {

    private final InterventionPhotoRepository photoRepository;
    private final InterventionRepository interventionRepository;

    @Transactional
    public InterventionPhotoDTO uploadPhoto(Long interventionId, MultipartFile file) throws IOException {
        Intervention intervention = interventionRepository.findById(interventionId)
            .orElseThrow(() -> new RuntimeException("Intervention not found: " + interventionId));

        InterventionPhoto photo = InterventionPhoto.builder()
            .intervention(intervention)
            .fileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : "photo.jpg")
            .contentType(file.getContentType() != null ? file.getContentType() : "image/jpeg")
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
            .orElseThrow(() -> new RuntimeException("Photo not found: " + photoId));
    }

    @Transactional
    public void deletePhoto(Long photoId) {
        if (!photoRepository.existsById(photoId)) {
            throw new RuntimeException("Photo not found: " + photoId);
        }
        photoRepository.deleteById(photoId);
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

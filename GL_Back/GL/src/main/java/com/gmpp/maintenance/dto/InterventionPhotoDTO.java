package com.gmpp.maintenance.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterventionPhotoDTO {
    private Long id;
    private Long interventionId;
    private String fileName;
    private String contentType;
    private LocalDateTime uploadedAt;
}

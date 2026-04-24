package com.gmpp.maintenance.repository;

import com.gmpp.maintenance.entity.InterventionPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterventionPhotoRepository extends JpaRepository<InterventionPhoto, Long> {
    List<InterventionPhoto> findByInterventionIdOrderByUploadedAtDesc(Long interventionId);
}

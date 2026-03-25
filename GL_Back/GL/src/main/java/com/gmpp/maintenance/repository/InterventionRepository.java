package com.gmpp.maintenance.repository;

import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.MaintenancePoint;
import com.gmpp.maintenance.enums.InterventionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface InterventionRepository extends JpaRepository<Intervention, Long> {

    List<Intervention> findByStatus(InterventionStatus status);

    // If you still want to find by entity reference
    List<Intervention> findByMaintenancePoint(MaintenancePoint maintenancePoint);

    // Optional: find by Machine entity
    List<Intervention> findByMachine_Id(Long machineId); // _Id works for nested entity

    List<Intervention> findByTechnicianId(Long technicianId);

    List<Intervention> findByMaintenancePointId(Long maintenancePointId);

    List<Intervention> findByPlannedDateBetween(LocalDate startDate, LocalDate endDate);

    List<Intervention> findByStatusAndPlannedDateBetween(InterventionStatus status, LocalDate startDate, LocalDate endDate);

    @Query("SELECT i FROM Intervention i WHERE i.status = :status AND i.plannedDate <= :date")
    List<Intervention> findOverdueInterventions(@Param("status") InterventionStatus status, @Param("date") LocalDate date);

    Long countByStatus(InterventionStatus status);

    Long countByMachineId(Long machineId);

    @Query("SELECT COUNT(i) FROM Intervention i WHERE i.status = :status")
    Long countByStatusQuery(@Param("status") InterventionStatus status);
}
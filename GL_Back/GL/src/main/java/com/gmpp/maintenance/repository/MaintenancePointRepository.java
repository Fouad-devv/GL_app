package com.gmpp.maintenance.repository;

import com.gmpp.maintenance.entity.MaintenancePoint;
import com.gmpp.maintenance.enums.MaintenanceFrequency;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenancePointRepository extends JpaRepository<MaintenancePoint, Long> {

    List<MaintenancePoint> findByMachineId(Long machineId);

    List<MaintenancePoint> findByNextDueBefore(LocalDate date);

    List<MaintenancePoint> findByNextDueBetween(LocalDate startDate, LocalDate endDate);

    List<MaintenancePoint> findByFrequency(MaintenanceFrequency frequency);

    @Query("SELECT mp FROM MaintenancePoint mp WHERE mp.machine.id = :machineId AND mp.nextDue <= :date")
    List<MaintenancePoint> findOverdueByMachineId(@Param("machineId") Long machineId,
                                                  @Param("date") LocalDate date);

    Long countByMachineId(Long machineId);

    @Query("SELECT COUNT(mp) FROM MaintenancePoint mp WHERE mp.nextDue < :date")
    Long countOverdueMaintenancePoints(@Param("date") LocalDate date);
}

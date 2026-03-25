package com.gmpp.maintenance.repository;

import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.enums.MachineType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

    // ===== Pagination-enabled methods =====
    Page<Machine> findByStatus(MachineStatus status, Pageable pageable);

    Page<Machine> findByType(MachineType type, Pageable pageable);

    @Query("SELECT m FROM Machine m WHERE m.name LIKE %:search% OR m.serialNumber LIKE %:search% OR m.location LIKE %:search%")
    Page<Machine> searchMachines(@Param("search") String search, Pageable pageable);

    // ===== Non-paginated methods =====
    Optional<Machine> findBySerialNumber(String serialNumber);

    List<Machine> findByNameContainingIgnoreCase(String name);

    List<Machine> findByLocationContainingIgnoreCase(String location);

    List<Machine> findByType(MachineType type);

    List<Machine> findByStatusOrderByNameAsc(MachineStatus status);

    Long countByStatus(MachineStatus status);
}
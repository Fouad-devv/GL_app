package com.gmpp.maintenance.service;

import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.repository.InterventionRepository;
import com.gmpp.maintenance.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final MachineRepository machineRepository;
    private final InterventionRepository interventionRepository;

    // -----------------------------------------------------------------------
    // NEW: Methods required by the new frontend endpoints
    // -----------------------------------------------------------------------

    /**
     * GET /api/reports/interventions
     * Filters interventions by machineId and/or date range.
     */
    public byte[] generateInterventionHistoryReport(Long machineId, LocalDate startDate, LocalDate endDate) {
        List<Intervention> interventions = interventionRepository.findAll();

        interventions = interventions.stream()
                .filter(i -> machineId == null || (i.getMachine() != null && i.getMachine().getId().equals(machineId)))
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Machine ID,Maintenance Point ID,Technician ID,Planned Date,Actual Date,Status,Duration (min),Equipment State,Cost,Observations\n");

        for (Intervention i : interventions) {
            csv.append(i.getId()).append(",")
                    .append(i.getMachine() != null ? i.getMachine().getId() : "").append(",")
                    .append(i.getMaintenancePoint() != null ? i.getMaintenancePoint().getId() : "").append(",")
                    .append(i.getTechnician() != null ? i.getTechnician().getId() : "").append(",")
                    .append(i.getPlannedDate()).append(",")
                    .append(i.getActualDate()).append(",")
                    .append(i.getStatus()).append(",")
                    .append(i.getDurationMinutes()).append(",")
                    .append(i.getEquipmentState()).append(",")
                    .append(i.getCost()).append(",")
                    .append(escapeCsv(i.getObservations())).append("\n");
        }

        return csv.toString().getBytes();
    }

    /**
     * GET /api/reports/technician-performance
     * Filters interventions by technicianId and/or date range.
     */
    public byte[] generateTechnicianPerformanceReport(Long technicianId, LocalDate startDate, LocalDate endDate) {
        List<Intervention> interventions = interventionRepository.findAll();

        interventions = interventions.stream()
                .filter(i -> technicianId == null || (i.getTechnician() != null && i.getTechnician().getId().equals(technicianId)))
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());

        long total = interventions.size();
        long completed = interventions.stream().filter(i -> InterventionStatus.TERMINEE.equals(i.getStatus())).count();
        long delayed = interventions.stream().filter(i -> InterventionStatus.EN_RETARD.equals(i.getStatus())).count();
        double completionRate = total > 0 ? (completed * 100.0 / total) : 0;

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Machine ID,Planned Date,Actual Date,Status,Duration (min),Cost\n");

        for (Intervention i : interventions) {
            csv.append(i.getId()).append(",")
                    .append(i.getMachine() != null ? i.getMachine().getId() : "").append(",")
                    .append(i.getPlannedDate()).append(",")
                    .append(i.getActualDate()).append(",")
                    .append(i.getStatus()).append(",")
                    .append(i.getDurationMinutes()).append(",")
                    .append(i.getCost()).append("\n");
        }

        csv.append("\nSUMMARY\n");
        csv.append("Total Interventions,").append(total).append("\n");
        csv.append("Completed,").append(completed).append("\n");
        csv.append("Delayed,").append(delayed).append("\n");
        csv.append("Completion Rate,").append(String.format("%.2f%%", completionRate)).append("\n");

        return csv.toString().getBytes();
    }

    /**
     * GET /api/reports/consumables
     * Placeholder — no consumables entity yet. Returns an empty CSV shell.
     * Replace with real logic once the Consumable entity exists.
     */
    public byte[] generateConsumablesReport(LocalDate startDate, LocalDate endDate) {
        StringBuilder csv = new StringBuilder();
        csv.append("=== CONSUMABLES REPORT ===\n");
        csv.append("Report Date: ").append(LocalDate.now()).append("\n");
        csv.append("Period: ").append(startDate != null ? startDate : "N/A")
                .append(" to ").append(endDate != null ? endDate : "N/A").append("\n\n");
        csv.append("ID,Name,Category,Quantity Used,Unit Cost,Total Cost\n");
        csv.append("# No consumables data available yet\n");
        return csv.toString().getBytes();
    }

    /**
     * GET /api/reports/machine-availability
     * Counts machines per status within the given period.
     */
    public byte[] generateMachineAvailabilityReport(LocalDate startDate, LocalDate endDate) {
        List<Machine> machines = machineRepository.findAll();

        long total = machines.size();
        long inService = machines.stream().filter(m -> MachineStatus.EN_SERVICE.equals(m.getStatus())).count();
        long inMaintenance = machines.stream().filter(m -> MachineStatus.EN_MAINTENANCE.equals(m.getStatus())).count();
        long outOfService = machines.stream().filter(m -> MachineStatus.HORS_SERVICE.equals(m.getStatus())).count();
        long inRepair = machines.stream().filter(m -> MachineStatus.EN_REPARATION.equals(m.getStatus())).count();
        double availability = total > 0 ? (inService * 100.0 / total) : 0;

        StringBuilder csv = new StringBuilder();
        csv.append("=== MACHINE AVAILABILITY REPORT ===\n");
        csv.append("Report Date: ").append(LocalDate.now()).append("\n");
        csv.append("Period: ").append(startDate != null ? startDate : "N/A")
                .append(" to ").append(endDate != null ? endDate : "N/A").append("\n\n");
        csv.append("Status,Count\n");
        csv.append("EN_SERVICE,").append(inService).append("\n");
        csv.append("EN_MAINTENANCE,").append(inMaintenance).append("\n");
        csv.append("HORS_SERVICE,").append(outOfService).append("\n");
        csv.append("EN_REPARATION,").append(inRepair).append("\n");
        csv.append("TOTAL,").append(total).append("\n");
        csv.append("\nAvailability Rate,").append(String.format("%.2f%%", availability)).append("\n");

        return csv.toString().getBytes();
    }

    /**
     * GET /api/reports/maintenance-costs
     * Sums intervention costs, optionally filtered by date range.
     */
    public byte[] generateMaintenanceCostsReport(LocalDate startDate, LocalDate endDate) {
        List<Intervention> interventions = interventionRepository.findAll().stream()
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());

        double totalCost = interventions.stream()
                .mapToDouble(i -> i.getCost() != null ? i.getCost() : 0)
                .sum();

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Machine ID,Planned Date,Status,Duration (min),Cost\n");

        for (Intervention i : interventions) {
            csv.append(i.getId()).append(",")
                    .append(i.getMachine() != null ? i.getMachine().getId() : "").append(",")
                    .append(i.getPlannedDate()).append(",")
                    .append(i.getStatus()).append(",")
                    .append(i.getDurationMinutes()).append(",")
                    .append(i.getCost()).append("\n");
        }

        csv.append("\nTOTAL COST,").append(String.format("%.2f", totalCost)).append("\n");
        return csv.toString().getBytes();
    }

    /**
     * GET /api/reports/dashboard
     * Combined summary: machines + interventions + performance.
     */
    public byte[] generateDashboardReport(LocalDate startDate, LocalDate endDate) {
        StringBuilder report = new StringBuilder();
        report.append("=== DASHBOARD REPORT ===\n\n");
        report.append("Report Date: ").append(LocalDate.now()).append("\n");
        report.append("Period: ").append(startDate != null ? startDate : "N/A")
                .append(" to ").append(endDate != null ? endDate : "N/A").append("\n\n");

        // Machine stats
        Long totalMachines = machineRepository.count();
        Long operationalMachines = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
        report.append("=== MACHINES ===\n");
        report.append("Total: ").append(totalMachines).append("\n");
        report.append("Operational: ").append(operationalMachines).append("\n");
        report.append("Availability: ")
                .append(totalMachines != 0 ? String.format("%.2f%%", (operationalMachines.doubleValue() / totalMachines) * 100) : "N/A")
                .append("\n\n");

        // Intervention stats
        List<Intervention> interventions = interventionRepository.findAll().stream()
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());

        long total = interventions.size();
        long completed = interventions.stream().filter(i -> InterventionStatus.TERMINEE.equals(i.getStatus())).count();
        long delayed = interventions.stream().filter(i -> InterventionStatus.EN_RETARD.equals(i.getStatus())).count();
        double totalCost = interventions.stream().mapToDouble(i -> i.getCost() != null ? i.getCost() : 0).sum();

        report.append("=== INTERVENTIONS ===\n");
        report.append("Total: ").append(total).append("\n");
        report.append("Completed: ").append(completed).append("\n");
        report.append("Delayed: ").append(delayed).append("\n");
        report.append("Completion Rate: ")
                .append(total > 0 ? String.format("%.2f%%", (completed * 100.0 / total)) : "N/A").append("\n");
        report.append("Total Cost: ").append(String.format("%.2f MAD", totalCost)).append("\n");

        return report.toString().getBytes();
    }

    /**
     * GET /api/reports/export?dataType=machines|interventions|users|maintenance-points
     * Generic raw data export.
     */
    public byte[] generateExportData(String dataType) {
        switch (dataType.toLowerCase()) {
            case "machines":
                return generateMachineListReport();
            case "interventions":
                return generateInterventionListReport();
            case "users":
                // Placeholder — wire in UserRepository if needed
                return "ID,Full Name,Email,Role,Active\n# Users export not yet implemented\n".getBytes();
            case "maintenance-points":
                // Placeholder — wire in MaintenancePointRepository if needed
                return "ID,Name,Description,Machine ID\n# Maintenance points export not yet implemented\n".getBytes();
            default:
                return ("Unknown data type: " + dataType + "\n").getBytes();
        }
    }

    // -----------------------------------------------------------------------
    // ORIGINAL methods — kept unchanged
    // -----------------------------------------------------------------------

    public byte[] generateMachineListReport() {
        List<Machine> machines = machineRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Name,Type,Brand,Model,Serial Number,Status,Location\n");

        for (Machine machine : machines) {
            csv.append(machine.getId()).append(",")
                    .append(escapeCsv(machine.getName())).append(",")
                    .append(machine.getType()).append(",")
                    .append(escapeCsv(machine.getBrand())).append(",")
                    .append(escapeCsv(machine.getModel())).append(",")
                    .append(escapeCsv(machine.getSerialNumber())).append(",")
                    .append(machine.getStatus()).append(",")
                    .append(escapeCsv(machine.getLocation())).append("\n");
        }

        return csv.toString().getBytes();
    }

    public byte[] generateInterventionListReport() {
        List<Intervention> interventions = interventionRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Machine ID,Maintenance Point ID,Technician ID,Planned Date,Status,Equipment State,Cost\n");

        for (Intervention intervention : interventions) {
            csv.append(intervention.getId()).append(",")
                    .append(intervention.getMachine() != null ? intervention.getMachine().getId() : "").append(",")
                    .append(intervention.getMaintenancePoint() != null ? intervention.getMaintenancePoint().getId() : "").append(",")
                    .append(intervention.getTechnician() != null ? intervention.getTechnician().getId() : "").append(",")
                    .append(intervention.getPlannedDate()).append(",")
                    .append(intervention.getStatus()).append(",")
                    .append(intervention.getEquipmentState()).append(",")
                    .append(intervention.getCost()).append("\n");
        }

        return csv.toString().getBytes();
    }

    public byte[] generateMonthlyInterventionReport(YearMonth yearMonth) {
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        List<Intervention> interventions = interventionRepository.findByPlannedDateBetween(startDate, endDate);

        StringBuilder csv = new StringBuilder();
        csv.append("ID,Machine ID,Planned Date,Status,Duration (min),Cost\n");

        for (Intervention intervention : interventions) {
            csv.append(intervention.getId()).append(",")
                    .append(intervention.getMachine() != null ? intervention.getMachine().getId() : "").append(",")
                    .append(intervention.getPlannedDate()).append(",")
                    .append(intervention.getStatus()).append(",")
                    .append(intervention.getDurationMinutes()).append(",")
                    .append(intervention.getCost()).append("\n");
        }

        return csv.toString().getBytes();
    }

    public byte[] generateMachineHistoryReport(Long machineId) {
        List<Intervention> interventions = interventionRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Planned Date,Actual Date,Status,Duration (min),Equipment State,Cost,Observations\n");

        for (Intervention intervention : interventions) {
            if (intervention.getMachine() != null && intervention.getMachine().getId().equals(machineId)) {
                csv.append(intervention.getId()).append(",")
                        .append(intervention.getPlannedDate()).append(",")
                        .append(intervention.getActualDate()).append(",")
                        .append(intervention.getStatus()).append(",")
                        .append(intervention.getDurationMinutes()).append(",")
                        .append(intervention.getEquipmentState()).append(",")
                        .append(intervention.getCost()).append(",")
                        .append(escapeCsv(intervention.getObservations())).append("\n");
            }
        }

        return csv.toString().getBytes();
    }

    public byte[] generateTechnicianActivityReport(Long technicianId) {
        List<Intervention> interventions = interventionRepository.findAll();
        StringBuilder csv = new StringBuilder();
        csv.append("ID,Machine ID,Planned Date,Actual Date,Status,Duration (min),Cost\n");

        for (Intervention intervention : interventions) {
            if (intervention.getTechnician() != null && intervention.getTechnician().getId().equals(technicianId)) {
                csv.append(intervention.getId()).append(",")
                        .append(intervention.getMachine() != null ? intervention.getMachine().getId() : "").append(",")
                        .append(intervention.getPlannedDate()).append(",")
                        .append(intervention.getActualDate()).append(",")
                        .append(intervention.getStatus()).append(",")
                        .append(intervention.getDurationMinutes()).append(",")
                        .append(intervention.getCost()).append("\n");
            }
        }

        return csv.toString().getBytes();
    }

    public byte[] generatePerformanceAnalysisReport() {
        Long totalMachines = machineRepository.count();
        Long operationalMachines = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
        Long completedInterventions = interventionRepository.countByStatus(InterventionStatus.TERMINEE);
        Long totalInterventions = interventionRepository.count();
        Long delayedInterventions = interventionRepository.countByStatus(InterventionStatus.EN_RETARD);

        StringBuilder report = new StringBuilder();
        report.append("=== PERFORMANCE ANALYSIS REPORT ===\n\n");
        report.append("Report Date: ").append(LocalDate.now()).append("\n\n");

        report.append("MACHINE STATUS:\n");
        report.append("Total Machines: ").append(totalMachines).append("\n");
        report.append("Operational: ").append(operationalMachines).append("\n");
        report.append("Machine Availability: ")
                .append(totalMachines != 0 ? String.format("%.2f%%", (operationalMachines.doubleValue() / totalMachines) * 100) : "N/A")
                .append("\n\n");

        report.append("INTERVENTIONS:\n");
        report.append("Total Interventions: ").append(totalInterventions).append("\n");
        report.append("Completed: ").append(completedInterventions).append("\n");
        report.append("Delayed: ").append(delayedInterventions).append("\n");
        report.append("Implementation Rate: ")
                .append(totalInterventions != 0 ? String.format("%.2f%%", (completedInterventions.doubleValue() / totalInterventions) * 100) : "N/A")
                .append("\n");

        return report.toString().getBytes();
    }

    public byte[] generateComplianceReport() {
        Long totalInterventions = interventionRepository.count();
        Long completedOnTime = interventionRepository.findByStatus(InterventionStatus.TERMINEE).stream()
                .filter(i -> i.getActualDate() != null && !i.getActualDate().isAfter(i.getPlannedDate()))
                .count();

        StringBuilder report = new StringBuilder();
        report.append("=== COMPLIANCE REPORT ===\n\n");
        report.append("Report Date: ").append(LocalDate.now()).append("\n\n");
        report.append("Total Interventions: ").append(totalInterventions).append("\n");
        report.append("Completed On Time: ").append(completedOnTime).append("\n");
        report.append("Compliance Rate: ")
                .append(totalInterventions != 0 ? String.format("%.2f%%", (completedOnTime.doubleValue() / totalInterventions) * 100) : "N/A")
                .append("\n");

        return report.toString().getBytes();
    }

    public String generateCsvExport(String reportType) {
        switch (reportType.toLowerCase()) {
            case "machines":
                return new String(generateMachineListReport());
            case "interventions":
                return new String(generateInterventionListReport());
            case "performance":
                return new String(generatePerformanceAnalysisReport());
            case "compliance":
                return new String(generateComplianceReport());
            default:
                return "";
        }
    }

    // -----------------------------------------------------------------------
    // Helper
    // -----------------------------------------------------------------------

    /** Wraps a CSV field in quotes if it contains commas, quotes, or newlines. */
    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
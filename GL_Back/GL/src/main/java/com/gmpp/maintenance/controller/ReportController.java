package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    // -------------------------------------------------------------------
    // Endpoints called by the frontend "Générer un rapport" switch block
    // All date params are accepted as plain Strings and parsed manually
    // to avoid Spring MethodArgumentTypeMismatchException with "format" param.
    // -------------------------------------------------------------------

    /**
     * GET /api/reports/interventions?machineId=&startDate=&endDate=&format=
     */
    @GetMapping("/interventions")
    public ResponseEntity<byte[]> getInterventionHistory(
            @RequestParam(required = false) Long machineId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = reportService.generateInterventionHistoryReport(
                machineId, parseDate(startDate), parseDate(endDate));
        return buildCsvResponse(data, "intervention-history");
    }

    /**
     * GET /api/reports/technician-performance?technicianId=&startDate=&endDate=&format=
     */
    @GetMapping("/technician-performance")
    public ResponseEntity<byte[]> getTechnicianPerformance(
            @RequestParam(required = false) Long technicianId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = reportService.generateTechnicianPerformanceReport(
                technicianId, parseDate(startDate), parseDate(endDate));
        return buildCsvResponse(data, "technician-performance");
    }

    /**
     * GET /api/reports/consumables?startDate=&endDate=&format=
     * Placeholder — no consumables entity yet.
     */
    @GetMapping("/consumables")
    public ResponseEntity<byte[]> getConsumablesReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = reportService.generateConsumablesReport(
                parseDate(startDate), parseDate(endDate));
        return buildCsvResponse(data, "consumables");
    }

    /**
     * GET /api/reports/machine-availability?startDate=&endDate=&format=
     */
    @GetMapping("/machine-availability")
    public ResponseEntity<byte[]> getMachineAvailabilityReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = reportService.generateMachineAvailabilityReport(
                parseDate(startDate), parseDate(endDate));
        return buildCsvResponse(data, "machine-availability");
    }

    /**
     * GET /api/reports/maintenance-costs?startDate=&endDate=&format=
     */
    @GetMapping("/maintenance-costs")
    public ResponseEntity<byte[]> getMaintenanceCostsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = reportService.generateMaintenanceCostsReport(
                parseDate(startDate), parseDate(endDate));
        return buildCsvResponse(data, "maintenance-costs");
    }

    /**
     * GET /api/reports/dashboard?startDate=&endDate=&format=
     */
    @GetMapping("/dashboard")
    public ResponseEntity<byte[]> getDashboardReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "csv") String format) {
        byte[] data = reportService.generateDashboardReport(
                parseDate(startDate), parseDate(endDate));
        return buildTextResponse(data, "dashboard-report");
    }

    // -------------------------------------------------------------------
    // Endpoints called by "Exporter les données" section
    // -------------------------------------------------------------------

    /**
     * GET /api/reports/export?dataType=machines|interventions|users|maintenance-points&format=excel
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportData(
            @RequestParam String dataType,
            @RequestParam(required = false, defaultValue = "excel") String format) {
        byte[] data = reportService.generateExportData(dataType);
        return buildCsvResponse(data, dataType);
    }

    // -------------------------------------------------------------------
    // Original endpoints — kept unchanged
    // -------------------------------------------------------------------

    @GetMapping("/machines/export")
    public ResponseEntity<byte[]> exportMachinesList() {
        return buildCsvResponse(reportService.generateMachineListReport(), "machines");
    }

    @GetMapping("/interventions/export")
    public ResponseEntity<byte[]> exportInterventionsList() {
        return buildCsvResponse(reportService.generateInterventionListReport(), "interventions");
    }

    @GetMapping("/interventions/monthly/{yearMonth}")
    public ResponseEntity<byte[]> exportMonthlyInterventions(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth) {
        return buildCsvResponse(reportService.generateMonthlyInterventionReport(yearMonth),
                String.format("interventions-monthly-%s", yearMonth));
    }

    @GetMapping("/machine/{machineId}/history")
    public ResponseEntity<byte[]> exportMachineHistory(@PathVariable Long machineId) {
        return buildCsvResponse(reportService.generateMachineHistoryReport(machineId),
                String.format("machine-%d-history", machineId));
    }

    @GetMapping("/technician/{technicianId}/activity")
    public ResponseEntity<byte[]> exportTechnicianActivity(@PathVariable Long technicianId) {
        return buildCsvResponse(reportService.generateTechnicianActivityReport(technicianId),
                String.format("technician-%d-activity", technicianId));
    }

    @GetMapping("/performance")
    public ResponseEntity<byte[]> exportPerformanceAnalysis() {
        return buildTextResponse(reportService.generatePerformanceAnalysisReport(), "performance-analysis");
    }

    @GetMapping("/compliance")
    public ResponseEntity<byte[]> exportComplianceReport() {
        return buildTextResponse(reportService.generateComplianceReport(), "compliance-report");
    }

    // -------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------

    /**
     * Safely parses a yyyy-MM-dd string to LocalDate. Returns null if blank or unparseable.
     */
    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.isBlank()) return null;
        try {
            return LocalDate.parse(dateStr);
        } catch (DateTimeParseException e) {
            return null;
        }
    }

    private ResponseEntity<byte[]> buildCsvResponse(byte[] data, String fileName) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("text/csv"))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(fileName + ".csv").build().toString())
                .body(data);
    }

    private ResponseEntity<byte[]> buildTextResponse(byte[] data, String fileName) {
        return ResponseEntity.ok()
                .contentType(MediaType.TEXT_PLAIN)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(fileName + ".txt").build().toString())
                .body(data);
    }

    /**
     * Catches any unhandled exception in this controller and returns a
     * readable 500 with the root cause message — visible in the browser
     * Network tab response body instead of an empty blob.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        String message = "Report generation failed: " + ex.getClass().getSimpleName()
                + " — " + ex.getMessage();
        return ResponseEntity.internalServerError()
                .contentType(MediaType.TEXT_PLAIN)
                .body(message);
    }
}
package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeParseException;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('admin', 'responsable de maintenance', 'technicien')")
public class ReportController {

    private final ReportService reportService;

    // ───────────────────────────────────────────────────────────────────────────
    // Core export endpoints — all accept ?format=pdf|excel|csv  (default: pdf)
    // ───────────────────────────────────────────────────────────────────────────

    @GetMapping("/machines/export")
    public ResponseEntity<byte[]> exportMachines(
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generateMachineListReport(format), "machines", format);
    }

    @GetMapping("/interventions/export")
    public ResponseEntity<byte[]> exportInterventions(
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generateInterventionListReport(format), "interventions", format);
    }

    @GetMapping("/interventions/monthly/{yearMonth}")
    public ResponseEntity<byte[]> exportMonthlyInterventions(
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(
                reportService.generateMonthlyInterventionReport(yearMonth, format),
                "interventions-" + yearMonth, format);
    }

    @GetMapping("/machine/{machineId}/history")
    public ResponseEntity<byte[]> exportMachineHistory(
            @PathVariable Long machineId,
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(
                reportService.generateMachineHistoryReport(machineId, format),
                "machine-" + machineId + "-history", format);
    }

    @GetMapping("/technician/{technicianId}/activity")
    public ResponseEntity<byte[]> exportTechnicianActivity(
            @PathVariable Long technicianId,
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(
                reportService.generateTechnicianActivityReport(technicianId, format),
                "technician-" + technicianId + "-activity", format);
    }

    @GetMapping("/performance")
    public ResponseEntity<byte[]> exportPerformanceAnalysis(
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generatePerformanceAnalysisReport(format), "performance-analysis", format);
    }

    @GetMapping("/compliance")
    public ResponseEntity<byte[]> exportComplianceReport(
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generateComplianceReport(format), "compliance-report", format);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Legacy/filter endpoints (kept for backward compat, always return CSV)
    // ───────────────────────────────────────────────────────────────────────────

    @GetMapping("/interventions")
    public ResponseEntity<byte[]> getInterventionHistory(
            @RequestParam(required = false) Long machineId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        byte[] data = reportService.generateInterventionHistoryReport(
                machineId, parseDate(startDate), parseDate(endDate));
        return buildResponse(data, "intervention-history", "csv");
    }

    @GetMapping("/technician-performance")
    public ResponseEntity<byte[]> getTechnicianPerformance(
            @RequestParam(required = false) Long technicianId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        byte[] data = reportService.generateTechnicianPerformanceReport(
                technicianId, parseDate(startDate), parseDate(endDate));
        return buildResponse(data, "technician-performance", "csv");
    }

    @GetMapping("/consumables")
    public ResponseEntity<byte[]> getConsumablesReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateConsumablesReport(parseDate(startDate), parseDate(endDate)),
                "consumables", "csv");
    }

    @GetMapping("/machine-availability")
    public ResponseEntity<byte[]> getMachineAvailabilityReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateMachineAvailabilityReport(parseDate(startDate), parseDate(endDate)),
                "machine-availability", "csv");
    }

    @GetMapping("/maintenance-costs")
    public ResponseEntity<byte[]> getMaintenanceCostsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateMaintenanceCostsReport(parseDate(startDate), parseDate(endDate)),
                "maintenance-costs", "csv");
    }

    @GetMapping("/dashboard")
    public ResponseEntity<byte[]> getDashboardReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateDashboardReport(parseDate(startDate), parseDate(endDate)),
                "dashboard-report", "csv");
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportData(@RequestParam String dataType) {
        return buildResponse(reportService.generateExportData(dataType), dataType, "csv");
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Helpers
    // ───────────────────────────────────────────────────────────────────────────

    private ResponseEntity<byte[]> buildResponse(byte[] data, String baseName, String format) {
        String mimeType, ext;
        switch (format.toLowerCase()) {
            case "pdf"   -> { mimeType = "application/pdf"; ext = "pdf"; }
            case "excel" -> { mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; ext = "xlsx"; }
            default      -> { mimeType = "text/csv; charset=UTF-8"; ext = "csv"; }
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(mimeType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(baseName + "." + ext).build().toString())
                .body(data);
    }

    private LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try { return LocalDate.parse(s); } catch (DateTimeParseException e) { return null; }
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        return ResponseEntity.internalServerError()
                .contentType(MediaType.TEXT_PLAIN)
                .body("Report generation failed: " + ex.getClass().getSimpleName() + " — " + ex.getMessage());
    }
}

package com.gmpp.maintenance.controller;

import com.gmpp.maintenance.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Rapports", description = "Export de rapports — formats disponibles : pdf, excel, csv")
public class ReportController {

    private final ReportService reportService;

    // ───────────────────────────────────────────────────────────────────────────
    // Core export endpoints — all accept ?format=pdf|excel|csv  (default: pdf)
    // ───────────────────────────────────────────────────────────────────────────

    @Operation(summary = "Exporter la liste des machines")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/machines/export")
    public ResponseEntity<byte[]> exportMachines(
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generateMachineListReport(format), "machines", format);
    }

    @Operation(summary = "Exporter la liste des interventions")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/interventions/export")
    public ResponseEntity<byte[]> exportInterventions(
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generateInterventionListReport(format), "interventions", format);
    }

    @Operation(summary = "Exporter le rapport mensuel des interventions")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/interventions/monthly/{yearMonth}")
    public ResponseEntity<byte[]> exportMonthlyInterventions(
            @Parameter(description = "Mois au format yyyy-MM (ex : 2025-06)")
            @PathVariable @DateTimeFormat(pattern = "yyyy-MM") YearMonth yearMonth,
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(
                reportService.generateMonthlyInterventionReport(yearMonth, format),
                "interventions-" + yearMonth, format);
    }

    @Operation(summary = "Exporter l'historique d'une machine")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/machine/{machineId}/history")
    public ResponseEntity<byte[]> exportMachineHistory(
            @Parameter(description = "ID de la machine") @PathVariable Long machineId,
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(
                reportService.generateMachineHistoryReport(machineId, format),
                "machine-" + machineId + "-history", format);
    }

    @Operation(summary = "Exporter le rapport d'activité d'un technicien")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/technician/{technicianId}/activity")
    public ResponseEntity<byte[]> exportTechnicianActivity(
            @Parameter(description = "ID du technicien") @PathVariable Long technicianId,
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(
                reportService.generateTechnicianActivityReport(technicianId, format),
                "technician-" + technicianId + "-activity", format);
    }

    @Operation(summary = "Exporter l'analyse de performance")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/performance")
    public ResponseEntity<byte[]> exportPerformanceAnalysis(
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generatePerformanceAnalysisReport(format), "performance-analysis", format);
    }

    @Operation(summary = "Exporter le rapport de conformité")
    @ApiResponse(responseCode = "200", description = "Fichier généré (pdf/excel/csv)")
    @GetMapping("/compliance")
    public ResponseEntity<byte[]> exportComplianceReport(
            @Parameter(description = "Format de sortie : pdf, excel, csv (défaut : pdf)")
            @RequestParam(defaultValue = "pdf") String format) {
        return buildResponse(reportService.generateComplianceReport(format), "compliance-report", format);
    }

    // ───────────────────────────────────────────────────────────────────────────
    // Legacy/filter endpoints (kept for backward compat, always return CSV)
    // ───────────────────────────────────────────────────────────────────────────

    @Operation(summary = "Historique des interventions (CSV, filtrable)",
               description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/interventions")
    public ResponseEntity<byte[]> getInterventionHistory(
            @Parameter(description = "Filtrer par machine (optionnel)") @RequestParam(required = false) Long machineId,
            @Parameter(description = "Date de début yyyy-MM-dd (optionnel)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin yyyy-MM-dd (optionnel)") @RequestParam(required = false) String endDate) {
        byte[] data = reportService.generateInterventionHistoryReport(
                machineId, parseDate(startDate), parseDate(endDate));
        return buildResponse(data, "intervention-history", "csv");
    }

    @Operation(summary = "Performance des techniciens (CSV)", description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/technician-performance")
    public ResponseEntity<byte[]> getTechnicianPerformance(
            @Parameter(description = "ID du technicien (optionnel)") @RequestParam(required = false) Long technicianId,
            @Parameter(description = "Date de début yyyy-MM-dd (optionnel)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin yyyy-MM-dd (optionnel)") @RequestParam(required = false) String endDate) {
        byte[] data = reportService.generateTechnicianPerformanceReport(
                technicianId, parseDate(startDate), parseDate(endDate));
        return buildResponse(data, "technician-performance", "csv");
    }

    @Operation(summary = "Rapport des consommables (CSV)", description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/consumables")
    public ResponseEntity<byte[]> getConsumablesReport(
            @Parameter(description = "Date de début yyyy-MM-dd (optionnel)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin yyyy-MM-dd (optionnel)") @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateConsumablesReport(parseDate(startDate), parseDate(endDate)),
                "consumables", "csv");
    }

    @Operation(summary = "Disponibilité des machines (CSV)", description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/machine-availability")
    public ResponseEntity<byte[]> getMachineAvailabilityReport(
            @Parameter(description = "Date de début yyyy-MM-dd (optionnel)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin yyyy-MM-dd (optionnel)") @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateMachineAvailabilityReport(parseDate(startDate), parseDate(endDate)),
                "machine-availability", "csv");
    }

    @Operation(summary = "Coûts de maintenance (CSV)", description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/maintenance-costs")
    public ResponseEntity<byte[]> getMaintenanceCostsReport(
            @Parameter(description = "Date de début yyyy-MM-dd (optionnel)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin yyyy-MM-dd (optionnel)") @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateMaintenanceCostsReport(parseDate(startDate), parseDate(endDate)),
                "maintenance-costs", "csv");
    }

    @Operation(summary = "Rapport dashboard (CSV)", description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/dashboard")
    public ResponseEntity<byte[]> getDashboardReport(
            @Parameter(description = "Date de début yyyy-MM-dd (optionnel)") @RequestParam(required = false) String startDate,
            @Parameter(description = "Date de fin yyyy-MM-dd (optionnel)") @RequestParam(required = false) String endDate) {
        return buildResponse(
                reportService.generateDashboardReport(parseDate(startDate), parseDate(endDate)),
                "dashboard-report", "csv");
    }

    @Operation(summary = "Export générique par type de données (CSV)", description = "Endpoint legacy — retourne toujours du CSV.")
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportData(
            @Parameter(description = "Type de données à exporter") @RequestParam String dataType) {
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

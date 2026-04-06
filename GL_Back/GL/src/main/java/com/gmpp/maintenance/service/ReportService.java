package com.gmpp.maintenance.service;

import com.gmpp.maintenance.entity.Intervention;
import com.gmpp.maintenance.entity.Machine;
import com.gmpp.maintenance.enums.InterventionStatus;
import com.gmpp.maintenance.enums.MachineStatus;
import com.gmpp.maintenance.repository.InterventionRepository;
import com.gmpp.maintenance.repository.MachineRepository;
import com.lowagie.text.Chunk;
import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.VerticalAlignment;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFColor;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final MachineRepository machineRepository;
    private final InterventionRepository interventionRepository;

    // ─── Design tokens ───────────────────────────────────────────────────────
    private static final Color C_PRIMARY   = new Color(29,  78,  216); // #1d4ed8
    private static final Color C_EVEN      = new Color(241, 245, 249); // #f1f5f9
    private static final Color C_BORDER    = new Color(226, 232, 240); // #e2e8f0
    private static final Color C_TEXT      = new Color(30,  41,  59);  // #1e293b
    private static final Color C_MUTED     = new Color(100, 116, 139); // #64748b
    private static final Color C_SUCCESS   = new Color(22,  163, 74);  // #16a34a
    private static final Color C_WARNING   = new Color(217, 119, 6);   // #d97706
    private static final Color C_DANGER    = new Color(220, 38,  38);  // #dc2626
    private static final Color C_LIGHT_BLUE= new Color(219, 234, 254); // #dbeafe
    private static final Color C_LIGHT_GREEN=new Color(220, 252, 231); // #dcfce7

    private static final DateTimeFormatter DATE_FMT  = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final DateTimeFormatter MONTH_FMT = DateTimeFormatter.ofPattern("MMMM yyyy");

    // ─── Public routing methods ───────────────────────────────────────────────

    public byte[] generateMachineListReport(String format) {
        List<Machine> machines = machineRepository.findAll();
        return switch (fmt(format)) {
            case "pdf"   -> machinesPdf(machines);
            case "excel" -> machinesExcel(machines);
            default      -> machinesCsv(machines);
        };
    }

    public byte[] generateInterventionListReport(String format) {
        List<Intervention> list = interventionRepository.findAll();
        return switch (fmt(format)) {
            case "pdf"   -> interventionsPdf(list, "Liste des Interventions", null);
            case "excel" -> interventionsExcel(list, "Interventions");
            default      -> interventionsCsv(list);
        };
    }

    public byte[] generateMonthlyInterventionReport(YearMonth ym, String format) {
        List<Intervention> list = interventionRepository.findByPlannedDateBetween(ym.atDay(1), ym.atEndOfMonth());
        String title = "Interventions – " + ym.format(MONTH_FMT);
        return switch (fmt(format)) {
            case "pdf"   -> interventionsPdf(list, title, null);
            case "excel" -> interventionsExcel(list, ym.toString());
            default      -> interventionsCsv(list);
        };
    }

    public byte[] generateMachineHistoryReport(Long machineId, String format) {
        List<Intervention> list = interventionRepository.findAll().stream()
                .filter(i -> i.getMachine() != null && i.getMachine().getId().equals(machineId))
                .collect(Collectors.toList());
        String machineName = list.stream().findFirst()
                .map(i -> i.getMachine().getName()).orElse("Machine #" + machineId);
        return switch (fmt(format)) {
            case "pdf"   -> interventionsPdf(list, "Historique – " + machineName, "Machine : " + machineName);
            case "excel" -> interventionsExcel(list, "Machine " + machineId);
            default      -> interventionsCsv(list);
        };
    }

    public byte[] generateTechnicianActivityReport(Long technicianId, String format) {
        List<Intervention> list = interventionRepository.findAll().stream()
                .filter(i -> i.getTechnician() != null && i.getTechnician().getId().equals(technicianId))
                .collect(Collectors.toList());
        String techName = list.stream().findFirst()
                .map(i -> i.getTechnician().getFullName()).orElse("Technicien #" + technicianId);
        return switch (fmt(format)) {
            case "pdf"   -> interventionsPdf(list, "Activité – " + techName, "Technicien : " + techName);
            case "excel" -> interventionsExcel(list, "Technicien " + technicianId);
            default      -> interventionsCsv(list);
        };
    }

    public byte[] generatePerformanceAnalysisReport(String format) {
        return switch (fmt(format)) {
            case "pdf"   -> performancePdf();
            case "excel" -> performanceExcel();
            default      -> performanceCsv();
        };
    }

    public byte[] generateComplianceReport(String format) {
        return switch (fmt(format)) {
            case "pdf"   -> compliancePdf();
            case "excel" -> complianceExcel();
            default      -> complianceCsv();
        };
    }

    // ─── Backward-compat no-format overloads (default to csv) ────────────────

    public byte[] generateMachineListReport()                         { return generateMachineListReport("csv"); }
    public byte[] generateInterventionListReport()                    { return generateInterventionListReport("csv"); }
    public byte[] generateMonthlyInterventionReport(YearMonth ym)     { return generateMonthlyInterventionReport(ym, "csv"); }
    public byte[] generateMachineHistoryReport(Long id)               { return generateMachineHistoryReport(id, "csv"); }
    public byte[] generateTechnicianActivityReport(Long id)           { return generateTechnicianActivityReport(id, "csv"); }
    public byte[] generatePerformanceAnalysisReport()                 { return generatePerformanceAnalysisReport("csv"); }
    public byte[] generateComplianceReport()                          { return generateComplianceReport("csv"); }

    // ─── Legacy methods required by other controller endpoints ───────────────

    public byte[] generateInterventionHistoryReport(Long machineId, LocalDate startDate, LocalDate endDate) {
        List<Intervention> list = interventionRepository.findAll().stream()
                .filter(i -> machineId == null || (i.getMachine() != null && i.getMachine().getId().equals(machineId)))
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate   == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());
        return interventionsCsv(list);
    }

    public byte[] generateTechnicianPerformanceReport(Long techId, LocalDate startDate, LocalDate endDate) {
        List<Intervention> list = interventionRepository.findAll().stream()
                .filter(i -> techId == null || (i.getTechnician() != null && i.getTechnician().getId().equals(techId)))
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate   == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());
        return interventionsCsv(list);
    }

    public byte[] generateConsumablesReport(LocalDate startDate, LocalDate endDate) {
        return ("ID,Nom,Catégorie,Quantité,Coût unitaire,Coût total\n# Données non disponibles\n").getBytes();
    }

    public byte[] generateMachineAvailabilityReport(LocalDate startDate, LocalDate endDate) {
        List<Machine> machines = machineRepository.findAll();
        long total      = machines.size();
        long inService  = machines.stream().filter(m -> MachineStatus.EN_SERVICE.equals(m.getStatus())).count();
        long inMaint    = machines.stream().filter(m -> MachineStatus.EN_MAINTENANCE.equals(m.getStatus())).count();
        long outOfSvc   = machines.stream().filter(m -> MachineStatus.HORS_SERVICE.equals(m.getStatus())).count();
        long inRepair   = machines.stream().filter(m -> MachineStatus.EN_REPARATION.equals(m.getStatus())).count();
        double avail    = total > 0 ? (inService * 100.0 / total) : 0;
        return String.format("Statut,Nombre\nEN_SERVICE,%d\nEN_MAINTENANCE,%d\nHORS_SERVICE,%d\nEN_REPARATION,%d\nTOTAL,%d\n\nTaux de disponibilité,%.2f%%\n",
                inService, inMaint, outOfSvc, inRepair, total, avail).getBytes();
    }

    public byte[] generateMaintenanceCostsReport(LocalDate startDate, LocalDate endDate) {
        List<Intervention> list = interventionRepository.findAll().stream()
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate   == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());
        double total = list.stream().mapToDouble(i -> i.getCost() != null ? i.getCost() : 0).sum();
        StringBuilder csv = new StringBuilder("ID,Machine,Date Planifiée,Statut,Durée (min),Coût\n");
        list.forEach(i -> csv.append(i.getId()).append(",")
                .append(i.getMachine() != null ? i.getMachine().getName() : "").append(",")
                .append(i.getPlannedDate()).append(",")
                .append(i.getStatus()).append(",")
                .append(i.getDurationMinutes()).append(",")
                .append(i.getCost()).append("\n"));
        csv.append("\nCOÛT TOTAL,").append(String.format("%.2f MAD", total)).append("\n");
        return csv.toString().getBytes();
    }

    public byte[] generateDashboardReport(LocalDate startDate, LocalDate endDate) {
        Long totalM = machineRepository.count();
        Long opM    = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
        List<Intervention> list = interventionRepository.findAll().stream()
                .filter(i -> startDate == null || (i.getPlannedDate() != null && !i.getPlannedDate().isBefore(startDate)))
                .filter(i -> endDate   == null || (i.getPlannedDate() != null && !i.getPlannedDate().isAfter(endDate)))
                .collect(Collectors.toList());
        long total = list.size();
        long completed = list.stream().filter(i -> InterventionStatus.TERMINEE.equals(i.getStatus())).count();
        long delayed   = list.stream().filter(i -> InterventionStatus.EN_RETARD.equals(i.getStatus())).count();
        double cost    = list.stream().mapToDouble(i -> i.getCost() != null ? i.getCost() : 0).sum();
        return String.format("=== RAPPORT TABLEAU DE BORD ===\nDate : %s\n\nMACHINES\nTotal : %d\nOpérationnelles : %d\nDisponibilité : %s\n\nINTERVENTIONS\nTotal : %d\nTerminées : %d\nEn retard : %d\nTaux de complétion : %s\nCoût total : %.2f MAD\n",
                LocalDate.now().format(DATE_FMT), totalM, opM,
                totalM != 0 ? String.format("%.1f%%", opM.doubleValue() / totalM * 100) : "N/A",
                total, completed, delayed,
                total > 0 ? String.format("%.1f%%", completed * 100.0 / total) : "N/A",
                cost).getBytes();
    }

    public byte[] generateExportData(String dataType) {
        return switch (dataType.toLowerCase()) {
            case "machines"     -> generateMachineListReport("csv");
            case "interventions"-> generateInterventionListReport("csv");
            default             -> ("Type inconnu : " + dataType).getBytes();
        };
    }

    public String generateCsvExport(String reportType) {
        return switch (reportType.toLowerCase()) {
            case "machines"     -> new String(machinesCsv(machineRepository.findAll()));
            case "interventions"-> new String(interventionsCsv(interventionRepository.findAll()));
            default             -> "";
        };
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // MACHINE LIST — CSV / PDF / EXCEL
    // ═══════════════════════════════════════════════════════════════════════════

    private byte[] machinesCsv(List<Machine> machines) {
        StringBuilder sb = new StringBuilder("ID,Nom,Type,Marque,Modèle,N° Série,Statut,Localisation,Heures\n");
        machines.forEach(m -> sb
                .append(m.getId()).append(",")
                .append(csv(m.getName())).append(",")
                .append(m.getType()).append(",")
                .append(csv(m.getBrand())).append(",")
                .append(csv(m.getModel())).append(",")
                .append(csv(m.getSerialNumber())).append(",")
                .append(m.getStatus()).append(",")
                .append(csv(m.getLocation())).append(",")
                .append(m.getOperatingHours()).append("\n"));
        return sb.toString().getBytes();
    }

    private byte[] machinesPdf(List<Machine> machines) {
        try {
            Document doc = new Document(PageSize.A4.rotate(), 30, 30, 55, 40);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, baos);
            doc.open();
            pdfHeader(doc, "Liste des Machines",
                    machines.size() + " machine(s)  ·  Généré le " + LocalDate.now().format(DATE_FMT));

            String[] headers = {"ID", "Nom", "Type", "Marque", "Modèle", "N° Série", "Statut", "Localisation", "Heures"};
            float[] widths   = {28,  95, 80, 80, 80, 90, 80, 100, 50};
            PdfPTable table  = pdfTable(headers, widths);
            Font df = FontFactory.getFont(FontFactory.HELVETICA, 8, C_TEXT);

            int r = 0;
            for (Machine m : machines) {
                Color bg = (r++ % 2 == 0) ? Color.WHITE : C_EVEN;
                pdfCell(table, s(m.getId()),             df, bg, Element.ALIGN_CENTER);
                pdfCell(table, s(m.getName()),           df, bg, Element.ALIGN_LEFT);
                pdfCell(table, s(m.getType()),           df, bg, Element.ALIGN_CENTER);
                pdfCell(table, s(m.getBrand()),          df, bg, Element.ALIGN_LEFT);
                pdfCell(table, s(m.getModel()),          df, bg, Element.ALIGN_LEFT);
                pdfCell(table, s(m.getSerialNumber()),   df, bg, Element.ALIGN_LEFT);
                pdfCell(table, statusLbl(m.getStatus()), FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, machineStatusColor(m.getStatus())), bg, Element.ALIGN_CENTER);
                pdfCell(table, s(m.getLocation()),       df, bg, Element.ALIGN_LEFT);
                pdfCell(table, s(m.getOperatingHours()), df, bg, Element.ALIGN_RIGHT);
            }
            doc.add(table);
            pdfFooter(doc);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) { throw new RuntimeException("PDF generation failed", e); }
    }

    private byte[] machinesExcel(List<Machine> machines) {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            XSSFSheet sheet = wb.createSheet("Machines");
            String[] headers = {"ID", "Nom", "Type", "Marque", "Modèle", "N° Série", "Statut", "Localisation", "Heures"};
            excelTitle(sheet, wb, "Liste des Machines", headers.length);
            excelHeaderRow(sheet, headers, xlsHeaderStyle(wb), 1);

            XSSFCellStyle even = xlsEvenStyle(wb), odd = xlsOddStyle(wb);
            XSSFCellStyle evenN = xlsEvenNumStyle(wb), oddN = xlsOddNumStyle(wb);

            int row = 2;
            for (Machine m : machines) {
                Row r = sheet.createRow(row);
                boolean e = row % 2 == 0; row++;
                xlsCell(r, 0, m.getId(),                        e ? evenN : oddN);
                xlsCell(r, 1, s(m.getName()),                   e ? even  : odd);
                xlsCell(r, 2, s(m.getType()),                   e ? even  : odd);
                xlsCell(r, 3, s(m.getBrand()),                  e ? even  : odd);
                xlsCell(r, 4, s(m.getModel()),                  e ? even  : odd);
                xlsCell(r, 5, s(m.getSerialNumber()),           e ? even  : odd);
                xlsCell(r, 6, statusLbl(m.getStatus()),         e ? even  : odd);
                xlsCell(r, 7, s(m.getLocation()),               e ? even  : odd);
                xlsCell(r, 8, m.getOperatingHours() != null ? (double) m.getOperatingHours() : 0.0, e ? evenN : oddN);
            }
            autoSize(sheet, headers.length);
            return xlsBytes(wb);
        } catch (Exception e) { throw new RuntimeException("Excel generation failed", e); }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // INTERVENTIONS — CSV / PDF / EXCEL  (shared by 5 report types)
    // ═══════════════════════════════════════════════════════════════════════════

    private byte[] interventionsCsv(List<Intervention> list) {
        StringBuilder sb = new StringBuilder("ID,Machine,Technicien,Date Planifiée,Date Réelle,Statut,État Équipement,Durée (min),Coût (MAD)\n");
        list.forEach(i -> sb
                .append(i.getId()).append(",")
                .append(i.getMachine()    != null ? csv(i.getMachine().getName())             : "").append(",")
                .append(i.getTechnician() != null ? csv(i.getTechnician().getFullName())      : "").append(",")
                .append(i.getPlannedDate() != null ? i.getPlannedDate().format(DATE_FMT)      : "").append(",")
                .append(i.getActualDate()  != null ? i.getActualDate().format(DATE_FMT)       : "").append(",")
                .append(i.getStatus()).append(",")
                .append(i.getEquipmentState()).append(",")
                .append(i.getDurationMinutes()).append(",")
                .append(i.getCost()).append("\n"));
        return sb.toString().getBytes();
    }

    private byte[] interventionsPdf(List<Intervention> list, String title, String subtitle) {
        try {
            Document doc = new Document(PageSize.A4.rotate(), 30, 30, 55, 40);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, baos);
            doc.open();

            String subLine = (subtitle != null ? subtitle + "  ·  " : "")
                    + list.size() + " intervention(s)  ·  Généré le " + LocalDate.now().format(DATE_FMT);
            pdfHeader(doc, title, subLine);

            // KPI summary row
            long completed = list.stream().filter(i -> InterventionStatus.TERMINEE.equals(i.getStatus())).count();
            long delayed   = list.stream().filter(i -> InterventionStatus.EN_RETARD.equals(i.getStatus())).count();
            double cost    = list.stream().mapToDouble(i -> i.getCost() != null ? i.getCost() : 0).sum();
            pdfSummaryBar(doc, list.size(), completed, delayed, cost);

            String[] headers = {"ID", "Machine", "Technicien", "Date Planifiée", "Date Réelle", "Statut", "État Équip.", "Durée", "Coût (MAD)"};
            float[] widths   = {28, 95, 90, 72, 72, 80, 80, 48, 70};
            PdfPTable table  = pdfTable(headers, widths);
            Font df = FontFactory.getFont(FontFactory.HELVETICA, 7.5f, C_TEXT);

            int r = 0;
            for (Intervention i : list) {
                Color bg = (r++ % 2 == 0) ? Color.WHITE : C_EVEN;
                pdfCell(table, s(i.getId()),  df, bg, Element.ALIGN_CENTER);
                pdfCell(table, i.getMachine()    != null ? s(i.getMachine().getName())        : "", df, bg, Element.ALIGN_LEFT);
                pdfCell(table, i.getTechnician() != null ? s(i.getTechnician().getFullName()) : "", df, bg, Element.ALIGN_LEFT);
                pdfCell(table, i.getPlannedDate() != null ? i.getPlannedDate().format(DATE_FMT) : "", df, bg, Element.ALIGN_CENTER);
                pdfCell(table, i.getActualDate()  != null ? i.getActualDate().format(DATE_FMT)  : "-", df, bg, Element.ALIGN_CENTER);
                pdfCell(table, interventionStatusLbl(i.getStatus()),
                        FontFactory.getFont(FontFactory.HELVETICA_BOLD, 7, interventionStatusColor(i.getStatus())), bg, Element.ALIGN_CENTER);
                pdfCell(table, s(i.getEquipmentState()), df, bg, Element.ALIGN_CENTER);
                pdfCell(table, i.getDurationMinutes() != null ? i.getDurationMinutes() + " min" : "-", df, bg, Element.ALIGN_RIGHT);
                pdfCell(table, i.getCost() != null ? String.format("%.2f", i.getCost()) : "-", df, bg, Element.ALIGN_RIGHT);
            }
            doc.add(table);
            pdfFooter(doc);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) { throw new RuntimeException("PDF generation failed", e); }
    }

    private byte[] interventionsExcel(List<Intervention> list, String sheetName) {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            XSSFSheet sheet = wb.createSheet(sheetName);
            String[] headers = {"ID", "Machine", "Technicien", "Date Planifiée", "Date Réelle", "Statut", "État Équipement", "Durée (min)", "Coût (MAD)"};
            excelTitle(sheet, wb, sheetName, headers.length);
            excelHeaderRow(sheet, headers, xlsHeaderStyle(wb), 1);

            XSSFCellStyle even = xlsEvenStyle(wb), odd = xlsOddStyle(wb);
            XSSFCellStyle evenN = xlsEvenNumStyle(wb), oddN = xlsOddNumStyle(wb);

            int row = 2;
            for (Intervention i : list) {
                Row r = sheet.createRow(row);
                boolean e = row % 2 == 0; row++;
                xlsCell(r, 0, i.getId(),  e ? evenN : oddN);
                xlsCell(r, 1, i.getMachine()    != null ? s(i.getMachine().getName())        : "", e ? even : odd);
                xlsCell(r, 2, i.getTechnician() != null ? s(i.getTechnician().getFullName()) : "", e ? even : odd);
                xlsCell(r, 3, i.getPlannedDate() != null ? i.getPlannedDate().format(DATE_FMT) : "", e ? even : odd);
                xlsCell(r, 4, i.getActualDate()  != null ? i.getActualDate().format(DATE_FMT)  : "", e ? even : odd);
                xlsCell(r, 5, interventionStatusLbl(i.getStatus()),                e ? even  : odd);
                xlsCell(r, 6, s(i.getEquipmentState()),                            e ? even  : odd);
                xlsCell(r, 7, i.getDurationMinutes() != null ? (double) i.getDurationMinutes() : 0.0, e ? evenN : oddN);
                xlsCell(r, 8, i.getCost() != null ? i.getCost() : 0.0,            e ? evenN : oddN);
            }
            // Total row
            row++;
            Row totRow = sheet.createRow(row);
            XSSFCellStyle totStyle = xlsSummaryStyle(wb);
            long completed = list.stream().filter(i -> InterventionStatus.TERMINEE.equals(i.getStatus())).count();
            double totalCost = list.stream().mapToDouble(i -> i.getCost() != null ? i.getCost() : 0).sum();
            xlsCell(totRow, 0, "TOTAL",                             totStyle);
            xlsCell(totRow, 1, list.size() + " interventions",      totStyle);
            xlsCell(totRow, 2, completed + " terminées",            totStyle);
            for (int c = 3; c < 8; c++) xlsCell(totRow, c, "", totStyle);
            xlsCell(totRow, 8, totalCost, totStyle);

            autoSize(sheet, headers.length);
            return xlsBytes(wb);
        } catch (Exception e) { throw new RuntimeException("Excel generation failed", e); }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PERFORMANCE ANALYSIS — CSV / PDF / EXCEL
    // ═══════════════════════════════════════════════════════════════════════════

    private byte[] performanceCsv() {
        Long totalM = machineRepository.count();
        Long opM    = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
        Long totalI = interventionRepository.count();
        Long compI  = interventionRepository.countByStatus(InterventionStatus.TERMINEE);
        Long delayI = interventionRepository.countByStatus(InterventionStatus.EN_RETARD);
        return String.format(
                "=== ANALYSE DE PERFORMANCE ===\nDate : %s\n\nMACHINES\nTotal,%d\nOpérationnelles,%d\nDisponibilité,%.1f%%\n\nINTERVENTIONS\nTotal,%d\nTerminées,%d\nEn retard,%d\nTaux de complétion,%.1f%%\n",
                LocalDate.now().format(DATE_FMT), totalM, opM,
                totalM > 0 ? opM.doubleValue() / totalM * 100 : 0,
                totalI, compI, delayI,
                totalI > 0 ? compI.doubleValue() / totalI * 100 : 0
        ).getBytes();
    }

    private byte[] performancePdf() {
        try {
            Long totalM = machineRepository.count();
            Long opM    = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
            Long totalI = interventionRepository.count();
            Long compI  = interventionRepository.countByStatus(InterventionStatus.TERMINEE);
            Long delayI = interventionRepository.countByStatus(InterventionStatus.EN_RETARD);
            double availRate = totalM > 0 ? opM.doubleValue() / totalM * 100 : 0;
            double compRate  = totalI > 0 ? compI.doubleValue() / totalI * 100 : 0;

            Document doc = new Document(PageSize.A4, 50, 50, 60, 50);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, baos);
            doc.open();
            pdfHeader(doc, "Analyse de Performance", "Généré le " + LocalDate.now().format(DATE_FMT));

            // KPI boxes
            PdfPTable kpis = new PdfPTable(4);
            kpis.setWidthPercentage(100);
            kpis.setSpacingBefore(12f);
            kpis.setSpacingAfter(18f);
            pdfKpiBox(kpis, "Machines totales", s(totalM), C_PRIMARY);
            pdfKpiBox(kpis, "Disponibilité",    String.format("%.1f%%", availRate), availRate >= 80 ? C_SUCCESS : C_DANGER);
            pdfKpiBox(kpis, "Interventions",    s(totalI), C_PRIMARY);
            pdfKpiBox(kpis, "Taux complétion",  String.format("%.1f%%", compRate),  compRate  >= 75 ? C_SUCCESS : C_WARNING);
            doc.add(kpis);

            // Machine status table
            pdfSectionTitle(doc, "Statut des Machines");
            PdfPTable mt = pdfTable(new String[]{"Statut", "Nombre"}, new float[]{250, 100});
            Font df = FontFactory.getFont(FontFactory.HELVETICA, 9, C_TEXT);
            pdfCell(mt, "En service",    df, Color.WHITE, Element.ALIGN_LEFT);  pdfCell(mt, s(machineRepository.countByStatus(MachineStatus.EN_SERVICE)),    df, Color.WHITE, Element.ALIGN_CENTER);
            pdfCell(mt, "En maintenance",df, C_EVEN,       Element.ALIGN_LEFT); pdfCell(mt, s(machineRepository.countByStatus(MachineStatus.EN_MAINTENANCE)), df, C_EVEN,       Element.ALIGN_CENTER);
            pdfCell(mt, "Hors service",  df, Color.WHITE, Element.ALIGN_LEFT);  pdfCell(mt, s(machineRepository.countByStatus(MachineStatus.HORS_SERVICE)),   df, Color.WHITE, Element.ALIGN_CENTER);
            pdfCell(mt, "En réparation", df, C_EVEN,       Element.ALIGN_LEFT); pdfCell(mt, s(machineRepository.countByStatus(MachineStatus.EN_REPARATION)),  df, C_EVEN,       Element.ALIGN_CENTER);
            doc.add(mt);

            // Intervention status table
            pdfSectionTitle(doc, "Statut des Interventions");
            PdfPTable it = pdfTable(new String[]{"Statut", "Nombre"}, new float[]{250, 100});
            pdfCell(it, "Planifiées",  df, Color.WHITE, Element.ALIGN_LEFT); pdfCell(it, s(interventionRepository.countByStatus(InterventionStatus.PLANIFIEE)), df, Color.WHITE, Element.ALIGN_CENTER);
            pdfCell(it, "En cours",    df, C_EVEN,      Element.ALIGN_LEFT); pdfCell(it, s(interventionRepository.countByStatus(InterventionStatus.EN_COURS)),  df, C_EVEN,      Element.ALIGN_CENTER);
            pdfCell(it, "Terminées",   df, Color.WHITE, Element.ALIGN_LEFT); pdfCell(it, s(compI),  df, Color.WHITE, Element.ALIGN_CENTER);
            pdfCell(it, "Annulées",    df, C_EVEN,      Element.ALIGN_LEFT); pdfCell(it, s(interventionRepository.countByStatus(InterventionStatus.ANNULEE)),   df, C_EVEN,      Element.ALIGN_CENTER);
            pdfCell(it, "En retard",   df, Color.WHITE, Element.ALIGN_LEFT); pdfCell(it, s(delayI), df, Color.WHITE, Element.ALIGN_CENTER);
            doc.add(it);

            pdfFooter(doc);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) { throw new RuntimeException("PDF generation failed", e); }
    }

    private byte[] performanceExcel() {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            XSSFSheet sheet = wb.createSheet("Performance");
            Long totalM = machineRepository.count();
            Long opM    = machineRepository.countByStatus(MachineStatus.EN_SERVICE);
            Long totalI = interventionRepository.count();
            Long compI  = interventionRepository.countByStatus(InterventionStatus.TERMINEE);
            Long delayI = interventionRepository.countByStatus(InterventionStatus.EN_RETARD);
            double availRate = totalM > 0 ? opM.doubleValue() / totalM * 100 : 0;
            double compRate  = totalI > 0 ? compI.doubleValue() / totalI * 100 : 0;

            excelTitle(sheet, wb, "Analyse de Performance", 3);
            XSSFCellStyle hStyle = xlsHeaderStyle(wb);
            XSSFCellStyle even   = xlsEvenStyle(wb);
            XSSFCellStyle odd    = xlsOddStyle(wb);
            XSSFCellStyle evenN  = xlsEvenNumStyle(wb);
            XSSFCellStyle oddN   = xlsOddNumStyle(wb);

            // Machines section
            int row = 2;
            Row secRow = sheet.createRow(row++);
            XSSFCellStyle secStyle = xlsSectionStyle(wb);
            Cell sc = secRow.createCell(0); sc.setCellValue("MACHINES"); sc.setCellStyle(secStyle);
            excelHeaderRow(sheet, new String[]{"Indicateur", "Valeur", "Détail"}, hStyle, row++);

            Object[][] mData = {
                    {"Total machines", totalM, ""},
                    {"Opérationnelles", opM, ""},
                    {"En maintenance", machineRepository.countByStatus(MachineStatus.EN_MAINTENANCE), ""},
                    {"Hors service", machineRepository.countByStatus(MachineStatus.HORS_SERVICE), ""},
                    {"En réparation", machineRepository.countByStatus(MachineStatus.EN_REPARATION), ""},
                    {"Disponibilité", String.format("%.1f%%", availRate), availRate >= 80 ? "Bon" : "Attention"},
            };
            for (Object[] d : mData) {
                Row r = sheet.createRow(row);
                boolean e = row % 2 == 0; row++;
                xlsCell(r, 0, s(d[0]), e ? even : odd);
                xlsCell(r, 1, d[1] instanceof Long ? (double)(Long)d[1] : s(d[1]), e ? evenN : oddN);
                xlsCell(r, 2, s(d[2]), e ? even : odd);
            }

            row++;
            Row secRow2 = sheet.createRow(row++);
            Cell sc2 = secRow2.createCell(0); sc2.setCellValue("INTERVENTIONS"); sc2.setCellStyle(secStyle);
            excelHeaderRow(sheet, new String[]{"Indicateur", "Valeur", "Détail"}, hStyle, row++);

            Object[][] iData = {
                    {"Total interventions", totalI, ""},
                    {"Planifiées",  interventionRepository.countByStatus(InterventionStatus.PLANIFIEE), ""},
                    {"En cours",    interventionRepository.countByStatus(InterventionStatus.EN_COURS), ""},
                    {"Terminées",   compI, ""},
                    {"Annulées",    interventionRepository.countByStatus(InterventionStatus.ANNULEE), ""},
                    {"En retard",   delayI, ""},
                    {"Taux complétion", String.format("%.1f%%", compRate), compRate >= 75 ? "Bon" : "À améliorer"},
            };
            for (Object[] d : iData) {
                Row r = sheet.createRow(row);
                boolean e = row % 2 == 0; row++;
                xlsCell(r, 0, s(d[0]), e ? even : odd);
                xlsCell(r, 1, d[1] instanceof Long ? (double)(Long)d[1] : s(d[1]), e ? evenN : oddN);
                xlsCell(r, 2, s(d[2]), e ? even : odd);
            }
            autoSize(sheet, 3);
            return xlsBytes(wb);
        } catch (Exception e) { throw new RuntimeException("Excel generation failed", e); }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // COMPLIANCE REPORT — CSV / PDF / EXCEL
    // ═══════════════════════════════════════════════════════════════════════════

    private byte[] complianceCsv() {
        long totalI = interventionRepository.count();
        long onTime = interventionRepository.findByStatus(InterventionStatus.TERMINEE).stream()
                .filter(i -> i.getActualDate() != null && !i.getActualDate().isAfter(i.getPlannedDate()))
                .count();
        double rate = totalI > 0 ? onTime * 100.0 / totalI : 0;
        return String.format("=== RAPPORT DE CONFORMITÉ ===\nDate : %s\n\nTotal interventions,%d\nTerminées dans les délais,%d\nTaux de conformité,%.1f%%\n",
                LocalDate.now().format(DATE_FMT), totalI, onTime, rate).getBytes();
    }

    private byte[] compliancePdf() {
        try {
            long totalI  = interventionRepository.count();
            List<Intervention> terminated = interventionRepository.findByStatus(InterventionStatus.TERMINEE);
            long onTime  = terminated.stream().filter(i -> i.getActualDate() != null && !i.getActualDate().isAfter(i.getPlannedDate())).count();
            long late    = terminated.size() - onTime;
            double rate  = totalI > 0 ? onTime * 100.0 / totalI : 0;

            Document doc = new Document(PageSize.A4, 50, 50, 60, 50);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(doc, baos);
            doc.open();
            pdfHeader(doc, "Rapport de Conformité", "Généré le " + LocalDate.now().format(DATE_FMT));

            // KPI boxes
            PdfPTable kpis = new PdfPTable(3);
            kpis.setWidthPercentage(100);
            kpis.setSpacingBefore(12f);
            kpis.setSpacingAfter(18f);
            pdfKpiBox(kpis, "Total interventions", s(totalI), C_PRIMARY);
            pdfKpiBox(kpis, "Dans les délais",     s(onTime), C_SUCCESS);
            pdfKpiBox(kpis, "Taux de conformité",  String.format("%.1f%%", rate), rate >= 80 ? C_SUCCESS : rate >= 60 ? C_WARNING : C_DANGER);
            doc.add(kpis);

            pdfSectionTitle(doc, "Détail des Interventions Terminées");
            PdfPTable dt = pdfTable(new String[]{"Métrique", "Valeur"}, new float[]{250, 100});
            Font df = FontFactory.getFont(FontFactory.HELVETICA, 9, C_TEXT);
            pdfCell(dt, "Terminées dans les délais", df, Color.WHITE, Element.ALIGN_LEFT); pdfCell(dt, s(onTime), df, Color.WHITE, Element.ALIGN_CENTER);
            pdfCell(dt, "Terminées en retard",       df, C_EVEN,      Element.ALIGN_LEFT); pdfCell(dt, s(late),   df, C_EVEN,      Element.ALIGN_CENTER);
            pdfCell(dt, "Total interventions",        df, Color.WHITE, Element.ALIGN_LEFT); pdfCell(dt, s(totalI), df, Color.WHITE, Element.ALIGN_CENTER);
            pdfCell(dt, "Taux de conformité",         df, C_EVEN,      Element.ALIGN_LEFT); pdfCell(dt, String.format("%.1f%%", rate), df, C_EVEN, Element.ALIGN_CENTER);
            doc.add(dt);
            pdfFooter(doc);
            doc.close();
            return baos.toByteArray();
        } catch (Exception e) { throw new RuntimeException("PDF generation failed", e); }
    }

    private byte[] complianceExcel() {
        try (XSSFWorkbook wb = new XSSFWorkbook()) {
            XSSFSheet sheet = wb.createSheet("Conformité");
            long totalI = interventionRepository.count();
            List<Intervention> terminated = interventionRepository.findByStatus(InterventionStatus.TERMINEE);
            long onTime = terminated.stream().filter(i -> i.getActualDate() != null && !i.getActualDate().isAfter(i.getPlannedDate())).count();
            double rate = totalI > 0 ? onTime * 100.0 / totalI : 0;

            excelTitle(sheet, wb, "Rapport de Conformité", 2);
            excelHeaderRow(sheet, new String[]{"Indicateur", "Valeur"}, xlsHeaderStyle(wb), 1);

            XSSFCellStyle even = xlsEvenStyle(wb), odd = xlsOddStyle(wb);
            XSSFCellStyle evenN = xlsEvenNumStyle(wb), oddN = xlsOddNumStyle(wb);
            Object[][] data = {
                    {"Total interventions", (double) totalI},
                    {"Terminées dans les délais", (double) onTime},
                    {"Terminées en retard", (double)(terminated.size() - onTime)},
                    {"Taux de conformité (%)", rate},
            };
            int row = 2;
            for (Object[] d : data) {
                Row r = sheet.createRow(row);
                boolean e = row % 2 == 0; row++;
                xlsCell(r, 0, s(d[0]),       e ? even  : odd);
                xlsCell(r, 1, (Double) d[1], e ? evenN : oddN);
            }
            autoSize(sheet, 2);
            return xlsBytes(wb);
        } catch (Exception e) { throw new RuntimeException("Excel generation failed", e); }
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // PDF HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    private void pdfHeader(Document doc, String title, String subtitle) throws DocumentException {
        PdfPTable banner = new PdfPTable(1);
        banner.setWidthPercentage(100);
        banner.setSpacingAfter(14f);
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(C_PRIMARY);
        cell.setPadding(12f);
        cell.setBorder(Rectangle.NO_BORDER);
        Paragraph p = new Paragraph(title, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 15, Color.WHITE));
        p.setAlignment(Element.ALIGN_LEFT);
        cell.addElement(p);
        if (subtitle != null && !subtitle.isBlank()) {
            Paragraph sub = new Paragraph(subtitle, FontFactory.getFont(FontFactory.HELVETICA, 8, new Color(186, 230, 253)));
            sub.setSpacingBefore(3f);
            cell.addElement(sub);
        }
        banner.addCell(cell);
        doc.add(banner);
    }

    private void pdfSectionTitle(Document doc, String text) throws DocumentException {
        Paragraph p = new Paragraph(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, C_PRIMARY));
        p.setSpacingBefore(14f);
        p.setSpacingAfter(5f);
        doc.add(p);
    }

    private PdfPTable pdfTable(String[] headers, float[] widths) throws DocumentException {
        PdfPTable table = new PdfPTable(headers.length);
        table.setWidthPercentage(100);
        table.setWidths(widths);
        table.setSpacingBefore(4f);
        table.setHeaderRows(1);
        Font hf = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 8, Color.WHITE);
        for (String h : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(h, hf));
            cell.setBackgroundColor(C_PRIMARY);
            cell.setPadding(7f);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
            cell.setBorderColor(new Color(30, 58, 138));
            table.addCell(cell);
        }
        return table;
    }

    private void pdfCell(PdfPTable table, String text, Font font, Color bg, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text != null ? text : "", font));
        cell.setBackgroundColor(bg);
        cell.setPadding(5f);
        cell.setHorizontalAlignment(align);
        cell.setVerticalAlignment(Element.ALIGN_MIDDLE);
        cell.setBorderColor(C_BORDER);
        cell.setBorderWidth(0.4f);
        table.addCell(cell);
    }

    private void pdfSummaryBar(Document doc, long total, long completed, long delayed, double cost) throws DocumentException {
        PdfPTable t = new PdfPTable(4);
        t.setWidthPercentage(100);
        t.setSpacingAfter(10f);
        Font lf = FontFactory.getFont(FontFactory.HELVETICA, 7, C_MUTED);
        Font vf = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, C_TEXT);
        pdfSummaryBox(t, "Total",      String.valueOf(total),       lf, vf, new Color(239, 246, 255));
        pdfSummaryBox(t, "Terminées",  String.valueOf(completed),   lf, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, C_SUCCESS), C_LIGHT_GREEN);
        pdfSummaryBox(t, "En retard",  String.valueOf(delayed),     lf, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13, C_DANGER),  new Color(254, 242, 242));
        pdfSummaryBox(t, "Coût total", String.format("%.2f MAD", cost), lf, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, C_TEXT), new Color(255, 251, 235));
        doc.add(t);
    }

    private void pdfSummaryBox(PdfPTable t, String label, String value, Font lf, Font vf, Color bg) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(bg);
        cell.setPadding(9f);
        cell.setBorderColor(C_BORDER);
        cell.setBorderWidth(1f);
        Paragraph p = new Paragraph();
        p.add(new Chunk(value + "\n", vf));
        p.add(new Chunk(label, lf));
        cell.addElement(p);
        t.addCell(cell);
    }

    private void pdfKpiBox(PdfPTable t, String label, String value, Color accent) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(Color.WHITE);
        cell.setPadding(12f);
        cell.setBorderColor(accent);
        cell.setBorderWidth(2f);
        Paragraph p = new Paragraph();
        p.add(new Chunk(value + "\n", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, accent)));
        p.add(new Chunk(label, FontFactory.getFont(FontFactory.HELVETICA, 8, C_MUTED)));
        p.setAlignment(Element.ALIGN_CENTER);
        cell.addElement(p);
        t.addCell(cell);
    }

    private void pdfFooter(Document doc) throws DocumentException {
        Paragraph p = new Paragraph(
                "GMPP Maintenance  ·  " + LocalDate.now().format(DATE_FMT),
                FontFactory.getFont(FontFactory.HELVETICA, 7, C_MUTED));
        p.setAlignment(Element.ALIGN_CENTER);
        p.setSpacingBefore(16f);
        doc.add(p);
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // EXCEL HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    private XSSFCellStyle xlsHeaderStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        XSSFFont f = wb.createFont();
        f.setBold(true); f.setFontHeightInPoints((short) 10);
        f.setColor(IndexedColors.WHITE.getIndex());
        s.setFont(f);
        s.setFillForegroundColor(new XSSFColor(new byte[]{(byte)29,(byte)78,(byte)216}, null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setAlignment(HorizontalAlignment.CENTER);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        xlsBorders(s, BorderStyle.THIN, new XSSFColor(new byte[]{(byte)30,(byte)58,(byte)138}, null));
        return s;
    }

    private XSSFCellStyle xlsEvenStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        s.setFillForegroundColor(new XSSFColor(new byte[]{(byte)241,(byte)245,(byte)249}, null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        xlsBorders(s, BorderStyle.THIN, new XSSFColor(new byte[]{(byte)226,(byte)232,(byte)240}, null));
        return s;
    }

    private XSSFCellStyle xlsOddStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        xlsBorders(s, BorderStyle.THIN, new XSSFColor(new byte[]{(byte)226,(byte)232,(byte)240}, null));
        return s;
    }

    private XSSFCellStyle xlsEvenNumStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = xlsEvenStyle(wb); s.setAlignment(HorizontalAlignment.RIGHT); return s;
    }

    private XSSFCellStyle xlsOddNumStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = xlsOddStyle(wb);  s.setAlignment(HorizontalAlignment.RIGHT); return s;
    }

    private XSSFCellStyle xlsSummaryStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        XSSFFont f = wb.createFont(); f.setBold(true); f.setFontHeightInPoints((short) 10); s.setFont(f);
        s.setFillForegroundColor(new XSSFColor(new byte[]{(byte)219,(byte)234,(byte)254}, null));
        s.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        xlsBorders(s, BorderStyle.MEDIUM, new XSSFColor(new byte[]{(byte)147,(byte)197,(byte)253}, null));
        return s;
    }

    private XSSFCellStyle xlsSectionStyle(XSSFWorkbook wb) {
        XSSFCellStyle s = wb.createCellStyle();
        XSSFFont f = wb.createFont(); f.setBold(true); f.setFontHeightInPoints((short) 11);
        f.setColor(new XSSFColor(new byte[]{(byte)29,(byte)78,(byte)216}, null));
        s.setFont(f);
        s.setVerticalAlignment(VerticalAlignment.CENTER);
        return s;
    }

    private void xlsBorders(XSSFCellStyle s, BorderStyle bs, XSSFColor color) {
        s.setBorderBottom(bs); s.setBorderTop(bs); s.setBorderLeft(bs); s.setBorderRight(bs);
        s.setBottomBorderColor(color); s.setTopBorderColor(color);
        s.setLeftBorderColor(color);   s.setRightBorderColor(color);
    }

    private void excelTitle(XSSFSheet sheet, XSSFWorkbook wb, String title, int cols) {
        Row r = sheet.createRow(0); r.setHeightInPoints(28);
        Cell c = r.createCell(0);
        c.setCellValue(title + "  ·  Généré le " + LocalDate.now().format(DATE_FMT));
        XSSFCellStyle s = wb.createCellStyle();
        XSSFFont f = wb.createFont(); f.setBold(true); f.setFontHeightInPoints((short) 13);
        f.setColor(new XSSFColor(new byte[]{(byte)29,(byte)78,(byte)216}, null));
        s.setFont(f); s.setVerticalAlignment(VerticalAlignment.CENTER);
        c.setCellStyle(s);
        if (cols > 1) sheet.addMergedRegion(new CellRangeAddress(0, 0, 0, cols - 1));
    }

    private void excelHeaderRow(XSSFSheet sheet, String[] headers, XSSFCellStyle style, int rowIdx) {
        Row r = sheet.createRow(rowIdx); r.setHeightInPoints(20);
        for (int i = 0; i < headers.length; i++) {
            Cell c = r.createCell(i); c.setCellValue(headers[i]); c.setCellStyle(style);
        }
    }

    private void xlsCell(Row row, int col, Object value, CellStyle style) {
        Cell c = row.createCell(col);
        if      (value instanceof Long)    c.setCellValue((Long) value);
        else if (value instanceof Double)  c.setCellValue((Double) value);
        else if (value instanceof Integer) c.setCellValue((Integer) value);
        else                               c.setCellValue(value != null ? value.toString() : "");
        c.setCellStyle(style);
    }

    private void autoSize(XSSFSheet sheet, int cols) {
        for (int i = 0; i < cols; i++) {
            sheet.autoSizeColumn(i);
            sheet.setColumnWidth(i, Math.min(sheet.getColumnWidth(i) + 1024, 16000));
        }
    }

    private byte[] xlsBytes(XSSFWorkbook wb) throws Exception {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        wb.write(b); return b.toByteArray();
    }

    // ═══════════════════════════════════════════════════════════════════════════
    // LABEL / COLOR HELPERS
    // ═══════════════════════════════════════════════════════════════════════════

    private String statusLbl(Object status) {
        if (status == null) return "";
        return switch (status.toString()) {
            case "EN_SERVICE"     -> "En service";
            case "EN_MAINTENANCE" -> "En maintenance";
            case "HORS_SERVICE"   -> "Hors service";
            case "EN_REPARATION"  -> "En réparation";
            default               -> status.toString();
        };
    }

    private String interventionStatusLbl(Object status) {
        if (status == null) return "";
        return switch (status.toString()) {
            case "PLANIFIEE" -> "Planifiée";
            case "EN_COURS"  -> "En cours";
            case "TERMINEE"  -> "Terminée";
            case "ANNULEE"   -> "Annulée";
            case "EN_RETARD" -> "En retard";
            default          -> status.toString();
        };
    }

    private Color machineStatusColor(Object status) {
        if (status == null) return C_MUTED;
        return switch (status.toString()) {
            case "EN_SERVICE"     -> C_SUCCESS;
            case "EN_MAINTENANCE" -> C_WARNING;
            case "EN_REPARATION"  -> C_DANGER;
            default               -> C_MUTED;
        };
    }

    private Color interventionStatusColor(Object status) {
        if (status == null) return C_MUTED;
        return switch (status.toString()) {
            case "TERMINEE"  -> C_SUCCESS;
            case "EN_COURS", "PLANIFIEE" -> C_WARNING;
            case "EN_RETARD" -> C_DANGER;
            default          -> C_MUTED;
        };
    }

    private String s(Object o)    { return o == null ? "" : o.toString(); }
    private String fmt(String f)  { return f == null ? "csv" : f.toLowerCase(); }

    private String csv(String v) {
        if (v == null) return "";
        if (v.contains(",") || v.contains("\"") || v.contains("\n"))
            return "\"" + v.replace("\"", "\"\"") + "\"";
        return v;
    }
}

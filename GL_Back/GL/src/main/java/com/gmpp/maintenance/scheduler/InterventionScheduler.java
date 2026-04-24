package com.gmpp.maintenance.scheduler;

import com.gmpp.maintenance.service.InterventionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class InterventionScheduler {

    private final InterventionService interventionService;

    /**
     * Every day at 00:05 — marks PLANIFIEE interventions whose plannedDate
     * is strictly before today as EN_RETARD.
     */
    @Scheduled(cron = "0 5 0 * * *")
    public void markOverdueInterventions() {
        int updated = interventionService.markOverdueInterventions();
        if (updated > 0) {
            log.info("[Scheduler] {} intervention(s) passée(s) en EN_RETARD", updated);
        }
    }
}

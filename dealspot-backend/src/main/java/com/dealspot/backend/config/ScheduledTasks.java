package com.dealspot.backend.config;

import com.dealspot.backend.service.BadgeService;
import com.dealspot.backend.service.CoupDeCoeurService;
import com.dealspot.backend.service.OffreService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduledTasks {
    
    private static final Logger logger = LoggerFactory.getLogger(ScheduledTasks.class);
    
    @Autowired
    private OffreService offreService;
    
    @Autowired
    private BadgeService badgeService;
    
    @Autowired
    private CoupDeCoeurService coupDeCoeurService;
    
    // Suppression des offres expirées - Toutes les heures
    @Scheduled(cron = "0 0 * * * *")
    public void deleteExpiredOffres() {
        logger.info("🗑️ Début de la suppression des offres expirées");
        offreService.deleteExpiredOffres();
        logger.info("✅ Suppression des offres expirées terminée");
    }
    
    // Mise à jour des badges - Tous les jours à 3h du matin
    @Scheduled(cron = "0 0 3 * * *")
    public void updateBadges() {
        logger.info("🏆 Début de la mise à jour des badges");
        badgeService.updateAllBadges();
        logger.info("✅ Mise à jour des badges terminée");
    }
    
    // Mise à jour des coups de cœur - Toutes les 6 heures
    @Scheduled(cron = "0 0 */6 * * *")
    public void updateCoupsDeCoeur() {
        logger.info("💖 Début de la mise à jour des coups de cœur");
        coupDeCoeurService.updateCoupsDeCoeur();
        logger.info("✅ Mise à jour des coups de cœur terminée");
    }
}
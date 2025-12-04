package com.dealspot.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.dealspot.backend.entity.RapportVendor;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.RapportVendorRepository;
import com.dealspot.backend.repository.UserRepository;
import com.dealspot.backend.repository.OffreRepository;
import com.dealspot.backend.repository.FavoriRepository;
import com.dealspot.backend.repository.OffreSuppressionLogRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RapportService {

    @Autowired
    private RapportVendorRepository rapportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OffreRepository offreRepository;

    @Autowired
    private FavoriRepository favoriRepository;
    
    @Autowired
    private OffreSuppressionLogRepository suppressionLogRepository;

    @Scheduled(cron = "0 0 8 * * MON")
    @Transactional
    public void genererRapportsHebdomadaires() {
        System.out.println("🕐 [" + LocalDateTime.now() + "] Génération rapports hebdomadaires...");

        List<User> vendors = userRepository.findByRole(User.Role.VENDEUR);

        int rapportsGeneres = 0;
        for (User vendor : vendors) {
            try {
                genererRapport(vendor, "SEMAINE");
                rapportsGeneres++;
            } catch (Exception e) {
                System.err.println("❌ Erreur rapport vendeur " + vendor.getId() + ": " + e.getMessage());
            }
        }

        System.out.println("✅ " + rapportsGeneres + " rapports hebdomadaires générés");
    }

    @Scheduled(cron = "0 0 8 1 * ?")
    @Transactional
    public void genererRapportsMensuels() {
        System.out.println("🕐 [" + LocalDateTime.now() + "] Génération rapports mensuels...");

        List<User> vendors = userRepository.findByRole(User.Role.VENDEUR);

        int rapportsGeneres = 0;
        for (User vendor : vendors) {
            try {
                genererRapport(vendor, "MOIS");
                rapportsGeneres++;
            } catch (Exception e) {
                System.err.println("❌ Erreur rapport vendeur " + vendor.getId() + ": " + e.getMessage());
            }
        }

        System.out.println("✅ " + rapportsGeneres + " rapports mensuels générés");
    }

    @Transactional
    public RapportVendor genererRapport(User vendor, String periode) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime dateDebut;
        
        // Calculer la période
        if ("SEMAINE".equals(periode)) {
            dateDebut = now.minusWeeks(1);
        } else {
            dateDebut = now.minusMonths(1);
        }
        
        int totalOffres = offreRepository.findByUser(vendor).size();

        long totalVues = offreRepository.findByUser(vendor).stream()
            .mapToLong(o -> o.getVues() != null ? o.getVues() : 0L)
            .sum();

        long totalFavoris = favoriRepository.countByVendeur(vendor);
        
        // Nouvelles statistiques
        Integer offresCreees = offreRepository.countOffresCreees(vendor, dateDebut, now);
        Integer offresSupprimees = suppressionLogRepository.countOffresSupprimees(vendor, dateDebut, now);
        Integer offresExpirees = offreRepository.countOffresExpirees(vendor, dateDebut, now);

        RapportVendor rapport = new RapportVendor();
        rapport.setVendor(vendor);
        rapport.setDateGeneration(LocalDateTime.now());
        rapport.setPeriode(periode);
        rapport.setTotalOffres(totalOffres);
        rapport.setTotalVues((int) totalVues);
        rapport.setTotalFavoris((int) totalFavoris);
        rapport.setOffresCreees(offresCreees != null ? offresCreees : 0);
        rapport.setOffresSupprimees(offresSupprimees != null ? offresSupprimees : 0);
        rapport.setOffresExpirees(offresExpirees != null ? offresExpirees : 0);

        return rapportRepository.save(rapport);
    }

    public List<RapportVendor> getRapportsVendor(Long vendorId) {
        return rapportRepository.findByVendorIdOrderByDateGenerationDesc(vendorId);
    }
}
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
        int totalOffres = offreRepository.findByUser(vendor).size();

        long totalVues = offreRepository.findByUser(vendor).stream()
            .mapToLong(o -> o.getVues() != null ? o.getVues() : 0L)
            .sum();

        long totalFavoris = favoriRepository.countByVendeur(vendor);

        RapportVendor rapport = new RapportVendor();
        rapport.setVendor(vendor);
        rapport.setDateGeneration(LocalDateTime.now());
        rapport.setPeriode(periode);
        rapport.setTotalOffres(totalOffres);
        rapport.setTotalVues((int) totalVues);
        rapport.setTotalFavoris((int) totalFavoris);

        return rapportRepository.save(rapport);
    }

    public List<RapportVendor> getRapportsVendor(Long vendorId) {
        return rapportRepository.findByVendorIdOrderByDateGenerationDesc(vendorId);
    }
}
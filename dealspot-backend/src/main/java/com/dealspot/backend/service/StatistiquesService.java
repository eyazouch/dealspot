package com.dealspot.backend.service;

import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.FavoriRepository;
import com.dealspot.backend.repository.OffreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatistiquesService {
    
    @Autowired
    private OffreRepository offreRepository;
    
    @Autowired
    private FavoriRepository favoriRepository;
    
    // Statistiques globales du vendeur
    public Map<String, Object> getVendeurStatistiques(User vendeur) {
        Map<String, Object> stats = new HashMap<>();
        
        List<Offre> offres = offreRepository.findByUser(vendeur);
        LocalDateTime now = LocalDateTime.now();
        
        // Nombre total d'offres
        stats.put("totalOffres", offres.size());
        
        // Offres actives
        long offresActives = offres.stream()
            .filter(o -> o.getDateExpiration().isAfter(now))
            .count();
        stats.put("offresActives", offresActives);
        
        // Offres expirées
        stats.put("offresExpirees", offres.size() - offresActives);
        
        // Total des vues
        long totalVues = offres.stream()
            .mapToLong(Offre::getVues)
            .sum();
        stats.put("totalVues", totalVues);
        
        // Total des favoris
        long totalFavoris = favoriRepository.countByVendeur(vendeur);
        stats.put("totalFavoris", totalFavoris);
        
        // Moyenne vues par offre
        double moyenneVues = offres.isEmpty() ? 0 : (double) totalVues / offres.size();
        stats.put("moyenneVues", Math.round(moyenneVues * 100.0) / 100.0);
        
        // Offres coup de cœur
        long offresCoupDeCoeur = offres.stream()
            .filter(Offre::getCoupDeCoeur)
            .count();
        stats.put("offresCoupDeCoeur", offresCoupDeCoeur);
        
        // Badges
        stats.put("badges", vendeur.getBadges());
        
        return stats;
    }
    
    // Statistiques détaillées par offre
    public List<Map<String, Object>> getOffresStatistiques(User vendeur) {
        List<Offre> offres = offreRepository.findByUser(vendeur);
        
        return offres.stream().map(offre -> {
            Map<String, Object> offreStats = new HashMap<>();
            offreStats.put("offreId", offre.getId());
            offreStats.put("titre", offre.getTitre());
            offreStats.put("vues", offre.getVues());
            offreStats.put("favoris", favoriRepository.countByOffre(offre));
            offreStats.put("coupDeCoeur", offre.getCoupDeCoeur());
            offreStats.put("categorie", offre.getCategorie());
            offreStats.put("dateExpiration", offre.getDateExpiration());
            return offreStats;
        }).collect(Collectors.toList());
    }
}
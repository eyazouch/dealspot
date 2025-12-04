package com.dealspot.backend.service;

import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.repository.FavoriRepository;
import com.dealspot.backend.repository.OffreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CoupDeCoeurService {
    
    @Autowired
    private OffreRepository offreRepository;
    
    @Autowired
    private FavoriRepository favoriRepository;
    
    // Calculer le score d'une offre
    private double calculateScore(Offre offre) {
        long nombreFavoris = favoriRepository.countByOffre(offre);
        long nombreVues = offre.getVues();
        
        // Score : 70% favoris + 30% vues
        return (nombreFavoris * 0.7) + (nombreVues * 0.3);
    }
    
    // Mettre à jour les coups de cœur
    public void updateCoupsDeCoeur() {
        LocalDateTime now = LocalDateTime.now();
        
        // Récupérer toutes les offres actives
        List<Offre> offresActives = offreRepository.findByDateExpirationAfter(now);
        
        // Filtrer les offres qui ont au moins 1 favori OU au moins 3 vues
        List<Offre> offresEligibles = offresActives.stream()
            .filter(o -> {
                long nombreFavoris = favoriRepository.countByOffre(o);
                long nombreVues = o.getVues() != null ? o.getVues() : 0;
                return nombreFavoris >= 1 || nombreVues >= 3;
            })
            .toList();
        
        // Calculer les scores et trier
        List<Offre> offresTriees = offresEligibles.stream()
            .sorted((o1, o2) -> Double.compare(calculateScore(o2), calculateScore(o1)))
            .toList();
        
        // Réinitialiser tous les coups de cœur
        offresActives.forEach(o -> o.setCoupDeCoeur(false));
        
        // Marquer les top 10 comme coups de cœur (parmi les offres éligibles)
        int limit = Math.min(10, offresTriees.size());
        for (int i = 0; i < limit; i++) {
            offresTriees.get(i).setCoupDeCoeur(true);
        }
        
        // Sauvegarder
        offreRepository.saveAll(offresActives);
    }
}
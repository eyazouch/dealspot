package com.dealspot.backend.service;

import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.FavoriRepository;
import com.dealspot.backend.repository.OffreRepository;
import com.dealspot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class BadgeService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OffreRepository offreRepository;
    
    @Autowired
    private FavoriRepository favoriRepository;
    
    // Mettre à jour les badges d'un vendeur
    public void updateBadges(User user) {
        if (user.getRole() != User.Role.VENDEUR) {
            return;
        }
        
        List<String> badges = new ArrayList<>();
        
        // Compter les offres du vendeur
        long nombreOffres = offreRepository.findByUser(user).size();
        
        // Compter les favoris totaux du vendeur
        long nombreFavoris = favoriRepository.countByVendeur(user);
        
        // Badge : Nouveau vendeur (toujours présent au début)
        if (nombreOffres < 5) {
            badges.add("NOUVEAU_VENDEUR");
        }
        
        // Badge : Vendeur actif (5-19 offres)
        if (nombreOffres >= 5 && nombreOffres < 20) {
            badges.add("VENDEUR_ACTIF");
        }
        
        // Badge : Vendeur fiable (20+ offres)
        if (nombreOffres >= 20) {
            badges.add("VENDEUR_FIABLE");
        }
        
        // Badge : Vendeur populaire (50+ favoris)
        if (nombreFavoris >= 50) {
            badges.add("VENDEUR_POPULAIRE");
        }
        
        // Badge : Top vendeur (100+ favoris)
        if (nombreFavoris >= 100) {
            badges.add("TOP_VENDEUR");
        }
        
        // Badge : Vendeur expert (50+ offres)
        if (nombreOffres >= 50) {
            badges.add("VENDEUR_EXPERT");
        }
        
        user.setBadges(badges);
        userRepository.save(user);
    }
    
    // Mettre à jour tous les badges
    public void updateAllBadges() {
        List<User> vendeurs = userRepository.findAll().stream()
            .filter(u -> u.getRole() == User.Role.VENDEUR)
            .toList();
        
        for (User vendeur : vendeurs) {
            updateBadges(vendeur);
        }
    }
}
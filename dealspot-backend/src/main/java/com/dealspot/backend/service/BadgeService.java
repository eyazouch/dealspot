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
        
        // Badge : Vendeur fiable (10+ offres)
        if (nombreOffres >= 10) {
            badges.add("Vendeur Fiable ✓");
        }
        
        // Badge : Vendeur populaire (30+ favoris)
        if (nombreFavoris >= 30) {
            badges.add("Vendeur Populaire ⭐");
        }
        
        // Badge : Top vendeur (100+ favoris)
        if (nombreFavoris >= 100) {
            badges.add("Top Vendeur 🏆");
        }
        
        // Badge : Vendeur expert (50+ offres)
        if (nombreOffres >= 50) {
            badges.add("Vendeur Expert 💎");
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
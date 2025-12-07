package com.dealspot.backend.service;

import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.FavoriRepository;
import com.dealspot.backend.repository.OffreRepository;
import com.dealspot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadgeService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OffreRepository offreRepository;
    
    @Autowired
    private FavoriRepository favoriRepository;
    
    // Mettre à jour le badge d'un vendeur
    public void updateBadges(User user) {
        if (user.getRole() != User.Role.VENDEUR) {
            return;
        }
        
        String badge = null;
        
        // Compter les offres du vendeur
        long nombreOffres = offreRepository.findByUser(user).size();
        
        // Compter les favoris totaux du vendeur
        long nombreFavoris = favoriRepository.countByVendeur(user);
        
        // Déterminer le meilleur badge (ordre de priorité du plus élevé au plus bas)
        if (nombreFavoris >= 100) {
            badge = "Top Vendeur 🏆";
        } else if (nombreOffres >= 50) {
            badge = "Vendeur Expert 💎";
        } else if (nombreFavoris >= 30) {
            badge = "Vendeur Populaire ⭐";
        } else if (nombreOffres >= 10) {
            badge = "Vendeur Fiable ✓";
        }
        
        user.setBadge(badge);
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
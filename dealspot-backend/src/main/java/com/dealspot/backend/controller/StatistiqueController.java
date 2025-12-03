package com.dealspot.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.repository.UserRepository;
import com.dealspot.backend.repository.OffreRepository;
import com.dealspot.backend.repository.FavoriRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/statistiques")
@CrossOrigin(origins = "http://localhost:5173")
public class StatistiqueController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OffreRepository offreRepository;
    
    @Autowired
    private FavoriRepository favoriRepository;
    
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<?> getStatistiquesVendor(@PathVariable Long vendorId) {
        try {
            Optional<User> vendorOpt = userRepository.findById(vendorId);
            
            if (!vendorOpt.isPresent()) {
                return ResponseEntity.status(404).body("Vendeur non trouvé");
            }
            
            User vendor = vendorOpt.get();
            
            if (vendor.getRole() != User.Role.VENDEUR) {
                return ResponseEntity.status(400).body("L'utilisateur n'est pas un vendeur");
            }
            
            Map<String, Object> stats = new HashMap<>();
            
            // Récupérer toutes les offres du vendeur
            List<Offre> toutesOffres = offreRepository.findByUser(vendor);
            LocalDateTime maintenant = LocalDateTime.now();
            
            // Offres actives (non expirées)
            long offresActives = toutesOffres.stream()
                .filter(o -> o.getDateExpiration().isAfter(maintenant))
                .count();
            
            // Offres expirées
            long offresExpirees = toutesOffres.size() - offresActives;
            
            // Total vues
            long totalVues = toutesOffres.stream()
                .mapToLong(o -> o.getVues() != null ? o.getVues() : 0L)
                .sum();
            
            // Total favoris
            long totalFavoris = favoriRepository.countByVendeur(vendor);
            
            // Moyenne vues par offre
            double moyenneVues = toutesOffres.isEmpty() ? 0 : Math.round((double)totalVues / toutesOffres.size() * 100.0) / 100.0;
            
            // Offres coup de cœur
            long offresCoupDeCoeur = toutesOffres.stream()
                .filter(o -> Boolean.TRUE.equals(o.getCoupDeCoeur()))
                .count();
            
            stats.put("totalOffres", toutesOffres.size());
            stats.put("offresActives", offresActives);
            stats.put("offresExpirees", offresExpirees);
            stats.put("totalVues", totalVues);
            stats.put("totalFavoris", totalFavoris);
            stats.put("moyenneVues", moyenneVues);
            stats.put("offresCoupDeCoeur", offresCoupDeCoeur);
            stats.put("badges", vendor.getBadge());
            
            // Offre la plus populaire
            if (!toutesOffres.isEmpty()) {
                Offre offrePopulaire = toutesOffres.stream()
                    .max((o1, o2) -> Long.compare(
                        o1.getVues() != null ? o1.getVues() : 0L,
                        o2.getVues() != null ? o2.getVues() : 0L
                    ))
                    .orElse(null);
                
                if (offrePopulaire != null && offrePopulaire.getVues() > 0) {
                    Map<String, Object> offrePopInfo = new HashMap<>();
                    offrePopInfo.put("id", offrePopulaire.getId());
                    offrePopInfo.put("titre", offrePopulaire.getTitre());
                    offrePopInfo.put("vues", offrePopulaire.getVues());
                    stats.put("offrePopulaire", offrePopInfo);
                }
            }
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }
}
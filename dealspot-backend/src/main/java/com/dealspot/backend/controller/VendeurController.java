package com.dealspot.backend.controller;

import com.dealspot.backend.entity.User;
import com.dealspot.backend.service.BadgeService;
import com.dealspot.backend.service.StatistiquesService;
import com.dealspot.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendeur")
@CrossOrigin(origins = "*")
public class VendeurController {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private StatistiquesService statistiquesService;
    
    @Autowired
    private BadgeService badgeService;
    
    // Dashboard vendeur
    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(@RequestParam Long userId) {
        try {
            User vendeur = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Vendeur non trouvé"));
            
            if (vendeur.getRole() != User.Role.VENDEUR) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Accès réservé aux vendeurs"));
            }
            
            // Mettre à jour les badges
            badgeService.updateBadges(vendeur);
            
            // Récupérer les statistiques
            Map<String, Object> stats = statistiquesService.getVendeurStatistiques(vendeur);
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
    
    // Statistiques détaillées par offre
    @GetMapping("/offres-stats")
    public ResponseEntity<?> getOffresStats(@RequestParam Long userId) {
        try {
            User vendeur = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Vendeur non trouvé"));
            
            if (vendeur.getRole() != User.Role.VENDEUR) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Accès réservé aux vendeurs"));
            }
            
            List<Map<String, Object>> offresStats = statistiquesService.getOffresStatistiques(vendeur);
            
            return ResponseEntity.ok(offresStats);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
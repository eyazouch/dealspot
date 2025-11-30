package com.dealspot.backend.controller;

import com.dealspot.backend.entity.Favori;
import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.service.FavoriService;
import com.dealspot.backend.service.OffreService;
import com.dealspot.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favoris")
@CrossOrigin(origins = "*")
public class FavoriController {
    
    @Autowired
    private FavoriService favoriService;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private OffreService offreService;
    
    // Récupérer les favoris d'un utilisateur
    @GetMapping
    public ResponseEntity<?> getFavoris(@RequestParam Long userId) {
        try {
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            List<Favori> favoris = favoriService.getFavorisByUser(user);
            
            return ResponseEntity.ok(favoris);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur: " + e.getMessage()));
        }
    }
    
    // Ajouter aux favoris
    @PostMapping("/{offreId}")
    public ResponseEntity<?> addFavori(@PathVariable Long offreId, 
                                       @RequestParam Long userId) {
        try {
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            Offre offre = offreService.getOffreById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
            
            Favori favori = favoriService.addFavori(user, offre);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(favori);
            
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur: " + e.getMessage()));
        }
    }
    
    // Retirer des favoris
    @DeleteMapping("/{offreId}")
    public ResponseEntity<?> removeFavori(@PathVariable Long offreId, 
                                          @RequestParam Long userId) {
        try {
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            Offre offre = offreService.getOffreById(offreId)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
            
            favoriService.removeFavori(user, offre);
            
            return ResponseEntity.ok(Map.of("message", "Retiré des favoris"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur: " + e.getMessage()));
        }
    }
}

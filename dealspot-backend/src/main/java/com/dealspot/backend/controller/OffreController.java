package com.dealspot.backend.controller;

import com.dealspot.backend.dto.OffreRequest;
import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.service.OffreService;
import com.dealspot.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offres")
@CrossOrigin(origins = "*")
public class OffreController {
    
    @Autowired
    private OffreService offreService;
    
    @Autowired
    private UserService userService;
    
    // Récupérer toutes les offres actives
    @GetMapping
    public ResponseEntity<List<Offre>> getAllActiveOffres() {
        List<Offre> offres = offreService.getActiveOffres();
        return ResponseEntity.ok(offres);
    }
    
    // Récupérer une offre par ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOffreById(@PathVariable Long id) {
        return offreService.getOffreById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    // Créer une nouvelle offre
    @PostMapping
    public ResponseEntity<?> createOffre(@RequestBody OffreRequest request, 
                                         @RequestParam Long userId) {
        try {
            // Trouver l'utilisateur
            User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
            
            // Vérifier que c'est un vendeur
            if (user.getRole() != User.Role.VENDEUR) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Seuls les vendeurs peuvent créer des offres"));
            }
            
            // Créer l'offre
            Offre offre = new Offre();
            offre.setTitre(request.getTitre());
            offre.setDescription(request.getDescription());
            offre.setPrixOriginal(request.getPrixOriginal());
            offre.setPrixPromo(request.getPrixPromo());
            offre.setCategorie(request.getCategorie());
            offre.setLocalisation(request.getLocalisation());
            offre.setImageUrl(request.getImageUrl());
            offre.setDateDebut(request.getDateDebut());
            offre.setDateExpiration(request.getDateExpiration());
            offre.setUser(user);
            
            Offre savedOffre = offreService.createOffre(offre);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOffre);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la création: " + e.getMessage()));
        }
    }
    
    // Modifier une offre
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOffre(@PathVariable Long id, 
                                         @RequestBody OffreRequest request,
                                         @RequestParam Long userId) {
        try {
            // Trouver l'offre
            Offre offre = offreService.getOffreById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
            
            // Vérifier que c'est le propriétaire
            if (!offre.getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Vous ne pouvez modifier que vos propres offres"));
            }
            
            // Mettre à jour
            offre.setTitre(request.getTitre());
            offre.setDescription(request.getDescription());
            offre.setPrixOriginal(request.getPrixOriginal());
            offre.setPrixPromo(request.getPrixPromo());
            offre.setCategorie(request.getCategorie());
            offre.setLocalisation(request.getLocalisation());
            offre.setImageUrl(request.getImageUrl());
            offre.setDateDebut(request.getDateDebut());
            offre.setDateExpiration(request.getDateExpiration());
            
            Offre updatedOffre = offreService.updateOffre(offre);
            
            return ResponseEntity.ok(updatedOffre);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la modification: " + e.getMessage()));
        }
    }
    
    // Supprimer une offre
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffre(@PathVariable Long id, 
                                         @RequestParam Long userId) {
        try {
            // Trouver l'offre
            Offre offre = offreService.getOffreById(id)
                .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
            
            // Vérifier que c'est le propriétaire
            if (!offre.getUser().getId().equals(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Vous ne pouvez supprimer que vos propres offres"));
            }
            
            offreService.deleteOffre(id);
            
            return ResponseEntity.ok(Map.of("message", "Offre supprimée avec succès"));
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la suppression: " + e.getMessage()));
        }
    }
    
    // Rechercher par catégorie
    @GetMapping("/categorie/{categorie}")
    public ResponseEntity<List<Offre>> getOffresByCategorie(@PathVariable String categorie) {
        List<Offre> offres = offreService.getOffresByCategorie(categorie);
        return ResponseEntity.ok(offres);
    }
    
    // Rechercher par localisation
    @GetMapping("/localisation/{localisation}")
    public ResponseEntity<List<Offre>> getOffresByLocalisation(@PathVariable String localisation) {
        List<Offre> offres = offreService.getOffresByLocalisation(localisation);
        return ResponseEntity.ok(offres);
    }
}
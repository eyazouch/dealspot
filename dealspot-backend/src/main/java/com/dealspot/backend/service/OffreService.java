package com.dealspot.backend.service;

import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.OffreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OffreService {
    
    @Autowired
    private OffreRepository offreRepository;
    
    // Créer une offre
    public Offre createOffre(Offre offre) {
        return offreRepository.save(offre);
    }
    
    // Trouver une offre par ID
    public Optional<Offre> getOffreById(Long id) {
        return offreRepository.findById(id);
    }
    
    // Récupérer toutes les offres actives (non expirées)
    public List<Offre> getActiveOffres() {
        return offreRepository.findByDateExpirationAfter(LocalDateTime.now());
    }
    
    // Récupérer toutes les offres
    public List<Offre> getAllOffres() {
        return offreRepository.findAll();
    }
    
    // Récupérer les offres d'un vendeur
    public List<Offre> getOffresByUser(User user) {
        return offreRepository.findByUser(user);
    }
    
    // Récupérer les offres par catégorie (actives)
    public List<Offre> getOffresByCategorie(String categorie) {
        return offreRepository.findByCategorieAndDateExpirationAfter(
            categorie, LocalDateTime.now()
        );
    }
    
    // Récupérer les offres par localisation (actives)
    public List<Offre> getOffresByLocalisation(String localisation) {
        return offreRepository.findByLocalisationAndDateExpirationAfter(
            localisation, LocalDateTime.now()
        );
    }
    
    // Mettre à jour une offre
    public Offre updateOffre(Offre offre) {
        return offreRepository.save(offre);
    }
    
    // Supprimer une offre
    public void deleteOffre(Long id) {
        offreRepository.deleteById(id);
    }
    
    // Supprimer les offres expirées
    public void deleteExpiredOffres() {
        List<Offre> expiredOffres = offreRepository.findByDateExpirationBefore(LocalDateTime.now());
        offreRepository.deleteAll(expiredOffres);
    }
 // AJOUTER À LA FIN DE OffreService.java (avant la dernière accolade)

    // Recherche par mot-clé
    public List<Offre> searchOffres(String keyword) {
        return offreRepository.searchByKeyword(keyword, LocalDateTime.now());
    }
    
    // Récupérer les coups de cœur
    public List<Offre> getCoupsDeCoeur() {
        return offreRepository.findByCoupDeCoeurTrueAndDateExpirationAfter(LocalDateTime.now());
    }
    
    // Incrémenter les vues
    public void incrementVues(Long offreId) {
        Offre offre = offreRepository.findById(offreId)
            .orElseThrow(() -> new RuntimeException("Offre non trouvée"));
        offre.incrementVues();
        offreRepository.save(offre);
    }
}
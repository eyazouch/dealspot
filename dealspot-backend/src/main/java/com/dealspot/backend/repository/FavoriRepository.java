package com.dealspot.backend.repository;

import com.dealspot.backend.entity.Favori;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.entity.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriRepository extends JpaRepository<Favori, Long> {
    
    // Trouver tous les favoris d'un utilisateur
    List<Favori> findByUser(User user);
    
    // Trouver un favori spécifique (utilisateur + offre)
    Optional<Favori> findByUserAndOffre(User user, Offre offre);
    
    // Vérifier si un favori existe
    boolean existsByUserAndOffre(User user, Offre offre);
    
    // Supprimer un favori spécifique
    void deleteByUserAndOffre(User user, Offre offre);
    
    // Compter les favoris d'une offre spécifique
    Long countByOffre(Offre offre);
    
    // Compter tous les favoris d'un vendeur (toutes ses offres)
    @Query("SELECT COUNT(f) FROM Favori f WHERE f.offre.user = :vendeur")
    Long countByVendeur(@Param("vendeur") User vendeur);
    
    // Méthodes additionnelles pour compatibilité avec l'ancien code
    List<Favori> findByUserId(Long userId);
    
    Optional<Favori> findByUserIdAndOffreId(Long userId, Long offreId);
    
    Integer countByOffreId(Long offreId);
    
 // ✅ CORRECT (utilise "user" au lieu de "vendor")
    @Query("SELECT COUNT(f) FROM Favori f WHERE f.offre.user.id = ?1")
    Integer countTotalFavorisByVendorId(Long vendorId);
}
package com.dealspot.backend.repository;

import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {
    List<Offre> findByDateExpirationAfter(LocalDateTime date);
    List<Offre> findByDateExpirationBefore(LocalDateTime date);
    List<Offre> findByUser(User user);
    List<Offre> findByCategorieAndDateExpirationAfter(String categorie, LocalDateTime date);
    List<Offre> findByLocalisationAndDateExpirationAfter(String localisation, LocalDateTime date);
    
    // NOUVEAU : Recherche par mots-clés
    @Query("SELECT o FROM Offre o WHERE " +
           "(LOWER(o.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "o.dateExpiration > :now")
    List<Offre> searchByKeyword(String keyword, LocalDateTime now);
    
    // NOUVEAU : Top offres (coups de cœur)
    @Query("SELECT o FROM Offre o WHERE o.dateExpiration > :now " +
           "ORDER BY SIZE(o.favoris) DESC, o.vues DESC")
    List<Offre> findTopOffres(LocalDateTime now);
    
    // Offres coup de cœur
    List<Offre> findByCoupDeCoeurTrueAndDateExpirationAfter(LocalDateTime date);
}
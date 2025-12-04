package com.dealspot.backend.repository;

import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OffreRepository extends JpaRepository<Offre, Long> {
    
    // Méthodes existantes
    List<Offre> findByDateExpirationAfter(LocalDateTime date);
    List<Offre> findByDateExpirationBefore(LocalDateTime date);
    List<Offre> findByUser(User user);
    List<Offre> findByCategorieAndDateExpirationAfter(String categorie, LocalDateTime date);
    List<Offre> findByLocalisationAndDateExpirationAfter(String localisation, LocalDateTime date);
    
    // Recherche partielle par localisation
    @Query("SELECT o FROM Offre o WHERE LOWER(o.localisation) LIKE LOWER(CONCAT('%', :localisation, '%')) AND o.dateExpiration > :now")
    List<Offre> searchByLocalisation(@Param("localisation") String localisation, @Param("now") LocalDateTime now);

    // Recherche par mots-clés
    @Query("SELECT o FROM Offre o WHERE " +
           "(LOWER(o.titre) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(o.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "o.dateExpiration > :now")
    List<Offre> searchByKeyword(@Param("keyword") String keyword, @Param("now") LocalDateTime now);

    // Top offres (coups de cœur)
    @Query("SELECT o FROM Offre o WHERE o.dateExpiration > :now " +
           "ORDER BY SIZE(o.favoris) DESC, o.vues DESC")
    List<Offre> findTopOffres(@Param("now") LocalDateTime now);

    // Offres coup de cœur
    List<Offre> findByCoupDeCoeurTrueAndDateExpirationAfter(LocalDateTime date);
    
    // Version simple pour coups de cœur (sans date)
    List<Offre> findByCoupDeCoeurTrue();
    
    // Offres créées par un vendeur dans une période
    @Query("SELECT COUNT(o) FROM Offre o WHERE o.user = :user AND o.createdAt >= :dateDebut AND o.createdAt <= :dateFin")
    Integer countOffresCreees(@Param("user") User user, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);
    
    // Offres expirées d'un vendeur dans une période
    @Query("SELECT COUNT(o) FROM Offre o WHERE o.user = :user AND o.dateExpiration >= :dateDebut AND o.dateExpiration <= :dateFin")
    Integer countOffresExpirees(@Param("user") User user, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);
}
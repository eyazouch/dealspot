package com.dealspot.backend.repository;

import com.dealspot.backend.entity.Favori;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.entity.Offre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriRepository extends JpaRepository<Favori, Long> {
    List<Favori> findByUser(User user);
    Optional<Favori> findByUserAndOffre(User user, Offre offre);
    boolean existsByUserAndOffre(User user, Offre offre);
    void deleteByUserAndOffre(User user, Offre offre);
    
    // NOUVEAU : Compter les favoris d'une offre
    Long countByOffre(Offre offre);
    
    // NOUVEAU : Compter tous les favoris d'un vendeur
    @Query("SELECT COUNT(f) FROM Favori f WHERE f.offre.user = :user")
    Long countByVendeur(User user);
}
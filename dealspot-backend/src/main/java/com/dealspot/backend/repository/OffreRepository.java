package com.dealspot.backend.repository;

import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
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
}
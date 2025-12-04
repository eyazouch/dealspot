package com.dealspot.backend.repository;

import com.dealspot.backend.entity.OffreSuppressionLog;
import com.dealspot.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OffreSuppressionLogRepository extends JpaRepository<OffreSuppressionLog, Long> {
    
    @Query("SELECT COUNT(o) FROM OffreSuppressionLog o WHERE o.vendor = :vendor AND o.dateSuppression >= :dateDebut AND o.dateSuppression <= :dateFin")
    Integer countOffresSupprimees(@Param("vendor") User vendor, @Param("dateDebut") LocalDateTime dateDebut, @Param("dateFin") LocalDateTime dateFin);
}

package com.dealspot.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.dealspot.backend.entity.RapportVendor;

import java.util.List;

@Repository
public interface RapportVendorRepository extends JpaRepository<RapportVendor, Long> {
    
    /**
     * Trouve tous les rapports d'un vendor, triés par date de génération décroissante
     */
    List<RapportVendor> findByVendorIdOrderByDateGenerationDesc(Long vendorId);
}
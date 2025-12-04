package com.dealspot.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "offre_suppression_log")
public class OffreSuppressionLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private User vendor;
    
    private String titreOffre;
    private LocalDateTime dateSuppression;
    
    // Constructeurs
    public OffreSuppressionLog() {
        this.dateSuppression = LocalDateTime.now();
    }
    
    public OffreSuppressionLog(User vendor, String titreOffre) {
        this.vendor = vendor;
        this.titreOffre = titreOffre;
        this.dateSuppression = LocalDateTime.now();
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getVendor() {
        return vendor;
    }
    
    public void setVendor(User vendor) {
        this.vendor = vendor;
    }
    
    public String getTitreOffre() {
        return titreOffre;
    }
    
    public void setTitreOffre(String titreOffre) {
        this.titreOffre = titreOffre;
    }
    
    public LocalDateTime getDateSuppression() {
        return dateSuppression;
    }
    
    public void setDateSuppression(LocalDateTime dateSuppression) {
        this.dateSuppression = dateSuppression;
    }
}

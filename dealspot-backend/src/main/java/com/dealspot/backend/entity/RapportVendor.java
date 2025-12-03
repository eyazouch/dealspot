package com.dealspot.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "rapport_vendor")
public class RapportVendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "vendor_id")
    private User vendor;
    
    private LocalDateTime dateGeneration;
    private String periode; // "SEMAINE" ou "MOIS"
    private Integer totalOffres;
    private Integer totalVues;
    private Integer totalFavoris;
    private String cheminFichierPdf;
    
    // Constructeurs
    public RapportVendor() {}
    
    public RapportVendor(User vendor, String periode, Integer totalOffres, 
                        Integer totalVues, Integer totalFavoris) {
        this.vendor = vendor;
        this.dateGeneration = LocalDateTime.now();
        this.periode = periode;
        this.totalOffres = totalOffres;
        this.totalVues = totalVues;
        this.totalFavoris = totalFavoris;
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
    
    public LocalDateTime getDateGeneration() {
        return dateGeneration;
    }
    
    public void setDateGeneration(LocalDateTime dateGeneration) {
        this.dateGeneration = dateGeneration;
    }
    
    public String getPeriode() {
        return periode;
    }
    
    public void setPeriode(String periode) {
        this.periode = periode;
    }
    
    public Integer getTotalOffres() {
        return totalOffres;
    }
    
    public void setTotalOffres(Integer totalOffres) {
        this.totalOffres = totalOffres;
    }
    
    public Integer getTotalVues() {
        return totalVues;
    }
    
    public void setTotalVues(Integer totalVues) {
        this.totalVues = totalVues;
    }
    
    public Integer getTotalFavoris() {
        return totalFavoris;
    }
    
    public void setTotalFavoris(Integer totalFavoris) {
        this.totalFavoris = totalFavoris;
    }
    
    public String getCheminFichierPdf() {
        return cheminFichierPdf;
    }
    
    public void setCheminFichierPdf(String cheminFichierPdf) {
        this.cheminFichierPdf = cheminFichierPdf;
    }
}
package com.dealspot.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "statistique_offre")
public class StatistiqueOffre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "offre_id")
    private Offre offre;
    
    private LocalDate date;
    private Integer vuesDuJour;
    private Integer favorisDuJour;
    
    // Constructeurs
    public StatistiqueOffre() {
        this.vuesDuJour = 0;
        this.favorisDuJour = 0;
    }
    
    public StatistiqueOffre(Offre offre, LocalDate date) {
        this.offre = offre;
        this.date = date;
        this.vuesDuJour = 0;
        this.favorisDuJour = 0;
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Offre getOffre() {
        return offre;
    }
    
    public void setOffre(Offre offre) {
        this.offre = offre;
    }
    
    public LocalDate getDate() {
        return date;
    }
    
    public void setDate(LocalDate date) {
        this.date = date;
    }
    
    public Integer getVuesDuJour() {
        return vuesDuJour;
    }
    
    public void setVuesDuJour(Integer vuesDuJour) {
        this.vuesDuJour = vuesDuJour;
    }
    
    public Integer getFavorisDuJour() {
        return favorisDuJour;
    }
    
    public void setFavorisDuJour(Integer favorisDuJour) {
        this.favorisDuJour = favorisDuJour;
    }
}
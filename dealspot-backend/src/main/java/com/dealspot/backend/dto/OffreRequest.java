package com.dealspot.backend.dto;

import java.time.LocalDateTime;

public class OffreRequest {
    private String titre;
    private String description;
    private Double prixOriginal;
    private Double prixPromo;
    private String categorie;
    private String localisation;
    private String imageUrl;
    private LocalDateTime dateDebut;
    private LocalDateTime dateExpiration;
    
    // Getters et Setters
    public String getTitre() {
        return titre;
    }
    
    public void setTitre(String titre) {
        this.titre = titre;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Double getPrixOriginal() {
        return prixOriginal;
    }
    
    public void setPrixOriginal(Double prixOriginal) {
        this.prixOriginal = prixOriginal;
    }
    
    public Double getPrixPromo() {
        return prixPromo;
    }
    
    public void setPrixPromo(Double prixPromo) {
        this.prixPromo = prixPromo;
    }
    
    public String getCategorie() {
        return categorie;
    }
    
    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }
    
    public String getLocalisation() {
        return localisation;
    }
    
    public void setLocalisation(String localisation) {
        this.localisation = localisation;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public LocalDateTime getDateDebut() {
        return dateDebut;
    }
    
    public void setDateDebut(LocalDateTime dateDebut) {
        this.dateDebut = dateDebut;
    }
    
    public LocalDateTime getDateExpiration() {
        return dateExpiration;
    }
    
    public void setDateExpiration(LocalDateTime dateExpiration) {
        this.dateExpiration = dateExpiration;
    }
}
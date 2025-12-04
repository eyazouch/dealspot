package com.dealspot.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String username;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Enumerated(EnumType.STRING)
    private Role role;
    
    private LocalDateTime createdAt;
    
    // Badges du vendeur
    @ElementCollection
    @CollectionTable(name = "user_badges", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "badge")
    private List<String> badges = new ArrayList<>();
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Offre> offres;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Favori> favoris;
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
    
    public enum Role {
        USER, VENDEUR, ADMIN
    }
    
    // Getters et Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Role getRole() {
        return role;
    }
    
    public void setRole(Role role) {
        this.role = role;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public List<String> getBadges() {
        return badges;
    }
    
    public void setBadges(List<String> badges) {
        this.badges = badges;
    }
    
    public List<Offre> getOffres() {
        return offres;
    }
    
    public void setOffres(List<Offre> offres) {
        this.offres = offres;
    }
    
    public List<Favori> getFavoris() {
        return favoris;
    }
    
    public void setFavoris(List<Favori> favoris) {
        this.favoris = favoris;
    }
    
    // MÉTHODES HELPERS POUR LA COMPATIBILITÉ
    
    public String getBadge() {
        if (badges == null || badges.isEmpty()) {
            return null;
        }
        return badges.get(0);
    }
    
    public void setBadge(String badge) {
        if (this.badges == null) {
            this.badges = new ArrayList<>();
        }
        if (!this.badges.contains(badge)) {
            this.badges.add(badge);
        }
    }
    
    public String getRoleString() {
        return this.role != null ? this.role.name() : null;
    }
    
    public boolean isVendeur() {
        return this.role == Role.VENDEUR;
    }
    
    public String getNom() {
        return this.username;
    }
}
package com.dealspot.backend.service;

import com.dealspot.backend.entity.Favori;
import com.dealspot.backend.entity.Offre;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.FavoriRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class FavoriService {
    
    @Autowired
    private FavoriRepository favoriRepository;
    
    // Ajouter aux favoris
    public Favori addFavori(User user, Offre offre) {
        // Vérifier si déjà en favoris
        if (favoriRepository.existsByUserAndOffre(user, offre)) {
            throw new RuntimeException("Cette offre est déjà dans vos favoris");
        }
        
        Favori favori = new Favori();
        favori.setUser(user);
        favori.setOffre(offre);
        return favoriRepository.save(favori);
    }
    
    // Récupérer les favoris d'un utilisateur
    public List<Favori> getFavorisByUser(User user) {
        return favoriRepository.findByUser(user);
    }
    
    // Vérifier si une offre est en favoris
    public boolean isFavori(User user, Offre offre) {
        return favoriRepository.existsByUserAndOffre(user, offre);
    }
    
    // Retirer des favoris
    @Transactional
    public void removeFavori(User user, Offre offre) {
        favoriRepository.deleteByUserAndOffre(user, offre);
    }
    
    // Trouver un favori spécifique
    public Optional<Favori> getFavori(User user, Offre offre) {
        return favoriRepository.findByUserAndOffre(user, offre);
    }
}
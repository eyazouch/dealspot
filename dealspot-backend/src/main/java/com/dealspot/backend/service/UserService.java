package com.dealspot.backend.service;

import com.dealspot.backend.entity.User;
import com.dealspot.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Créer un utilisateur
    public User createUser(User user) {
        return userRepository.save(user);
    }
    
    // Trouver un utilisateur par ID
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    // Trouver un utilisateur par username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    // Trouver un utilisateur par email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    // Vérifier si username existe
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    // Vérifier si email existe
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    // Récupérer tous les utilisateurs
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    // Supprimer un utilisateur
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
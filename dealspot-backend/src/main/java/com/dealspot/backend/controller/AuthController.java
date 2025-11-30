package com.dealspot.backend.controller;

import com.dealspot.backend.dto.LoginRequest;
import com.dealspot.backend.dto.RegisterRequest;
import com.dealspot.backend.entity.User;
import com.dealspot.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;
    
    // Inscription
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            // Vérifier si username existe déjà
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Ce nom d'utilisateur existe déjà"));
            }
            
            // Vérifier si email existe déjà
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cet email est déjà utilisé"));
            }
            
            // Créer l'utilisateur
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(request.getPassword()); // TODO: hasher le mot de passe
            user.setRole(request.getRole());
            
            User savedUser = userService.createUser(user);
            
            // Retourner les infos (sans le mot de passe)
            Map<String, Object> response = new HashMap<>();
            response.put("id", savedUser.getId());
            response.put("username", savedUser.getUsername());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            response.put("message", "Inscription réussie");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de l'inscription: " + e.getMessage()));
        }
    }
    
    // Connexion
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Trouver l'utilisateur
            User user = userService.getUserByUsername(request.getUsername())
                .orElse(null);
            
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Nom d'utilisateur ou mot de passe incorrect"));
            }
            
            // Vérifier le mot de passe (simple comparaison pour l'instant)
            if (!user.getPassword().equals(request.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Nom d'utilisateur ou mot de passe incorrect"));
            }
            
            // Connexion réussie
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            response.put("message", "Connexion réussie");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Erreur lors de la connexion: " + e.getMessage()));
        }
    }
}
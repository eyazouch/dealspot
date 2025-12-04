# 📋 Rapport Technique - DealSpot

## Plateforme de Gestion d'Offres Promotionnelles

---

## 📌 1. Présentation du Projet

**DealSpot** est une application web full-stack permettant aux vendeurs de publier des offres promotionnelles et aux utilisateurs de découvrir, rechercher et sauvegarder leurs offres préférées.

### Fonctionnalités principales :
- Authentification (inscription/connexion) avec gestion des rôles (USER, VENDEUR)
- Publication, modification et suppression d'offres par les vendeurs
- Recherche d'offres par mot-clé, localisation et catégorie
- Système de favoris pour les utilisateurs
- Tableau de bord vendeur avec statistiques et rapports
- Système de badges et récompenses pour les vendeurs
- Offres "Coup de Cœur" basées sur la popularité
- Alertes pour les offres bientôt expirées

---

## 🛠️ 2. Technologies Utilisées

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| **Java** | 17 | Langage de programmation |
| **Spring Boot** | 4.0.0 | Framework Java pour les applications web |
| **Spring Data JPA** | - | Persistance des données |
| **Spring Security** | - | Sécurité de l'application |
| **Spring Validation** | - | Validation des données |
| **Hibernate** | - | ORM (Object-Relational Mapping) |
| **MySQL** | 8.x | Base de données relationnelle |
| **Lombok** | - | Réduction du code boilerplate |
| **Maven** | - | Gestion des dépendances |

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| **React** | 19.2.0 | Bibliothèque UI JavaScript |
| **React Router DOM** | 7.9.6 | Routage côté client |
| **Axios** | 1.13.2 | Client HTTP |
| **Tailwind CSS** | 3.4.1 | Framework CSS utilitaire |
| **Lucide React** | 0.555.0 | Icônes |
| **Vite** | 7.2.4 | Bundler et serveur de développement |

### Outils de Développement
| Outil | Utilisation |
|-------|-------------|
| **Eclipse IDE** | Développement Java/Spring Boot |
| **VS Code** | Développement Frontend React |
| **MySQL Workbench** | Administration base de données |
| **Postman** | Tests des API REST |
| **Git/GitHub** | Versioning et collaboration |

---

## 🏗️ 3. Architecture du Système

### Architecture Globale
```
┌─────────────────┐     HTTP/REST     ┌─────────────────┐     JPA/JDBC     ┌─────────────────┐
│                 │  ◄───────────────► │                 │ ◄──────────────► │                 │
│  Frontend       │     Port 5173      │  Backend        │    Port 3306     │  MySQL          │
│  React + Vite   │                    │  Spring Boot    │                  │  Database       │
│                 │                    │  Port 8081      │                  │                 │
└─────────────────┘                    └─────────────────┘                  └─────────────────┘
```

### Structure du Projet
```
dealspot/
├── dealspot-backend/           # API Spring Boot
│   └── src/main/java/com/dealspot/backend/
│       ├── config/             # Configuration (CORS, Security, Tasks)
│       ├── controller/         # Contrôleurs REST (6 contrôleurs)
│       ├── dto/                # Data Transfer Objects
│       ├── entity/             # Entités JPA (6 entités)
│       ├── exception/          # Gestion des exceptions
│       ├── repository/         # Repositories JPA
│       └── service/            # Services métier (7 services)
│
└── dealspot-frontend/          # Application React
    └── src/
        ├── components/         # Composants réutilisables
        ├── pages/              # Pages de l'application (9 pages)
        └── services/           # Services API (axios)
```

---

## 🔧 4. Backend (API / Services Web)

### 4.1 Configuration

**application.properties**
```properties
# Port du serveur
server.port=8081

# Configuration MySQL
spring.datasource.url=jdbc:mysql://localhost:3306/dealspot
spring.datasource.username=root
spring.datasource.password=123456

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### 4.2 Entités JPA (Modèle de Données)

#### User (Utilisateur)
```java
@Entity
@Table(name = "users")
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;      // Unique
    private String email;         // Unique
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;            // USER, VENDEUR, ADMIN
    @ElementCollection
    private List<String> badges;  // Badges du vendeur
    private LocalDateTime createdAt;
}
```

#### Offre
```java
@Entity
@Table(name = "offres")
public class Offre {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titre;
    private String description;
    private Double prixOriginal;
    private Double prixPromo;
    private String categorie;
    private String localisation;
    private String imageUrl;
    private LocalDateTime dateDebut;
    private LocalDateTime dateExpiration;
    @ManyToOne
    private User user;            // Vendeur
    private Long vues = 0L;       // Nombre de vues
    private Boolean coupDeCoeur = false;
    private LocalDateTime createdAt;
}
```

#### Favori
```java
@Entity
@Table(name = "favoris")
public class Favori {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User user;
    @ManyToOne
    private Offre offre;
    private LocalDateTime createdAt;
}
```

#### RapportVendor
```java
@Entity
@Table(name = "rapport_vendor")
public class RapportVendor {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    private User vendor;
    private LocalDateTime dateGeneration;
    private String periode;           // "hebdomadaire" ou "mensuel"
    private Integer totalOffres;
    private Integer totalVues;
    private Integer totalFavoris;
    private Integer offresCreees;
    private Integer offresSupprimees;
    private Integer offresExpirees;
}
```

---

## 📡 5. Structure des API Principales

### Base URL : `http://localhost:8081/api`

### 5.1 Authentification (`/api/auth`)

| Méthode | Endpoint | Description | Body |
|---------|----------|-------------|------|
| `POST` | `/register` | Inscription | `{username, email, password, role}` |
| `POST` | `/login` | Connexion | `{username, password}` |

**Exemple - Inscription (POST /api/auth/register)**
```json
// Request
{
  "username": "vendeur1",
  "email": "vendeur1@email.com",
  "password": "123456",
  "role": "VENDEUR"
}

// Response (201 Created)
{
  "id": 1,
  "username": "vendeur1",
  "email": "vendeur1@email.com",
  "role": "VENDEUR",
  "message": "Inscription réussie"
}
```

### 5.2 Gestion des Offres (`/api/offres`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `GET` | `/` | Toutes les offres actives | - |
| `GET` | `/{id}` | Offre par ID | - |
| `GET` | `/search?keyword=` | Recherche par mot-clé | `keyword` |
| `GET` | `/categorie/{cat}` | Offres par catégorie | - |
| `GET` | `/localisation/{loc}` | Offres par localisation | - |
| `GET` | `/coups-de-coeur` | Offres coup de cœur | - |
| `POST` | `/?userId=` | Créer une offre | `userId` |
| `PUT` | `/{id}?userId=` | Modifier une offre | `userId` |
| `DELETE` | `/{id}?userId=` | Supprimer une offre | `userId` |
| `POST` | `/{id}/vue` | Incrémenter les vues | - |

**Exemple - Créer une offre (POST /api/offres?userId=1)**
```json
// Request
{
  "titre": "iPhone 15 Pro",
  "description": "Smartphone Apple dernière génération",
  "prixOriginal": 1299.99,
  "prixPromo": 999.99,
  "categorie": "Électronique",
  "localisation": "Tunis",
  "imageUrl": "https://example.com/iphone.jpg",
  "dateDebut": "2024-12-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}

// Response (201 Created)
{
  "id": 1,
  "titre": "iPhone 15 Pro",
  "description": "Smartphone Apple dernière génération",
  ...
}
```

### 5.3 Gestion des Favoris (`/api/favoris`)

| Méthode | Endpoint | Description | Paramètres |
|---------|----------|-------------|------------|
| `GET` | `/?userId=` | Favoris d'un utilisateur | `userId` |
| `POST` | `/{offreId}?userId=` | Ajouter aux favoris | `userId` |
| `DELETE` | `/{offreId}?userId=` | Retirer des favoris | `userId` |

### 5.4 Statistiques Vendeur (`/api/statistiques`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/vendor/{vendorId}` | Statistiques complètes |

**Exemple - Response**
```json
{
  "totalOffres": 15,
  "offresActives": 12,
  "offresExpirees": 3,
  "totalVues": 450,
  "totalFavoris": 78,
  "moyenneVues": 30.0,
  "offresCoupDeCoeur": 2,
  "badges": ["Vendeur Fiable ✓", "Vendeur Populaire ⭐"],
  "offrePopulaire": {
    "id": 5,
    "titre": "iPhone 15 Pro",
    "vues": 120
  }
}
```

### 5.5 Rapports (`/api/rapports`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/vendor/{vendorId}` | Liste des rapports |
| `POST` | `/vendor/{vendorId}/generer?periode=` | Générer un rapport |

### 5.6 Vendeur (`/api/vendeur`)

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/dashboard?userId=` | Dashboard vendeur |
| `GET` | `/offres-stats?userId=` | Stats par offre |
| `POST` | `/update-badges?userId=` | Mettre à jour badges |

---

## ⚙️ 6. Services Techniques

### 6.1 BadgeService
Gestion des badges vendeur basée sur les performances :

| Badge | Condition |
|-------|-----------|
| Vendeur Fiable ✓ | 10+ offres créées |
| Vendeur Populaire ⭐ | 30+ favoris reçus |
| Top Vendeur 🏆 | 100+ favoris reçus |
| Vendeur Expert 💎 | 50+ offres créées |

### 6.2 CoupDeCoeurService
Sélection automatique des offres populaires :
- **Éligibilité** : ≥1 favori OU ≥3 vues
- **Score** : `(favoris × 0.7) + (vues × 0.3)`
- **Sélection** : Top 10 offres par score

### 6.3 ScheduledTasks (Tâches Planifiées)

| Tâche | Fréquence | Description |
|-------|-----------|-------------|
| `deleteExpiredOffres` | Toutes les heures | Supprime les offres expirées |
| `updateBadges` | Tous les jours à 3h | Met à jour les badges |
| `updateCoupsDeCoeur` | Toutes les 6 heures | Recalcule les coups de cœur |

### 6.4 RapportService
Génération automatique de rapports :
- **Hebdomadaire** : Tous les lundis à 8h
- **Mensuel** : Le 1er de chaque mois à 8h
- Contient : offres créées, supprimées, expirées, vues, favoris

---

## 🖥️ 7. Frontend

### 7.1 Structure des Pages

| Page | Route | Description |
|------|-------|-------------|
| `Home.jsx` | `/` | Page d'accueil avec recherche et liste des offres |
| `Login.jsx` | `/login` | Formulaire de connexion |
| `Register.jsx` | `/register` | Formulaire d'inscription |
| `OffreDetails.jsx` | `/offre/:id` | Détails d'une offre |
| `CreateOffre.jsx` | `/creer-offre` | Création d'offre (vendeur) |
| `EditOffre.jsx` | `/modifier-offre/:id` | Modification d'offre |
| `MesOffres.jsx` | `/mes-offres` | Liste des offres du vendeur |
| `Favoris.jsx` | `/favoris` | Favoris de l'utilisateur |
| `VendorStatistiques.jsx` | `/statistiques` | Dashboard vendeur |

### 7.2 Description des Principaux Écrans

#### Page d'Accueil (`Home.jsx`)
- **Barre de recherche unifiée** : Recherche par mot-clé ET localisation
- **Filtres par catégorie** : Électronique, Mode, Maison, Sport, Alimentation, Autre
- **Section "Coups de Cœur"** : Offres les plus populaires (max 10)
- **Section "Bientôt Expiré"** : Offres expirant dans 48h avec compte à rebours
- **Liste des offres** : Cartes avec image, prix, réduction, localisation
- **Boutons d'action** : Voir détails, Ajouter aux favoris

#### Dashboard Vendeur (`VendorStatistiques.jsx`)
- **Statistiques globales** : Total offres, vues, favoris, coups de cœur
- **Progression des badges** : Barres de progression vers les objectifs
- **Offre la plus populaire** : Mise en avant
- **Historique des rapports** : Liste des rapports générés

### 7.3 Service API (`api.js`)
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:8081/api';

// Authentification
export const register = (userData) => api.post('/auth/register', userData);
export const login = (credentials) => api.post('/auth/login', credentials);

// Offres
export const getAllOffres = () => api.get('/offres');
export const getOffreById = (id) => api.get(`/offres/${id}`);
export const createOffre = (data, userId) => api.post(`/offres?userId=${userId}`, data);
export const updateOffre = (id, data, userId) => api.put(`/offres/${id}?userId=${userId}`, data);
export const deleteOffre = (id, userId) => api.delete(`/offres/${id}?userId=${userId}`);
export const getOffresByCategorie = (cat) => api.get(`/offres/categorie/${cat}`);
export const getOffresByLocalisation = (loc) => api.get(`/offres/localisation/${loc}`);

// Favoris
export const getFavoris = (userId) => api.get(`/favoris?userId=${userId}`);
export const addFavori = (offreId, userId) => api.post(`/favoris/${offreId}?userId=${userId}`);
export const removeFavori = (offreId, userId) => api.delete(`/favoris/${offreId}?userId=${userId}`);
```

---

## 🧪 8. Tests

### 8.1 Tests Postman

#### Collection des Tests API

**1. Test Inscription**
```
POST http://localhost:8081/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@email.com",
  "password": "123456",
  "role": "USER"
}

✅ Expected: 201 Created
```

**2. Test Connexion**
```
POST http://localhost:8081/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}

✅ Expected: 200 OK avec id, username, email, role
```

**3. Test Création Offre**
```
POST http://localhost:8081/api/offres?userId=1
Content-Type: application/json

{
  "titre": "Test Offre",
  "description": "Description test",
  "prixOriginal": 100,
  "prixPromo": 80,
  "categorie": "Électronique",
  "localisation": "Tunis",
  "dateDebut": "2024-12-01T00:00:00",
  "dateExpiration": "2024-12-31T23:59:59"
}

✅ Expected: 201 Created
```

**4. Test Recherche**
```
GET http://localhost:8081/api/offres/search?keyword=iphone

✅ Expected: 200 OK avec liste d'offres
```

**5. Test Favoris**
```
POST http://localhost:8081/api/favoris/1?userId=2

✅ Expected: 201 Created
```

**6. Test Statistiques**
```
GET http://localhost:8081/api/statistiques/vendor/1

✅ Expected: 200 OK avec stats complètes
```

### 8.2 MySQL Workbench

#### Requêtes de Vérification

```sql
-- Vérifier les utilisateurs
SELECT id, username, email, role, created_at FROM users;

-- Vérifier les offres d'un vendeur
SELECT id, titre, prix_promo, categorie, vues, coup_de_coeur 
FROM offres WHERE user_id = 1;

-- Statistiques favoris par vendeur
SELECT u.username, COUNT(f.id) as total_favoris
FROM users u
JOIN offres o ON o.user_id = u.id
JOIN favoris f ON f.offre_id = o.id
GROUP BY u.id;

-- Offres coup de coeur
SELECT titre, vues, coup_de_coeur FROM offres 
WHERE coup_de_coeur = true;

-- Badges des vendeurs
SELECT u.username, ub.badge 
FROM users u
JOIN user_badges ub ON ub.user_id = u.id;
```

### 8.3 Eclipse IDE

#### Configuration du Projet

1. **Import Maven Project**
   - File → Import → Maven → Existing Maven Projects
   - Sélectionner `dealspot-backend`

2. **Run Configuration**
   - Right-click sur `DealspotBackendApplication.java`
   - Run As → Spring Boot App

3. **Debug Mode**
   - Placer des breakpoints dans les contrôleurs
   - Debug As → Spring Boot App

#### Structure dans Eclipse
```
dealspot-backend
├── src/main/java
│   └── com.dealspot.backend
│       ├── DealspotBackendApplication.java
│       ├── config
│       ├── controller
│       ├── dto
│       ├── entity
│       ├── exception
│       ├── repository
│       └── service
├── src/main/resources
│   └── application.properties
└── pom.xml
```

---

## 🚀 9. Démarrage du Projet

### Backend (Eclipse / Terminal)
```bash
cd dealspot-backend
./mvnw spring-boot:run
# Ou dans Eclipse: Run As → Spring Boot App
```
**Serveur accessible sur** : `http://localhost:8081`

### Frontend (VS Code / Terminal)
```bash
cd dealspot-frontend
npm install
npm run dev
```
**Application accessible sur** : `http://localhost:5173`

### Base de Données (MySQL Workbench)
```sql
CREATE DATABASE dealspot;
-- Les tables sont créées automatiquement par Hibernate (ddl-auto=update)
```

---

## 📊 10. Schéma de la Base de Données

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   users     │       │   offres    │       │  favoris    │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──┐   │ id (PK)     │◄──┐   │ id (PK)     │
│ username    │   │   │ titre       │   │   │ user_id(FK) │──►users
│ email       │   │   │ description │   │   │ offre_id(FK)│──►offres
│ password    │   │   │ prix_orig   │   │   │ created_at  │
│ role        │   │   │ prix_promo  │   │   └─────────────┘
│ created_at  │   │   │ categorie   │   │
└─────────────┘   │   │ localisation│   │   ┌─────────────┐
                  │   │ image_url   │   │   │user_badges  │
┌─────────────┐   │   │ date_debut  │   │   ├─────────────┤
│rapport_vendor│  │   │ date_exp    │   │   │ user_id(FK) │──►users
├─────────────┤   │   │ user_id(FK) │───┘   │ badge       │
│ id (PK)     │   │   │ vues        │       └─────────────┘
│ vendor_id   │───┘   │ coup_coeur  │
│ date_gen    │       │ created_at  │
│ periode     │       └─────────────┘
│ total_offres│
│ total_vues  │
│ total_fav   │
└─────────────┘
```

---

## ✅ 11. Conclusion

DealSpot est une application web complète utilisant une architecture REST moderne avec :

- **Backend robuste** en Spring Boot avec services métier découplés
- **API RESTful** bien structurée et documentée
- **Base de données relationnelle** MySQL avec JPA/Hibernate
- **Frontend réactif** en React avec Tailwind CSS
- **Fonctionnalités avancées** : badges, coups de cœur, rapports automatiques
- **Tâches planifiées** pour la maintenance automatique

Le projet respecte les bonnes pratiques de développement web et offre une expérience utilisateur fluide pour la gestion d'offres promotionnelles.

---

*Rapport généré le 4 décembre 2025*

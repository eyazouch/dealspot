# 🛍️ DealSpot Backend

Backend API REST pour la plateforme de bons plans en temps réel.

## 🚀 Technologies

- **Java** 17+
- **Spring Boot** 4.0
- **MySQL** 8.0
- **Maven** 3.8+
- **Hibernate** 7.1

## 📋 Prérequis

- JDK 17 ou supérieur
- MySQL 8.0+
- Maven 3.8+

## ⚙️ Installation

### 1. Cloner le repository
```bash
git clone https://github.com/eyazouch/dealspot.git
cd dealspot/dealspot-backend
```

### 2. Configurer MySQL

Créer la base de données :
```sql
CREATE DATABASE dealspot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Configuration

Modifier `src/main/resources/application.properties` :
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/dealspot
spring.datasource.username=root
spring.datasource.password=TON_MOT_DE_PASSE
```

### 4. Lancer l'application
```bash
mvn spring-boot:run
```

L'API sera accessible sur : `http://localhost:8081`

## 📚 Documentation API

### Authentification

#### Inscription
- **POST** `/api/auth/register`
- Body :
```json
{
  "username": "yessine",
  "email": "yessine@example.com",
  "password": "password123",
  "role": "VENDEUR"
}
```

#### Connexion
- **POST** `/api/auth/login`
- Body :
```json
{
  "username": "yessine",
  "password": "password123"
}
```

### Offres

- **GET** `/api/offres` - Toutes les offres actives
- **GET** `/api/offres/{id}` - Détail d'une offre
- **POST** `/api/offres?userId={userId}` - Créer une offre
- **PUT** `/api/offres/{id}?userId={userId}` - Modifier une offre
- **DELETE** `/api/offres/{id}?userId={userId}` - Supprimer une offre
- **GET** `/api/offres/categorie/{categorie}` - Filtrer par catégorie
- **GET** `/api/offres/localisation/{localisation}` - Filtrer par localisation

### Favoris

- **GET** `/api/favoris?userId={userId}` - Mes favoris
- **POST** `/api/favoris/{offreId}?userId={userId}` - Ajouter aux favoris
- **DELETE** `/api/favoris/{offreId}?userId={userId}` - Retirer des favoris

## 🗄️ Structure de la Base de Données

### Table `users`
- `id` (PK)
- `username` (unique)
- `email` (unique)
- `password`
- `role` (USER, VENDEUR, ADMIN)
- `created_at`

### Table `offres`
- `id` (PK)
- `titre`
- `description`
- `prix_original`
- `prix_promo`
- `categorie`
- `localisation`
- `image_url`
- `date_debut`
- `date_expiration`
- `user_id` (FK)
- `created_at`

### Table `favoris`
- `id` (PK)
- `user_id` (FK)
- `offre_id` (FK)
- `created_at`

## 📦 Structure du Projet
```
dealspot-backend/
├── src/
│   └── main/
│       ├── java/
│       │   └── com/dealspot/backend/
│       │       ├── config/
│       │       ├── controller/
│       │       ├── dto/
│       │       ├── entity/
│       │       ├── exception/
│       │       ├── repository/
│       │       ├── service/
│       │       └── DealspotBackendApplication.java
│       └── resources/
│           └── application.properties
├── pom.xml
└── README.md
```

## 👨‍💻 Auteur

**Eya** -**Saba** - Projet Académique Services Web

## 📄 Licence

Ce projet est réalisé dans un cadre académique.

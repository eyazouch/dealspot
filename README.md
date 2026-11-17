# DealSpot

Plateforme web de bons plans à durée limitée. Les vendeurs publient des offres promotionnelles et suivent leurs statistiques ; les utilisateurs consultent, recherchent et filtrent les offres, puis les enregistrent en favoris.

Projet réalisé dans le cadre du cours Services Web.

## Fonctionnalités

**Utilisateurs**
- Inscription et connexion
- Consultation des offres actives, recherche, filtres par catégorie et par localisation
- Favoris
- Sélection « coups de cœur » : offres les plus populaires, classées par un score qui pondère les favoris (70 %) et les vues (30 %)

**Vendeurs**
- Création, modification et suppression d'offres
- Tableau de bord et statistiques par offre (vues, favoris)
- Rapport hebdomadaire d'activité
- Badges attribués selon le nombre d'offres publiées et de favoris reçus

**Tâches planifiées**
- Suppression des offres expirées, toutes les heures
- Mise à jour des badges vendeurs, chaque nuit
- Génération des rapports vendeurs, chaque lundi matin

## Stack technique

| Couche | Technologies |
|---|---|
| Backend | Java 17, Spring Boot 4 (Web MVC, Data JPA, Security, Validation), Maven |
| Base de données | MySQL 8 |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios |

## Structure

```
dealspot-backend/    API REST Spring Boot (contrôleurs, services, entités JPA, tâches planifiées)
dealspot-frontend/   Interface React
```

## Installation

### Base de données

```sql
CREATE DATABASE dealspot CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Renseigner les identifiants MySQL dans `dealspot-backend/src/main/resources/application.properties`.

### Backend

```bash
cd dealspot-backend
./mvnw spring-boot:run
```

L'API est disponible sur http://localhost:8081.

### Frontend

```bash
cd dealspot-frontend
npm install
npm run dev
```

L'interface est disponible sur http://localhost:5173.

## API

| Ressource | Préfixe | Principales opérations |
|---|---|---|
| Authentification | `/api/auth` | `POST /register`, `POST /login` |
| Offres | `/api/offres` | liste, détail, création, modification, suppression, `/search`, `/categorie/{c}`, `/localisation/{l}`, `/coups-de-coeur` |
| Favoris | `/api/favoris` | ajout et retrait d'une offre |
| Vendeur | `/api/vendeur` | `/dashboard`, `/offres-stats` |
| Statistiques | `/api/statistiques` | statistiques d'un vendeur |
| Rapports | `/api/rapports` | consultation et génération du rapport d'un vendeur |

Le détail des choix techniques figure dans le [rapport technique](RAPPORT_TECHNIQUE_DEALSPOT.md).

## Équipe

Eya Zouch, Saba

# SteganoIA Web - Plateforme de détection et stéganographie d'images

## Description
Plateforme web permettant :
- La détection d'images générées par IA
- L'application de stéganographie sur des images (PNG, JPEG, etc.)
- La gestion des utilisateurs (admin/user) avec rôles et sécurité
- L'intégration d'un modèle IA via une API Flask

## Architecture
- **Backend** : Spring Boot, PostgreSQL, DDD (Domain Driven Design)
- **Frontend** : React.js + Vite (ultra-rapide)
- **API IA** : Flask (Python) avec TensorFlow/Keras
- **Base de données** : PostgreSQL (via Docker)
- **Sécurité** : Spring Security + JWT

## Démarrage rapide

### 1. Lancer la base PostgreSQL
```bash
docker-compose up -d postgres
```

### 2. Lancer l'API Flask (Python)
```bash
cd /chemin/vers/votre/flask-app
# Activer l'environnement virtuel
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate     # Windows

# Démarrer Flask
python app.py
```
L'API Flask sera accessible sur http://127.0.0.1:5000

### 3. Lancer le backend Spring Boot
```bash
cd backend
./mvnw spring-boot:run
```
Le backend sera accessible sur http://localhost:8080

### 4. Lancer le frontend React + Vite
```bash
cd frontend/front
npm install
npm run dev
```
Le frontend sera accessible sur http://localhost:3000

## Configuration Flask

Votre API Flask doit exposer les endpoints suivants :
- `POST /api/v2/upload` - Analyse complète d'image
- `POST /api/v2/add_steganography` - Ajout de stéganographie
- `POST /api/v2/verify_integrity` - Vérification d'intégrité
- `GET /api/v2/test` - Test de connectivité

## Test de connectivité

Une fois tous les services démarrés :
1. Connectez-vous avec `admin`/`admin123` ou `user`/`user123`
2. Le Dashboard affiche le statut de connexion Flask
3. Testez l'upload d'une image pour vérifier l'intégration

## Endpoints principaux
- `/api/auth/login` : Authentification JWT
- `/api/users` : Gestion des utilisateurs (CRUD, sécurisé)
- `/api/images` : Gestion des images (upload, analyse, stéganographie)
- `/api/images/flask-status` : Statut de connexion Flask

## Comptes par défaut
- **Admin** : `admin` / `admin123`
- **User** : `user` / `user123`

## Sécurité
- Authentification JWT avec tokens
- Rôles : ADMIN, USER
- Mots de passe hashés avec BCrypt
- Routes protégées côté frontend

## Technologies
- **Backend** : Spring Boot 3.5, PostgreSQL 16, Spring Security + JWT
- **Frontend** : React 18, Vite 5, Material-UI, React Router
- **API IA** : Flask, TensorFlow, PIL/Pillow
- **Database** : PostgreSQL avec Docker
- **Build** : Maven (backend), Vite (frontend)

## Dépannage

### Problème de connexion Flask
- Vérifiez que Flask démarre sur http://127.0.0.1:5000
- Consultez le Dashboard pour voir le statut de connexion
- Testez manuellement : `curl http://127.0.0.1:5000/api/v2/test`

### Problème de base SQLite Flask
Si vous voyez l'erreur SQLite dans Flask :
```bash
⚠️ Erreur lors de l'initialisation de la base de données: (sqlite3.OperationalError) unable to open database file
```
L'application Flask peut continuer sans base de données pour les tests d'intégration.

## Auteur
Projet démo pour plateforme SteganoIA.

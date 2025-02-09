# Feuille de Route pour l'Application de Recensement Discord

## 1. Configuration de l'environnement
- [ ] Installer Node.js (version 18.x ou plus).
- [ ] Installer SvelteKit (version 2.x).
- [ ] Installer TypeScript (version 5.x).
- [ ] Installer Vite (version 5.x).
- [ ] Installer PNPM (version 8.x ou plus).

## 2. Mise en place de la base de données
- [ ] Choisir PostgreSQL comme système de gestion de base de données.
- [ ] Créer les tables nécessaires :
  - Utilisateurs :
    - `snowflake` (bigint)
    - `discord_username` (varchar)
    - `nom` (varchar)
    - `prénom` (varchar)
    - `email` (varchar)
    - `status` (boolean, false par défaut)
  - Promotions :
    - `snowflake` (bigint)
    - `nom` (varchar)
  - Channels :
    - `snowflake` (bigint)
    - `nom` (varchar)
  - Rôles :
    - `snowflake` (bigint)
    - `nom` (varchar)
- [ ] Assurer la normalisation des données pour respecter les formes normales.

## 3. Développement du Backend (NestJS)
- [ ] Créer la structure de modules :
  - [ ] Module pour les utilisateurs.
  - [ ] Module pour les promotions.
  - [ ] Module pour les channels.
  - [ ] Module pour les rôles.
- [ ] Implémenter les contrôleurs pour gérer les routes API.
- [ ] Créer des services pour la logique métier et la persistance des données.
- [ ] Utiliser MikroORM pour la gestion des entités.
- [ ] Mettre en place l'authentification OAuth avec Discord :
  - [ ] Gérer le flux d'authentification.
  - [ ] Échanger le code d'autorisation contre un token d'accès.
  - [ ] Générer un JWT pour l'utilisateur.

## 4. Développement du Frontend (SvelteKit)
- [ ] Créer la structure de fichiers :
  - [ ] Pages pour l'accueil, la connexion, le profil et le formulaire de recensement.
- [ ] Implémenter le formulaire de recensement :
  - [ ] Champs pour le nom, le prénom, l'email, la promotion et une case à cocher pour les conditions d'utilisation.
- [ ] Gérer l'état global avec Svelte stores.
- [ ] Utiliser Tailwind CSS pour le style des composants.
- [ ] Implémenter l'accessibilité sur les éléments interactifs.

## 5. Tests
- [ ] Écrire des tests unitaires pour chaque fonction publique dans le backend.
- [ ] Écrire des tests d'intégration pour les modules API.
- [ ] Écrire des tests de bout en bout pour les flux critiques de l'utilisateur.
- [ ] Utiliser Jest pour les tests.

## 6. Sécurité
- [ ] Mettre en œuvre des bonnes pratiques de sécurité :
  - [ ] Validation des entrées utilisateur.
  - [ ] Gestion des erreurs et des exceptions.
  - [ ] Protection des routes sensibles avec des gardes d'authentification.

## 7. Déploiement
- [ ] Préparer l'application pour le déploiement :
  - [ ] Configurer les variables d'environnement.
  - [ ] Optimiser les performances.
- [ ] Déployer l'application sur un serveur (par exemple, Heroku, Vercel, ou un serveur dédié).

## 8. Maintenance et évolutions
- [ ] Surveiller les performances et les erreurs.
- [ ] Recueillir les retours des utilisateurs pour des améliorations futures.
- [ ] Planifier des mises à jour régulières pour la sécurité et les fonctionnalités.
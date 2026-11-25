# Gestion des utilisateurs — API REST sécurisée (Spring Boot + React)

Projet de Master Cryptographie et Sécurité de l'Information (Université Mohammed V de Rabat, 2025-2026),
réalisé en équipe de 3. Application d'administration : API REST Spring Boot protégée par JWT + dashboard React.

## Stack
Java 17 · Spring Boot 3.5 · Spring Security · JWT (jjwt) · Spring Data JPA · MySQL · React 19 · Vite · Tailwind · Axios · Postman

## Fonctionnalités
- Connexion administrateur (JWT, expiration 1 h)
- CRUD utilisateurs, recherche, filtre par rôle, pagination, tri
- Dashboard (statistiques, derniers ajoutés, répartition des rôles), gestion du profil et du mot de passe

## Sécurité (audit et durcissement)
Audit complet, preuves et tests : voir [SECURITY.md](SECURITY.md).

La première version contenait plusieurs failles, corrigées dans cette version :

| Problème initial | Correction |
|---|---|
| Routes `/users/**` en `permitAll()` : le JWT ne protégeait rien | Seul `POST /users/login` est public ; le reste exige le rôle `ADMIN` (`denyAll` par défaut) |
| Hash BCrypt renvoyé dans toutes les réponses JSON | `@JsonProperty(access = WRITE_ONLY)` sur le mot de passe |
| Secret JWT et mot de passe MySQL en dur dans le code | Variables d'environnement (`JWT_SECRET` ≥ 32 car., `DB_PASSWORD`), démarrage refusé si secret trop court |
| Création de compte ouverte : escalade de privilèges (`role: ADMIN`) | Création réservée aux admins, rôle validé (`ADMIN\|USER`) |
| Aucune validation des entrées | Bean Validation (`@Valid`, email, longueur mot de passe 8-72), email unique (409) |
| Login raté renvoyait `200` + `null` | `401`, et blocage 15 min après 5 échecs par email (`429`) |
| Tri sur un champ choisi par le client, pagination non bornée | Liste blanche de champs, taille de page ≤ 100 |
| Détails d'erreur et SQL dans les logs | `show-sql=false`, `server.error.include-*=never` |
| Rôle fixé dans le token | Rôle relu en base à chaque requête (compte supprimé/rétrogradé = accès perdu) |

### Limites connues / pistes d'amélioration
- Token stocké dans `localStorage` (exposé en cas de XSS) : préférer un cookie `HttpOnly` + `SameSite`, et une CSP.
- Anti brute-force en mémoire (non partagé entre instances) : utiliser Redis en production.
- Pas de refresh token ni de révocation.
- HTTPS non configuré en local ; obligatoire en production.
- Pas encore de migrations (Flyway) : `ddl-auto=update` est réservé au développement.

## Lancer le projet
```bash
# 1. Variables d'environnement (voir .env.example)
export DB_PASSWORD=...   JWT_SECRET=$(openssl rand -base64 48)

# 2. Backend (http://localhost:8081)
cd backend && ./mvnw spring-boot:run

# 3. Frontend (http://localhost:5173)
cd frontend && npm install && npm run dev
```
Il faut un premier compte `ADMIN` en base. Génère un hash BCrypt de ton mot de passe, puis :
```sql
INSERT INTO user (name, email, password, role) VALUES ('Admin', 'admin@example.com', '<hash BCrypt>', 'ADMIN');
```

## Tests
```bash
cd backend && ./mvnw test      # tests unitaires JWT (signature, expiration, falsification)
```
Les routes ont aussi été testées avec Postman (voir le rapport PDF).

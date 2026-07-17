# 🇨🇲 Cursor Cameroun — Site Officiel

Plateforme communautaire officielle de Cursor Cameroun

[![Next.js](https://img.shields.io/badge/Next.js-16.2.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)

[Demo Live](https://cursor-cameroun-nine.vercel.app) · [Signaler un bug](https://github.com/cursor-cameroun/cursor-cameroun/issues) · [Proposer une feature](https://github.com/cursor-cameroun/cursor-cameroun/issues)

---

## Table des matières

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Charte graphique](#charte-graphique)
- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide](#démarrage-rapide)
- [Variables d'environnement](#variables-denvironnement)
- [Structure du projet](#structure-du-projet)
- [Conformité CDC](#conformité-cdc)
- [Aperçus visuels](#aperçus-visuels)
- [Contribution](#contribution)
- [Auteur](#auteur)

---

## Aperçu

**Cursor Cameroun** est la communauté officielle des développeurs camerounais utilisant [Cursor](https://cursor.sh/) — l'éditeur de code assisté par IA. Ce site centralise les événements, la galerie de projets, la roadmap communautaire et les ressources pour rejoindre la communauté.

> Projet né lors du **Mini Hackathon #1** de Cursor Cameroun.

---

## Stack technique

| Technologie | Version | Usage |
| --- | --- | --- |
| **Next.js** (App Router) | 16.2.5 | Framework fullstack |
| **TypeScript** | 5.x | Typage statique |
| **Tailwind CSS** | 4.x | Styling utilitaire |
| **next-intl** | 4.x | Internationalisation FR/EN |
| **Framer Motion** | 12.x | Animations |
| **React Leaflet** | 5.x | Carte interactive Cameroun |
| **React Hook Form** + **Zod** | — | Formulaires et validation |
| **Resend** | — | Envoi d'emails transactionnels |

---

## Charte graphique

La palette est **Noir / Blanc / Gris uniquement**, conforme au cahier des charges officiel.

Les tokens CSS sont définis dans [src/app/globals.css](src/app/globals.css).

- Thème **sombre par défaut**
- Thème clair disponible via le sélecteur intégré

---

## Fonctionnalités

- [x] Pages principales : Home, Events, Gallery, Roadmap, Community
- [x] Navigation responsive avec CTA, sélecteur de langue et de thème
- [x] Internationalisation FR / EN (`next-intl`, messages centralisés)
- [x] Galerie avec filtre événement/date, lightbox et lazy-loading
- [x] Carte Cameroun interactive (Leaflet)
- [x] Gestion d'états d'événements : `upcoming`, `ongoing`, `past`
- [x] SEO : sitemap dynamique + robots.txt
- [x] Metadata optimisée sur toutes les pages principales
- [x] Intégration des liens officiels (WhatsApp / GitHub org / LinkedIn)
- [x] Migration images WebP/AVIF (en cours sur certaines sources)
- [x] Carte Cameroun — enrichissement "10 régions" à finaliser

---

## Démarrage rapide

### Prérequis

- Node.js ≥ 18
- npm ≥ 9

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/cursor-cameroun/cursor-cameroun.git
cd cursor-cameroun

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env

# Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

### Commandes disponibles

```bash
npm run dev      # Serveur de développement (hot reload)
npm run build    # Build de production
npm run start    # Lancer le build de production
npm run lint     # Vérification du code (ESLint)
```

---

## Variables d'environnement

Copier `.env.example` en `.env` et renseigner les valeurs :

| Variable | Description |
| --- | --- |
| `ADMIN_PASSWORD` | Mot de passe du tableau de bord admin |
| `RESEND_API_KEY` | Clé API [Resend](https://resend.com) pour les emails |
| `NEXT_PUBLIC_BASE_URL` | URL de base du site en production |

---

## Structure du projet

```text
cursor-cameroun/
├── src/
│   ├── app/              # Routes App Router (layouts, pages, API)
│   ├── components/       # Composants réutilisables
│   ├── data/             # Données statiques (events, links…)
│   └── lib/              # Utilitaires et helpers
├── messages/             # Traductions FR / EN
├── public/               # Assets statiques (images, brand, gallery)
├── scripts/              # Scripts utilitaires
├── AGENT.md              # Règles d'usage Cursor (hackathon)
├── .cursorrules          # Règles projet Cursor AI
└── next.config.ts        # Configuration Next.js
```

---

## Conformité CDC

Conformité au Cahier des Charges officiel (v2.0) :

| Exigence | Statut |
| --- | --- |
| Pages obligatoires (Home, Events, Gallery, Roadmap, Community) | ✅ |
| Navigation responsive + CTA rejoindre | ✅ |
| i18n FR/EN | ✅ |
| Thème sombre par défaut + thème clair | ✅ |
| Sitemap + robots.txt | ✅ |
| Metadata SEO sur les pages principales | ✅ |
| Lazy-loading images | ✅ |
| Migration WebP/AVIF (toutes sources) | 🔄 |
| Carte Cameroun interactive | ✅ |
| Enrichissement carte (10 régions) | 🔄 |

---

## Aperçus visuels

### Édition du AGENT.md avec Cursor

![Agent MD](public/gallery/AGENT.png)

### Session de mise à jour du README

![README](public/gallery/README.png)

### Session de travail collaboratif

![Session de Travail](public/gallery/WORK.png)

---

## Contribution

Les contributions sont les bienvenues ! Voici comment participer :

1. **Fork** le dépôt
2. Créer une branche : `git checkout -b feat/ma-feature`
3. Committer les changements : `git commit -m "feat: description de la feature"`
4. Pousser la branche : `git push origin feat/ma-feature`
5. Ouvrir une **Pull Request** vers `main`

Merci de respecter la convention de commit [Conventional Commits](https://www.conventionalcommits.org/).

---

## Auteur

**Azangue Leonel** — Contributeur principal

[![GitHub](https://img.shields.io/badge/GitHub-Delmat237-181717?style=flat-square&logo=github)](https://github.com/Delmat237)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-leonel--azangue-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/leonel-azangue)
[![Email](https://img.shields.io/badge/Email-azangueleonel9@gmail.com-EA4335?style=flat-square&logo=gmail)](mailto:azangueleonel9@gmail.com)
[![WhatsApp](https://img.shields.io/badge/WhatsApp-%2B237%2069%20477%203472-25D366?style=flat-square&logo=whatsapp)](https://wa.me/237694773472)

---

Fait avec ❤️ au Cameroun · Propulsé par [Cursor](https://cursor.sh/) & [Next.js](https://nextjs.org/)

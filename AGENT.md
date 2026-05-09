# Cursor Cameroun — Mini Hackathon #1

Ce projet a été conçu et développé **intégralement avec Cursor**, conformément au cahier des charges du mini hackathon.

## Ce que Cursor a permis d’accélérer

- **Socle Robuste** : Mise en place rapide de Next.js + Tailwind CSS.
- **Internationalisation** : Support multilingue FR/EN complet avec `next-intl`.
- **Design System** : UI premium respectant la charte graphique Cursor (Noir, Blanc, Gris).
- **Espace Admin** : Système d'administration des événements avec authentification sécurisée.
- **Gestion des Données** : CRUD d'événements persistant en JSON avec support des images de couverture et galeries via URLs.
- **Notifications Automatiques** : Intégration de Resend pour notifier par email lors de l'ajout de nouveaux événements.
- **Expérience Utilisateur** : Animations fluides avec `framer-motion` et design adaptatif (Mobile/Desktop).

## Structure du projet

- `src/app/` : Pages principales et routes API (Auth, Events, Mail).
- `src/components/` : Composants UI réutilisables (Navbar, Footer premium, Admin Forms).
- `src/middleware.ts` : Gestion combinée des locales et de la protection des routes admin.
- `src/data/` : Sources de vérité pour les événements, la roadmap et les liens communautaires.
- `messages/` : Dictionnaires de traduction pour une I18n propre.

## Statut des Tâches
- [x] Remplacer les liens officiels (WhatsApp, GitHub, LinkedIn).
- [x] Intégrer les logos officiels Cursor.
- [x] Sécuriser l'accès à la page Admin via `/login`.
- [x] Redessiner le Footer pour un aspect plus professionnel.
- [x] Ajouter le support des images par URL externe.
- [x] Configurer les notifications par email pour les nouveaux événements.

## À finaliser (Post-Hackathon)
- Ajouter des photos réelles dans `public/gallery/` pour les événements passés.
- Optimiser davantage les performances LCP avec des formats d'image nouvelle génération.


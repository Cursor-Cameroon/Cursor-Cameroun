# Cursor Cameroun — Site officiel

Site officiel de la communauté **Cursor Cameroun** (Mini Hackathon #1).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- `next-intl` (FR/EN)
- `next-themes` (sombre par défaut + clair)

## Charte graphique (obligatoire)

**Noir / Blanc / Gris uniquement** (conforme au cahier des charges).  
Tokens CSS dans `src/app/globals.css`.

## Démarrer en local

```bash
cd cursor-cameroun
npm install
npm run dev
```

Puis ouvrir `http://localhost:3000`.

## Données et Assets
- [x] Liens officiels (WhatsApp / GitHub org / LinkedIn) intégrés dans `src/data/links.ts`
- [x] Événements et pages détails complétés dans `src/data/events.ts`
- [x] Photos professionnelles (N&B) ajoutées dans `public/gallery/`
- [x] Logos officiels Cursor ajoutés dans `public/brand/`

## Livrables hackathon

- `.cursorrules` : règles projet Cursor
- `AGENT.md` : usage de Cursor pendant le hackathon
- SEO : `src/app/sitemap.ts` + `src/app/robots.ts`

## Galerie & Aperçus de Travail

Voici quelques captures d'écran illustrant notre travail collaboratif avec Cursor :

### Édition du AGENT.md
![Agent MD](cursor-cameroun/public/gallery/AGENT.png)

### Mise à jour du README
![README](/gallery/README.png)

### Session de Travail
![Session de Travail](/gallery/WORK.png)

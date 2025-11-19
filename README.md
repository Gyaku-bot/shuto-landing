# SHUTO Landing Page

Landing page officielle de SHUTO - Services de dashboards sur-mesure et automatisations intelligentes.

## 🚀 Stack Technique

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Hébergement:** Cloudflare Pages
- **Déploiement:** Automatique via Git

## 🎨 Design

Le site utilise une palette dark slate avec des accents indigo pour un look premium et moderne :
- Fond : Dégradé dark slate (#0F172A → #1E293B)
- Accent : Indigo (#818CF8)
- Logo : Cercle blanc animé avec trace progressive + S indigo

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build
```

Le site sera accessible sur `http://localhost:3000`

## 🌐 Déploiement

Le site est hébergé sur **Cloudflare Pages** avec un déploiement automatique.

### Configuration Cloudflare

1. **Build command:** `npm run build`
2. **Build output directory:** `out` (ou `.next` selon la config)
3. **Branch de production:** `main`

### Workflow de déploiement

#### 1. Développement local
```bash
# Créer une branche pour les modifications
git checkout -b nom-de-la-branche

# Faire les modifications...
# Tester en local avec npm run dev

# Commiter les changements
git add .
git commit -m "Description des changements"
```

#### 2. Tester avant déploiement
```bash
# Builder localement pour vérifier
npm run build
npm run start
```

#### 3. Déployer en production
```bash
# Passer sur la branche main
git checkout main

# Merger la branche de développement
git merge nom-de-la-branche

# Pusher sur GitHub
git push origin main
```

#### 4. Déploiement automatique
- Cloudflare Pages détecte automatiquement le push sur `main`
- Lance le build automatiquement
- Déploie la nouvelle version sur `shuto.ai`
- Le déploiement prend généralement 1-2 minutes

### Preview Deployments

Cloudflare génère automatiquement des previews pour chaque branche :
- Chaque push sur une branche crée un environnement de preview
- URL type : `design-site.shuto-landing.pages.dev`
- Utile pour tester avant de merger dans `main`

### Rollback

En cas de problème :
```bash
# Voir l'historique des commits
git log --oneline

# Revenir à un commit précédent
git revert <commit-hash>
git push origin main
```

## 📁 Structure du projet

```
shuto-landing/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Page principale
│   │   ├── layout.tsx        # Layout global
│   │   └── globals.css       # Styles globaux + animations
│   └── components/
│       └── Logo.tsx          # Composant logo animé
├── public/                   # Assets statiques
├── package.json
└── README.md
```

## 🎯 Fonctionnalités

- **Logo animé** : Animation trace progressive sur le cercle
- **Design responsive** : Adapté mobile, tablet, desktop
- **Performance** : Optimisé avec Next.js 15
- **SEO-friendly** : Métadonnées optimisées
- **Effet glassmorphism** : Cards avec backdrop-blur
- **Animations fluides** : Transitions CSS optimisées

## 📧 Contact

Pour toute question : [quentin@shuto.ai](mailto:quentin@shuto.ai)

## 📝 Licence

© 2025 Shuto. Tous droits réservés.

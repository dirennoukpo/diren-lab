# Diren Lab

Site personnel de type "Research Lab" — documentation publique d'une progression en robotique
et IA : projets, notions théoriques, expériences, journal de progression. Voir
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) pour les décisions techniques.

## Stack

Astro (statique) + Content Collections (Zod) + Tailwind CSS v4 + Pagefind (recherche full-text) +
KaTeX (équations) + Recharts (graphiques, via un îlot React). Aucun backend, aucune base de
données : le contenu Git versionné est la source de vérité.

## Installation

Nécessite Node.js ≥ 20.

```bash
npm install
npm run dev
```

Le site est servi sur `http://localhost:4321`. `/` redirige vers `/fr/`.

## Build de production

```bash
npm run build   # génère le graphe de liens, vérifie les types, build Astro, indexe Pagefind
npm run preview # sert dist/ localement
```

`npm run build` échoue si :
- une image (frontmatter ou corps Markdown/MDX) n'a pas de texte alternatif ;
- les types ne correspondent pas aux schémas Zod des collections (`astro check`).

## Créer un nouveau contenu

Chaque type de contenu a un fichier `_template.mdx` (ignoré par Astro car préfixé `_`) à copier :

| Type | Template | Destination | URL générée |
|---|---|---|---|
| Projet | `src/content/projects/_template.mdx` | `src/content/projects/<slug>.mdx` | `/fr/projects/<slug>/` |
| Notion | `src/content/notions/_template.mdx` | `src/content/notions/<slug>.mdx` | `/fr/notions/<slug>/` |
| Expérience | `src/content/experiments/_template.mdx` | `src/content/experiments/<slug>.mdx` | `/fr/experiments/<slug>/` |
| Entrée de journal | `src/content/journal/_template.mdx` | `src/content/journal/<slug>.mdx` | `/fr/journal/` (liste) |

Étapes :

1. Copier le template, renommer avec le slug voulu (kebab-case).
2. Remplir le frontmatter et le corps. Chaque template documente ses champs en commentaire.
3. Lier ce contenu à d'autres entités via `relatedTo: ["type/slug", ...]` (ou juste `"slug"` si
   même collection). Le lien inverse est généré automatiquement au build — inutile de l'ajouter
   des deux côtés.
4. Passer `draft: true` à `false` (ou retirer le champ) quand le contenu est prêt à publier.
5. Pour la version anglaise, dupliquer le fichier dans le même dossier avec `lang: en`, un slug
   différent, et le placer conceptuellement sous `/en/...` (routage automatique via `lang`).

### Graphe de liens bidirectionnel

`scripts/build-graph.mjs` parse le frontmatter de tout le contenu, calcule les références
inverses et écrit `src/data/graph.json` (généré, gitignored). Il tourne automatiquement avant
`dev` et `build` (`npm run build:graph`). Une référence vers un slug inexistant produit un
avertissement au build, pas une erreur.

### Graphiques de données expérimentales

Voir `src/data/experiments/README.md` pour le format JSON attendu et comment le référencer
depuis une expérience (`dataset: "fichier.json"` dans le frontmatter).

## Déploiement

Site 100% statique (`astro build` → `dist/`), compatible Vercel, Netlify ou GitHub Pages sans
configuration serveur. Avant le premier déploiement :

- remplacer `SITE_URL` (TODO) dans `astro.config.mjs` par le domaine réel ;
- remplacer les liens `#`/TODO dans `Footer.astro` et `about.astro`.

## Recherche

Pagefind indexe `dist/` après le build Astro (`npm run search:index`, inclus dans `npm run
build`). Aucune UI de recherche n'est encore branchée en V1 — voir
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md), section "Décisions ouvertes".

## Accessibilité & performance

- Navigation clavier complète, focus visible, lien d'évitement ("skip to content").
- Contraste AA minimum imposé par les tokens de couleur (`src/styles/global.css`).
- Alt text obligatoire : le build échoue sinon (`scripts/remark-require-alt.mjs` pour le
  Markdown/MDX ; schéma Zod pour les images de frontmatter).
- Objectif Lighthouse ≥ 95 (mobile) en Performance et Accessibilité — à vérifier après ajout de
  contenu réel et d'images (`npm run build && npm run preview`, puis Lighthouse en local).

# Décisions d'architecture

## Pourquoi Astro

Le site est à dominante contenu (Markdown/MDX versionné), consulté par des visiteurs anonymes,
sans état partagé entre utilisateurs. Astro rend chaque page en HTML statique au build, n'envoie
du JavaScript que pour les îlots explicitement interactifs (le filtre de domaine, les
graphiques Recharts), et a un support natif des Content Collections avec validation Zod — exactement
ce qu'il faut pour un graphe de contenu structuré qui doit rester rapide et indexable pendant
plusieurs années. Next.js/Remix auraient apporté du rendu serveur et une complexité de runtime
inutiles pour un site sans compte utilisateur ni donnée dynamique ; un générateur purement
Markdown (Hugo, Eleventy) aurait rendu plus difficile l'îlot React pour les graphiques et la
validation de schéma typée. Astro a été retenu sans alternative sérieuse pour ce cas d'usage.

## Le graphe de contenu plutôt qu'un blog

Les quatre collections (`projects`, `notions`, `experiments`, `journal`) forment un graphe, pas
une liste chronologique. Chaque entité déclare uniquement ses relations **sortantes** via
`relatedTo` dans son frontmatter ; `scripts/build-graph.mjs` calcule les relations entrantes au
build et écrit `src/data/graph.json`, consommé par les pages via `src/lib/graph.ts`. Alternative
écartée : maintenir manuellement les deux sens de chaque relation dans le frontmatter — rejetée
car source garantie d'incohérences dès que le contenu dépasse une dizaine d'entités.

## Contenu en fichiers Git, pas de CMS ni de base de données

Toute la donnée éditoriale vit dans `src/content/**/*.mdx`. Pas de Sanity/Contentful/Strapi, pas
de PostgreSQL. Le propriétaire du site est aussi son unique éditeur ; un CMS headless ajouterait
un service tiers, une dépendance réseau au build, et un modèle de permissions à gérer pour un
gain nul dans ce contexte. Git donne déjà l'historique, la revue de diff et la sauvegarde.

## Tailwind CSS v4 avec tokens CSS-first

Les tokens (couleurs, police, — voir `@theme` dans `src/styles/global.css`) sont définis une
seule fois et consommés par les classes utilitaires (`bg-accent`, `text-ink-muted`, etc.).
Tailwind v4 permet de définir ces tokens directement en CSS sans fichier `tailwind.config.js`
séparé, réduisant le risque de divergence entre config et usage. Palette volontairement sobre
(gris quasi neutres + un seul accent vert foncé) pour éviter l'esthétique "startup SaaS"
générique demandée à éviter.

## i18n : routes `/fr/` et `/en/` dès la V1

Astro gère le préfixage de route (`i18n.routing.prefixDefaultLocale: true`) mais ne duplique pas
automatiquement le contenu entre langues. Chaque entité de contenu porte un champ `lang`, et les
pages sous `src/pages/en/*` filtrent les collections sur `lang: 'en'`. Comme demandé, seul le FR
est rempli en V1 ; les pages EN existantes affichent un bandeau ("non traduit") plutôt que de
retourner une 404, pour que la structure de routes soit réellement prête à recevoir des
traductions sans refonte.

## Filtrage de listes sans backend

Le filtre par domaine sur `/projects` et `/notions` est un petit script client
(`src/scripts/domain-filter.ts`, progressive enhancement, pas de framework) plutôt qu'un
paramètre de requête traité côté serveur — le site étant 100% statique (pas d'adaptateur SSR),
il n'y a pas de serveur pour interpréter une query string au moment de la requête.

## Graphiques : îlot React (Recharts), pas de framework global

`@astrojs/react` n'est chargé que sur les pages d'expérience qui déclarent un `dataset`, via
`client:visible`. Alternative (Chart.js) écartée car Recharts s'intègre plus proprement en
composant React déclaratif pour ce genre de séries temporelles/mesures.

## Décisions ouvertes (à trancher avant la V1 réelle)

- **UI de recherche** : Pagefind indexe `dist/` au build, mais aucune page/composant ne branche
  encore son widget de recherche. À faire : une page ou une modale `/recherche` qui charge le JS
  Pagefind en `client:idle`.
- **Nom de domaine réel** : `SITE_URL` dans `astro.config.mjs` est un placeholder
  (`https://example.invalid`) — nécessaire pour que `@astrojs/sitemap` et les URLs canoniques
  soient corrects.
- **Stockage des images** : `public/` vs. import co-localisé avec le contenu (`src/content/.../*.jpg`
  avec l'optimisation d'image d'Astro). Le schéma actuel (`coverImage: { src, alt }`) accepte une
  chaîne brute ; passer au helper `image()` d'Astro (optimisation, formats modernes) est un
  changement mineur mais à faire avant d'ajouter de vraies photos/schémas.
- **Traduction EN** : stratégie de traduction (manuelle, ou pipeline semi-automatisé) non
  définie — la structure est prête, le processus éditorial ne l'est pas.
- **Rechargement du graphe en dev** : `build:graph` tourne une fois avant `astro dev` mais n'est
  pas ré-exécuté automatiquement quand un fichier de contenu change pendant la session (pas de
  watcher). Redémarrer `npm run dev` après avoir modifié un champ `relatedTo`.
- **Commentaires/réactions publiques** : hors scope V1 (pas de backend) ; si demandé plus tard,
  solution tierce (ex. Giscus sur GitHub Discussions) plutôt qu'un service à héberger.

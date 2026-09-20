export const languages = { fr: 'Français', en: 'English' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'fr';

export const ui = {
  fr: {
    nav_home: 'Accueil',
    nav_projects: 'Projets',
    nav_notions: 'Notions',
    nav_experiments: 'Expériences',
    nav_journal: 'Journal',
    nav_media: 'Média',
    nav_about: 'À propos',
    site_tagline: 'Laboratoire de recherche personnel — robotique & IA',
    related_projects: 'Projets liés',
    related_notions: 'Notions liées',
    related_experiments: 'Expériences liées',
    related_journal: 'Journal lié',
    skip_to_content: 'Aller au contenu principal',
    search_placeholder: 'Rechercher…',
    en_incomplete_notice:
      "This section is not translated to English yet — the French version is the source of truth.",
    view_repo: 'Voir le dépôt',
    watch_video: 'Voir la vidéo',
    read_more: 'Lire la suite',
    empty_state: 'Rien à afficher pour le moment.',
    outcome_success: 'Succès',
    outcome_partial: 'Partiel',
    outcome_failure: 'Échec',
    status_in_progress: 'En cours',
    status_completed: 'Terminé',
    status_paused: 'En pause',
  },
  en: {
    nav_home: 'Home',
    nav_projects: 'Projects',
    nav_notions: 'Notions',
    nav_experiments: 'Experiments',
    nav_journal: 'Journal',
    nav_media: 'Media',
    nav_about: 'About',
    site_tagline: 'A personal research lab — robotics & AI',
    related_projects: 'Related projects',
    related_notions: 'Related notions',
    related_experiments: 'Related experiments',
    related_journal: 'Related journal entries',
    skip_to_content: 'Skip to main content',
    search_placeholder: 'Search…',
    en_incomplete_notice:
      'This section is not translated to English yet — the French version is the source of truth.',
    view_repo: 'View repository',
    watch_video: 'Watch video',
    read_more: 'Read more',
    empty_state: 'Nothing to show yet.',
    outcome_success: 'Success',
    outcome_partial: 'Partial',
    outcome_failure: 'Failure',
    status_in_progress: 'In progress',
    status_completed: 'Completed',
    status_paused: 'Paused',
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}

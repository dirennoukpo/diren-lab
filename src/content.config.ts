import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** An image that always carries mandatory alt text — the build fails without it. */
const imageWithAlt = () =>
  z.object({
    src: z.string(),
    alt: z.string().min(1, 'alt text is required for every image'),
  });

const githubRepo = z.object({
  url: z.string().url(),
  description: z.string().min(1),
  reproducible: z.boolean().default(true),
});

const youtubeVideo = z.object({
  id: z.string().min(1, 'YouTube video id, e.g. "dQw4w9WgXcQ"'),
  title: z.string().min(1),
});

const lang = z.enum(['fr', 'en']).default('fr');

/** "type/slug" or "slug" (same collection) — resolved by scripts/build-graph.mjs. */
const relatedTo = z.array(z.string()).default([]);

// The glob() loader, unlike the legacy content collections API, does NOT skip
// "_"-prefixed files on its own — exclude _template.mdx explicitly so it never
// becomes a real, publishable entry.
const entryPattern = ['**/*.{md,mdx}', '!_*.{md,mdx}'];

const projects = defineCollection({
  loader: glob({ pattern: entryPattern, base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    domain: z.enum(['robotique', 'ia', 'embarque', 'controle', 'autre']),
    status: z.enum(['in-progress', 'completed', 'paused']),
    startDate: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    coverImage: imageWithAlt().optional(),
    videos: z.array(youtubeVideo).default([]),
    github: z.array(githubRepo).default([]),
    relatedTo,
    lang,
    draft: z.boolean().default(false),
  }),
});

const notions = defineCollection({
  loader: glob({ pattern: entryPattern, base: './src/content/notions' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    domain: z.enum(['maths', 'physique', 'mecanique', 'cinematique', 'automatique', 'ia', 'autre']),
    relatedTo,
    lang,
    draft: z.boolean().default(false),
  }),
});

const experiments = defineCollection({
  loader: glob({ pattern: entryPattern, base: './src/content/experiments' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    outcome: z.enum(['success', 'partial', 'failure']),
    // Body must follow the fixed template in src/content/experiments/_template.mdx
    dataset: z.string().optional(), // path to a JSON file under src/data/experiments/
    coverImage: imageWithAlt().optional(),
    videos: z.array(youtubeVideo).default([]),
    github: z.array(githubRepo).default([]),
    relatedTo,
    lang,
    draft: z.boolean().default(false),
  }),
});

const journal = defineCollection({
  loader: glob({ pattern: entryPattern, base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    levelAtStart: z.string().optional(),
    objectives: z.array(z.string()).default([]),
    skillsAcquired: z.array(z.string()).default([]),
    difficulties: z.array(z.string()).default([]),
    relatedTo,
    lang,
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects, notions, experiments, journal };

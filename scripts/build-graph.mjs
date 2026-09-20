#!/usr/bin/env node
/**
 * Builds a bidirectional relationship graph from the frontmatter of every
 * content entity (projects, notions, experiments, journal entries).
 *
 * Each entity declares its OUTGOING relations via `relatedTo: ["type/slug", ...]`.
 * This script computes the INCOMING (back-reference) side automatically, so a
 * notion referenced by a project shows that project without any manual
 * duplication in the notion's own frontmatter.
 *
 * Output: src/data/graph.json — consumed by pages via src/lib/graph.ts.
 * This file is generated, not hand-edited, and is gitignored.
 */
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const CONTENT_DIR = join(ROOT, 'src', 'content');
const OUT_FILE = join(ROOT, 'src', 'data', 'graph.json');

const COLLECTIONS = ['projects', 'notions', 'experiments', 'journal'];

/** @typedef {{ type: string, slug: string }} EntityRef */

function readEntities() {
  /** @type {Map<string, { type: string, slug: string, title: string, relatedTo: EntityRef[] }>} */
  const entities = new Map();

  for (const type of COLLECTIONS) {
    const dir = join(CONTENT_DIR, type);
    let files = [];
    try {
      files = readdirSync(dir, { withFileTypes: true });
    } catch {
      continue; // collection folder not created yet
    }

    for (const entry of files) {
      if (!entry.isFile()) continue;
      if (entry.name.startsWith('_')) continue; // templates, e.g. _template.mdx
      const ext = extname(entry.name);
      if (ext !== '.md' && ext !== '.mdx') continue;

      const slug = entry.name.replace(/\.mdx?$/, '');
      const raw = readFileSync(join(dir, entry.name), 'utf-8');
      const { data } = matter(raw);

      const relatedTo = (data.relatedTo ?? []).map((ref) => parseRef(ref, type));
      const key = `${type}/${slug}`;

      entities.set(key, {
        type,
        slug,
        title: data.title ?? slug,
        relatedTo,
      });
    }
  }

  return entities;
}

/**
 * A relation can be written as "type/slug" (cross-collection) or just
 * "slug" (implicitly same collection as the referencing entity).
 */
function parseRef(ref, fallbackType) {
  if (ref.includes('/')) {
    const [type, slug] = ref.split('/');
    return { type, slug };
  }
  return { type: fallbackType, slug: ref };
}

function buildGraph() {
  const entities = readEntities();

  /** @type {Map<string, Set<string>>} key -> set of related keys (both directions) */
  const adjacency = new Map();

  const addEdge = (fromKey, toKey) => {
    if (!adjacency.has(fromKey)) adjacency.set(fromKey, new Set());
    adjacency.get(fromKey).add(toKey);
  };

  for (const [key, entity] of entities) {
    for (const ref of entity.relatedTo) {
      const toKey = `${ref.type}/${ref.slug}`;
      if (!entities.has(toKey)) {
        console.warn(
          `[build-graph] Warning: ${key} references unknown entity "${toKey}". Skipping.`
        );
        continue;
      }
      addEdge(key, toKey);
      addEdge(toKey, key); // automatic back-reference
    }
  }

  /** @type {Record<string, { type: string, slug: string, title: string, related: EntityRef[] }>} */
  const graph = {};
  for (const [key, entity] of entities) {
    const related = [...(adjacency.get(key) ?? [])]
      .map((relKey) => {
        const [type, slug] = relKey.split('/');
        const relEntity = entities.get(relKey);
        return { type, slug, title: relEntity?.title ?? slug };
      })
      .sort((a, b) => a.title.localeCompare(b.title));

    graph[key] = {
      type: entity.type,
      slug: entity.slug,
      title: entity.title,
      related,
    };
  }

  return graph;
}

const graph = buildGraph();
mkdirSync(join(ROOT, 'src', 'data'), { recursive: true });
writeFileSync(OUT_FILE, JSON.stringify(graph, null, 2) + '\n');
console.log(
  `[build-graph] Wrote ${Object.keys(graph).length} entities to src/data/graph.json`
);

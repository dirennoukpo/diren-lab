import rawGraph from '../data/graph.json';

export interface EntityRef {
  type: string;
  slug: string;
  title: string;
}

export interface GraphEntity {
  type: string;
  slug: string;
  title: string;
  related: EntityRef[];
}

const graph = rawGraph as Record<string, GraphEntity>;

/** All entities related to `type/slug`, optionally filtered to one target collection. */
export function getRelated(type: string, slug: string, onlyType?: string): EntityRef[] {
  const entry = graph[`${type}/${slug}`];
  if (!entry) return [];
  return onlyType ? entry.related.filter((r) => r.type === onlyType) : entry.related;
}

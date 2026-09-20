import { visit } from 'unist-util-visit';

/**
 * Fails the build if a Markdown/MDX image is missing (or has empty) alt text.
 * Accessibility is a non-negotiable requirement for this site (see README).
 */
export function remarkRequireAlt() {
  return (tree, file) => {
    visit(tree, 'image', (node) => {
      if (!node.alt || !node.alt.trim()) {
        const source = file?.history?.[0] ?? 'unknown file';
        throw new Error(
          `[remark-require-alt] Missing alt text for image "${node.url}" in ${source}. ` +
            `Add descriptive alt text: ![description](${node.url})`
        );
      }
    });
  };
}

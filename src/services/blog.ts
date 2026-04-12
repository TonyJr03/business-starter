import type { BlogPost } from '@/types';
import { blogPosts } from '@/data';

/**
 * Capa de servicios para el blog.
 *
 * Actualmente devuelve datos locales tipados.
 * En el futuro consultará Supabase o un CMS sin cambiar el contrato.
 */

/** Returns all posts, newest first. */
export async function getPosts(): Promise<BlogPost[]> {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

/** Returns a single post by slug, or undefined if not found. */
export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  return blogPosts.find((p) => p.slug === slug);
}

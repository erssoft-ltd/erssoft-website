import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const insights = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/insights' }),
  schema: z.object({
    title: z.string(), description: z.string(), category: z.enum(['JD Edwards','ERP Consulting','Integration','Business Intelligence','Artificial Intelligence']),
    date: z.coerce.date(), author: z.string()
  })
});
export const collections = { insights };

import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const glossary = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/glossary" }),
  schema: z.object({
    title: z.string(),
    term: z.string(),
    definition: z.string(),
  }),
});

export const collections = { glossary };

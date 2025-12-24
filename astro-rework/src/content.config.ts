import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const inputs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/inputs" }),
  schema: z.object({
    title: z.string(),
    value: z.number(),
    scale: z.number().optional().default(1),
    display_units: z.string(),
    variable_name: z.string(),
    variable_type: z.string(),
    entity: z.string().optional().nullable(),
    units: z.string(),
    source_url: z.string().optional().nullable(),
    date_added: z.string().optional().nullable(),
    tags: z.array(z.string()).optional().nullable(),
    visibility: z.string().optional().nullable(),
    type: z.string().optional().nullable(),
  }),
});

const scenarios = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/scenarios" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    input_variables: z.array(z.string()),
    calculation_type: z.string(),
    operations: z.string(),
    result_label: z.string(),
    result_units: z.string(),
    category: z.string(),
    date_added: z.string().optional(),
    tags: z.array(z.string()).optional(),
    visibility: z.string().optional(),
    type: z.string().optional(),
  }),
});

export const collections = { inputs, scenarios };

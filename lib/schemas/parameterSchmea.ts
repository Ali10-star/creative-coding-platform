import { z } from 'zod';

export const RuntimeSchema = z.enum(['p5', 'three', 'pixi', 'vanilla']);
export type Runtime = z.infer<typeof RuntimeSchema>;

// TODO: implement this
export const ParameterSchema = z.object({});

// TODO: implement this
export const ActionSchema = z.object({});

export const SketchSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  runtime: RuntimeSchema,
  code: z.string(),
  parameters: ParameterSchema,
  actions: ActionSchema,
  extraImports: z.record(z.string(), z.string()).default({}),
});

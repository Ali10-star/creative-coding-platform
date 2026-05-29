import { z } from 'zod';

export const RuntimeSchema = z.enum(['p5', 'three', 'pixi', 'vanilla']);
export type Runtime = z.infer<typeof RuntimeSchema>;

//* ---------------------------------------------------------------------------
//? PARAMETERS
// A sketch declares its tunable parameters as a JSON array. Each entry is one
// of four discriminated types — number, boolean, color, or select. The
// SketchEmbed component reads this schema and auto-generates the matching
// Bauhaus control for each one.
//* ---------------------------------------------------------------------------
const numberParam = z.object({
  name: z.string().min(1),
  type: z.literal('number'),
  default: z.number(),
  min: z.number().optional(),
  max: z.number().optional(),
  step: z.number().optional(),
  lable: z.string().optional(),
});

const booleanParam = z.object({
  name: z.string().min(1),
  type: z.literal('boolean'),
  default: z.boolean(),
  label: z.string().optional(),
});

const colorParam = z.object({
  name: z.string().min(1),
  type: z.literal('color'),
  default: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Expected hex color like #D02020'),
  label: z.string().optional(),
});

const selectParam = z.object({
  name: z.string().min(1),
  type: z.literal('select'),
  default: z.string(),
  options: z.array(z.string()).min(1),
  label: z.string().optional(),
});

export const ParameterSchema = z.array(
  z.discriminatedUnion('type', [
    numberParam,
    booleanParam,
    colorParam,
    selectParam,
  ]),
);

export type Parameter = z.infer<typeof ParameterSchema>[number];

export const ActionSchema = z.array(
  z.object({
    name: z.string().min(1),
    label: z.string().optional(),
  }),
);

export type Action = z.infer<typeof ActionSchema>[number];

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
export type Sketch = z.infer<typeof SketchSchema>;

'use server';

import { requireAdmin } from '@/lib/auth';
import { STARTER_CODE } from '@/lib/runtimeTemplates';
import { RuntimeSchema } from '@/lib/schemas/parameterSchema';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const CreateSketchInput = z.object({
  title: z.string().min(1).max(200),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  runtime: RuntimeSchema,
});

const ALREADY_EXISTS_ERROR = '23505';

export async function createSketch(input: unknown) {
  const { supabase } = await requireAdmin();
  const data = CreateSketchInput.parse(input);

  const { data: inserted, error } = await supabase
    .from('sketches')
    .insert({
      title: data.title,
      slug: data.slug,
      runtime: data.runtime,
      description: '',
      code: STARTER_CODE[data.runtime],
      parameters: [],
      actions: [],
      extra_imports: {},
      companion_files: [],
      published: false,
    })
    .select('id')
    .single();

  if (error) {
    if (error.code === ALREADY_EXISTS_ERROR) {
      return { ok: false as const, message: 'Slug already exists.' };
    }
    return { ok: false as const, message: error.message };
  }

  redirect(`/admin/sketches/${inserted.id}`);
}

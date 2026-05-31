'use server';

import { requireAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function deleteSketch(id: string) {
  const { supabase } = await requireAdmin();

  const { error } = await supabase.from('sketches').delete().eq('id', id);

  if (error) {
    throw new Error(`Failed to delete sketch: ${error.message}`);
  }

  revalidatePath('/admin/sketches');
}
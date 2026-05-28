import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const role = (data?.claims?.app_metadata as { role?: string } | undefined)?.role;

  if (!data?.claims || role !== 'admin') {
    redirect('/login');
  }

  return { supabase, claims: data.claims };
}

// lib/cn.ts
// Tiny class-merging helper used throughout the Bauhaus components.
// If you're using shadcn/ui you'll likely already have this; this version
// avoids the clsx/tailwind-merge dependency for simplicity.

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

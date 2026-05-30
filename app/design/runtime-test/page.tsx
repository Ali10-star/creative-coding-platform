import SketchEmbed from '@/components/SketchEmbed';
import { FIXTURES } from '@/lib/fixtures/sketches';

interface Props {
  searchParams: Promise<{ slug?: string }>;
}
export default async function RuntimeTestPage({ searchParams }: Props) {
  const { slug = 'p5-circle' } = await searchParams;

  const sketch =
    FIXTURES[slug as keyof typeof FIXTURES] ?? FIXTURES['p5-circle'];

  return (
    <main className="min-h-screen p-8">
      <nav className="mb-6 flex gap-3">
        {Object.values(FIXTURES).map((s) => (
          <a
            key={s.slug}
            href={`?slug=${s.slug}`}
            className="border-bauhaus-fg hover:bg-bauhaus-yellow border-2 px-3 py-1 text-xs font-bold tracking-widest uppercase"
          >
            {s.title}
          </a>
        ))}
      </nav>
      <h1 className="mb-6 text-4xl">{sketch.title}</h1>
      <p className="mb- 6 text-sm font-bold tracking-widest uppercase">
        Runtime: {sketch.runtime}
      </p>
      <div className="h-[70vh]">
        <SketchEmbed
          runtime={sketch.runtime}
          code={sketch.code}
          parameters={sketch.parameters}
          actions={sketch.actions}
        />
      </div>
    </main>
  );
}

'use client';

import { useMemo, useState, useTransition } from 'react';
import { Button } from '@/components/Button';
import { Card, CardBody, CardTitle, CornerColor, CornerShape } from '@/components/Card';
import { createSketch } from '@/app/admin/sketches/new/actions';
import type { Runtime } from '@/lib/schemas/parameterSchema';
import { slugify } from '@/lib/slug';
import { cn } from '@/lib/cn';

type RuntimeCard = {
  value: Runtime;
  title: string;
  subtitle: string;
  color: CornerColor;
  shape: CornerShape;
};

const RUNTIMES: RuntimeCard[] = [
  {
    value: 'p5',
    title: 'p5.js',
    subtitle: 'Beginner-friendly 2D generative art.',
    color: 'blue',
    shape: 'square',
  },
  {
    value: 'three',
    title: 'Three.js',
    subtitle: '3D scenes, lights, geometry.',
    color: 'red',
    shape: 'circle',
  },
  {
    value: 'pixi',
    title: 'PixiJS',
    subtitle: 'Fast GPU-powered 2D rendering.',
    color: 'red',
    shape: 'triangle'
  },
  {
    value: 'vanilla',
    title: 'Vanilla',
    subtitle: 'No framework; pure JavaScript canvas/DOM.',
    color: 'blue',
    shape: 'none',
  },
];

const NewSketchForm: React.FC = () => {
  const [runtime, setRuntime] = useState<Runtime>('p5');
  const [title, setTitle] = useState('Untitled Sketch');
  const [slug, setSlug] = useState('untitled-sketch');
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const isValid = useMemo(
    () => title.trim().length > 0 && slug.trim().length > 0,
    [title, slug],
  );

  const onSubmit = () => {
    setError(null);

    startTransition(async () => {
      const result = await createSketch({
        title: title.trim(),
        slug: slug.trim(),
        runtime,
      });

      if (result?.ok === false) {
        setError(result.message);
      }
    });
  };

  return (
    <section className="space-y-8">
      <header>
        <span className="bg-bauhaus-fg inline-block px-3 py-1 text-xs font-bold tracking-widest text-white uppercase">
          New Sketch
        </span>
        <h1 className="mt-3 text-4xl sm:text-5xl">Choose Runtime</h1>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {RUNTIMES.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setRuntime(item.value)}
            className={`text-left ${runtime === item.value ? 'ring-bauhaus-fg ring-4' : ''}`}
          >
            <Card lift cornerShape={item.shape} cornerColor={item.color} className={cn(
              'transition-colors duration-150 ease-in-out hover:bg-bauhaus-blue/10',
              runtime === item.value ? 'bg-bauhaus-blue/30' : ''
            )}>
              <CardTitle>{item.title}</CardTitle>
              <CardBody>{item.subtitle}</CardBody>
            </Card>
          </button>
        ))}
      </div>

      <Card cornerShape="circle" cornerColor="blue">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => {
                const next = e.target.value;
                setTitle(next);
                setSlug(slugify(next));
              }}
              className="border-bauhaus-fg w-full border-2 px-3 py-2"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-bold tracking-widest uppercase">
              Slug
            </span>
            <input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className="border-bauhaus-fg w-full border-2 px-3 py-2 font-mono"
            />
          </label>
        </div>

        {error ? (
          <p className="bg-bauhaus-red border-bauhaus-fg mt-4 border-2 px-3 py-2 text-sm font-bold text-white">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end">
          <Button onClick={onSubmit} variant='blue' disabled={!isValid || pending}>
            {pending ? 'Creating...' : 'Create Draft'}
          </Button>
        </div>
      </Card>
    </section>
  );
};

export default NewSketchForm;

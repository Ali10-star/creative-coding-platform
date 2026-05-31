import DeleteSketchButton from '@/components/admin/DeleteSketchButton';
import { Button } from '@/components/Button';
import { Card, CardBody, CardTitle } from '@/components/Card';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { deleteSketch } from './actions';

type SketchRow = {
  id: string;
  title: string;
  slug: string;
  runtime: string;
  published: boolean;
  updated_at: string;
};

const AdminSketchesPage: React.FC = async () => {
  const { supabase } = await requireAdmin();

  const { data, error } = await supabase
    .from('sketches')
    .select('id, title, slug, runtime, published, updated_at')
    .order('updated_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to load sketches: ${error.message}`);
  }

  const sketches = (data ?? []) as SketchRow[];

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="bg-bauhaus-fg inline-block px-3 py-1 text-xs font-bold tracking-widest text-white uppercase">
            Admin
          </span>
          <h1 className="mt-3 text-4xl sm:text-5xl">Sketches</h1>
        </div>

        <Link href="/admin/sketches/new">
          <Button variant="yellow">+ New</Button>
        </Link>
      </header>

      {sketches.length === 0 ? (
        <Card cornerColor="yellow" cornerShape="square">
          <CardTitle>No sketches yet</CardTitle>
          <CardBody>Create your first one to start building the gallery content.</CardBody>
        </Card>
      ) : (
        <div className="overflow-x-auto border-4 border-bauhaus-fg bg-white">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b-4 border-bauhaus-fg bg-bauhaus-muted text-left text-xs tracking-widest uppercase">
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Runtime</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sketches.map((sketch) => (
                <tr key={sketch.id} className="border-b-2 border-bauhaus-fg last:border-b-0">
                  <td className="px-4 py-3 font-bold">{sketch.title}</td>
                  <td className="px-4 py-3 font-mono text-sm">{sketch.slug}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block border-2 border-bauhaus-fg px-2 py-1 text-xs font-bold uppercase">
                      {sketch.runtime}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block border-2 border-bauhaus-fg px-2 py-1 text-xs font-bold uppercase ${
                        sketch.published ? 'bg-bauhaus-blue text-white' : 'bg-bauhaus-yellow'
                      }`}
                    >
                      {sketch.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(sketch.updated_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/sketches/${sketch.id}`}>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </Link>
                      <form action={deleteSketch.bind(null, sketch.id)}>
                        <DeleteSketchButton />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminSketchesPage;

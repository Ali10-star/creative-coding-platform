import { GeometricLogo } from '@/components/Shapes';
import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { logout } from '../login/actions';
import { Button } from '@/components/Button';

const AdminLayout: React.FC<{ children: React.ReactNode }> = async ({ children }) => {
  const { claims } = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-bauhaus-fg border-b-4 bg-white">
        <div className="max-w-7x mx-auto flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href={'/admin'} className="flex items-center gap-3">
            <GeometricLogo size={28} />
            <span className="tracking-tightest text-xl font-black uppercase">Admin</span>
          </Link>

          <nav className="hideen text sm items-center gap-6 font-bold tracking-wider uppercase md:flex">
            <Link href="/admin/sketches" className="hover:text-bauhaus-blue">
              Sketches
            </Link>
            <Link href="/admin/posts" className="hover:text-bauhaus-blue">
              Posts
            </Link>
            <Link href="/admin/tags" className="hover:text-bauhaus-blue">
              Tags
            </Link>
            <Link href="/" className="hover:text-bauhaus-blue">
              View Site
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden text-xs font-bold tracking-widest uppercase sm:inline">
              {claims.email as string}
            </span>
            <form action={logout}>
              <Button variant="outline" size="sm">
                Log Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
};

export default AdminLayout;

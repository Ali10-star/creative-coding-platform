import { Button } from '@/components/Button';
import { GeometricLogo } from '@/components/Shapes';
import { login, signUp } from './actions';

interface Props {
  searchParams: Promise<{ error?: string; signup?: string }>;
}

const LoginPage: React.FC<Props> = async ({ searchParams }) => {
  const { error, signup: signupStatus } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-4">
          <GeometricLogo size={48} />
          <h1 className="text-4xl">Admin Access</h1>
          <p className="text-muted-foreground">Sign in to manage sketches and expiriments.</p>
        </div>

        <form className="border-bauhaus-fg shadow-bauhaus-lg space-y-5 border-4 bg-white p-8">
          {error && (
            <div className="bg-bauhaus-red border-bauhaus-fg border-2 p-3 text-sm font-bold tracking-wider text-white uppercase">
              {decodeURIComponent(error)}
            </div>
          )}
          {signupStatus && (
            <div className="bg-bauhaus-yellow text-bauhaus-fg border-bauhaus-fg border-2 p-3 text-sm font-bold tracking-wider uppercase">
              Check your email to confirm, then log in.
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-xs font-bold tracking-widest uppercase"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="border-bauhaus-fg focus:bg-bauhaus-yellow/20 w-full border-2 p-3 font-medium focus:ring-0 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-xs font-bold tracking-widest uppercase"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="border-bauhaus-fg focus:bg-bauhaus-yellow/20 w-full border-2 p-3 font-medium focus:ring-0 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="blue" size="md" formAction={login} className="flex-1">
              Log In
            </Button>
            <Button variant="outline" size="md" formAction={signUp} className="flex-1">
              Sign Up
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;

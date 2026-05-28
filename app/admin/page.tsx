import { Card, CardBody, CardTitle } from '@/components/Card';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <span className="bg-bauhaus-fg inline-block px-3 py-1 text-xs font-bold tracking-widest text-white uppercase">
        Dashboard
      </span>
      <h1 className="mt-3 text-5xl sm:text-6xl">Welcome</h1>
      <p className="mt-4 max-w-2xl text-lg font-medium">
        Phase 1 is complete. Phase 2 will add the sketch runtime, and from there sketches can be
        authored and published.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <Card cornerColor="red" cornerShape="circle">
          <CardTitle>Sketches</CardTitle>
          <CardBody>Coming in phase 3 - creating and editing interactive sketches.</CardBody>
        </Card>

        <Card cornerShape="square" cornerColor="blue">
          <CardTitle>Posts</CardTitle>
          <CardBody>Coming in Phase 6 — author MDX tutorials with embedded sketches.</CardBody>
        </Card>

        <Card cornerShape="triangle" cornerColor="yellow">
          <CardTitle>Tags</CardTitle>
          <CardBody>Coming in Phase 3 — organize content with shared tags.</CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;

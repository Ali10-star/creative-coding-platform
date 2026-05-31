import { requireAdmin } from '@/lib/auth';
import NewSketchForm from '@/components/admin/NewSketchForm';

const NewSketchPage: React.FC = async () => {
  await requireAdmin();

  return <NewSketchForm />;
};

export default NewSketchPage;

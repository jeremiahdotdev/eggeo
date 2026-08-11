import { CreateEggForm } from '@/components/CreateEggForm';
import { requirePageSession } from '@/components/RequireAuth';

export default async function CreatePage() {
  await requirePageSession();

  return (
    <main className="page stack" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Create an Egg</h1>
      <CreateEggForm />
    </main>
  );
}

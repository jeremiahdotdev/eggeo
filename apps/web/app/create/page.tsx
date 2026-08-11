import { CreateEggForm } from '@/components/CreateEggForm';
import { PageTitle } from '@/components/PageTitle';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function CreatePage() {
  await requirePageSession();

  return (
    <SkyPage className="create-page">
      <PageTitle>Create an Egg</PageTitle>
      <CreateEggForm />
    </SkyPage>
  );
}

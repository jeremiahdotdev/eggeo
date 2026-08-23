import { EggeoText } from '@eggeo/ui';
import { CreateEggForm } from '@/components/CreateEggForm';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function CreatePage() {
  await requirePageSession();

  return (
    <SkyPage className="create-page">
      <EggeoText colorized variant="pageTitle">
        Create an Egg
      </EggeoText>
      <CreateEggForm />
    </SkyPage>
  );
}

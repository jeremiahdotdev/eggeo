import { prisma } from '@eggeo/db';
import { EggeoText } from '@eggeo/ui';
import { CreateEggForm } from '@/components/CreateEggForm';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';

export default async function CreatePage() {
  const session = await requirePageSession();
  const events = await prisma.event.findMany({
    where: {
      username: session.username,
    },
    orderBy: {
      title: 'asc',
    },
    select: {
      id: true,
      title: true,
    },
  });

  return (
    <SkyPage className="create-page">
      <EggeoText colorized variant="pageTitle">
        Create an Egg
      </EggeoText>
      <CreateEggForm events={events} />
    </SkyPage>
  );
}

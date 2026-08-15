import { revalidatePath } from 'next/cache';
import { appText } from '@eggeo/domain';
import { prisma } from '@eggeo/db';
import { EggeoEventQrCard, EggeoText } from '@eggeo/ui';
import { QRCodeSVG } from 'qrcode.react';
import { CreateEventForm } from '@/components/CreateEventForm';
import { PrintEggSheet } from '@/components/PrintEggSheet';
import { requirePageSession } from '@/components/RequireAuth';
import { SkyPage } from '@/components/SkyScene';
import { parseLinkFromEvent } from '@/lib/egg';

type OwnedEvent = {
  id: string;
  title: string;
};

export default async function EventsPage() {
  const session = await requirePageSession();
  const events: OwnedEvent[] = await prisma.event.findMany({
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
    <SkyPage>
      <EggeoText colorized variant="pageTitle">
        {appText.nav.events}
      </EggeoText>
      <CreateEventForm />
      <PrintEggSheet isEmpty={events.length === 0}>
        {events.map((event: OwnedEvent) => {
          async function deleteEvent() {
            'use server';

            const session = await requirePageSession();
            const ownedEvent = await prisma.event.findFirst({
              where: {
                id: event.id,
                username: session.username,
              },
              select: {
                id: true,
              },
            });

            if (!ownedEvent) {
              return;
            }

            await prisma.event.delete({
              where: {
                id: event.id,
              },
            });
            revalidatePath('/events');
          }

          return (
            <EggeoEventQrCard
              isOwner
              key={event.id}
              onDelete={deleteEvent}
              qr={<QRCodeSVG value={parseLinkFromEvent(event.id)} />}
              title={event.title}
            />
          );
        })}
      </PrintEggSheet>
    </SkyPage>
  );
}

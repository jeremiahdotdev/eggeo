import { revalidatePath } from 'next/cache';
import { prisma } from '@eggeo/db';
import { appText } from '@eggeo/domain';
import { EggeoQrCard } from '@eggeo/ui';
import { QRCodeSVG } from 'qrcode.react';
import { EventFilter } from '@/components/EventFilter';
import { PrintEggSheet } from '@/components/PrintEggSheet';
import { PrintAction } from '@/components/PrintAction';
import { requirePageSession } from '@/components/RequireAuth';
import { parseLinkFromEgg } from '@/lib/egg';
import { SkyPage } from '@/components/SkyScene';
import styles from './page.module.css';

type PrintableEgg = {
  color: string | null;
  id: string;
  title: string | null;
};

export default async function CodesPage({ searchParams }: { searchParams: Promise<{ eventId?: string }> }) {
  const session = await requirePageSession();
  const { eventId = '' } = await searchParams;
  const selectedEvent = eventId
    ? await prisma.event.findFirst({
        where: {
          id: eventId,
          username: session.username,
        },
      })
    : null;
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
  const eggs: PrintableEgg[] = selectedEvent
    ? await prisma.egg.findMany({
        where: {
          eventId: selectedEvent.id,
          username: session.username,
          isCollected: false,
        },
        orderBy: {
          title: 'asc',
        },
        select: {
          color: true,
          id: true,
          title: true,
        },
      })
    : [];

  return (
    <SkyPage>
      <div className={`${styles.printControls} no-print`}>
        <EventFilter allLabel={appText.events.labels.selectEvent} events={events} requireSelection webStyle={{ margin: 0, maxWidth: 320, width: '100%' }} />
        <PrintAction disabled={!selectedEvent || eggs.length === 0} />
      </div>
      <PrintEggSheet emptyMessage={selectedEvent ? undefined : appText.eggs.messages.selectEventToPrint} isEmpty={eggs.length === 0}>
        {eggs.map((egg: PrintableEgg) => {
          async function deleteEgg() {
            'use server';

            const session = await requirePageSession();
            const ownedEgg = await prisma.egg.findFirst({
              where: {
                id: egg.id,
                username: session.username,
              },
              select: {
                id: true,
              },
            });

            if (!ownedEgg) {
              return;
            }

            await prisma.location.deleteMany({
              where: {
                eggId: egg.id,
              },
            });
            await prisma.userEgg.deleteMany({
              where: {
                eggId: egg.id,
              },
            });
            await prisma.egg.delete({
              where: {
                id: egg.id,
              },
            });
            revalidatePath('/codes');
          }

          return (
            <EggeoQrCard
              action={
                <form action={deleteEgg}>
                  <button className={styles.deleteButton} type="submit">
                    {appText.common.actions.delete}
                  </button>
                </form>
              }
              color={egg.color}
              key={egg.id}
              qr={<QRCodeSVG value={parseLinkFromEgg(egg.id)} />}
              title={egg.title || appText.eggs.labels.untitled}
            />
          );
        })}
      </PrintEggSheet>
    </SkyPage>
  );
}

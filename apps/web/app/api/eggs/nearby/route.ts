import { z } from 'zod';
import { prisma } from '@eggeo/db';
import { apiError, ok } from '@/lib/api';
import { requireSession } from '@/lib/session';

const nearbySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});

function distance(point: { lat: number; lng: number }, coords: { lat: unknown; lng: unknown } | null) {
  const lat = Number(coords?.lat);
  const lng = Number(coords?.lng);
  return Math.sqrt((lat - point.lat) ** 2 + (lng - point.lng) ** 2);
}

export async function GET(request: Request) {
  try {
    await requireSession();
    const url = new URL(request.url);
    const center = nearbySchema.parse({
      lat: url.searchParams.get('lat'),
      lng: url.searchParams.get('lng'),
    });

    const eggs = await prisma.egg.findMany({
      where: {
        coords: {
          lat: { lte: center.lat + 0.01, gte: center.lat - 0.01 },
          lng: { lte: center.lng + 0.01, gte: center.lng - 0.01 },
        },
        isCollected: false,
      },
      include: {
        coords: true,
      },
    });

    return ok(eggs.sort((a, b) => distance(center, a.coords) - distance(center, b.coords)));
  } catch (error) {
    return apiError(error);
  }
}

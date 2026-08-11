import { prisma } from '@eggeo/db';
import { requireAuth } from './requireAuth';

export default defineEventHandler(
  requireAuth(async (event) => {
    const egg = await readBody(event);
    try {
      const eggs = await prisma.egg.findMany({
        where: {
          coords: {
            lat: { lte: egg.coords.lat + 0.01, gte: egg.coords.lat - 0.01 },
            lng: { lte: egg.coords.lng + 0.01, gte: egg.coords.lng - 0.01 },
          },
          isCollected: false,
        },
        include: {
          coords: {},
        },
      });
      function calculateDistance(point1: any, point2: any) {
        const latDiff = point2.lat - point1.lat;
        const lngDiff = point2.lng - point1.lng;
        return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      }
      const sorted = eggs.sort(
        (a, b) => calculateDistance(egg.coords, a.coords) - calculateDistance(egg.coords, b.coords),
      );
      return sorted;
    } catch (error: unknown) {
      console.error(error);
    }
  }),
);

<template>
  <div class="w-full h-screen max-w-screen flex align-center justify-center py-32 px-4">
    <div class="w-full max-w-screen-sm flex flex-col items-center justify-center gap-2">
      <vLabel box="0 0 600 100" class="w-3/4 sm:w-1/2">LEADERBOARD</vLabel>
      <div
        v-for="(user, index) in users"
        :key="user.id"
        class="flex w-full rounded-xl px-4 items-center justify-between py-2 shadow-xl bg-white border-black"
      >
        <span class="text-lg font-semibold">{{ getPlacement(index) }}</span>
        <vLabel box="0 0 800 100" class="h-8 w-64">{{ getName(user.name) }}</vLabel>
        <span class="text-lg">{{ getPoints(user.points) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGetLeaderboard } from '~/composables/gateway/egg';
const [users, errors] = useGetLeaderboard({});
const getPlacement = (index: number) => {
  const placements = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th'];
  return placements[index] || `${index + 1}th`;
};
const getPoints = (points: number) => {
  return Math.abs(points) === 1 ? `${points}pt.` : `${points}pts.`;
};
const getName = (fullName: string) => {
  if (!fullName) return 'Anonymous Ninja';
  const firstName = fullName.split(' ')[0];
  const lastInitial = fullName.split(' ')[1].split('')[0];
  return `${firstName.length < 15 ? firstName : firstName.substring(0, 14)} ${lastInitial}.`;
};
</script>

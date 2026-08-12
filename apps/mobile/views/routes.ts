import { appText } from '@eggeo/static-text';

export type MobilePage = 'codes' | 'create' | 'dashboard' | 'find' | 'hide' | 'leaderboard' | 'locator' | 'panel' | 'score';

export const primaryPages: Array<{ key: MobilePage; label: string }> = [
  { key: 'dashboard', label: appText.nav.dashboard },
  { key: 'leaderboard', label: appText.nav.leaderboard },
  { key: 'find', label: appText.nav.find },
  { key: 'locator', label: appText.nav.locator },
  { key: 'panel', label: appText.nav.panel },
];

export const setupPages: Array<{ key: MobilePage; label: string }> = [
  { key: 'codes', label: appText.nav.codes },
  { key: 'create', label: appText.nav.create },
  { key: 'hide', label: appText.nav.hide },
  { key: 'score', label: appText.nav.score },
];

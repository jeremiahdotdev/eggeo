import { NavLinkRoute } from '~/types/global.ts';

export const useRoutes: () => NavLinkRoute[] = () => [
  NavLinkRoute.LEADERBOARD,
  NavLinkRoute.FIND,
  NavLinkRoute.LOCATOR,
  NavLinkRoute.USER,
];

export const useSetupRoutes: () => NavLinkRoute[] = () => [
  NavLinkRoute.CODES,
  NavLinkRoute.CREATE,
  NavLinkRoute.HIDE,
  NavLinkRoute.SCORE,
  NavLinkRoute.SIGNOUT,
];

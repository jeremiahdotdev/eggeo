# Offline use

Sign in online once after installing this version. Eggeo remembers the last account and selected event without storing its password. If the server cannot be reached later, the saved account can continue hunting. Losing connectivity does not sign you out. A yellow shared UI banner indicates offline mode.

## Available offline

- Find, Hide, Map, and the Home score. Hide is in the main dropdown on mobile and web.
- Finding and collecting eggs use the existing persistent queue. Hiding now adds GPS coordinates to that same queue. Location permission and a GPS fix are needed to hide.
- Known egg points immediately count toward the saved score, pending server confirmation. Repeated scans and eggs already credited in the saved score do not add points again. Unknown eggs stay pending until their points and event can be confirmed online.
- Pending collections remove map markers. Pending hides reposition known eggs in their event. An unknown egg's event and map marker can only be confirmed online.
- Previously loaded event choices, scores, egg details, and map locations remain available. Visit Home and Map for an event online before using it offline. Data never downloaded cannot be displayed offline.
- Cached egg locations can initialize the map without GPS. Apple Maps controls basemap tile caching; streets/background tiles in areas not previously loaded may be unavailable offline.

## Requires a connection

Account settings, rankings, egg codes/creation/deletion, event management, score resets, and the privacy policy require internet access. These management screens do not use offline read caches. User shows a login/connection message while offline; the saved hunting account remains active. First-time login and registration require internet access.

On reconnect or foregrounding, the app verifies the server session before syncing. It retries connection checks every 15 seconds while active offline. An expired session requires signing in again; the queue stays on the phone. A find's score caches refresh from the server before it leaves the queue, so an interrupted score refresh can safely retry the idempotent find.

Read caches are account-scoped. The action queue and map/egg caches remain shared per installation, following the single-user-per-phone design. Manual sign-out clears the remembered login. Account deletion also clears local game data and the queue.

## Code structure

The API client only contacts the server. There is no request interception or synthetic cached response.

- `useMobileSession.ts` checks connectivity and restores the remembered account when the server is unavailable.
- `App.tsx` explicitly loads saved event choices when offline and saves fresh choices after an online load.
- `useHuntScore.ts` explicitly chooses a saved score or a server refresh, then adds pending finds.
- `huntStorage.ts` stores event choices and confirmed scores by account. It can read older builds' cache keys, and prevents delayed score responses from overwriting newer saved totals.
- `offlineEggs.ts` keeps the existing action queue, egg details, and map cache. Sync always refreshes scores from the server before removing a find.
- `connectivity.ts` checks network availability and reports connection failures to the offline banner. It does not intercept requests or store data.

## Release dependency

Deploy the web backend with the expanded `/api/score` response (`foundEggIds`) before distributing the mobile build. No database migration is needed. Older score responses still display their confirmed total, but cannot safely add optimistic points until a fresh score with credited egg IDs is loaded.

## Device verification

1. Sign in, choose an event, and load Home and Map online.
2. Enable Airplane Mode, fully close and reopen the app. Check the remembered account/event, banner, saved score, and markers.
3. Find a cached egg. Check its points appear on Find, Home, and Map. Scan it again and scan an already-credited egg; neither should award duplicate points.
4. Find an unknown egg. Check it remains pending without inventing a point value.
5. Collect and then hide a known egg elsewhere. Check its marker follows the queued actions. Reopen offline to check persistence.
6. Check User shows the connection/login message and management pages are unavailable.
7. Reconnect and check scores and markers reconcile. Interrupt connectivity during sync and retry; points should not double-count.
8. Verify an expired session requires sign-in before queued actions sync. A new install with no remembered account should require online login.
9. Online, check Hide in the main dropdown and Privacy Policy under User.

Run `pnpm typecheck` for workspace type validation. Native GPS, cookies, QR scanning, and map tiles require the device checks above. No test files are maintained.
